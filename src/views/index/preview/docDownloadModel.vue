<style scoped lang="less">
@import '~@/vant-variables.less';
.download {
  height: 320px;
  &__title {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    margin: 20px 20px 10px 20px;
    font-size: 18px;
  }
  &__content {
    margin: 10px 20px 20px 20px;
    &__payment {
      font-size: 14px;
      color: @gray-6;
      margin: 10px 0px;
    }
  }
}
</style>
<style scoped>
.van-rate__icon--full {
  color: #ffd21e;
}
</style>
<template>
  <van-popup class="download" v-model="downloadConfirmModel" closeable position="bottom" round>
    <div class="download__title">
      {{ this.fileInfo.title }}
      ({{ (this.fileInfo.size / (1024 * 1024)).toFixed(2) }} MB)
    </div>
    <div class="download__content">
      <div>
        <v-addScoreModel :ratersNum="fileInfo.fileExtraEntity.ratersNum" :score="fileInfo.fileExtraEntity.score"></v-addScoreModel>
      </div>
      <div class="download__content__payment" v-if="this.fileInfo.paymentMethod == 1">
        价值 • <span style="color:green">免费</span>（给作者点个赞支持一下吧）
      </div>
      <div class="download__content__payment" v-else>
        价值 • {{this.fileInfo.paymentAmount}}{{ this.fileInfo.paymentMethod == 2 ? "金币" : "下载券" }}
        <span v-if="this.fileInfo.isAllowVipfree==1">
          • <img class="mine__userinfo__nickname__icon" src="@/images/main-icon/icon_VIP.svg" width="20" /> VIP免费下</span>
      </div>
      <v-alert dense type="info">
        该文档格式为
        <strong>{{this.fileInfo.fileType}}</strong>
      </v-alert>
      <v-alert border="left" colored-border type="info" elevation="2">
        <div class="text-body-2">文档贡献者将完全取得您的积分或下载券，下载券可无门槛折换现金。文档重复下载不收费，余额不足将下载失败!</div>
      </v-alert>
      <van-goods-action>
        <van-goods-action-button v-if="isVip && this.fileInfo.isAllowVipfree==1" type="warning" text="VIP 免费下载" @click="doDownload" />
        <van-goods-action-button v-if="!isVip && this.fileInfo.isAllowVipfree==1" type="warning" text="申请VIP 文档免费下" @click="$router.push('/vip')" />
        <van-goods-action-button v-if="this.fileInfo.paymentMethod == 1" type="info" text="免费下载" @click="doDownload" />
        <van-goods-action-button v-if="this.fileInfo.paymentMethod != 1 && (this.fileInfo.isAllowVipfree!=1 || !isVip)" type="info"
          :text="'付'+this.fileInfo.paymentAmount+(this.fileInfo.paymentMethod == 2 ? '金币' : '下载券')+'下载'" @click="doDownload" />
      </van-goods-action>
    </div>
    <my-dialog ref="dialog"></my-dialog>
  </van-popup>
</template>

<script>
import dialog from '@/components/dialog/dialog.vue';
import addScoreModel from './addScoreModel.vue';
import { Toast } from 'vant';
export default {
  name: 'docDownloadModel',
  props: {
    fileInfo: Object,
  },
  components: {
    'my-dialog': dialog,
    'v-addScoreModel': addScoreModel,
  },
  data() {
    return {
      downloadConfirmModel: false,
      isVip: false,
    };
  },
  mounted() {
    if (localStorage.getItem('token') != null) {
      this.isVip = sessionStorage.getItem('isVip') == '1';
    }
  },
  methods: {
    //下载-下载确认
    open() {
      this.downloadConfirmModel = true;
    },
    //下载-执行下载
    doDownload() {
      if (localStorage.getItem('token') == null) {
        this.$emit('needLoginNotice');
        return;
      }
      this.$Axios({
        method: 'get',
        url: '/docFileService/getDownloadFileToken',
        params: {
          fileID: this.fileInfo.fileID,
        },
      })
        .then((response) => {
          this.downloadConfirmModel = false;
          Toast.loading({
            message: '正在准备下载',
            forbidClick: true,
          });
          window.location.href = this.$root.businessServer + '/docFileService/downloadFile?token=' + response.data.msg;
        })
        .catch((response) => {
          this.downloadConfirmModel = false;
          if (response.data.code == '-2') {
            this.$refs['dialog'].newDialog('error', '余额不足', '您的账号余额不足以完成本次下载', '立刻获取', '稍后再说').then(() => {
              this.$router.push('/index');
            });
          }
        });
    },
  },
};
</script>

<style>
</style>