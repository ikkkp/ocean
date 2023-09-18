<style scoped lang="less">
@import '~@/vant-variables.less';
.collection {
  background-color: white;
  padding: 20px;
  &__title {
    font-size: 20px;
    margin: 0;
    width: 100%;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  &__desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="收藏详情" left-text="返回" left-arrow @click-left="back" fixed placeholder @click-right="toChangeCollection">
      <template #right>
        <a>修改</a>
      </template>
    </van-nav-bar>
    <div class="collection full">
      <p class="collection__title">{{$route.query.collectionName}}</p>
      <p class="collection__desc" v-if="$route.query.collectionDesc!=null">{{$route.query.collectionDesc}}</p>

      <van-pull-refresh v-model="refreshing" @refresh="getCollectionFileList()" class="full">
        <van-list v-model="loading" :finished="finished" @load="getCollectionFileList()">
          <div v-for="(fileInfo,index) in fileList" :key="fileInfo.fileID">
            <van-swipe-cell>
              <v-fileBox :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
                :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
                :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
                :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames" class="preview__folder__filebox"></v-fileBox>
              <template #right>
                <van-button square text="删除" type="danger" style="height: 100%" @click="deleteCollectionItem(index,fileInfo.fileID)" />
              </template>
            </van-swipe-cell>
          </div>
          <template #finished>
            <!--若无收藏夹则显示空提示-->
            <van-empty description="本收藏夹下还没有收藏文档" v-if="fileList.length==0">
              <template slot="image">
                <img src="@/images/empty-picture/no_data.svg" />
              </template>
            </van-empty>
            <div v-else class="notice-nomore__text">没有更多文档了</div>
          </template>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import fileBox from '../../components/fileBox';

export default {
  components: {
    'v-fileBox': fileBox,
  },
  data() {
    return {
      fileList: [],
      refreshing: false,
      loading: false,
      finished: false,
    };
  },
  mounted() {
    this.getCollectionFileList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getCollectionFileList() {
      this.loading = true;
      this.$Axios({
        method: 'get',
        url: '/docCollectionService/getCollectionFileList',
        params: {
          collectionID: this.$route.query.collectionID,
        },
      }).then((response) => {
        this.fileList = response.data.msg;
        this.loading = false;
        this.refreshing = false;
        this.finished = true; //一次性全部加载，直接完成
      });
    },
    deleteCollectionItem(index, fileID) {
      this.$Axios({
        method: 'get',
        url: '/docCollectionService/deleteCollectionItem',
        params: {
          collectionID: this.$route.query.collectionID,
          fileID: fileID,
        },
      }).then((response) => {
        if (response.data.state == 'SUCCESS') {
          this.fileList.splice(index, 1);
        }
      });
    },
    toChangeCollection() {
      this.$router.push({
        path: '/newCollection',
        query: {
          collectionID: this.$route.query.collectionID,
          collectionName: this.$route.query.collectionName,
          collectionDesc: this.$route.query.collectionDesc,
          isPublic: this.$route.query.isPublic,
          isChange: true,
        },
      });
    },
  },
};
</script>

<style scoped>
</style>