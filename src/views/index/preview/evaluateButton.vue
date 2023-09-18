<style scoped lang="less">
@import '~@/vant-variables.less';
.button {
  &__icon {
    font-size: 16px !important;
    margin: 0 2px;
  }
  &__text {
    font-size: 12px;
    color: var(--v-primary-base);
    letter-spacing: 0px !important;
  }
  &--like {
    background-color: #2d8bf011;
    height: 30px !important;
    min-width: 30px;
  }
  &--dislike {
    background-color: #2d8bf011;
    height: 30px !important;
    min-width: 30px;
  }
}
</style>
<template>
  <v-btn-toggle :value="evaluateButtonStatus" multiple rounded color="primary" background-color="#2d8cf011">
    <v-btn :style="{width:(evaluateLoading?'130px':(this.isDisLike?'40px':'90px')),'border-color': 'var(--v-primary-base) !important'}" class="button--like" plain
      :loading="evaluateLoading" @click="doEvaluateDoc('like')">
      <v-icon class="button__icon" style="color:var(--v-primary-base)">mdi-thumb-up</v-icon>
      <span class="button__text" v-if="!this.isDisLike"> {{this.isLike?" 已赞同":" 赞同"}}
        {{ fileInfo.fileExtraEntity.likeNum }}</span>
    </v-btn>
    <v-btn :style="{width:(!this.isDisLike?'40px':'90px'),'border-color': 'var(--v-primary-base) !important'}" class="button--dislike" plain v-if="!evaluateLoading"
      @click="doEvaluateDoc('dislike')">
      <span v-if="this.isDisLike" class="button__text" style="margin-right:5px">已反对</span>
      <v-icon class="button__icon" style="color:var(--v-primary-base)">mdi-thumb-down</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
import { Notify } from 'vant';

export default {
  name: 'evaluateButton',
  props: {
    fileInfo: Object,
  },
  computed: {
    evaluateButtonStatus() {
      if (this.evaluateLoading) {
        return [0, 1];
      }
      if (!this.isLike && !this.isDisLike) {
        return [0, 1];
      } else if (this.isLike) {
        return [0];
      } else {
        return [1];
      }
    },
  },
  data() {
    return {
      //点赞点踩
      isLike: false,
      isDisLike: false,
      evaluateLoading: true, //评价信息加载或正在请求
    };
  },
  mounted() {},
  methods: {
    initEvaluateStatus(userBehaviorList) {
      if (userBehaviorList == null) {
        // 未登录时无法获取用户行为数据
        this.evaluateLoading = false;
      }
      for (let index in userBehaviorList) {
        if (userBehaviorList[index].behaviorType == 'DO_LIKE') {
          this.isLike = true;
        }
        if (userBehaviorList[index].behaviorType == 'DO_DISLIKE') {
          this.isDisLike = true;
        }
      }
      this.evaluateLoading = false;
    },

    //评价文章
    doEvaluateDoc(evaluate) {
      if (localStorage.getItem('token') == null) {
        this.$emit('needLoginNotice');
        return;
      }
      this.evaluateLoading = true;
      this.$Axios({
        method: 'get',
        url: '/docFunctionService/evaluateDoc',
        params: {
          fileID: this.fileInfo.fileID,
          isLike: evaluate == 'like' ? true : false,
          isCancel: (this.isLike && evaluate == 'like') || (this.isDisLike && evaluate == 'dislike') ? true : false,
        },
      })
        .then((response) => {
          this.evaluateLoading = false;
          if (response.data.code == 1) {
            if (evaluate == 'like') {
              this.isLike = !this.isLike;
              if (this.isLike) {
                Notify({ type: 'success', message: '已赞同' });
                this.fileInfo.fileExtraEntity.likeNum += 1;
              } else {
                Notify({ type: 'success', message: '已取消赞同' });
                this.fileInfo.fileExtraEntity.likeNum -= 1;
              }
              if (this.isLike) {
                this.isDisLike = false;
              }
            } else {
              this.isDisLike = !this.isDisLike;
              if (this.isDisLike === true) {
                Notify({ type: 'success', message: '已反对' });
              } else {
                Notify({ type: 'success', message: '已取消反对' });
              }
              if (this.isDisLike && this.isLike) {
                this.isLike = false;
                this.fileInfo.fileExtraEntity.likeNum -= 1;
              }
            }
          }
        })
        .catch((response) => {
          this.evaluateLoading = false;
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

<style>
</style>