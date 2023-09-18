<style scoped lang="less">
@import '../vant-variables.less';
.adBox {
  border: 1px solid @gray-2;
  border-radius: 10px;
  margin: 15px;
  background-color: @gray-1;
  &__title {
    padding: 10px 15px;
    font-size: 14px;
  }
  &__content {
    padding: 5px 15px;
    font-size: 12px;
    color: @gray-4;
  }
}
</style>

<template>
  <div>
    <div class="adBox" @click="open">
      <div class="adBox__title">飞书2022春招来袭，超多职位，等你来投！</div>
      <video src="../images/ad-3.mp4" autoplay muted width="100%" />
      <!-- <img src="../images/ad.png" width="100%"/> -->
      <div class="adBox__content">字节跳动 的广告</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'adBox',
  props: {},
  mounted() {},
  data() {
    return {};
  },
  methods: {
    open() {
      window.location.href = 'https://mp.weixin.qq.com/s/nxaxk7yLwZ-msP2HF6hz0A';
    },
  },
};
</script>

<style scoped>
</style>