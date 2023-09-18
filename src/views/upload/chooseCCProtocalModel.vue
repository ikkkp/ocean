<style scoped lang="less">
@import '~@/vant-variables.less';
.ccprotocal {
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
  &__checkbox {
    margin: 0px 20px;
    display: flex;
    flex-wrap: wrap;
    &__label {
      font-size: 14px;
      min-width: 110px;
    }
  }
  &--primary {
    font-size: 14px;
    color: var(--v-primary-base);
    font-weight: bold;
  }
}
</style>
<template>
  <van-popup class="ccprotocal" v-model="showCCprotocalModel" round position="bottom" closeable>
    <p class="ccprotocal__title">请选择版权协议</p>
    <v-card class="ccprotocal__box">
      <div class="ccprotocal__checkbox">
        <v-checkbox v-model="copyrightNotice" value="BY" hide-details :disabled="ccDisabled">
          <template slot="label">
            <div class="ccprotocal__checkbox__label">姓名标示（BY）</div>
          </template>
        </v-checkbox>
        <v-checkbox v-model="copyrightNotice" value="NC" hide-details :disabled="ccDisabled">
          <template slot="label">
            <div class="ccprotocal__checkbox__label">非商业性（NC）</div>
          </template>
        </v-checkbox>
        <v-checkbox v-model="copyrightNotice" value="ND" hide-details :disabled="ccDisabled">
          <template slot="label">
            <div class="ccprotocal__checkbox__label">禁止改作（ND）</div>
          </template>
        </v-checkbox>
        <v-checkbox v-model="copyrightNotice" value="SA" hide-details :disabled="ccDisabled">
          <template slot="label">
            <div class="ccprotocal__checkbox__label">相同方式分享（SA）</div>
          </template>
        </v-checkbox>
        <v-checkbox v-model="copyrightNotice" value="COPYRIGHT" hide-details>
          <template slot="label">
            <div class="ccprotocal__checkbox__label">作者保留全部著作权</div>
          </template>
        </v-checkbox>
      </div>

      <v-card-actions @click="showMore = !showMore">
        <div>什么是CC版权协议</div>
        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>{{ showMore ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="showMore">
          <v-divider></v-divider>
          <v-ccProtocalStatement></v-ccProtocalStatement>
        </div>
      </v-expand-transition>
    </v-card>
    <v-btn color="primary" @click="ok()">
      确定
    </v-btn>
  </van-popup>
</template>

<script>
import ccProtocalStatement from '@/views/statement/ccProtocalStatement.vue';

export default {
  components: {
    'v-ccProtocalStatement': ccProtocalStatement,
  },
  props: {
    value: String,
  },
  data() {
    return {
      showMore: false,
      showCCprotocalModel: false,
      copyrightNotice: [],
    };
  },
  computed: {
    ccDisabled() {
      if (this.copyrightNotice.indexOf('COPYRIGHT') != -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    value() {
      this.copyrightNotice = this.value.split('-');
    },
    ccDisabled() {
      if (this.ccDisabled) {
        this.copyrightNotice = ['COPYRIGHT'];
      }
    },
  },
  methods: {
    open() {
      this.showCCprotocalModel = true;
    },
    ok() {
      this.showCCprotocalModel = false;
      this.$emit('onSelect', this.copyrightNotice.join('-'));
    },
  },
};
</script>

<style>
</style>