<style scoped lang="less">
@import '~@/vant-variables.less';
.comments {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin: 0px 5px;
  &__title {
    &--index {
      padding: 0px 15px 5px 15px;
    }
    &--dialog {
      padding: 0px 15px 20px 15px;
    }
  }
  &__commentBox {
    padding: 5px 20px 0px 20px;
  }
  &__more {
    text-align: center;
    width: 100%;
    font-size: 12px;
    color: @gray-4 !important;
  }
  &__avatar {
    margin: 0px;
    margin-right: 10px;
    font-size: 14px;
    color: white;
  }
}
.comments-input-mask {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px 20px;
  margin-bottom: 10px;
  &__input {
    font-size: 12px;
    border: 1px solid @gray-2;
    border-radius: 10px;
    color: @gray-4;
    padding: 5px;
    width: 100%;
    margin-left: 10px;
  }
}
</style>

<template>
  <div class="comments">
    <div :class="isIndex?'comments__title--index':'comments__title--dialog'">评论 {{this.commentCount}}</div>
    <div v-if="isIndex">
      <div class="comments-input-mask" v-if="!anonymous">
        <v-username class="comment__avatar" type="avater" :avatarSize="28" :username="myUsername"></v-username>
        <div class="comments-input-mask__input">评论千万条 文明第一条</div>
      </div>
      <div class="comments-input-mask" v-else>
        <div class="comments-input-mask__input">请登录发表评论</div>
      </div>
    </div>
    <div style="flex:1;overflow:auto">
      <van-skeleton title avatar :row="3" :loading="initLoading" style="width:100%">
        <van-list v-model="pageLoading" :finished="this.isIndex || this.isEnd" @load="getComment()">
          <div v-for="(item,index) in this.comments" :key="index">
            <v-commentBox class="comments__commentBox" :isIndex="isIndex" :bindID="bindID" :mainType="mainType" :comment="item" :isComment="true" @doReply="doReply"
              @showReplyList="showReplyList" @needLoginNotice="$emit('needLoginNotice')"></v-commentBox>
          </div>
          <template slot="finished" style="line-height:unset">
            <div class="comments__more" v-if="this.isIndex" @click="()=>$emit('showAllComment')">查看全部评论 ></div>
            <div class="notice-nomore__text" v-if="!this.isIndex && isEnd">没有更多的评论了</div>
          </template>
        </van-list>
      </van-skeleton>
    </div>

    <v-sendBox :mainType="mainType" :bindID="bindID" ref="sendBox" v-if="!isIndex" @onSuccess="addNewComment" @needLoginNotice="$emit('needLoginNotice')"></v-sendBox>

    <v-replyList :style="{'height':viewareaHeight}" ref="replyList" :bindID="bindID" :mainType="mainType" @needLoginNotice="$emit('needLoginNotice')"></v-replyList>

  </div>
</template>

<script>
import Username from '@/components/common/username/username';
import commentBox from './commentBox';
import replyList from './replyList';
import sendBox from './sendBox';

import { Notify } from 'vant';

import userBehaviorStore from '@/components/common/userBehavior/userBehaviorStore.js';

