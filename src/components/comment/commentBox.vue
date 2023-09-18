<style scoped lang="less">
@import '~@/vant-variables.less';
.comment {
  display: flex;
  flex-direction: row;
  font-size: 14px;
  &__avatar {
    margin: 0px;
    margin-right: 10px;
  }
  &__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__nickname {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: unset;
    &--comment {
      font-size: 14px;
      font-weight: bold;
    }
    &--reply {
      font-size: 13px;
    }
    &__replyuser {
      margin-left: 2px;
    }
  }
  &__userlevel {
    padding: 0px 4px;
    margin-left: 2px;
  }
  &__content {
    margin-top: 5px;
    word-break: break-all;
    word-wrap: break-word;
    line-break: anywhere;
    &--comment {
      font-size: 14px;
      word-break: break-all;
      word-wrap: break-word;
      line-break: anywhere;
    }
    &--reply {
      font-size: 13px;
    }
    &--index {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    &--delete {
      color: @gray-4;
      text-decoration: line-through;
    }
  }
  &__bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 5px;
    &__date {
      font-size: 12px;
      color: @gray-4;
      font-weight: lighter;
      letter-spacing: -0.5px;
      margin-top: 5px;
    }
    &__flag {
      color: @orange;
      margin-left: 5px;
    }
    &__buttonIcon {
      font-size: 18px !important;
    }
    &__replyButton {
      min-width: unset !important;
      padding: unset !important;
      width: 25px;
      margin-right: 15px;
    }
    &__likeButton {
      min-width: unset !important;
      padding: unset !important;
      width: 50px;
    }
    &__likeNum {
      text-decoration: none !important;
      font-size: 12px;
      color: @gray-5 !important;
      letter-spacing: -0.5px !important;
      text-align: left;
      padding-left: 4px;
    }
    &__moreButton {
      min-width: unset !important;
      padding: unset !important;
    }
  }
  &__replyBox {
    padding-top: 5px;
    &__more {
      padding-left: 10px;
      color: var(--v-secondary-darken1);
      background-color: @gray-1;
      margin: 0px 0px 20px 30px;
    }
  }
}
.more {
  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  &__icon {
    font-size: 18px !important;
  }
}
</style>

