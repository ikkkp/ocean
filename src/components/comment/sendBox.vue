<style scoped lang="less">
@import '~@/vant-variables.less';
.comments-input-mask-2 {
  padding: 15px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0px -1px 1px #eee;
  color: @gray-4;
  &__button {
    color: rgb(45, 139, 240);
  }
}
.inputbox {
  height: 200px;
  &__textarea {
    font-size: 14px;
  }
  &__send {
    width: 100%;
    height: 50px;
    display: flex;
    text-align: right;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>

<style scoped lang="less">
/deep/ .v-textarea textarea {
  line-height: 1.2rem;
  margin-top: 35px !important;
  font-size: 14px;
}
</style>

<template>
  <div>
    <div class="comments-input-mask-2" @click="showSendBox(initParams)">
      <div>评论千万条，文明第一条</div>
      <div class="comments-input-mask-2__button">发布</div>
    </div>

    <van-popup class="inputbox" v-model="inputModel" round position="bottom" closeable>
      <v-textarea v-model="commentContent" class="inputbox__textarea" background-color="white" :loader-height="1" filled no-resize :label="notice" hide-details="auto" rows="6"
        shaped></v-textarea>
      <div class="comments-input-mask-2">
        <div class="comments-input-mask-2__button" @click="sendCommentOrReply">发布</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import qs from 'qs';
export default {
  name: 'sendBox',
  components: {},
  props: {
    bindID: String,
    mainType: String,
    isReply: Boolean,
    replyInCommentID: String,
  },
  mounted() {
    if (this.isReply != null) {
      this.initParams.isReply = this.isReply;
    }
    if (this.replyInCommentID != null) {
      this.initParams.replyInCommentID = this.replyInCommentID;
    }
  },
  data() {
    return {
      notice: '评论千万条，文明第一条',
      inputModel: false,
      commentContent: null,
      initParams: { isReply: false },
      params: {},
    };
  },
  methods: {
    showSendBox(params = this.initParams) {
      if (localStorage.getItem('token') == null) {
        this.$emit('needLoginNotice');
        return;
      }
      this.inputModel = true;
      this.params = params;
      this.notice = params.replyToUsername != null ? '回复用户: ' + params.replyToUsername : '评论千万条，文明第一条';
    },
    sendCommentOrReply() {
      this.$Axios({
        method: 'post',
        url: '/comment/addComment',
        data: qs.stringify({
          bindID: this.bindID,
          mainType: this.mainType,
          commentContent: this.commentContent,
          ...this.params,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          if (response.data.code == 1) {
            this.commentContent = null;
            this.$emit('onSuccess', {
              args: this.params,
              response: response.data.msg,
            });
          } else {
            this.$emit('onError', response.data.msg);
          }
          this.inputModel = false;
        })
        .catch((error) => {
          this.$emit('onError', error);
          this.inputModel = false;
        });
    },
  },
};
</script>

<style scoped>
</style>