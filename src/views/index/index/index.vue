<style scoped lang="less">
.index {
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  &__top {
    background-color: white;
    padding: 20px;
    &__logo {
      width: 150px;
    }
    &__searchBox {
      margin: 10px 0;
    }
    &__grid {
      margin: 10px 0;
    }
    &__adSwipe {
      margin-bottom: 0px;
    }
  }
  &__artical {
    margin-top: 5px;
    background-color: white;
    padding: 20px;
    &__group {
      display: flex;
      justify-content: space-between;
      &__title {
        font-size: 16px;
        &--extraDesc {
          font-size: 12px;
        }
        &--divider {
          margin: 0 5px;
        }
      }
      &__more {
        font-size: 14px;
        display: flex;
        align-items: center;
      }
      &__tabs {
        margin: 5px 0;
        &__tab {
          margin: 10px 0;
        }
      }
      &__fileBox {
        margin-top: 15px;
      }
    }
  }

  &__bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;

    &__navigation {
      height: 56px !important;
    }
  }
}
</style>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>
<template>
  <div class="index">
    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o" v-if="isIntranet">
      您当前处于校园局域网内，已为您切换校内服务器提供服务。当您离开校园局域网时首次加载可能会有短暂延迟，望您见谅。
    </van-notice-bar>
    <div class="index__top">
      <img class="index__top__logo" src="@/images/main-picture/logo.png" />
      <div class="index__top__searchBox" @click="toSearch">
        <v-text-field outlined readonly dense hide-details="auto" prepend-inner-icon="mdi-file-find">
          <template v-slot:label>
            <div class="text-body-2 text--secondary">搜索你想查找的资料名称</div>
          </template>
        </v-text-field>
      </div>
      <van-grid class="index__top__grid">
        <!--一重循环，把各个Top的Group循环显示出来-->
        <van-grid-item :text="item.groupName" v-for="item in topItemList" :key="item.groupID"
          @click="toIndexResult(item.groupName,item.includeIndex,item.includeType,item.includeTag)">
          <template slot="icon">
            <v-icon style="color:var(--v-primary-base)">mdi-{{item.icon}}</v-icon>
          </template>
        </van-grid-item>
      </van-grid>
      <van-swipe class="index__top__adSwipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item style="background-color: var(--v-primary-base);display: flex;justify-content: center;align-items: center;color: white">
          <div style="line-height: 0px;"><img src="@/images/ad-4.jpg" width="100%" /></div>
        </van-swipe-item>
        <van-swipe-item style="background-color: var(--v-primary-base);display: flex;justify-content: center;align-items: center;color: white">
          <div style="line-height: 0px;"><img src="@/images/ad-5.jpg" width="100%" /></div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="index__artical" v-for="item in mainItemList" :key="item.groupID">
      <!--一重循环，把各个Main的Group循环显示出来-->
      <div class="index__artical__group">
        <div class="index__artical__group__title">{{item.groupName}}
          <span class="index__artical__group__title--divider">|</span>
          <span class="index__artical__group__title--extraDesc text--secondary">{{item.extraDesc}}</span>
        </div>
        <a class="index__artical__group__more" @click="toIndexResult(item.groupName,item.includeIndex,item.includeType,item.includeTag)">
          详情
          <van-icon name="arrow" />
        </a>
      </div>

      <van-tabs v-model="item.activeTag" class="index__artical__group__tabs" :ellipsis="false" sticky @change="getFileListByTypeIDAndTagIDAndIndexString">
        <!--二重循环，把各个Type循环出来-->
        <van-tab :title="type.typeName" class="index__artical__group__tabs__tab" :name="item.groupID+'/'+item.includeIndex+'/'+type.typeID+'/'+item.includeTag"
          v-for="type in typeList[item.groupID]" :key="type.typeID">
          <!--加载时显示骨架屏-->
          <van-skeleton title :row="3" :loading="type.isload" style="margin-top: 20px;">
            <div v-if="!type.isload">
              <!--若无合适的文件则显示空提示-->
              <van-empty description="本分类下没有文档" v-if="fileList[type.typeID].size==0">
                <template slot="image">
                  <img src="@/images/empty-picture/no_data.svg" />
                </template>
              </van-empty>
              <!--三重循环，把Type对应的文件列表循环出来-->
              <div v-for="fileInfo in fileList[type.typeID].list" :key="fileInfo.fileID" class="index__artical__group__fileBox">
                <v-fileBox :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
                  :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
                  :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
                  :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames" :uploadUsername="fileInfo.uploadUsername"></v-fileBox>
              </div>
            </div>
          </van-skeleton>
        </van-tab>
      </van-tabs>
    </div>
    <div class="index__bottom">
      <v-bottom-navigation shift color="primary" grow class="index__bottom__navigation" v-model="navigation">
        <v-btn link to="/index">
          <span>文库</span>
          <v-icon>mdi-text-box-search</v-icon>
        </v-btn>
        <v-btn link to="/wall">
          <span>互助</span>
          <v-icon>mdi-handshake</v-icon>
        </v-btn>
        <v-btn link to="/mine">
          <span>我的</span>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import fileBox from '@/components/fileBox';
