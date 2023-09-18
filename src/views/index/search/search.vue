<style scoped lang="less">
@import '~@/vant-variables.less';
.search {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: #fafafa;
  height: 100%;
  &__input {
    height: 50px !important;
  }
  &__history {
    margin: 0px 20px 0px 20px;
  }
  &__suggest {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 15px 20px 0px 20px;
    &__icon {
      font-size: 20px;
    }
    &__content {
      flex: 1;
      margin-left: 10px;
    }
    &__searchnow {
      align-items: center;
      margin: 15px 20px 0px 20px;
    }
  }
  &__result {
    &__box {
      background: #fff;
      padding: 15px 20px;
      margin-top: 5px;
    }
  }
}
</style>
<style lang="less" scoped>
/deep/ .v-toolbar__content {
  padding: 0px 20px;
}
</style>
<template>
  <div class="search">
    <van-nav-bar id="toolbar" title="搜索" left-text="返回" left-arrow @click-left="back" fixed placeholder>
    </van-nav-bar>

    <van-sticky :offset-top="0">
      <v-toolbar class="search__input" color="#fff">
        <v-text-field v-model="keywords" prepend-inner-icon="mdi-file-search" placeholder="搜索你想查找的资料名称" clearable @keydown="keydownListen" @input="suggest"
          @click:clear="restartSearch" hide-details="auto"></v-text-field>
      </v-toolbar>
    </van-sticky>

    <!--当用户没有聚焦在搜索框、搜索框内没有输入任何字符时，不显示搜索建议-->
    <!--用户搜索输入产生建议时，立刻唤起搜索建议-->
    <div v-if="showSuggest">
      <div class="search__suggest" v-for="(item,index) in suggestList" v-bind:key="index" @click="searchKeywords(item)">
        <v-icon class="search__suggest__icon">mdi-magnify</v-icon>
        <div class="search__suggest__content">{{item}}</div>
        <v-icon class="search__suggest__icon">mdi-arrow-top-right</v-icon>
      </div>
      <div class="search__suggest">
        <v-icon class="search__suggest__icon" color="primary">mdi-cloud-search</v-icon>
        <a class="search__suggest__content" @click="search(false)">搜索「{{keywords}}」</a>
      </div>
    </div>

    <van-list class="search__result" v-model="loading" :finished="finished" :immediate-check="true" @load="search(true)" v-if="showResult && !showSuggest">
      <v-skeleton-loader type="article,article,article,article,article" v-if="initLoading"></v-skeleton-loader>
      <div class="search__result__box" v-for="fileInfo in fileList" :key="fileInfo.fileID">
        <v-fileBox :fileID="fileInfo.fileID" :searchResultContent="fileInfo.content" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title"
          :fileType="fileInfo.fileType" :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.readNum" :score="fileInfo.score"
          :ratersNum="fileInfo.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount" :isVipIncome="fileInfo.isVipIncome"></v-fileBox>
      </div>
      <template #finished>
        <!--若无合适的文件则显示空提示-->
        <van-empty :description="'抱歉没有找到与「'+keywords+'」相关的文档'" v-if="fileList.length==0">
          <template #image>
            <img src="@/images/empty-picture/no_search.svg" />
          </template>
          <template>
            <v-btn color="primary" small>
              去帮帮墙发求助帖
              <v-icon right dark>
                mdi-wall
              </v-icon>
            </v-btn>
          </template>
        </van-empty>
        <div v-else>
          <div class="notice-nomore__text">没有更多的结果了</div>
          <v-btn color="primary" small>
            去帮帮墙发求助帖
            <v-icon right dark>
              mdi-wall
            </v-icon>
          </v-btn>
        </div>
      </template>
    </van-list>
    <div v-show="!showSuggest && !showResult && (keywords=='' || keywords==null)">
      <v-searchHistory class="search__history" ref="searchHistory" @onHistoryTagClick="searchKeywords">
      </v-searchHistory>
      <van-empty description="输入关键字开始检索">
        <template slot="image">
          <img src="@/images/empty-picture/no_search.svg" />
        </template>
      </van-empty>
    </div>
  </div>
</template>

<script>
import fileBox from '@/components/fileBox';
import searchHistory from './searchHistory';

export default {
  name: 'search',
  components: {
    'v-fileBox': fileBox,
    'v-searchHistory': searchHistory,
  },
  data() {
    return {
      keywords: '',
      startNum: 1,
      fileList: [],
      suggestList: [],
      showSuggest: false,
      showResult: false,
      initLoading: true,
      loading: false,
      finished: false,
    };
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    restartSearch() {
      this.startNum = 1;
      this.fileList = [];
      this.suggestList = [];
      this.showSuggest = false;
      this.showResult = false;
      this.initLoading = true;
      this.loading = true;
      this.finished = false;
    },
    keydownListen(keyboardEvent) {
      if (keyboardEvent.key == 'Enter') {
        this.search(false);
      }
    },
    suggest(item) {
      if (item == null || item == '') {
        this.restartSearch();
        return;
      }
      this.showSuggest = true;
      this.$Axios({
        method: 'get',
        url: '/docSearchService/suggest',
        params: {
          keyword: item,
          rows: 10,
        },
      }).then((response) => {
        this.suggestList = response.data.msg;
      });
    },
    searchKeywords(searchString) {
      this.keywords = searchString;
      this.search(false);
    },
    search(isContinueLoading) {
      this.showSuggest = false;
      this.$refs['searchHistory'].addHistory(this.keywords);

      this.loading = true;
      if (!isContinueLoading) {
        this.restartSearch();
      }
      this.showResult = true;
      this.$Axios({
        method: 'get',
        url: '/docSearchService/search',
        params: {
          keywords: this.keywords,
          page: this.startNum,
          rows: 10,
        },
      }).then((response) => {
        let searchHits = response.data.msg.searchHits;
        let fileListTemp = searchHits.map((data) => {
          if (data.highlightFields != null) {
            if (data.highlightFields.abstractContent != null && data.highlightFields.abstractContent.length > 0) {
              data.content.abstractContent = data.highlightFields.abstractContent[0];
            }
            if (data.highlightFields.title != null && data.highlightFields.title.length > 0) {
              data.content.title = data.highlightFields.title[0];
            }
            if (data.highlightFields.content != null && data.highlightFields.content.length > 0) {
              data.content.content = data.highlightFields.content[0];
            }
          }
          return data.content;
        });

        this.fileList.push.apply(this.fileList, fileListTemp);
        this.startNum += 1;
        if (response.data.msg.totalHits < 10) {
          this.finished = true;
        }
        this.loading = false;
        this.initLoading = false;
      });
    },
    toPreview(fileID, abstractContent, title, isOpenDownload = false) {
      this.$router.push({
        path: '/preview',
        query: {
          fileID: fileID,
          abstractContent: abstractContent,
          title: title,
          isOpenDownload: isOpenDownload,
        },
      });
    },
  },
};
</script>

<style scoped>
</style>