<style scoped>
.more {
  margin: 10px;
  background-color: white;
}
</style>
<template>
  <van-popup v-model="moreModel" position="bottom">
    <div class="more">
      <slot></slot>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'more',
  data() {
    return {
      moreModel: false,
    };
  },
  methods: {
    open() {
      this.moreModel = true;
    },
    close() {
      this.moreModel = false;
    },
  },
};
</script>

<style scoped>
</style>