<style scoped lang="less">
@import '~@/vant-variables.less';
.replies {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin: 0px 5px;

  &__divider {
    background-color: @gray-1;
  }

  &__title {
    padding: 10px 15px 10px 15px;
    margin-top: 10px;
    background-color: @white;
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
  }
}

.replyBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  &__title {
    margin: 20px;
    text-align: center;
    font-size: 16px;
  }
}
</style>

<template>
  <van-popup style="width:100%;height:100%" v-model="replyModel" round position="bottom" :overlay="false" closeable>
    <div class="replyBox" v-if="replyModel">
      <div class="replyBox__title">回复评论</div>
      <div class="replies" style="flex:1;overflow:auto;width: 100%;">
        <van-skeleton title avatar :row="3" :loading="initLoading" style="width:100%">
          <v-commentBox class="replies__commentBox" :isIndex="false" :bindID="bindID" :comment="comment" :mainType="mainType" :isComment="true"
            @doReply="(args)=> $refs['sendBox'].showSendBox(args)" @needLoginNotice="$emit('needLoginNotice')"></v-commentBox>
        </van-skeleton>
        <div class="replies__divider">
          <div class="replies__title">回复 {{this.replyCount}}</div>
        </div>

        <div style="flex:1;overflow:auto">
          <van-skeleton title avatar :row="3" :loading="initLoading" style="width:100%">
            <van-list v-model="pageLoading" :finished="this.isEnd" @load="getReply">
              <div v-for="(item,index) in this.replies" :key="index">
                <v-commentBox class="replies__commentBox" :isIndex="false" :faterCommentID="commentID" :bindID="bindID" :mainType="mainType" :comment="item" :isComment="false"
                  @doReply="(args)=> $refs['sendBox'].showSendBox(args)" @needLoginNotice="$emit('needLoginNotice')">
                </v-commentBox>
              </div>
              <template slot="finished" style="line-height:unset">
                <div class="notice-nomore__text" v-if="!this.isIndex && isEnd">没有更多的回复了</div>
              </template>
            </van-list>
          </van-skeleton>
        </div>

        <v-sendBox ref="sendBox" :bindID="bindID" :mainType="mainType" @onSuccess="addNewReply" :isReply="true" :replyInCommentID="commentID"
          @needLoginNotice="$emit('needLoginNotice')"></v-sendBox>
      </div>

    </div>
  </van-popup>
</template>

<script>
import commentBox from './commentBox';
import sendBox from './sendBox';

import { Notify } from 'vant';

import userBehaviorStore from '@/components/common/userBehavior/userBehaviorStore.js';

export default {
  name: 'commentList',
  components: {
    'v-commentBox': commentBox,
    'v-sendBox': sendBox,
  },
  props: {
    bindID: String,
    mainType: String,
  },
  mounted() {},
  data() {
    return {
      replyModel: false,
      commentID: null,
      //加载
      initLoading: true,
      pageLoading: false,

      //用户行为(点赞等)
      commentUserBehavior: [],

      //评论内容
      comment: null,
      //回复
      replies: [],
      replyCount: 0, //评论总数
      pageSize: 10,
      pageNum: 1,
      isEnd: false, //是否全部完成加载

      //伪加载排除
      newRepliesID: [], //回复在本页不会滚动加载，无需排除
    };
  },
  methods: {
    showReplyModel(commentID) {
      this.commentID = commentID;
      this.replyModel = true;
      this.replies = [];
      this.newRepliesID = [];
      this.commentUserBehavior = [];
      this.pageNum = 1;
      this.isEnd = false;
      this.getReply();
    },
    addNewReply(data) {
      //把返回的数据加入列表，避免全表刷新
      this.replyCount += 1;
      this.replies.push(data.response);
      this.newRepliesID.push(data.response.id);
      Notify({ type: 'success', message: '回复发送成功' });
    },
    //为了防止新增回复后在多页加载后把新增的回复渲染两次
    checkRepetitiveReply(replies) {
      return replies.filter((reply) => {
        let isRepetitive = false;
        this.newRepliesID.map((newRepliesID) => {
          if (reply.id == newRepliesID) {
            isRepetitive = true;
          }
        });
        return !isRepetitive;
      });
    },
    getUserBehaviorByFileID(comment) {
      if (localStorage.getItem('token') == null) {
        this.replies.push(...comment.replyCommentList);
        comment.replyCommentList = null;
        this.comment = comment;

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
        comment.isLike = false;
        comment.isDislike = false;

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
        // 载入回复
        let replies = this.checkRepetitiveReply(comment.replyCommentList); //新回复去重
        this.replies.push(...replies);
        // 载入评论
        comment.replyCommentList = null;
        this.comment = comment;

        this.pageLoading = false;
        this.initLoading = false;
      });
    },
    getReply() {
      this.pageLoading = true;
      this.$Axios({
        method: 'get',
        url: '/comment/getCommentReply',
        params: {
          bindID: this.bindID,
          mainType: this.mainType,
          commentID: this.commentID,
          replyCount: this.pageSize,
          pageNum: this.pageNum,
        },
      }).then((response) => {
        if (response.data.code == 1) {
          this.replyCount = response.data.msg.replyCount;

          let reylies = response.data.msg.replyCommentList;
          if (reylies instanceof Array) {
            this.getUserBehaviorByFileID(response.data.msg);
            if (reylies.length < this.pageSize) {
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