<template>
  <div class="comment">
    <v-username class="comment__avatar" type="avater" :avatarSize="isComment?28:24" :username="isComment?comment.commentBuildUsername:comment.replyBuildUsername"></v-username>

    <div style="width:100%">
      <div class="comment__top">
        <div :class="'comment__nickname '+(isComment?'comment__nickname--comment':'comment__nickname--reply')">
          <v-username type="username" :username="isComment?comment.commentBuildUsername:comment.replyBuildUsername">
          </v-username>
          <v-username v-if="isComment" class="comment__userlevel" type="level" :username="isComment?comment.commentBuildUsername:comment.replyBuildUsername">
          </v-username>
          <!--回复评论时显示回复的对象-->
          <v-icon class="comment__nickname__replyuser" v-if="!isComment && comment.replyToCommentReplier!=null && comment.replyToCommentReplier!=''">mdi-menu-right</v-icon>
          <v-username class="comment__nickname__replyuser" type="username" v-if="!isComment && comment.replyToCommentReplier!=null && comment.replyToCommentReplier!=''"
            :username="comment.replyToCommentReplier"></v-username>
        </div>
        <v-btn small text rounded class=" comment__bottom__moreButton" @click="$refs['moreModel'].open()" v-if="comment.commentStatus=='NORMAL'">
          <v-icon class="comment__bottom__buttonIcon" style="color:var(--v-secondary-lighten4)">
            mdi-dots-horizontal</v-icon>
        </v-btn>
      </div>

      <div :class="'comment__content'+(isComment?' comment__content--comment':' comment__content--reply')+(isIndex?' comment__content--index':'')"
        @click="()=>$emit('showReplyList',comment.id)">
        <div :class="comment.commentStatus!='NORMAL'?'comment__content--delete':''">
          {{comment.commentContent}}
        </div>
      </div>
      <div class="comment__bottom">
        <div>
          <div class="comment__bottom__date">{{comment.buildDate}}
            <span class="comment__bottom__flag" v-if="comment.hotValue==2"> 置顶</span>
            <span class="comment__bottom__flag" v-if="comment.hotValue==1 || comment.likeNumber>1000"> 热评</span>
          </div>
        </div>
        <div v-if="comment.commentStatus=='NORMAL'">
          <v-btn small text rounded class=" comment__bottom__replyButton" @click="doReply()">
            <v-icon class="comment__bottom__buttonIcon" style="color:var(--v-secondary-lighten4)">
              mdi-comment-text-multiple-outline</v-icon>
          </v-btn>
          <v-btn small text rounded class="comment__bottom__likeButton" @click="doEvaluateComment('like',comment)">
            <v-icon class="comment__bottom__buttonIcon" style="color:var(--v-secondary-lighten4)" v-if="!comment.isLike">mdi-thumb-up-outline</v-icon>
            <v-icon class="comment__bottom__buttonIcon" style="color:var(--v-primary-base)" v-else>mdi-thumb-up</v-icon>
            <div class="comment__bottom__likeNum">
              {{ comment.likeNumber == 0 ? "":comment.likeNumber}}
            </div>
          </v-btn>
        </div>
      </div>
      <div class="comment__replyBox" v-if="isComment">
        <div v-for="(item,index) in comment.replyCommentList" :key="index">
          <commentBox :faterCommentID="comment.id" :bindID="bindID" :mainType="mainType" :comment="item" :isComment="false" @needLoginNotice="$emit('needLoginNotice')"
            @doReply="(args)=>$emit('doReply', args)"></commentBox>
        </div>
        <van-tag class="comment__replyBox__more" v-if="comment.replyCommentList!=null && comment.replyCount>=2 && !isIndex" round size="medium"
          @click="()=>$emit('showReplyList',comment.id)">查看全部 {{comment.replyCount}} 条回复 <v-icon>mdi-menu-right</v-icon>
        </van-tag>
      </div>
    </div>

    <v-more ref="moreModel">
      <v-moreItem title="删除评论" icon="mdi-delete" @click="doDelete(comment)" v-if="isComment? myUsername == comment.commentBuildUsername: myUsername == comment.replyBuildUsername">
      </v-moreItem>
      <v-moreItem :title="comment.isDislike?'取消踩评论':'踩评论'" icon="mdi-thumb-down" @click="doEvaluateComment('dislike',comment)"></v-moreItem>
      <v-moreItem title="举报" icon="mdi-comment-alert" v-if="isComment? myUsername != comment.commentBuildUsername: myUsername != comment.replyBuildUsername">
      </v-moreItem>
    </v-more>

  </div>
</template>

<script>
import Username from '@/components/common/username/username';
import { Notify } from 'vant';

import userBehaviorStore from '@/components/common/userBehavior/userBehaviorStore.js';
import moreItem from '@/components/more/moreItem';
import more from '@/components/more/more';

