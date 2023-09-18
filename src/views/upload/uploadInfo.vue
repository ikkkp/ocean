<style lang="less" scoped>
@import '~@/vant-variables.less';
.upload {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: @gray-1;
  overflow-x: hidden;
  &--box {
    background-color: white;
    padding: 20px;
    padding-bottom: 5px;
  }
  &--list {
    background-color: white;
  }
  &__title {
    font-size: 20px;
  }
  &__baseinfo {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    &__filetype {
      margin-right: 10px;
    }
  }
  &__button {
    width: 100%;
    margin-top: 10px;
  }
  &__preview {
    min-width: 320px;
    height: 100%;
    width: 90%;
    &--bottom {
      display: flex;
      justify-content: right;
      align-items: center;
      padding: 15px;
      height: 60px;
    }
  }
}
</style>
<template>
  <div class="upload">
    <van-nav-bar id="toolbar" title="文档信息编辑" left-text="返回" left-arrow @click-left="back">
      <template #right>
        <div v-if="uploadID!=null">
          <van-loading color="var(--v-primary-base)" v-if="previewLoading" size="24" />
          <a v-else @click="previewDrawerShow = true">文档预览</a>
        </div>
      </template>
    </van-nav-bar>
    <div class="upload--box">
      <p class="upload__title">{{uploadID!=null?'完善上传文档信息':'修改文档信息'}}</p>
      <div class="upload__baseinfo">
        <div class="upload__baseinfo__filetype">
          <img src="../../images/type-icon/doc.svg" width="36" height="36" v-if="fileInfo.fileType=='doc'||fileInfo.fileType=='docx'" />
          <img src="../../images/type-icon/xls.svg" width="36" height="36" v-if="fileInfo.fileType=='xls'||fileInfo.fileType=='xlsx'" />
          <img src="../../images/type-icon/ppt.svg" width="36" height="36" v-if="fileInfo.fileType=='ppt'||fileInfo.fileType=='pptx'" />
          <img src="../../images/type-icon/pdf.svg" width="36" height="36" v-if="fileInfo.fileType=='pdf'" />
        </div>
        <v-text-field v-model="fileInfo.title" placeholder="请输入文档标题" :rules="[titleRule.required]" outlined dense hide-details="auto">
        </v-text-field>
      </div>
      <van-divider></van-divider>
      <v-textarea v-model="fileInfo.abstractContent" placeholder="简要介绍文档内容等" outlined dense hide-details="auto" hint="准确的文档内容简介更容易被他人检索"></v-textarea>
    </div>
    <div class="upload--list">
      <van-field readonly clickable :value="folderName" label="专栏组" placeholder="点击加入一个专栏" @click="showFolderList" />
      <van-popup v-model="showFolderPicker" position="bottom">
        <van-picker show-toolbar :columns="folderNameList" @confirm="onFolderConfirm" @cancel="showFolderPicker = false" />
      </van-popup>

      <van-field readonly clickable :value="tagName" label="模块分类" placeholder="点击加入一个模块" @click="showTagList" />
      <van-popup v-model="showTagPicker" position="bottom">
        <van-picker show-toolbar :columns="tagNameList" @confirm="onTagConfirm" @cancel="showTagPicker = false" />
      </van-popup>

      <van-field label="原创">
        <template #input>
          <van-switch v-model="fileInfo.fileExtraEntity.isOriginal" size="20" :active-value="1" :inactive-value="0" />
        </template>
      </van-field>

      <van-field readonly clickable :value="paymentDesc" label="文档收益" placeholder="点击选择收益类型" @click="$refs['paymentMethodModel'].open()" />
      <v-paymentMethodModel ref="paymentMethodModel" @onSelect="setFilePayment" :fileInfo="fileInfo">
      </v-paymentMethodModel>

      <van-field label="原创作者" v-if="!fileInfo.fileExtraEntity.isOriginal" v-model="fileInfo.fileExtraEntity.originalAuthor" placeholder="请输入原创作者姓名/昵称/来源" />

      <van-field label="开源声明" v-if="fileInfo.fileExtraEntity.isOriginal" v-model="copyrightNoticeDesc" placeholder="点击选择一个文档开源CC协议" @click="$refs['chooseCCProtocalModel'].open()"
        readonly />
      <v-chooseCCProtocalModel ref="chooseCCProtocalModel" @onSelect="(data)=> fileInfo.fileExtraEntity.copyrightNotice = data " :value="fileInfo.fileExtraEntity.copyrightNotice">
      </v-chooseCCProtocalModel>

      <van-field label="开启评论区">
        <template #input>
          <van-switch v-model="fileInfo.isAllowComment" size="20" :active-value="1" :inactive-value="0" />
        </template>
      </van-field>

      <van-field v-if="fileInfo.fileExtraEntity.isOriginal">
        <template #input>
          <van-checkbox v-model="isOriginalConfirm" shape="square">
            我郑重确认所提交的文档系本人独立创作，内容不涉及他人权利，本人依法享有和承担由此作品而产生的权利和全部法律责任。
            <span style="color:var(--v-error-base)">转载禁止声明原创，平台一经发现确认将零容忍封禁账号。</span>
          </van-checkbox>
        </template>
      </van-field>

      <van-field v-if="!fileInfo.fileExtraEntity.isOriginal">
        <template #input>
          <van-checkbox v-model="isNonOriginalConfirm" shape="square">
            我郑重确认所提交的文档已被授权转载，且已标明文档来源和作者信息。本人依法承担由转载此文档而产生的全部法律责任。
          </van-checkbox>
        </template>
      </van-field>

      <van-button class="upload__button" :loading="saveLoading" type="info" loading-text="正在保存" @click="submitDocumentInfo">保存
      </van-button>
    </div>

    <van-popup v-model="previewDrawerShow" position="right" class="upload__preview" @opened="changePreviewSize">
      <van-nav-bar ref="previewToolbar" title="文件预览" left-text="返回" left-arrow @click-left="previewDrawerShow = false" fixed :placeholder="true">
      </van-nav-bar>
      <iframe ref="previewContent" fullscreen="yes" :src="url" style="width: 100%;display: block;"></iframe>

      <div ref="previewBottom" class="upload__preview--bottom">
        <v-btn color="error" small>
          <v-icon>mdi-face-agent</v-icon>反馈文件预览异常
        </v-btn>
      </div>
    </van-popup>
  </div>
