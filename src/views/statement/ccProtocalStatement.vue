<style scoped lang="less">
@import '~@/vant-variables.less';
.ccprotocal {
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
}
</style>
<template style="overflow-y:hidden">
  <div class="ccprotocal">
    <img class="ccprotocal__logo" src="@/images/main-picture/cc.png" />
    <p class="ccprotocal__title">CC版权协议</p>
    <div class="ccprotocal__content">
      <p>知识共享许可协议（Creative Commons license），又叫CC协议，是一种允许他人分发作品的公共版权许可。</p>

      <p>创作共享协议允许作者选择不同的授权条款和根据不同国家的著作权法制定的版权协议，版权持有人可以指定以下的条件：</p>
      <p>姓名标示（BY）：他人<span class="ccprotocal--primary">可以</span>自由复制、散布、展示及演出本作品；他人<span class="ccprotocal--primary">必须</span>按照作者或授权人所指定的方式，保留其姓名标示。</p>
      <p>非商业性（NC）：他人<span class="ccprotocal--primary">可以</span>自由复制、散布、展示及演出本作品；他人<span class="ccprotocal--primary">不得</span>为商业目的而使用本作品。</p>
      <p>禁止改作（ND）：他人<span class="ccprotocal--primary">可以</span>自由复制、散布、展示及演出本作品；他人<span class="ccprotocal--primary">不得</span>改变、转变或改作本作品。</p>
      <p>相同方式分享（SA）：他人<span class="ccprotocal--primary">可以</span>自由复制、散布、展示及演出本作品；若他人改变、转变或改作本作品，<span class="ccprotocal--primary">仅在遵守与本著作相同的授权条款下</span>，他人才能散布由本作品产生的衍生作品。</p>
      <p class="ccprotocal--primary">在没有指定“NC”的情况下，将授权对本作品进行商业利用；在没有指定“ND”的情况下，将授权创作衍生作品。</p>
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