export default {
  name: 'commentBox',
  components: {
    'v-username': Username,
    'v-more': more,
    'v-moreItem': moreItem,
  },
  props: {
    bindID: String,
    mainType: String,
    comment: Object,
    isComment: Boolean,
    faterCommentID: {
      default: null,
      type: String,
    },
    isIndex: Boolean,
  },
  mounted() {
    if (localStorage.getItem('token') != null) {
      this.myUsername = window.sessionStorage.getItem('username');
    }
  },
  data() {
    return {
      myUsername: null,
    };
  },
  methods: {
    doDelete(item) {
      this.$Axios({
        method: 'get',
        url: '/comment/deleteComment',
        params: {
          bindID: this.bindID,
          mainType: this.mainType,
          commentID: item.id,
        },
      }).then((response) => {
        if (response.data.code == 1) {
          Notify({ type: 'danger', message: '已成功删除评论' });
        }
      });
    },
    doReply() {
      if (localStorage.getItem('token') == null) {
        this.$emit('needLoginNotice');
        return;
      }
      let args = {};
      args.isReply = true;
      args.replyInCommentID = this.isComment ? this.comment.id : this.faterCommentID;
      args.replyToCommentReplyID = this.isComment ? null : this.comment.id;
      args.replyToCommentReplier = this.isComment ? null : this.comment.replyBuildUsername;
      this.$emit('doReply', args);
    },
    doEvaluateComment(evaluate, item) {
      if (localStorage.getItem('token') == null) {
        this.$emit('needLoginNotice');
        return;
      }
      this.$Axios({
        method: 'get',
        url: '/comment/evaluateComment',
        params: {
          bindID: this.bindID,
          mainType: this.mainType,
          commentID: item.id,
          isLike: evaluate == 'like' ? true : false,
          isCancel: (item.isLike && evaluate == 'like') || (item.isDislike && evaluate == 'dislike') ? true : false,
        },
      })
        .then((response) => {
          if (response.data.code == 1) {
            if (evaluate == 'like') {
              // 当前用户评价是 赞/取消赞
              item.isLike = !item.isLike; // 历史评价状态取反
              if (item.isLike) {
                // （取反后）如果当前评价状态是 赞：true，则本次操作为点赞，赞数增加
                item.likeNumber += 1;
                //如果当前评价状态是 赞：true，则必不能是踩
                if (item.isDislike) {
                  item.isDislike = false; // 取消历史的 踩 状态
                  //做伪装的用户行为记录以规避重复拉取用户行为：删除点踩记录
                  userBehaviorStore.deleteFakeUserBehaviorToList('DOCUMENT', this.bindID, 'DO_COMMENT_DISLIKE', { commentID: item.id });
                }
                //做伪装的用户行为记录以规避重复拉取用户行为：点赞记录
                userBehaviorStore.addFakeUserBehaviorToList('DOCUMENT', this.bindID, 'DO_COMMENT_LIKE', { commentID: item.id });
              } else {
                // 否则是 取消赞
                item.likeNumber -= 1;
                //做伪装的用户行为记录以规避重复拉取用户行为：删除点赞记录
                userBehaviorStore.deleteFakeUserBehaviorToList('DOCUMENT', this.bindID, 'DO_COMMENT_LIKE', { commentID: item.id });
              }
            } else {
              // 当前用户评价是 踩/取消踩
              item.isDislike = !item.isDislike; // 历史评价状态取反
              if (item.isDislike) {
                //如果当前评价状态是 踩：true 且历史评价状态是 赞：true
                if (item.isLike) {
                  item.isLike = false; // 取消历史的 赞 状态
                  item.likeNumber -= 1; // 扣除 赞 数
                  //做伪装的用户行为记录以规避重复拉取用户行为：删除点赞记录
                  userBehaviorStore.deleteFakeUserBehaviorToList('DOCUMENT', this.bindID, 'DO_COMMENT_LIKE', { commentID: item.id });
                }
                //做伪装的用户行为记录以规避重复拉取用户行为：添加点踩记录
                userBehaviorStore.addFakeUserBehaviorToList('DOCUMENT', this.bindID, 'DO_COMMENT_DISLIKE', { commentID: item.id });
              } else {
                //做伪装的用户行为记录以规避重复拉取用户行为：删除点踩记录
                userBehaviorStore.deleteFakeUserBehaviorToList('DOCUMENT', this.bindID, 'DO_COMMENT_DISLIKE', { commentID: item.id });
              }
            }
          }
        })
        .catch((response) => {
          if (response.data.code == -2) {
            Notify({ type: 'danger', message: '异常：不能重复评价一篇文章！' }); //兜底，实际不会触发
          } else if (response.data.code == -3) {
            Notify({ type: 'danger', message: '不能点赞自己的发布嗷~' });
          } else if (response.data.code == -4) {
            Notify({
              type: 'danger',
              message: '异常：不能取消未评价文章的评价！',
            }); //兜底，实际不会触发
          }
        });
    },
  },
};
</script>

<style scoped>
</style>