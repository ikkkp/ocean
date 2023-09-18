<style scoped lang="less">
@import '~@/vant-variables.less';
.payment {
  max-height: 70%;
  display: flex;
  flex-direction: column;
  &__box {
    flex: 1;
    overflow-y: scroll;
  }
  &__title {
    margin: 15px;
    text-align: center;
    font-size: 16px;
  }
  &--primary {
    font-size: 14px;
    color: var(--v-primary-base);
    font-weight: bold;
  }
}
</style>
<template>
  <van-popup class="payment" v-model="showPaymentMethodModel" round position="bottom" closeable>
    <p class="payment__title">请设置收益类型</p>
    <v-card class="payment__box">

      <v-alert border="right" colored-border type="info" elevation="2">
        您的文档目前{{!isProCert?'暂时还不是':'已是'}}精华文档，{{!isProCert?'不可':'可以'}}设置收益类型为 下载券 下载。<span v-if="!isProCert">若要申请精华文档，请点击 <v-btn color="primary" x-small>申请优质认证
          </v-btn> 并耐心等待管理员审核。</span>
      </v-alert>

      <van-field readonly clickable :value="revenueTypeName" label="收益类型" placeholder="点击选择收益类型" @click="showRevenueTypePicker = true" />
      <van-popup v-model="showRevenueTypePicker" position="bottom">
        <van-picker show-toolbar :columns="revenueTypeList" @confirm="onRevenueTypeConfirm" @cancel="showRevenueTypePicker = false" />
      </van-popup>

      <van-field label="售价" v-if="paymentMethod!=1">
        <template #input>
          下载需
          <v-btn class="mx-2" fab x-small color="primary" @click="()=>paymentAmount-=1" :disabled="paymentAmount==0">
            <v-icon dark>
              mdi-minus
            </v-icon>
          </v-btn>
          {{paymentAmount}}
          <v-btn class="mx-2" fab x-small color="primary" @click="()=>paymentAmount+=1" :disabled="paymentAmount>=30">
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>

          <span v-if="paymentMethod!=1">{{paymentMethod==2?' 金币':' 下载券'}}</span>
        </template>
      </van-field>

      <van-field label="访客可阅读">
        <template #input>
          <van-switch v-model="isAllowAnon" size="20" :active-value="1" :inactive-value="0" />
        </template>
      </van-field>
      <van-field label="优享免费下载">
        <template #input>
          <van-switch v-model="isAllowVipfree" size="20" :active-value="1" :inactive-value="0" />
        </template>
      </van-field>

      <v-card-actions @click="showMore = !showMore">
        <div>文档收益、优质文档评价与“优享免费下”说明</div>
        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>{{ showMore ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="showMore">
          <v-divider></v-divider>
          <v-filePaymentStatement></v-filePaymentStatement>
        </div>
      </v-expand-transition>
    </v-card>
    <v-btn color="primary" @click="ok()">
      确定
    </v-btn>
  </van-popup>
</template>

<script>
import filePaymentStatement from '@/views/statement/filePaymentStatement.vue';

export default {
  components: {
    'v-filePaymentStatement': filePaymentStatement,
  },
  props: {
    fileInfo: Object,
  },
  watch: {
    fileInfo() {
      this.isOriginal = this.fileInfo.fileExtraEntity.isOriginal == 1 ? true : false;
      this.isProCert = this.fileInfo.fileExtraEntity.isProCert == 1 ? true : false;
      this.isAllowAnon = this.fileInfo.isAllowAnon;
      this.isAllowVipfree = this.fileInfo.isAllowVipfree;
      this.paymentMethod = this.fileInfo.paymentMethod;
      this.paymentAmount = this.fileInfo.paymentAmount;
    },
  },
  mounted() {},
  data() {
    return {
      showMore: false,
      showPaymentMethodModel: false,

      isOriginal: false,
      isProCert: false,

      isAllowAnon: 0,
      isAllowVipfree: 1,
      paymentMethod: 1,
      paymentAmount: 1,

      showRevenueTypePicker: false,
    };
  },
  computed: {
    revenueTypeList: {
      get: function () {
        return [
          { text: '无偿贡献', disabled: false },
          { text: '金币收益', disabled: false },
          { text: '下载券(优质文档专属)', disabled: !this.isProCert },
        ];
      },
    },
    revenueTypeName() {
      return this.revenueTypeList[this.paymentMethod - 1].text;
    },
  },
  methods: {
    open() {
      this.showPaymentMethodModel = true;
    },
    ok() {
      this.showPaymentMethodModel = false;
      this.$emit('onSelect', {
        isAllowAnon: this.isAllowAnon,
        isAllowVipfree: this.isAllowVipfree,
        paymentMethod: this.paymentMethod,
        paymentAmount: this.paymentAmount,
      });
    },
    onRevenueTypeConfirm(value, index) {
      this.paymentMethod = index + 1;
      this.showRevenueTypePicker = false;
    },
  },
};
</script>

<style>
</style>