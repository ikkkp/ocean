<style lang="less" scoped>
@import '~@/vant-variables.less';
.page {
  background-color: @gray-1;
}
.fileBox {
  padding: 15px 20px;
  margin-bottom: 5px;
  background-color: @white;
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="最近阅读" left-text="返回" left-arrow @click-left="back" fixed placeholder>
    </van-nav-bar>

    <div class="full">
      <van-pull-refresh v-model="refreshing" @refresh="getRecentlyReadList()" class="full">
        <van-list v-model="loading" :finished="finished" @load="getRecentlyReadList()">
          <div v-for="fileInfo in fileList" :key="fileInfo.fileID" class="fileBox">
            <v-fileBox :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
              :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
              :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
              :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames"></v-fileBox>
          </div>
          <template #finished>
            <!--若无收藏夹则显示空提示-->
            <van-empty description="没有最近7天的阅读记录呢" v-if="fileList.length==0">
              <template slot="image">
                <img src="@/images/empty-picture/no_record.svg" />
              </template>
            </van-empty>
            <div v-else class="notice-nomore__text">没有更多阅读记录了</div>
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
    this.getRecentlyReadList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getRecentlyReadList() {
      this.loading = true;
      this.$Axios({
        method: 'get',
        url: '/docInfoService/getRecentlyReadList',
      }).then((response) => {
        this.fileList = response.data.msg;
        this.refreshing = false;
        this.loading = false;
        this.finished = true;
      });
    },
  },
};
</script>

<style scoped>
</style>