<style lang="less" scoped>
@import '~@/vant-variables.less';
.page {
  background-color: @gray-1;
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="钱包账单" left-text="返回" left-arrow @click-left="back" fixed placeholder>
    </van-nav-bar>
    <div class="full">
      <van-pull-refresh v-model="loading" @refresh="getWalletChangeRecord(true)" class="full">
        <van-list v-model="loading" :finished="finished" @load="getWalletChangeRecord()">
          <div v-for="(record,index) in recordList" :key="index">
            <van-cell :value="record.time" size="large" :label="record.reason">
              <template #title>
                <p :style="'color:'+(record.changeNum>0?'#ed4014':'#19be6b')">{{record.changeNum>0?'增加':'扣除'}} {{record.changeNum}}
                  {{record.itemName=='Ticket'?'下载券':(record.itemName=='Coin'?'金币':record.itemName) }}</p>
              </template>
            </van-cell>
          </div>
          <template #finished>
            <!--若无合适的文件则显示空提示-->
            <van-empty description="没有账单记录" v-if="recordList.length===0">
              <template slot="image">
                <img src="@/images/empty-picture/no_record.svg" />
              </template>
            </van-empty>
            <div class="notice-nomore__text" v-else>没有更多账单了</div>
          </template>
        </van-list>

      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      nextPage: 1,
      loading: false,
      finished: false,
      recordList: {},
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getWalletChangeRecord(typeID, isNew = false) {
      if (isNew) {
        this.nextPage = 1;
      }
      this.$Axios({
        method: 'get',
        url: '/userWalletService/getWalletChangeRecord',
        params: {
          pageNum: this.nextPage,
          pageSize: 10,
        },
      }).then((response) => {
        this.loading = false;
        this.recordList = response.data.msg.list;
        this.finished = response.data.msg.isLastPage;
      });
    },
  },
};
</script>
