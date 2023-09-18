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
      高校限制，注册者必须是中南大学学生/教职工，登录时未注册将自动关联注册。
    </v-alert>
    <v-text-field v-model="csuUserID" type="text" name="username" label="学号/工号" placeholder="请输入中南大学学号/工号"></v-text-field>
    <v-text-field v-model="csuPwd" hide-details="auto" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[passwordRulesCSU.required, passwordRulesCSU.min]"
      :type="showPassword ? 'text' : 'password'" label="统一认证密码" placeholder="请输入门户/统一认证密码" hint="默认密码为身份证后6位" counter @click:append="showPassword = !showPassword"></v-text-field>
    <div class="login__captcha" v-if="csuCaptchaBoxShow">
      <v-text-field class="login__cpatcha__input" v-model="csuCaptcha" type="text" name="csuCaptcha" label="验证码" placeholder="请输入右侧验证码"></v-text-field>
      <img class="login__cpatcha__img" :src="csuCaptchaImg" @click="getCSULoginCaptchaCode" />
    </div>
    <v-btn class="login__button" depressed color="primary" @click="login">
      登录
    </v-btn>
    <v-checkbox v-model="isAutoLogin" label="记住账号和密码"></v-checkbox>
  </div>
</template>
<script>
import * as axios from 'axios';
import { encryptPassword } from './csuLoginEncrypt';
import { Notify } from 'vant';
import qs from 'qs';
export default {
  
  components: {

  },
  data() {
    return {
      passwordRulesCSU: {
        required: (value) => value == null || (value != null && value != '') || '密码不可为空，默认密码为身份证后6位',
        min: (value) => value == null || value.length >= 6 || value.length == 0 || '密码至少为 6 字符',
      },
      showPassword: false,
      csuUserID: '',
      csuPwd: '',
      csuCaptcha: null,
      csuCookie: null,
      csuExecution: null,
      csuPwdEncryptSalt: null,
      csuCaptchaImg: null,
      csuCaptchaBoxShow: false,
      isAutoLogin: false,
      noticeShow: false,
    };
  },
  mounted() {
    this.isAutoLogin = localStorage.getItem('isAutoLogin') === 'true';
    if (this.isAutoLogin) {
      this.csuUserID = localStorage.getItem('csuUserID');
      this.csuPwd = localStorage.getItem('csuPwd');
    }
    this.getCSULoginInfo();
  },
  methods: {
    reg() {
      this.tab = 'csulogin';
      this.noticeShow = true;
    },
    getCSULoginInfo() {
      axios({
        method: 'get',
        url: this.$root.businessServer + 'thirdPartLogin/getCSULoginInfo',
      }).then((response) => {
        if (response.data.state == 'SUCCESS') {
          this.csuCookie = response.data.msg.cookie;
          this.csuExecution = response.data.msg.execution;
          this.csuPwdEncryptSalt = response.data.msg.pwdEncryptSalt;
          if (this.csuUserID != null) {
            this.getCSULoginCaptchaCode();
          }
        }
      });
    },
    getCSULoginCaptchaCode() {
      axios({
        method: 'get',
        url: this.$root.businessServer + 'thirdPartLogin/getCSULoginCaptchaCode',
        params: {
          username: this.csuUserID,
          cookie: this.csuCookie,
        },
      }).then((response) => {
        if (response.data.state == 'SUCCESS' && response.data.code == '1') {
          this.csuCaptchaImg = response.data.msg;
          this.csuCaptchaBoxShow = true;
        }
      });
    },
    login() {
      if (this.isAutoLogin) {
        localStorage.setItem('csuUserID', this.csuUserID);
        localStorage.setItem('csuPwd', this.csuPwd);
        localStorage.setItem('isAutoLogin', 'true');
      } else {
        localStorage.setItem('isAutoLogin', 'false');
      }
      this.doLogin();
      
    },
    doLogin() {
      this.getCSULoginCaptchaCode();
      this.$emit('onLogin', {
        url: this.$root.businessServer + 'userAuth/CSULogin',
        data: {
          studentID: this.csuUserID,
          password: encryptPassword(this.csuPwd, this.csuPwdEncryptSalt),
          execution: this.csuExecution,
          captcha: this.csuCaptcha,
          cookie: this.csuCookie,
        },
      });
    },
  },
};
</script>