<style scoped lang="less">
@import '~@/vant-variables.less';
.collection {
  height: 400px;
  &__title {
    text-align: center;
    padding: 10px;
    margin: 5px;
  }
  &__list {
    overflow: scroll;
    height: 310px;
    &--new-collection {
      color: #1989fa;
    }
    &--item-title {
      margin-right: 10px;
    }
  }
  &__button {
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
}
</style>
<style scoped>
.van-rate__icon--full {
  color: #ffd21e;
}
</style>
<template>
  <van-popup class="collection" v-model="collectionModel" closeable close-icon-position="top-left" position="bottom" round>
    <div class="collection__title">
      已加入 {{ collectedNum }} 个收藏夹
    </div>
    <div class="collection__list">
      <van-cell to="/newCollection">
        <template #title>
          <span class="collection__list--new-collection">
            <van-icon name="plus" color="#1989fa" /> 新建收藏夹
          </span>
        </template>
      </van-cell>
      <van-cell :label="item.files.length +' 个内容 · ' +(item.isPublic ? '公开收藏夹' : '私密收藏夹')" v-for="(item, index) in myCollection" :key="index">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="collection__list--item-title">{{ item.name }}</span>
          <van-icon name="lock" v-if="!item.isPublic" color="#1989fa" size="20" />
        </template>
        <template #extra>
          <van-checkbox v-model="isCollectedList[index]"></van-checkbox>
        </template>
      </van-cell>
    </div>
    <van-button class="collection__button" type="info" @click="doCollectionChange">确认</van-button>
  </van-popup>
</template>

<script>
import qs from 'qs';
export default {
  name: 'addCollection',
  components: {},
  props: {
    fileInfo: Object,
  },
  data() {
    return {
      isCollected: false,
      myCollection: [],
      isCollectedList: [],
      collectedNum: 0,
      collectionModel: false,
    };
  },
  mounted() {},
  methods: {
    open() {
      if (localStorage.getItem('token') == null) {
        this.$emit('needLoginNotice');
        return;
      }
      this.collectionModel = true;
      this.getCollection();
    },
    //收藏相关
    //收藏-获取收藏夹信息
    getCollection() {
      this.$Axios({
        method: 'get',
        url: '/docCollectionService/getCollection',
      }).then((response) => {
        this.collectedNum = 0;
        this.myCollection = response.data.msg.collection;

        for (let index in this.myCollection) {
          let isExist = false;
          for (let j = 0; j < this.myCollection[index].files.length; j++) {
            if (this.myCollection[index].files[j] == this.fileInfo.fileID) {
              isExist = true;
            }
          }

          if (isExist) {
            this.isCollectedList[index] = true;
            this.collectedNum++;
          } else {
            this.isCollectedList[index] = false;
          }
        }
      });
    },
    //收藏-执行收藏变更
    doCollectionChange() {
      let changedCollection = {};
      for (let index in this.myCollection) {
        changedCollection[this.myCollection[index].collectionID] = this.isCollectedList[index];
      }
      this.$Axios({
        method: 'post',
        url: '/docCollectionService/changeCollectionItem',
        data: qs.stringify({
          changedList: JSON.stringify(changedCollection),
          fileID: this.fileInfo.fileID,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((response) => {
        if (response.data.code == 1) {
          this.collectionModel = false;
        }
      });
    },
  },
};
</script>