<style scoped lang="less">
@import '~@/vant-variables.less';
.free-print {
  &__img {
    background: url('../../../images/main-picture/motaPrint.jpg') center center no-repeat;
    height: 200px;
    background-size: auto 100%;
  }
  &__title {
    color: #333;
    font-size: 16px;
    line-height: 1;
    padding-top: 20px;
    text-align: center;
  }
  &__content {
    text-align: center;
    margin: 10px 0;
    color: #666;
    font-size: 14px;
  }
}
</style>
<template>
  <v-dialog v-model="freePrintModel" persistent max-width="290">
    <v-card>
      <div class="free-print__img"></div>
      <v-card-title class="text-h6">
        使用点墨自助打印设备打印
      </v-card-title>
      <v-card-text>无套路，文档打印全部免费</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="freePrintModel = false">
          稍后再说
        </v-btn>
        <v-btn color="var(--v-primary-base)" text @click="$router.push('/freePrint')">
          立刻前往
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      freePrintModel: false,
    };
  },
  mounted() {},
  methods: {
    open() {
      this.freePrintModel = true;
    },
  },
};
</script>

<style>
</style>