<style lang="less" scoped>
.login {
  display: flex;
  flex-direction: column;
  &__title {
    flex: 1;
    margin-top: 40px;
  }
  &__logo {
    width: 120px;
    margin-bottom: 10px;
  }
  &__body {
    flex: 3;
  }
  &__button {
    margin-top: 5px;
  }
  &__alert {
    line-height: 20px;
  }
  &__captcha {
    display: flex;
    flex-direction: row;
    align-items: center;
    &__input {
      margin-right: 10px;
    }
    &__img {
      height: 30px;
      width: 80px;
      margin-left: 10px;
    }
  }
  &__tab {
    padding: 10px 0px;
    &__icon {
      width: 26px;
    }
  }
  &__bottom {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 14px;
  }
  &__divider {
    margin: 0 10px;
  }
  &__copyright {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
.container {
  padding: 25px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>

<template>
  <div>
    <v-alert class="login__alert" border="bottom" colored-border type="warning" elevation="2" v-if="noticeShow">
      高校限制，注册者必须是北京理工大学学生/教职工，登录时未注册将自动关联注册。
    </v-alert>
    <v-text-field v-model="bitUserID" type="text" name="username" label="学号/工号" placeholder="请输入北京理工大学学号/工号" @change="getBITLoginCaptchaCode"></v-text-field>
    <v-text-field v-model="bitPwd" hide-details="auto" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[passwordRulesBIT.required, passwordRulesBIT.min]"
      :type="showPassword ? 'text' : 'password'" label="统一认证密码" placeholder="请输入门户/统一认证密码" hint="默认密码为身份证后6位" counter @click:append="showPassword = !showPassword">
    </v-text-field>
    <div class="login__captcha" v-if="bitCaptchaBoxShow">
      <v-text-field class="login__captcha__input" v-model="bitCaptcha" type="text" name="bitCaptcha" label="验证码" placeholder="请输入右侧验证码"></v-text-field>
      <img class="login__captcha__img" :src="bitCaptchaImg" @click="getBITLoginCaptchaCode" />
    </div>
    <v-btn class="login__button" depressed color="primary" @click="login">
      登录
    </v-btn>
    <v-checkbox v-model="isAutoLogin" label="记住账号和密码"></v-checkbox>
  </div>
</template>
<script>
import * as axios from 'axios';
import { encryptPassword } from './bitLoginEncrypt.js';
import { Notify } from 'vant';

export default {
  data() {
    return {
      passwordRulesBIT: {
        required: (value) => value == null || (value != null && value != '') || '密码不可为空，默认密码为身份证后6位',
        min: (value) => value == null || value.length >= 6 || value.length == 0 || '密码至少为 6 字符',
      },
      showPassword: false,
      bitUserID: '',
      bitPwd: '',
      bitCaptcha: null,
      bitCookie: null,
      bitExecution: null,
      bitPwdEncryptSalt: null,
      bitCaptchaImg: null,
      bitCaptchaBoxShow: false,
      isAutoLogin: false,
      noticeShow: false,
    };
  },
  mounted() {
    this.isAutoLogin = localStorage.getItem('isAutoLogin') === 'true';
    if (this.isAutoLogin) {
      this.bitUserID = localStorage.getItem('bitUserID');
      this.bitPwd = localStorage.getItem('bitPwd');
    }
    this.getBITLoginInfo();
  },
  methods: {
    reg() {
      this.tab = 'bitlogin';
      this.noticeShow = true;
    },
    getBITLoginInfo() {
      axios({
        method: 'get',
        url: this.$root.businessServer + 'thirdPartLogin/getBITLoginInfo',
      }).then((response) => {
        if (response.data.state == 'SUCCESS') {
          this.bitCookie = response.data.msg.cookie;
          this.bitExecution = response.data.msg.execution;
          this.bitPwdEncryptSalt = response.data.msg.pwdEncryptSalt;
          if (this.bitUserID != null) {
            this.getBITLoginCaptchaCode();
          }
        }
      });
    },
    getBITLoginCaptchaCode() {
      axios({
        method: 'get',
        url: this.$root.businessServer + 'thirdPartLogin/getBITLoginCaptchaCode',
        params: {
          username: this.bitUserID,
          cookie: this.bitCookie,
        },
      }).then((response) => {
        if (response.data.state == 'SUCCESS' && response.data.code == '1') {
          this.bitCaptchaImg = response.data.msg;
          this.bitCaptchaBoxShow = true;
        }
      });
    },
    login() {
      if (this.isAutoLogin) {
        localStorage.setItem('bitUserID', this.bitUserID);
        localStorage.setItem('bitPwd', this.bitPwd);
        localStorage.setItem('isAutoLogin', 'true');
      } else {
        localStorage.setItem('isAutoLogin', 'false');
      }
      this.doLogin();
      
    },
    doLogin() {
      this.getBITLoginCaptchaCode();
      this.$emit('onLogin', {
        url: this.$root.businessServer + 'userAuth/BITLogin',
        data: {
          studentID: this.bitUserID,
          password: encryptPassword(this.bitPwd, this.bitPwdEncryptSalt),
          execution: this.bitExecution,
          captcha: this.bitCaptcha,
          cookie: this.bitCookie,
        },
      });
    },
  },
};
</script>