import { enableIntranetSites } from '@/axios/axiosPlugin.js';

export default {
  components: {
    'v-fileBox': fileBox,
  },
  data() {
    return {
      page: 0,
      topItemList: [],
      mainItemList: [],
      typeList: {},
      fileList: {},
      navigation: 0,
    };
  },
  computed: {
    isIntranet() {
      if (localStorage.intranetURL) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    enableIntranetSites();
    if (this.$root.devicesFlag) {
      document.addEventListener('plusready', function () {
        plus.push.createMessage('欢迎使用Library开源文库');
      });
    }
    this.$Axios({
      method: 'get',
      url: '/docClassificationService/getIndexPageGroups',
      params: {},
    }).then((response) => {
      let groupList = response.data.msg;
      for (let index in groupList) {
        if (groupList[index].showLocation === 'top') {
          this.topItemList.push(groupList[index]);
        } else if (groupList[index].showLocation === 'main') {
          groupList[index].activeTag = 0;
          this.mainItemList.push(groupList[index]);
          this.getTypesByTypeString(groupList[index].includeIndex, groupList[index].includeType, groupList[index].includeTag, groupList[index].groupID);
        }
      }
    });
  },
  methods: {
    getTypesByTypeString(indexString, typeString, tagString, groupID) {
      this.$Axios({
        method: 'get',
        url: '/docClassificationService/getTypesByTypeString',
        params: {
          typeString: typeString,
        },
      }).then((response) => {
        let typeList = response.data.msg;
        for (let index in typeList) {
          typeList[index].isload = true;
        }
        Vue.set(this.typeList, groupID, typeList);
        this.getFileListByTypeIDAndTagIDAndIndexString(groupID + '/' + indexString + '/' + typeList[0].typeID + '/' + tagString);
      });
    },
    getFileListByTypeIDAndTagIDAndIndexString(location) {
      let groupID = location.split('/')[0];
      let indexString = location.split('/')[1];
      let typeID = location.split('/')[2];
      let tagString = location.split('/')[3];
      this.$Axios({
        method: 'get',
        url: '/docClassificationService/getGroupsFileList',
        params: {
          indexString: indexString,
          typeID: typeID,
          tagString: tagString,
          pageNum: 1,
          pageSize: 3,
        },
      }).then((response) => {
        let fileList = response.data.msg;
        Vue.set(this.fileList, typeID, fileList);
        for (let index in this.typeList[groupID]) {
          if (this.typeList[groupID][index].typeID == typeID) {
            Vue.set(this.typeList[groupID][index], 'isload', false);
          }
        }
      });
    },
    toIndexResult(name, indexString, typeString, tagString) {
      this.$router.push({
        path: '/indexResult',
        query: {
          name: name,
          indexString: indexString,
          typeString: typeString,
          tagString: tagString,
        },
      });
    },
    toSearch() {
      this.$router.push({
        path: '/search',
      });
    },
  },
};
</script>