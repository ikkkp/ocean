<style scoped lang="less">
@import '~@/vant-variables.less';
.one_line {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  &__type {
    position: absolute;
    bottom: -10px;
    right: -6px;
    &--folder {
      position: absolute;
      bottom: -11px;
      right: -5px;
    }
    &__img {
      width: 36px;
      height: 36px;
    }
  }
  &__vip-flag {
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    &__img {
      width: 25px;
      height: 25px;
      margin-bottom: -4px;
      margin-right: 2px;
    }
  }
  &__preview {
    position: relative;
    width: 30%;
    flex-shrink: 0;
    align-items: center;
    display: flex;
    &__img {
      width: 100%;
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    }
  }
  &__detail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 10px;
    width: 70%;
  }
  &__content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-bottom: 5px;
    line-height: 18px;
    &--search {
      font-size: 12px;
      color: @gray-4;
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  }
  &__user {
    font-size: 12px;
    color: @gray-6;
    margin-bottom: 5px;
  }
  &__tag {
    &--file-tag {
      padding: 2px 4px;
      margin-right: 2px;
      margin-bottom: 4px;
    }
    &--pay {
      padding: 1px 4px;
      margin-left: 2px;
      //display: inline;
      line-height: unset;
    }
    &--vip {
      padding: 1px 4px;
      margin-left: 2px;
      display: inline;
    }
  }
}
/deep/ .highlight {
  color: @orange;
}
</style>
<template>
  <div class="file-card" @click="toPreview()">
    <div class="file-card__preview">
      <img v-if="previewPictureObjectName!=null" class="file-card__preview__img" :src="previewPictureUrl" />
      <img v-else class="file-card__preview__img" src="@/images/main-picture/no_preview.png" />
      <div class="file-card__vip-flag" v-if="isVipIncome==1">
        <van-tag class="file-card__tag--vip" round> <img class="file-card__vip-flag__img" src="../images/main-icon/icon_VIP.svg" />优享</van-tag>
      </div>
      <div class="file-card__type">
        <img class="file-card__type__img" src="../images/type-icon/word-48.png" v-if="fileType=='doc'||fileType=='docx'" />
        <img class="file-card__type__img" src="../images/type-icon/xls-48.png" v-if="fileType=='xls'||fileType=='xlsx'" />
        <img class="file-card__type__img" src="../images/type-icon/ppt-48.png" v-if="fileType=='ppt'||fileType=='pptx'" />
        <img class="file-card__type__img" src="../images/type-icon/pdf-48.png" v-if="fileType=='pdf'" />

      </div>
      <div class="file-card__type--folder">
        <img class="file-card__type__img" src="../images/type-icon/folder-48.png" v-if="fileType=='folder'" />
      </div>
    </div>
    <div class="file-card__detail">
      <div>
        <div v-if="uploadUsername!=null" class="file-card__user">
          <v-username type="avater" :avatarSize="20" :username="uploadUsername"></v-username>
          <v-username type="username" :username="uploadUsername"></v-username>
        </div>
        <div class="text-body-2 file-card__content"><span v-html="title"></span><span v-if="fileType=='folder'">
            <van-tag class="file-card__tag--pay" round type="primary">
              专栏
            </van-tag>
          </span></div>
        <div class="text-caption text--secondary file-card__content"><span v-html="abstractContent"></span></div>
        <div class="file-card__content--search" v-if="searchResultContent!=null">...<span v-html="searchResultContent"></span></div>
      </div>
      <div>
        <van-tag class="file-card__tag--file-tag" plain type="primary" v-for="fileTag in fileTagList" :key="fileTag">{{fileTag}}
        </van-tag>
        <div class="text-caption text--secondary">{{readNum}}阅读 · {{ parseFloat( this.score / this.ratersNum ).toFixed(1) }}分
          <span v-if="fileType=='folder'">
            <van-tag class="file-card__tag--pay" plain round type="warning">
              合并计价
            </van-tag>
          </span>
          <span v-else>
            <van-tag class="file-card__tag--pay" plain round type="warning" v-if="paymentMethod!='1'">
              {{paymentAmount}}<img src="../images/main-icon/coin.svg" width="16" v-if="paymentMethod=='2'" /><img src="../images/main-icon/coupon.svg" width="16" v-else />
            </van-tag>
            <van-tag class="file-card__tag--pay" plain round type="success" v-else>
              免费
            </van-tag>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Username from '@/components/common/username/username';
import { objectStorageServer } from '@/config.js';

export default {
  name: 'fileBox',
  components: {
    'v-username': Username,
  },
  computed: {
    previewPictureUrl() {
      return objectStorageServer + this.previewPictureObjectName;
    },
  },
  props: {
    searchResultContent: String,
    abstractContent: String,
    title: String,
    fileType: String,
    previewPictureObjectName: String,
    fileTagList: {
      type: Array,
      default: function () {
        return new Array();
      },
    },
    readNum: [Number, String],
    score: [Number, String],
    ratersNum: [Number, String],
    paymentMethod: [Number, String],
    paymentAmount: [Number, String],
    isVipIncome: [Number, String],
    fileID: [Number, String],
    uploadUsername: [String],
  },
  methods: {
    toPreview(isOpenDownload = false) {
      this.$router.push({
        path: '/preview',
        query: {
          fileID: this.fileID,
          abstractContent: this.abstractContent,
          title: this.title,
          isOpenDownload: isOpenDownload,
        },
      });
    },
  },
};
</script>