</template>

<script>
import chooseCCProtocalModel from '@/views/upload/chooseCCProtocalModel.vue';
import paymentMethodModel from '@/views/upload/paymentMethodModel.vue';
import { pdfjsViewerURL, objectStorageServer } from '@/config.js';

export default {
  name: 'app',
  components: {
    'v-chooseCCProtocalModel': chooseCCProtocalModel,
    'v-paymentMethodModel': paymentMethodModel,
  },
  computed: {
    copyrightNoticeDesc() {
      let copyrightNotice = this.fileInfo.fileExtraEntity.copyrightNotice;
      if (copyrightNotice.indexOf('COPYRIGHT') != -1) {
        return '版权归属作者所有';
      } else {
        return '遵循CC-' + copyrightNotice + '协议开源';
      }
    },
    paymentDesc() {
      let desc = '';
      if (this.fileInfo.paymentMethod == 1) {
        desc = '无偿贡献';
      } else {
        desc = '下载需' + this.fileInfo.paymentAmount + (this.fileInfo.paymentMethod == 2 ? '金币' : '下载券');
      }
      if (this.fileInfo.isAllowVipfree) {
        desc = desc + ' (优享免费) ';
      }
      return desc;
    },
  },
  data() {
    return {
      titleRule: {
        required: (value) => value == null || (value != null && value != '') || '收藏夹名称不可为空',
      },
      uploadID: this.$route.query.uploadID,
      fileID: this.$route.query.fileID,

      fileInfo: {
        title: '未命名',
        abstractContent: '',
        fileType: '',

        paymentMethod: 1,
        paymentAmount: 1,
        isAllowAnon: 1,
        isAllowVipfree: 1,
        isAllowComment: 1,

        fileExtraEntity: {
          copyrightNotice: 'BY-NC',
          isOriginal: 1,
          isProCert: 0,
          originalAuthor: '',
        },
      },
      isOriginalConfirm: false,
      isNonOriginalConfirm: false,

      showFolderPicker: false,
      folderName: null,
      folderNameList: [],
      folderList: [],
      folderID: null,
      typeID:null,

      showTagPicker: false,
      tagName: null,
      tagNameList: [],
      tagList: [],
      tagID: null,

      previewDrawerShow: false,
      previewLoading: true,
      url: null,

      saveLoading: false,
    };
  },
  mounted() {
    if (this.$route.query.uploadID != null) {
      this.$Axios({
        method: 'get',
        url: '/docFileService/getUploadFileTempInfo',
        params: {
          uploadID: this.$route.query.uploadID,
        },
      }).then((response) => {
        if (response.data.code == 1) {
          this.fileInfo.title = response.data.msg.title;
          this.fileInfo.fileType = response.data.msg.fileSuffix.replace('.', '');
          this.fileInfo.size = response.data.msg.size;
          this.getPreview();
        }
      });
    } else {
      this.$Axios({
        method: 'get',
        url: '/docInfoService/getFileInfoByFileID',
        params: {
          fileID: this.$route.query.fileID,
        },
      }).then((response) => {
        if (response.data.code == 1) {
          this.fileInfo = response.data.msg;
        }
      });
    }
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    setFilePayment(data) {
      this.fileInfo.isAllowAnon = data.isAllowAnon;
      this.fileInfo.isAllowVipfree = data.isAllowVipfree;
      this.fileInfo.paymentMethod = data.paymentMethod;
      this.fileInfo.paymentAmount = data.paymentAmount;
    },

    getPreview() {
      this.$Axios({
        method: 'get',
        url: '/docFileService/doTempFilePreview',
        params: {
          uploadID: this.uploadID,
        },
        timeout:-1,
      }).then((response) => {
        if (response.data.code != -1) {
          this.url = pdfjsViewerURL + objectStorageServer + response.data.msg;
          this.previewLoading = false;
        }
      });
    },

    changePreviewSize() {
      let clientHeight = `${document.documentElement.clientHeight}`;
      let topAndBottomHeight = this.$refs['previewToolbar'].height + this.$refs['previewBottom'].offsetHeight;
      this.$refs['previewContent'].style.height = clientHeight - topAndBottomHeight + 'px';
    },

    showFolderList() {
      this.getMyFolderList();
      this.showFolderPicker = true;
    },
    showTagList() {
      this.getMyTagList();
      this.showTagPicker = true;
    },
    onFolderConfirm(value, index) {
      this.typeID = this.folderList[index].typeID;
      this.folderName = value;
      this.showFolderPicker = false;
    },
    onTagConfirm(value, index) {
      this.tagID = this.tagList[index].tagID;
      this.tagName = value;
      this.showTagPicker = false;
    },
    getMyFolderList(fileID) {
      this.$Axios({
        method: 'get',
        url: '/docClassificationService/getMyFolderList',
      }).then((response) => {
        this.folderList = response.data.msg;
        this.folderNameList = [];
        for (let index in this.folderList) {
          this.folderNameList.push(this.folderList[index].typeName);
        }
        // this.folderNameList.push("<p style='color: #2d8cf0'>新建专栏</p>");
      });
    },
    getMyTagList(TagID) {
      this.$Axios({
        method: 'get',
        url: '/docClassificationService/getMyTagList',
      }).then((response) => {
        this.tagList = response.data.msg;
        this.tagNameList = [];
        for (let index in this.tagList) {
          this.tagNameList.push(this.tagList[index].tagName);
        }
      });
    },
    submitDocumentInfo() {
      this.saveLoading = true;
      let params = new URLSearchParams();
      let url;
      if (this.uploadID != null) {
        url = '/docFileService/submitDocumentInfo';
        params.append('uploadID', this.uploadID);
      } else {
        url = '/docFileService/changeDocumentInfo';
        params.append('fileID', this.fileID);
      }
      params.append('title', this.fileInfo.title);
      params.append('abstractContent', this.fileInfo.abstractContent);
      params.append('folderName',this.folderName);
      params.append('paymentMethod', this.fileInfo.paymentMethod);
      params.append('paymentAmount', this.fileInfo.paymentAmount);
      params.append('isAllowAnon', this.fileInfo.isAllowAnon);
      params.append('isAllowVipfree', this.fileInfo.isAllowVipfree);
      params.append('isAllowComment', this.fileInfo.isAllowComment);
      params.append('copyrightNotice', this.fileInfo.fileExtraEntity.copyrightNotice);
      params.append('isOriginal', this.fileInfo.fileExtraEntity.isOriginal);
      params.append('originalAuthor', this.fileInfo.fileExtraEntity.originalAuthor);

      if (this.typeID != null) {
        params.append('typeID', this.typeID);
      }

      if (this.tagID != null) {
        params.append('tagID', this.tagID);
      }

      this.$Axios({
        method: 'post',
        url: url,
        data: params,
      })
        .then((response) => {
          this.$router.push({
            path: '/result',
            query: {
              state: response.data.state,
              code: response.data.code,
              msg: response.data.msg,
            },
          });
        })
        .catch((response) => {
          this.$router.push({
            path: '/result',
            query: {
              state: response.data.state,
              code: response.data.code,
              msg: response.data.msg,
            },
          });
        });
    },
  },
};
</script>

<style>
</style>