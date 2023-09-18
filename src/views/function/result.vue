<template>
  <div style="font-size: 14px;position: absolute;top:0;bottom: 0;right: 0;left: 0;">
    <van-nav-bar id="toolbar" title="执行结果" left-text="返回主页" left-arrow @click-left="back">
    </van-nav-bar>
    <div v-if="state=='ERROR'" style="display:flex;flex-direction:column;height: 90%">
      <div style="flex:1;display: flex;flex-direction: column;align-items:center;justify-content:center;padding:20px;text-align: center">
        <Icon type="ios-bug" size="64" color="#ed4014" />
        <v-icon size="64" color="#ed4014">mdi-alert-octagon-outline</v-icon>
        <p style="font-size: 20px;color: #ed4014;margin-top:10px">我们遇到了一个异常</p>
        <br />
        <p>“那您说的这个BUG，它离谱吗？”</p>
        <p>“它不是离不离谱的问题！它真的是那种……那种很少见的那种。”</p>
        <br />
        <p>“它的错误代码是 <span style="color: #ed4014">{{code}}</span> ,它原因是 <span style="color: #ed4014"> {{msg}} </span>牙齿尖尖的，就很离谱。”
        </p>
        <br />
        <v-btn color="warning" @click="back">返回主页</v-btn>
      </div>
      <div style="flex:0;font-size: 10px;text-align: center;color: #17233d;margin-bottom: 20px;">欢迎联系作者反馈，作者QQ
        1257477940
      </div>
    </div>
    <div v-else style="display:flex;flex-direction:column;height: 90%">
      <div style="flex:1;display: flex;flex-direction: column;align-items:center;justify-content:center;padding:20px;text-align: center">
        <v-icon size="64" color="#19be6b">mdi-checkbox-marked-circle-outline</v-icon>
        <p style="font-size: 20px;color: #19be6b;margin-top:10px">操作成功</p>
        <br />
        <p>返回结果为 <span style="color: #19be6b"> {{msg}} </span>
        </p>
        <br />
        <v-btn color="success" @click="back">返回主页</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'result',
  data() {
    return {
      state: this.$route.query.state,
      code: this.$route.query.code,
      msg: this.$route.query.msg,
    };
  },
  methods: {
    back() {
      this.$router.push('/index'); //返回上一层
    },
  },
};
</script>

<style scoped>
</style>