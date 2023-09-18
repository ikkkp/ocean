<style scoped lang="less">
@import '~@/vant-variables.less';
.payment {
  padding: 20px;
  &__logo {
    width: 160px;
  }
  &__title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  &__content {
    font-size: 14px;
  }
  &--primary {
    font-size: 14px;
    color: var(--v-primary-base);
    font-weight: bold;
  }
  &--important {
    font-size: 14px;
    color: var(--v-error-base);
    font-weight: bold;
  }
}
</style>
<template style="overflow-y:hidden">
  <div class="payment">
    <v-alert border="right" colored-border type="info" elevation="2">
      若您上传文档为若未经任课教师授权的公开课件等资料，为<span class="payment--primary">避免产权纠纷</span>请<span class="payment--primary">不要</span>开启访客可阅读
      ，保持收益类型为<span class="payment--primary">无偿贡献。</span>
    </v-alert>
    <v-alert border="right" colored-border type="error" elevation="2">
      <span class="payment--important">请勿上传任课教师事先声明禁止公开或上传至网络的任何内容</span>，一经举报将永久封禁账号，由此带来的其他后果由本人自行承担。
    </v-alert>
    <p class="payment__title">文档收益说明</p>
    <div class="payment__content">
      <p>待补充</p>
    </div>
    <p class="payment__title">怎样贡献优质文档</p>
    <div class="payment__content">
      <p>待补充</p>
    </div>
    <p class="payment__title">我如何从“优享免费下”获益？</p>
    <div class="payment__content">
      <p>待补充</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style>
</style>