export default {
  name: 'commentList',
  components: {
    'v-username': Username,
    'v-commentBox': commentBox,
    'v-replyList': replyList,
    'v-sendBox': sendBox,
  },
  props: {
    bindID: String,
    mainType: String,
    isIndex: Boolean,
    viewareaHeight: String,
  },
  mounted() {
    if (localStorage.getItem('token') != null) {
      this.myUsername = window.sessionStorage.getItem('username');
      this.anonymous = false;
    }
    this.getComment();
  },
  data() {
    return {
      //加载
      initLoading: true,
      pageLoading: false,

      //用户行为(点赞等)
      commentUserBehavior: [],

      //首页显示
      myUsername: null,
      anonymous: true,

      //评论列表核心
      comments: [],
      commentCount: 0, //评论总数
      pageSize: 10,
      pageNum: 1,
      isEnd: false, //是否全部完成加载

      //伪加载排除
      newCommentID: [], //回复类的 在本页不会滚动加载，无需排除
    };
  },
  methods: {
    doReply(args) {
      if (!this.isIndex) {
        this.$refs['sendBox'].showSendBox(args);
      } else {
        this.$emit('showAllComment');
      }
    },
    showReplyList(commentID) {
      if (!this.isIndex) {
        this.$refs['replyList'].showReplyModel(commentID);
      } else {
        this.$emit('showAllComment');
      }
    },
    //不会在主页触发该函数，无需规避问题
    addNewComment(data) {
      //把返回的数据加入列表，避免全表刷新
      if (data.args.isReply) {
        //是回复他人评论的
        this.comments.map((comment) => {
          if (comment.id == data.args.replyInCommentID) {
            comment.replyCount += 1;
            comment.replyCommentList.push(data.response);
          }
        });
      } else {
        this.commentCount += 1;
        this.comments.push(data.response);
        this.newCommentID.push(data.response.id);
      }
      Notify({ type: 'success', message: '评论发送成功' });
    },
    //为了防止新增评论后在多页加载后把新增的评论渲染两次
    checkRepetitiveComment(comments) {
      return comments.filter((comment) => {
        let isRepetitive = false;
        this.newCommentID.map((newCommentID) => {
          if (comment.id == newCommentID) {
            isRepetitive = true;
          }
        });
        return !isRepetitive;
      });
    },
    getUserBehaviorByFileID(comments) {
      if (localStorage.getItem('token') == null) {
        //未登录时无需后进行用户行为现场的还原
        this.comments.push(...comments);
        this.pageLoading = false;
        this.initLoading = false;
        return;
      }
      userBehaviorStore.getUserBehaviorList(this.mainType, this.bindID, this).then((userBehaviorList) => {
        userBehaviorList.forEach((data) => {
          //需要获取behaviorType为DO_COMMENT_LIKE或DO_COMMENT_DISLIKE的两类行为记录
          if (data.behaviorType == 'DO_COMMENT_LIKE' || data.behaviorType == 'DO_COMMENT_DISLIKE') {
            this.commentUserBehavior.push(data);
          }
        });
        //初始化现场，因为没有用户行为记录的不一定能被遍历的到
        comments.map((comment) => {
          comment.isLike = false;
          comment.isDislike = false;
          comment.replyCommentList.map((reply) => {
            reply.isLike = false;
            reply.isDislike = false;
          });
        });
        comments.map((comment) => {
          this.commentUserBehavior.map((record) => {
            let commentID = record.extraInfo.commentID;
            if (commentID.indexOf(comment.id) != -1) {
              if (commentID == comment.id) {
                //是评论
                comment.isLike = record.behaviorType == 'DO_COMMENT_LIKE';
                comment.isDislike = record.behaviorType == 'DO_COMMENT_DISLIKE';
              } else {
                //是回复
                comment.replyCommentList.map((reply) => {
                  if (commentID == reply.id) {
                    reply.isLike = record.behaviorType == 'DO_COMMENT_LIKE';
                    reply.isDislike = record.behaviorType == 'DO_COMMENT_DISLIKE';
                  }
                });
              }
            }
          });
        });
        comments = this.checkRepetitiveComment(comments);
        this.comments.push(...comments);
        this.pageLoading = false;
        this.initLoading = false;
      });
    },
    getComment() {
      this.pageLoading = true;
      this.$Axios({
        method: 'get',
        url: '/comment/getComment',
        params: {
          bindID: this.bindID,
          mainType: this.mainType,
          commentCount: !this.isIndex ? this.pageSize : 2,
          replyCount: !this.isIndex ? 2 : 0,
          pageNum: this.pageNum,
        },
      }).then((response) => {
        if (response.data.code == 1) {
          this.commentCount = response.data.msg.commentCount;
          let comments = response.data.msg.comments;
          if (comments instanceof Array) {
            this.getUserBehaviorByFileID(comments);
            if (comments.length < this.pageSize) {
              this.isEnd = true;
            } else {
              this.pageNum += 1;
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
</style>