<style lang="less" scoped>
@import '~@/vant-variables.less';
.page {
  background-color: @gray-1;
}
.notifyBox {
  background-color: @white;
  padding: 20px;
  margin-bottom: 5px;
  &__top {
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    &__avatar {
      margin-right: 5px;
    }
    &__date {
      font-size: 12px;
      color: @gray-4;
    }
  }
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="赞同" left-text="返回" left-arrow @click-left="back" fixed placeholder></van-nav-bar>
    <div v-for="(item,index) in likeList" :key="index" class="notifyBox">
      <div class="notifyBox__top">
        <div class="notifyBox__top__avatar">
          <v-username class="comment__avatar" type="avater" :avatarSize="28" :username="item.buildUsername"></v-username>
        </div>
        <div>
          <div>
            <v-username type="username" :username="item.buildUsername"></v-username>
            点赞了你的{{item.action=='LIKE_COMMENT'?'评论':'文章'}}
          </div>
          <div class="notifyBox__top__date">{{item.buildDate}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  mounted() {},
  data() {
    return {
      likeList: [],
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