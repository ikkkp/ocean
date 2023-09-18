<style scoped lang="less">
@import '~@/vant-variables.less';
.score {
  font-size: 12px;
  color: @gray-5;
  &__model {
    text-align: center;
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__title {
      margin: 15px;
      font-size: 14px;
    }
    &__caption {
      margin: 15px;
      font-size: 12px;
      color: @gray-5;
    }
  }
}
</style>
<style scoped>
.van-rate__icon--full {
  color: #ffd21e;
}
</style>
<template>
  <div>
    <div class="score" @click="open()">
      {{ ratersNum }} 人评出
      <van-rate :value="scoreAvg" allow-half color="#ffd21e" void-icon="star" void-color="#eee" size="12" />
      {{ parseFloat(scoreAvg).toFixed(1) }} 分
    </div>

    <van-popup v-model="setScoreModel" round position="bottom" style="height: 200px" closeable>
      <div class="score__model">
        <div class="score__model__title">请为该文档进行评分</div>
        <van-rate v-model="myScore" allow-half :size="35" color="#ffd21e" void-icon="star" void-color="#eee" />
        <div class="score__model__caption">公正评价是对作者劳动成果的尊重</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'addScoreModel',
  props: {
    ratersNum: Number,
    score: Number,
  },
  computed: {
    scoreAvg() {
      return this.score / this.ratersNum;
    },
  },
  data() {
    return {
      //文档评分
      myScore: 0,
      setScoreModel: false,
    };
  },
  mounted() {},
  methods: {
    open() {
      this.setScoreModel = true;
    },
  },
};
</script>

<style>
</style>