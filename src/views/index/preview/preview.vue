<style scoped lang="less">
@import '~@/vant-variables.less';
.preview {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: @gray-1;
  &__toolbar__icon {
    margin-right: 10px;
  }
  &__content {
    font-size: 14px;
    background-color: @white;
    padding: 15px;
    max-height: 160px;
    box-shadow: 1px 1px 5px @gray-5;
    &__title {
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-size: 20px;
    }
    &__tag {
      margin-right: 5px;
      padding: 2px 4px;
    }
    &__desc {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin: 10px 0px;
      line-height: initial;
    }
    &__detail-1 {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
    &__detail-2 {
      text-align: right;
      margin-top: 5px;
    }
  }
  &__folder {
    overflow: scroll;
    margin-top: 5px;
    &__filebox {
      padding: 10px 20px;
      background: @white;
      margin: 0px 0px 5px 0px !important;
    }
  }
  &__notice {
    margin: 5px 15px;
    font-size: 12px;
    color: @gray-4;
  }
  &__tooltip {
    position: -webkit-sticky;
    position: sticky;
    height: 50px;
    padding-left: 15px;
    padding-right: 5px;
    background: @gray-1;
    bottom: 0;
    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }
    &__button {
      &--func {
        height: 40px;
        min-width: 0px;
        margin-right: 5px;
        border: 0px;
        background-color: initial;
        color: @gray-5;
      }
    }
    &__icon {
      &--img {
        height: 20px;
        width: 20px;
      }
      &--text {
        margin-top: 2px;
        transform: scale(0.8);
      }
    }
  }
}
.more {
  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
<template>
  <div class="preview">
    <van-nav-bar ref="toolbar" id="toolbar" :title="isFolder?'专栏列表':'文件预览'" left-text="返回" left-arrow @click-left="back" fixed :placeholder="true" :z-index="1">
      <template #right>
        <van-icon name="search" size="18" class="preview__toolbar__icon" @click="toSearch" />
        <van-icon name="more-o" size="18" @click="$refs['moreModel'].open()" />
      </template>
    </van-nav-bar>
    <div ref="title" id="title" class="preview__content">
      <div class="preview__content__title">
        <van-tag class="preview__content__tag" type="warning" v-if="isFolder">
          <v-icon v-if="isFolder" color="white" size="20">mdi-folder-zip-outline</v-icon>专栏
        </van-tag>
        {{ fileInfo.title }}
        <van-tag class="preview__content__tag" type="primary" v-if="!baseInfoLoading && fileInfo.fileExtraEntity.isProCert == 1">专</van-tag>
        <van-tag class="preview__content__tag" type="success" v-if="!baseInfoLoading && fileInfo.fileExtraEntity.isOfficial == 1">官</van-tag>
      </div>
      <div class="preview__content__desc">
        {{ fileInfo.abstractContent }}
      </div>
      <div class="text-caption text--secondary preview__content__detail-1">
        <div>
          <span v-if="fileInfo.folderID != null">已被收入组 <a :href="'/preview?fileID='+fileInfo.folderID"><span>{{folderName}}</span></a></span>
          <span v-if="isFolder">(收录文档{{folderFileList.length}}篇)</span>
        </div>
        <div style="text-align: right" v-if="!baseInfoLoading">
          {{ fileInfo.fileExtraEntity.readNum }}人阅读 |
          {{ fileInfo.fileExtraEntity.likeNum }}人点赞
        </div>
      </div>
      <div class="preview__content__detail-2" v-if="!baseInfoLoading">
        <v-addScoreModel :ratersNum="fileInfo.fileExtraEntity.ratersNum" :score="fileInfo.fileExtraEntity.score"></v-addScoreModel>
      </div>
    </div>

    <iframe ref="contentDoc" width="100%" fullscreen="yes" :src="url" v-show="!isFolder" style="display: block;"></iframe>

    <div ref="contentFileList" v-show="isFolder" class="preview__folder">
      <!--若无合适的文件则显示空提示-->
      <van-empty description="专栏中尚未添加文档" v-if="folderFileList.length==0">
        <template slot="image">
          <img src="@/images/empty-picture/no_data.svg" />
        </template>
      </van-empty>
      <div v-for="fileInfo in folderFileList" :key="fileInfo.fileID">
        <v-fileBox :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
          :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
          :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
          :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames" class="preview__folder__filebox"></v-fileBox>
      </div>
    </div>

    <div class="preview__notice" v-if="!baseInfoLoading && !isFolder">上传于 {{this.fileInfo.uploadDate}} ·
      <span v-if="fileInfo.fileExtraEntity.copyrightNotice.indexOf('COPYRIGHT')==-1">遵循 {{this.fileInfo.fileExtraEntity.copyrightNotice}} 协议开源</span>
      <span v-else>未开源,使用或转载需经作者本人授权</span>
    </div>
    <div class="preview__notice" v-if="!baseInfoLoading && isFolder">建立于 {{this.fileInfo.uploadDate}} · 文档版权以收录文档声明为准
    </div>

    <v-adBox></v-adBox>

    <div style="margin-bottom:10px;">
      <v-commentList :bindID="String(this.$route.query.fileID)" mainType="DOCUMENT" :isIndex="true" @showAllComment="openComment" @needLoginNotice="needLoginNotice">
      </v-commentList>
    </div>

    <!--底部工具栏-->
    <div class="preview__tooltip">
      <div class="preview__tooltip__content">

        <!-- 文档评价按钮组件 -->
        <v-evaluateButton ref="evaluateButton" :fileInfo="fileInfo" @needLoginNotice="needLoginNotice">
        </v-evaluateButton>

        <!--底部操作按钮-->
        <div v-if="!baseInfoLoading">
          <!--底部操作按钮：收藏-->
          <van-button class="preview__tooltip__button--func" plain type="default" size="small" @click="$refs['addCollectionModel'].open()">
            <img v-if="isCollected" class="preview__tooltip__icon--img" src="@/images/function-icon/icon_collection_selected.svg" />
            <img v-else class="preview__tooltip__icon--img" src="@/images/function-icon/icon_collection.svg" />
            <div class="preview__tooltip__icon--text">{{ fileInfo.fileExtraEntity.collectionNum }}</div>
          </van-button>
          <!--底部操作按钮：下载-->
          <van-button class="preview__tooltip__button--func" plain type="default" size="small" @click="$refs['docDownloadModel'].open();" :disabled="isFolder">
            <img class="preview__tooltip__icon--img" src="@/images/function-icon/icon_download.svg" />
            <div class="preview__tooltip__icon--text" v-if="!isFolder">{{ fileInfo.fileExtraEntity.downloadNum }}</div>
            <div class="preview__tooltip__icon--text" v-else>不可用</div>
          </van-button>
          <!--底部操作按钮：评论-->
          <van-button class="preview__tooltip__button--func" plain type="default" size="small" @click="openComment">
            <img class="preview__tooltip__icon--img" src="@/images/function-icon/icon_comment.svg" />
            <div class="preview__tooltip__icon--text">{{ fileInfo.fileExtraEntity.commentNum }}</div>
          </van-button>
        </div>
      </div>
    </div>

    <!-- 文档下载窗口组件 -->
    <v-docDownloadModel ref="docDownloadModel" :fileInfo="fileInfo" @needLoginNotice="needLoginNotice">
    </v-docDownloadModel>
    <!-- 新增收藏窗口组件 -->
    <v-addCollectionModel ref="addCollectionModel" :fileInfo="fileInfo" @needLoginNotice="needLoginNotice">
    </v-addCollectionModel>
    <!-- 文档评论窗口组件 -->
    <v-docCommentModel ref="docCommentModel" :fileInfo="fileInfo" @needLoginNotice="needLoginNotice">
    </v-docCommentModel>

    <!-- 文档详情窗口组件 -->
    <v-docInfoModel ref="docInfoModel" :fileInfo="fileInfo"></v-docInfoModel>
    <!-- 免费打印提示框组件 -->
    <v-freePrintModel ref="freePrintModel"></v-freePrintModel>

    <!-- More更多窗口 -->
    <v-more ref="moreModel">
      <!-- <v-moreItem title="免费打印" icon="mdi-printer" @click="openFreePrint"></v-moreItem> -->
      <v-moreItem title="修改文档信息" icon="mdi-note-edit" @click="changeFileInfo()" v-if="isOwner"></v-moreItem>
      <v-moreItem title="删除文档" icon="mdi-file-cancel" v-if="isOwner"></v-moreItem>
      <v-moreItem title="文档详情" icon="mdi-book-information-variant" @click="openInfo"></v-moreItem>
      <v-moreItem title="举报文档" icon="mdi-bell-alert"></v-moreItem>
    </v-more>

    <!--通用对话框-->
    <my-dialog ref="dialog"></my-dialog>

    <!--文档加载中-->
    <v-dialog v-model="docLoading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          文档正在加载中
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import commentList from '@/components/comment/commentList';
import adBox from '@/components/adBox';
import dialog from '@/components/dialog/dialog.vue';

import addCollectionModel from './addCollectionModel.vue';
import addScoreModel from './addScoreModel.vue';
import docInfoModel from './docInfoModel.vue';
import docDownloadModel from './docDownloadModel.vue';
import docCommentModel from './docCommentModel.vue';
import evaluateButton from './evaluateButton.vue';
import freePrintModel from './freePrintModel.vue';

import userBehaviorStore from '@/components/common/userBehavior/userBehaviorStore.js';

import fileBox from '@/components/fileBox';
import moreItem from '@/components/more/moreItem';
import more from '@/components/more/more';

import Watermark from '@/utils/watermark';

import { pdfjsViewerURL, objectStorageServer } from '@/config.js';
export default {
  name: 'app',
  components: {
    'v-addCollectionModel': addCollectionModel,
    'v-addScoreModel': addScoreModel,
    'v-docCommentModel': docCommentModel,
    'v-docDownloadModel': docDownloadModel,
    'v-docInfoModel': docInfoModel,
    'v-evaluateButton': evaluateButton,
    'v-freePrintModel': freePrintModel,

    'v-commentList': commentList,
    'v-adBox': adBox,
    'my-dialog': dialog,
    'v-fileBox': fileBox,
    'v-more': more,
    'v-moreItem': moreItem,
  },
  data() {
    return {
      docLoading: true,
      baseInfoLoading: true,
      isFolder: false,
      folderFileList: [],
      fileInfo: {
        title: this.$route.query.title,
        abstractContent: this.$route.query.abstractContent,
        ratersNum: 1,
        score: 5,
        paymentMethod: 1,
        paymentAmount: null,
        fileExtraEntity: {
          copyrightNotice: '',
        },
      },
      folderName: null,
      url: null,
      isCollected: false,
    };
  },
  mounted() {
    this.$refs['contentDoc'].onload = () => {
      this.docLoading = false;
    };
    //文档窗口尺寸重新调整
    window.onresize = () => {
      this.changeContentSize();
    };
    //获取文档信息
    this.getFileInfoByFileID(this.$route.query.fileID);
    //获取用户行为
    this.getUserBehaviorByFileID(this.$route.query.fileID);
    //记录阅读行为
    if (localStorage.getItem('token') != null) {
      Watermark.set(sessionStorage.getItem('realname') + '(' + sessionStorage.getItem('studentID') + ')');
      this.doRead(this.$route.query.fileID);
    }
  },
  computed: {
    isOwner() {
      if (localStorage.getItem('token') != null) {
        return sessionStorage.getItem('username') == this.fileInfo.uploadUsername;
      }
      return false;
    },
  },
  methods: {
    changeContentSize() {
      let clientHeight = `${document.documentElement.clientHeight}`;
      let topHeight = this.$refs['toolbar'].height + this.$refs['title'].offsetHeight;
      if (this.isFolder) {
        this.$refs['contentFileList'].style.height = clientHeight - topHeight + 'px';
      } else {
        this.$refs['contentDoc'].style.height = clientHeight - topHeight + 'px';
      }
    },
    getFileInfoByFileID(fileID) {
      //判断用户是否匿名访问本页面
      let url = '/docInfoService/getFileInfoByFileID';
      if (localStorage.getItem('token') == null) {
        url = '/docInfoService/getFileInfoByFileIDWithAnon';
      }
      this.$Axios({
        method: 'get',
        url: url,
        params: {
          fileID: fileID,
        },
      })
        .then((response) => {
          this.fileInfo = response.data.msg;
          this.fileInfo.scoreAvg = this.fileInfo.fileExtraEntity.score / this.fileInfo.fileExtraEntity.ratersNum;
          this.baseInfoLoading = false;
          if (this.fileInfo.fileType != 'folder') {
            this.url = pdfjsViewerURL + objectStorageServer + this.fileInfo.previewPdfObjectName;
          } else {
            this.isFolder = true;
            this.getFolderFileList(fileID);
          }
          this.changeContentSize();
          if (this.fileInfo.folderID != null) {
            this.getFolderName(this.fileInfo.folderID);
          }
          if (this.fileInfo.isApproved == 0) {
            this.$refs['dialog'].newDialog('error', '预览模式', '本文档尚未通过审核，分享他人无效，请等待管理员处理', null, null).then(() => {});
          }
        })
        .catch((response) => {
          if (response.data.code == -2) {
            this.$refs['dialog'].newDialog('error', '禁止匿名访问', '因可能的版权问题，本文档发布者要求访问者必须登录。', null, null).then(() => {
              this.$router.push('/index');
            });
          } else if (response.data.code == -3) {
            this.$refs['dialog'].newDialog('error', '禁止访问', '本文档尚未通过审核或已封禁，请等待管理员处理', null, null).then(() => {
              this.$router.push('/index');
            });
          }
        });
    },
    getFolderFileList(folderID) {
      this.$Axios({
        method: 'get',
        url: '/docInfoService/getFileListByFolderID',
        params: {
          folderID: folderID,
        },
      }).then((response) => {
        this.folderFileList = response.data.msg;
        this.docLoading = false;
      });
    },
    getFolderName(fileID) {
      this.$Axios({
        method: 'get',
        url: '/docInfoService/getFileInfoByFileID',
        params: {
          fileID: fileID,
        },
      }).then((response) => {
        this.folderName = response.data.msg.title;
      });
    },
    getUserBehaviorByFileID(fileID) {
      userBehaviorStore.getUserBehaviorList('DOCUMENT', fileID, this, true).then((userBehaviorList) => {
        this.$refs['evaluateButton'].initEvaluateStatus(userBehaviorList);
        userBehaviorList.map((value) => {
          if (value.behaviorType == 'DO_COLLECTION') {
            this.isCollected = true;
          }
        });
      });
    },
    doRead(fileID) {
      this.$Axios({
        method: 'get',
        url: '/docFunctionService/read',
        params: {
          fileID: fileID,
        },
      })
        .then(() => {})
        .catch(() => {});
    },
    back() {
      this.$router.go(-1); //返回上一层
    },
    toSearch() {
      this.$router.push({
        path: '/search',
      });
    },
    openInfo() {
      this.$refs['moreModel'].close();
      this.$refs['docInfoModel'].open();
    },
    openFreePrint() {
      this.$refs['moreModel'].close();
      this.$refs['freePrintModel'].open();
    },
    openComment() {
      let viewareaHeight = document.documentElement.clientHeight - document.getElementById('toolbar').offsetHeight + 'px';
      this.$refs['docCommentModel'].open(viewareaHeight);
    },
    changeFileInfo() {
      this.$router.push({
        path: '/uploadInfo',
        query: {
          fileID: this.$route.query.fileID,
        },
      });
    },

    needLoginNotice() {
      this.$refs['dialog'].newDialog('login', '请登录', '目前您处于访客模式，该操作需要您登录后方可继续', '立刻登录', '稍后再说').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style>
</style>