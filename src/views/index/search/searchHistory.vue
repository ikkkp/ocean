<style scoped lang="less">
@import '~@/vant-variables.less';
.history {
  &__title {
    margin-top: 10px;
    font-size: 12px;
    color: @gray-5;
  }
  &__tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    &__tag {
      margin: 5px 10px 5px 0px;
    }
  }
}
</style>
<template>
  <div class="">
    <div class="history__title">历史记录</div>
    <div class="history__tags">
      <v-chip class="history__tags__tag" v-for="(item,index) in history" v-bind:key="index" small close @click="clickTag(item)" @click:close="deleteHistory(item)">
        {{item}}
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchHistory',
  props: {},
  data() {
    return {
      history: null,
    };
  },
  mounted() {
    this.history = JSON.parse(localStorage.getItem('searchHistory'));
    if (this.history == null) {
      localStorage.setItem('searchHistory', JSON.stringify([]));
      this.history = [];
    }
  },
  methods: {
    deleteHistory(item) {
      this.history = this.history.filter((searchString) => {
        return searchString != item;
      });
      localStorage.setItem('searchHistory', JSON.stringify(this.history));
    },
    addHistory(searchString) {
      let flag = false;
      this.history.map((item) => {
        if (searchString == item) {
          flag = true;
        }
      });
      if (!flag) {
        this.history.push(searchString);
        localStorage.setItem('searchHistory', JSON.stringify(this.history));
      }
    },
    clickTag(searchString) {
      this.$emit('onHistoryTagClick', searchString);
    },
  },
};
</script>

<style>
</style>