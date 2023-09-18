<template>
  <div>
    <van-nav-bar id="toolbar" title="慧墨云免费打印" left-text="返回" left-arrow @click-left="back">
    </van-nav-bar>
    <div style="display: flex;flex-direction: column">
      <img id="title" src="../../images/main-picture/motaPrint.jpg" style="height: 150px;object-fit: cover;" />
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
        慧墨云自助免费打印 与 OceanLib文库 均为Oriole团队旗下项目，您可以通过自助打印设备免费打印文件，也无需为文库相应文件付费，点墨已经代为支付了相关费用！
      </van-notice-bar>
      <div style="padding: 20px;font-size: 14px;">
        <p>请您点击自助打印设备屏幕“开始打印”选项，并获得OceanLib云打印编码。</p>
        <br />
        <p style="font-size: 16px;">在下方输入该编码，并确认即可开始打印</p>
      </div>
      <van-password-input :value="printCode" :mask="false" :focused="showKeyboard" @focus="showKeyboard = true" />
      <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard = false" />
      <cube-button :primary="true" style="margin-top: 20px;" @click="doPrint">开始打印</cube-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      printCode: '',
      showKeyboard: true,
    };
  },
  mounted() {},
  methods: {
    onInput(key) {
      this.printCode = (this.printCode + key).slice(0, 6);
    },
    onDelete() {
      this.printCode = this.printCode.slice(0, this.printCode.length - 1);
    },
    back() {
      this.$router.go(-1); //返回上一层
    },
    doPrint() {
      this.$createDialog({
        type: 'alert',
        title: '打印任务发送成功',
        content: '点墨自助打印设备正在为您打印',
        icon: 'cubeic-alert',
        onConfirm: () => {
          this.back();
        },
      }).show();
    },
  },
};
</script>

<style scoped>
</style>