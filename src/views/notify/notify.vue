<template>
  <div>
    <van-nav-bar id="toolbar" title="消息" left-text="返回" left-arrow @click-left="back" fixed placeholder></van-nav-bar>
    <van-grid style="margin-bottom: 10px">
      <van-grid-item text="帮帮求助" to="/">
        <template #icon>
          <img src="@/images/module-icon/icon_notify_help.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="赞同" to="/notifyLikeList">
        <template #icon>
          <img src="@/images/module-icon/icon_notify_like.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="下载与评价" to="/">
        <template #icon>
          <img src="@/images/module-icon/icon_notify_evaluate.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="评论与回复" to="/">
        <template #icon>
          <img src="@/images/module-icon/icon_notify_comment.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
// import fileBox from '../../components/fileBox';
import userNotifyStore from './userNotifyStore.js';

export default {
  components: {
    // 'v-fileBox': fileBox,
  },
  mounted() {
    userNotifyStore.pullUserNotifyList(this);
  },
  data() {
    return {};
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