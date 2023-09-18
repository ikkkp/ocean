<template>
  <div style="position: absolute; top: 0px; right: 0px" v-if="showLoading">
    <div style="display: flex; flex-direction: row; align-items: center" class="mx-2 my-2">
      <p class="text-caption mr-2 mb-0" style="line-height: 16px; text-align: right">
        <span>加载中</span><br />
        <span v-if="subTitle != null">{{subTitle}}</span>
      </p>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showLoading: false,
      title: "加载中",
      subTitle: null,
    };
  },
  methods: {
    show(subTitle, title) {
      if (title != null) {
        this.title = title;
      }
      this.subTitle = subTitle;
      this.showLoading = true;
    },
    hide() {
      this.showLoading = false;
    },
  },
};
</script>