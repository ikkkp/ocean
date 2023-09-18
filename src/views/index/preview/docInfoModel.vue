<style scoped lang="less">
@import '~@/vant-variables.less';
.fileinfo {
  margin: 20px;
  display: flex;
  flex-direction: column;
  &__detail {
    &__item {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      &__title {
        margin-right: 5px;
        width: 70px;
      }
    }
  }
  &__copyright {
    word-break: break-all;
    word-wrap: break-word;
    line-break: anywhere;
    &__report {
      margin: 10px 0 0 0;
    }
  }
}
</style>
<template>
  <van-popup v-model="infoModel" position="bottom" style="height: 540px" closeable>
    <div class="fileinfo">
      <img src="@/images/main-picture/logo.png" width="120" />

      <van-divider content-position="right">文档详情</van-divider>
      <div class="fileinfo__detail__item">
        <div class="fileinfo__detail__item__title">文档大小:</div>
        <div>{{this.fileInfo.size}} KB</div>
      </div>
      <div class="fileinfo__detail__item">
        <div class="fileinfo__detail__item__title">文档类型:</div>
        <div>{{this.fileInfo.fileType}}</div>
      </div>
      <div class="fileinfo__detail__item">
        <div class="fileinfo__detail__item__title">上传者:</div>
        <div>
          <v-username type="avater" :avatarSize="20" :username="fileInfo.uploadUsername"></v-username>
          <v-username type="username" :username="fileInfo.uploadUsername" v-if="fileInfo.fileExtraEntity.isOffical != 1"></v-username>
          <div v-else>官方用户</div>
        </div>
      </div>
      <div class="fileinfo__detail__item">
        <div class="fileinfo__detail__item__title">上传时间:</div>
        <div>{{this.fileInfo.uploadDate}}</div>
      </div>
      <div class="fileinfo__detail__item">
        <div class="fileinfo__detail__item__title">下载次数:</div>
        <div>{{this.fileInfo.fileExtraEntity.downloadNum}}</div>
      </div>
      <div class="fileinfo__detail__item">
        <div class="fileinfo__detail__item__title">是否原创:</div>
        <div>
          {{this.fileInfo.fileExtraEntity.isOriginal == 1? "原创": "转载(原作者:" + this.fileInfo.fileExtraEntity.originalAuthor + ")"}}
        </div>
      </div>
      <van-divider content-position="right">版权声明</van-divider>
      <div>
        <div class="fileinfo__copyright">本文档由用户<van-tag type="success" v-if="fileInfo.fileExtraEntity.isOfficial == 1">官</van-tag>
          <v-username type="username" :username="fileInfo.uploadUsername"></v-username>上传
          {{fileInfo.fileExtraEntity.isOriginal == 1? ",作者声明为原创文档。" : ",原创文档作者为" + fileInfo.fileExtraEntity.originalAuthor + "，"}}
          <span v-if="fileInfo.fileExtraEntity.copyrightNotice.indexOf('COPYRIGHT')==-1">
            本文遵循知识共享(CC)协议开源,使用本文需遵循开源协议
            <span style='color:#ed4014'>{{fileInfo.fileExtraEntity.copyrightNotice}}</span>
            所述的内容。
          </span>
          <span v-else>
            本文不是开源文档,使用或转载需经过作者本人授权。
          </span>
          <br />
          <br />
          本文档收益归属内容提供方。<a>点此查看我们的版权保护政策</a>,若发现您的版权权益受到侵害,请立即举报或联系客服,我们会第一时间为您处理并反馈结果。
        </div>
      </div>
      <v-btn tile color="error" class="fileinfo__copyright__report">
        <v-icon left>
          mdi-message-alert
        </v-icon>
        举报版权违规
      </v-btn>
    </div>
  </van-popup>
</template>

<script>
import Username from '@/components/common/username/username';

export default {
  name: 'docInfoModel',
  components: {
    'v-username': Username,
  },
  props: {
    fileInfo: Object,
  },
  data() {
    return {
      infoModel: false,
    };
  },
  mounted() {},
  methods: {
    open() {
      this.infoModel = true;
    },
  },
};
</script>