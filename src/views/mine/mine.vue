<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>
<style lang="less" scoped>
@import '~@/vant-variables.less';
.mine {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: @gray-1;
  &__userinfo-box {
    margin-bottom: 10px;
    &__tools {
      position: absolute;
      top: 0px;
      right: 0px;
      padding: 10px;
      &__icon {
        margin-left: 10px;
        padding: 0px !important;
        min-width: unset !important;
      }
    }
    &__avatar-box {
      position: absolute;
      top: 140px;
      left: 20px;
    }
    &__avatar {
      border: 2px solid white !important;
      font-size: 36px;
    }
  }
  &__userinfo {
    margin-top: 150px;
    background-color: white;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 20px;
    &__detail {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      &__box {
        min-width: 45px;
      }
      &--title {
        font-size: 12px;
        color: #bbb;
      }
      &--number {
        font-size: 14px;
      }
    }
    &__nickname {
      font-size: 18px;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &__icon {
        margin-left: 5px;
      }
    }
    &__personalsign {
      font-size: 12px;
      margin-top: 5px;
      color: #bbb;
    }
  }
}
</style>
<template>
  <div class="mine">
    <div class="mine__userinfo-box" :style="newBackground">

      <div class="mine__userinfo-box__tools">
        <v-btn link to="/notify" class="mine__userinfo-box__tools__icon" text>
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
        <v-btn link to="/notify" class="mine__userinfo-box__tools__icon" text>
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>
      </div>

      <v-badge class="mine__userinfo-box__avatar-box" offset-x="20" offset-y="80" bordered color="warning" overlap>
        <template v-slot:badge>
          <div>{{userInfo.level}}</div>
        </template>
        <v-avatar color="primary" size="80" class="mine__userinfo-box__avatar">
          <v-img :src="userInfo.avatar" alt="Avatar" v-if="userInfo.avatar != null && userInfo.avatar != ''" />
          <span class="white--text" v-else>{{userInfo.nickname.substring(0, 1)}}</span>
        </v-avatar>
      </v-badge>

      <div class="mine__userinfo">
        <div class="mine__userinfo__detail">
          <div class="mine__userinfo__detail__box">
            <div class="mine__userinfo__detail--title">积分</div>
            <div class="mine__userinfo__detail--number">
              {{ userInfo.wallet.exp }}
            </div>
          </div>
          <div class="mine__userinfo__detail__box">
            <div class="mine__userinfo__detail--title">金币</div>
            <div class="mine__userinfo__detail--number">
              {{ userInfo.wallet.coin }}
            </div>
          </div>
          <div class="mine__userinfo__detail__box">
            <div class="mine__userinfo__detail--title">下载卷</div>
            <div class="mine__userinfo__detail--number">
              {{ userInfo.wallet.ticket }}
            </div>
          </div>
        </div>
        <div>
          <div class="mine__userinfo__nickname">
            {{ userInfo.nickname }}
            <img class="mine__userinfo__nickname__icon" src="../../images/main-icon/icon_VIP.svg" v-if="userInfo.wallet.isVip == 1" width="20" />

            <v-badge class="mine__userinfo__nickname__icon" bordered color="primary" overlap
              v-if="userInfo.userCertificationEntity!=null && userInfo.userCertificationEntity.certName!=null">
              <template v-slot:badge>
                <v-icon color="white" size="16">{{userInfo.userCertificationEntity.icon}}</v-icon>
              </template>
              <v-chip x-small color="primary" outlined>
                {{userInfo.userCertificationEntity.certName}}
              </v-chip>
            </v-badge>

          </div>
          <div class="mine__userinfo__personalsign" v-if="userInfo.userExtraEntity!=null">
            {{ (userInfo.userExtraEntity.personalSignature==null || userInfo.userExtraEntity.personalSignature=="")? "原装签名送给每个小可爱" : userInfo.userExtraEntity.personalSignature }}
          </div>
        </div>
      </div>
    </div>
    <van-grid style="margin-bottom: 10px">
      <van-grid-item text="我的收藏" to="/myCollectionList">
        <template #icon>
          <img src="../../images/module-icon/icon_collection.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="我的下载" to="/myDownloadList">
        <template #icon>
          <img src="../../images/module-icon/icon_download.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="最近浏览" to="/myRecentlyReadList">
        <template #icon>
          <img src="../../images/module-icon/icon_look.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="我的贡献" to="/myUpload">
        <template #icon>
          <img src="../../images/module-icon/icon_contribution.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="上传文档" to="/uploadFile">
        <template #icon>
          <img src="../../images/module-icon/icon_upload.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
      <van-grid-item text="申请VIP" to="/vip">
        <template #icon>
          <img src="../../images/main-icon/icon_VIP.svg" width="30" style="margin-bottom: 5px" />
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell title="我的订单" is-link />
    <van-cell title="我的钱包变动" is-link to="/walletChangeRecordList" />
    <van-cell title="关于OceanLib文库" is-link style="margin-top: 5px" to="/about" />
    <div style="position: fixed;bottom: 0;left: 0;right: 0;">
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
export default {
  data() {
    return {
      navigation: 2,
      newBackground: {
        'background-image': 'url(' + require('../../images/background-picture/background-new.png') + ')',
        'background-size': '100%',
      },
      page: 1,
      userInfo: {
        avatar: null,
        nickname: '中南用户',
        wallet: {
          coin: 0,
          exp: 0,
          ticket: 0,
        },
      },
    };
  },
  mounted() {
    this.getUserAllInfo();
  },
  methods: {
    getUserAllInfo() {
      this.$Axios({
        method: 'get',
        url: '/userInfoService/getUserAllInfo',
        params: {},
      }).then((response) => {
        this.userInfo = response.data.msg;
      });
    },
  },
};
</script>

<style scoped>
</style>