<style lang="less" scoped>
@import '~@/vant-variables.less';
.indexBox {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  &__title {
    text-align: left;
    font-size: 16px;
    margin: 20px;
  }
  &__indexSupport {
    flex: 1;
    overflow: auto;
  }
}
.index {
  background-color: white;
  padding: 20px;
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__title {
      font-size: 20px;
      margin: 0px 0;
    }
    &__button {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }
  &__artical {
    display: flex;
    &__fileBox {
      margin-top: 15px;
    }
  }
}
/deep/ .van-tabs__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="专题详情" left-text="返回" left-arrow @click-left="back" fixed placeholder @click-right="toIndex">
      <template #right>
        <a>返回首页</a>
      </template>
    </van-nav-bar>
    <div class="index full">
      <div class="index__top">
        <div class="index__top__title">{{name}}
          <span style="font-size: 14px;">{{nameExtra}}</span>
        </div>
        <a class="index__top__button" @click="changeIndex()">精确索引
          <van-icon name="arrow" />
        </a>
      </div>
      <van-tabs class="index__artical full" v-model="activeTag" :ellipsis="false" sticky>
        <van-tab :title="type.typeName" :name="index" v-for="(type,index) in typeList" :key="type.typeID" class="full">
          <van-pull-refresh v-model="type.refreshing" @refresh="getFileListByTypeIDAndTagIDAndIndexString(type.typeID,true)" class="full">
            <van-list v-model="type.loading" :finished="type.finished" @load="getFileListByTypeIDAndTagIDAndIndexString(type.typeID)">
              <div v-for="fileInfo in fileList[type.typeID]" :key="fileInfo.fileID">
                <v-fileBox class="index__artical__fileBox" :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title"
                  :fileType="fileInfo.fileType" :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum"
                  :score="fileInfo.fileExtraEntity.score" :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod"
                  :paymentAmount="fileInfo.paymentAmount" :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames"></v-fileBox>
              </div>
              <template #finished>
                <!--若无合适的文件则显示空提示-->
                <van-empty description="本分类下没有文档" v-if="fileList[type.typeID].length==0">
                  <template slot="image">
                    <img src="@/images/empty-picture/no_data.svg" />
                  </template>
                </van-empty>
                <div class="notice-nomore__text" v-else>没有更多的文档了</div>
              </template>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup class="indexBox" v-model="indexDrawerShow" position="right" :style="{ height:'100%',width: '90%' }" closeable round>
      <p class="indexBox__title">索引列表</p>
      <v-indexSupport class="indexBox__indexSupport" :rootString="$route.query.indexString" @setIndexString="setIndexString"></v-indexSupport>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import fileBox from '@/components/fileBox';
import indexSupport from '@/components/indexSupport';

export default {
  components: {
    'v-fileBox': fileBox,
    'v-indexSupport': indexSupport,
  },
  data() {
    return {
      indexDrawerShow: false,
      indexString: this.$route.query.indexString,
      name: this.$route.query.name,
      nameExtra: null,
      activeTag: 0,
      typeList: [],
      fileList: {},
    };
  },
  mounted() {
    this.getTypesByTypeString(this.$route.query.typeString);
  },
  methods: {
    back() {
      // if (this.$root.devicesFlag) {
      //   //适配Wap2App
      //   var webview = plus.webview.currentWebview();
      //   webview.back();
      // } else {
      this.$router.go(-1); //返回上一层
      // }
    },
    toIndex() {
      this.$router.replace('/Index');
    },
    getTypesByTypeString(typeString) {
      this.$Axios({
        method: 'get',
        url: '/docClassificationService/getTypesByTypeString',
        params: {
          typeString: typeString,
        },
      }).then((response) => {
        let typeList = response.data.msg;
        for (let index in typeList) {
          typeList[index].finished = false;
          typeList[index].refreshing = false;
          typeList[index].loading = false;
          typeList[index].nextPage = 1;
        }
        this.typeList = typeList;
      });
    },
    getFileListByTypeIDAndTagIDAndIndexString(typeID, isNew = false) {
      if (isNew) {
        this.typeList[this.activeTag].nextPage = 1;
      }
      this.$Axios({
        method: 'get',
        url: '/docClassificationService/getGroupsFileList',
        params: {
          indexString: this.indexString,
          typeID: typeID,
          tagString: this.$route.query.tagString,
          pageNum: this.typeList[this.activeTag].nextPage,
          pageSize: 10,
        },
      }).then((response) => {
        if (!this.fileList[typeID] || isNew) {
          Vue.set(this.fileList, typeID, []);
        }
        this.fileList[typeID].push.apply(this.fileList[typeID], response.data.msg.list);

        Vue.set(this.typeList[this.activeTag], 'loading', false);
        Vue.set(this.typeList[this.activeTag], 'refreshing', false);
        Vue.set(this.typeList[this.activeTag], 'nextPage', this.typeList[this.activeTag].nextPage + 1);
        Vue.set(this.typeList[this.activeTag], 'finished', response.data.msg.isLastPage);
      });
    },
    changeIndex() {
      this.indexDrawerShow = true;
    },
    setIndexString(indexString, indexStringName) {
      this.indexString = indexString;
      this.indexDrawerShow = false;
      let typeID = this.typeList[this.activeTag].typeID;
      this.getFileListByTypeIDAndTagIDAndIndexString(typeID, true);
      this.nameExtra = '(' + indexStringName + ')';
    },
  },
};
</script>
