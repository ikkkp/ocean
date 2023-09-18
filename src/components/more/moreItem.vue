<style scoped>
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
<template>
  <div>
    <van-cell class="cell" :title="title" @click="$emit('click')">
      <template #right-icon>
        <v-icon color="secondary-darken5" size="22">{{icon}}</v-icon>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'moreItem',
  props: {
    title: String,
    icon: String,
  },
  methods: {},
};
</script>

<style scoped>
</style>