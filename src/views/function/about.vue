<style lang="less" scoped>
@import '~@/vant-variables.less';
.about {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  height: 100%;
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 20px;
    &--primary {
      color: #000;
      font-size: 12px;
      text-align: center;
    }
    &--warning {
      color: var(--v-primary-base);
      font-size: 12px;
      text-align: center;
    }
    &__button {
      margin: 10px;
    }
  }
  &__bottom {
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.7);
    text-align: center;
    margin: 15px;
  }
}
.sponsor {
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<template>
  <div class="about">
    <van-nav-bar id="toolbar" title="关于OceanLib" left-text="返回" left-arrow @click-left="back" fixed placeholder>
    </van-nav-bar>
    <img src="../../images/main-picture/about_top.png" style="width: 100%" />
    <div class="about__content">
      <br />
      <p class="about__content--primary">内部版本3.2.1 (20220318Build)内测版本</p>
      <p class="about__content--warning">本项目为中南大学、北京理工大学大学生创新创业项目支持的非盈利性公益项目</p>
      <v-btn class="about__content__button" small @click="showSponsor=true">捐赠OceanLib项目</v-btn>
    </div>

    <p class="about__bottom">
      遵顼Apache Licene 2.0协议开源<br />
      允许代码修改再发布 允许商用<br />
      但必需在产品首页声明产品原始名称及<a>主要作者</a>
    </p>

    <van-popup v-model="showSponsor" closeable position="right" round style="width:90%;height:100%">
      <div class="sponsor">
        <v-card class="my-2" style="width:90%">
          <v-img src="@/images/main-picture/sponsor_code.jpg"></v-img>
          <v-alert border="right" colored-border type="info" elevation="2" class="mb-0">
            如果有时间，麻烦亲动动手给文库捐助一个免费的红包包，今年的服务器费用也拜托亲啦！<a>捐助者名单</a>
          </v-alert>
        </v-card>
        <v-card class="my-2" style="width:90%">
          <v-img src="@/images/main-picture/red_packet.jpg"></v-img>
        </v-card>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      showSponsor: false,
    };
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
  },
};
</script>

<style scoped>
</style>