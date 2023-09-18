<template>
  <div>
    <div style="margin:0 20px">
      <van-button round type="info" size="small" icon="arrow-up" @click="previousIndex" style="margin-right: 10px;">返回上一级</van-button>
      <van-button round type="info" size="small" icon="success" @click="finish">使用当前索引</van-button>
      <p style="font-size: 14px;margin: 10px 0;">当前索引：{{indexStringName}} ( 索引号{{indexString}} ) </p>
    </div>
    <van-tree-select :items="itemList" height="100%" :active-id.sync="activeId" :main-active-index.sync="activeIndex" @click-item="onChooseItem" @click-nav="onChooseNav">
    </van-tree-select>
  </div>
</template>

<script>
export default {
  props: {
    rootString: String,
  },
  data() {
    return {
      indexString: null,
      indexStringName: null,
      itemList: [],
      activeId: null,
      activeIndex: 0,
      historyItemList: [],
    };
  },
  mounted() {
    this.indexString = this.rootString;
    this.getIndex(this.rootString);
  },
  methods: {
    getIndex(indexString) {
      this.$Axios({
        method: 'get',
        url: '/docClassificationService/getIndexList',
        params: {
          indexString: indexString,
        },
      }).then((response) => {
        let root = response.data.msg;
        let children = [];
        for (let index in root.nextNodes) {
          children.push({
            text: root.nextNodes[index].nodeName,
            id: indexString + '-' + index,
            nextNodes: root.nextNodes[index].nextNodes,
          });
        }
        this.itemList.push({
          text: root.nodeName,
          id: indexString,
          nextNodes: root.nextNodes,
          children: children,
        });
        this.indexStringName = root.nodeName;
      });
    },
    onChooseItem(data) {
      this.indexString = this.activeId;
      this.indexStringName = data.text;
      if (data.nextNodes == null) {
        //结束
        this.finish();
      } else {
        this.historyItemList.push(this.itemList);
        let newItemList = this.itemList[this.activeIndex].children;
        this.activeIndex = newItemList.indexOf(data);
        this.activeId = null;
        this.itemList = newItemList;
        this.onChooseNav();
      }
    },
    onChooseNav() {
      this.indexString = this.itemList[this.activeIndex].id;
      this.indexStringName = this.itemList[this.activeIndex].text;
      if (this.itemList[this.activeIndex].nextNodes == null) {
        //结束
        this.finish();
      } else {
        let children = [];
        for (let index in this.itemList[this.activeIndex].nextNodes) {
          children.push({
            text: this.itemList[this.activeIndex].nextNodes[index].nodeName,
            id: this.itemList[this.activeIndex].id + '-' + index,
            nextNodes: this.itemList[this.activeIndex].nextNodes[index].nextNodes,
          });
        }
        this.activeId = null;
        this.itemList[this.activeIndex].children = children;
      }
    },
    previousIndex() {
      if (this.historyItemList.length > 0) {
        this.itemList = this.historyItemList.pop();
        this.activeIndex = 0;
        this.activeId = null;
        this.onChooseNav();
      }
    },
    finish() {
      this.$emit('setIndexString', this.indexString, this.indexStringName);
    },
  },
};
</script>

<style scoped>
</style>