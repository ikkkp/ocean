<style lang="less" scoped>
@import '~@/vant-variables.less';
.login {
  display: flex;
  flex-direction: column;
  &__title {
    flex: 1;
    margin-top: 40px;
  }
  &__logo {
    width: 150px;
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
    font-size: 12px;
  }
  &__divider {
    margin: 0 10px;
  }
  &__copyright {
    margin-top: 5px;
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

<style lang="scss" scoped>
@import '~vuetify/src/components/VMessages/_variables.scss';
$messages-line-height: unset;
</style>

<template>
  <div class="login container md-body-1">
    <v-loading ref="loading" />
    <div class="login__title">
      <img class="login__logo" src="../images/main-picture/logo.png" />
      <br />
      <span class="text-h5" style="color:rgba(0,0,0,0.7)"><strong>登录到OceanLib</strong></span>
    </div>
    <div class="login__body">
      <v-tabs v-model="tab">
        <v-tab href="#userlogin">
          <v-icon class="login__tab__icon">mdi-account-box</v-icon>
        </v-tab>
        <v-tab href="#univlogin">
          <v-icon class="login__tab__icon">mdi-school</v-icon>
        </v-tab>
        <v-tabs-slider></v-tabs-slider>
      </v-tabs>
      <v-tabs-items v-model="tab" class="login__tab">
        <v-tab-item value="userlogin">
          <v-text-field v-model="username" type="text" name="username" label="用户名" placeholder="请输入用户名"></v-text-field>
          <v-text-field v-model="password" hide-details="auto" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[passwordRules.required, passwordRules.min]"
            :type="showPassword ? 'text' : 'password'" name="password" label="密码" placeholder="请输入账号密码" hint="密码至少为6位" counter @click:append="showPassword = !showPassword">
          </v-text-field>
          <v-btn class="login__button" depressed color="primary" @click="login">
            登录
          </v-btn>
          <v-checkbox v-model="isAutoLogin" label="记住账号和密码"></v-checkbox>
        </v-tab-item>
        <v-tab-item value="univlogin">
          <v-select v-model="univ" :items="univList" item-text="key" item-value="value" label="选择你的所在高校"></v-select>
          <v-bitLogin v-if="univ=='BIT'" @onLogin="(data)=>{doLogin(data)}"></v-bitLogin>
          <v-csuLogin v-if="univ=='CSU'" @onLogin="(data)=>{doLogin(data)}"></v-csuLogin>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <div class="login__bottom">
      <div>
        <a @click="reg">注册</a> <span class="login__divider">|</span> <a>帮助</a>
      </div>
      <p class="md-caption login__copyright">Oriole 亦师 (CSU/BIT) © Copyright 2019-2022</p>
    </div>
  </div>
</template>
<script>
import * as axios from 'axios';
import qs from 'qs';
import { Notify } from 'vant';
import loading from '@/components/loading';
import bitLogin from '@/components/univlogin/bit/bitLogin.vue';
import csuLogin from '@/components/univlogin/csu/csuLogin.vue';
export default {
  components: {
    'v-loading': loading,
    'v-bitLogin': bitLogin,
    'v-csuLogin': csuLogin,
  },
  data() {
    return {
      univList: [
        {
          key: '中南大学',
          value: 'CSU',
        },
        {
          key: '北京理工大学',
          value: 'BIT',
        },
      ],
      univ: null,
      passwordRules: {
        required: (value) => value == null || (value != null && value != '') || '密码不可为空',
        min: (value) => value == null || value.length >= 6 || value.length == 0 || '密码至少为 6 字符',
      },

      showPassword: false,
      tab: 'univlogin',
      username: '',
      password: '',

      isAutoLogin: false,
      noticeShow: false,
    };
  },
  mounted() {
    this.isAutoLogin = localStorage.getItem('isAutoLogin') === 'true';
    if (this.isAutoLogin) {
      this.username = localStorage.getItem('username');
      this.password = localStorage.getItem('password');
    }
  },
  methods: {
    reg() {
      this.tab = 'csulogin';
      this.noticeShow = true;
    },
    login() {
      this.$refs.loading.show('正在登录');
      if (this.isAutoLogin) {
        if (this.tab == 'userlogin') {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);
        } else {
          localStorage.setItem('csuUserID', this.csuUserID);
          localStorage.setItem('csuPwd', this.csuPwd);
        }
        localStorage.setItem('isAutoLogin', 'true');
      } else {
        localStorage.setItem('isAutoLogin', 'false');
      }
      this.doLogin();
    },
    doLogin(args) {
      if (args == null) {
        args = {
          url: this.$root.businessServer + 'userAuth/login',
          data: {
            username: this.username,
            password: this.password,
          },
        };
      }
      axios({
        method: 'post',
        url: args.url,
        data: qs.stringify(args.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          console.log(response)
          if (response.data.state == 'SUCCESS') {
            if (response.data.code == '1') {
              sessionStorage.clear();
              localStorage.setItem('token', response.data.msg);
              Notify({ type: 'success', message: '登录成功' });
              this.$router.push('/index');
            }
            if (response.data.code == '0' && this.univ != null) {
              sessionStorage.clear();
              localStorage.setItem('regToken', response.data.msg);
              this.$router.push({
                path: '/reg',
                query: {
                  univ: this.univ,
                },
              });
            }
          } else {
            this.$refs.loading.hide();
            if (response.data.code == '-2') {
              Notify({ type: 'danger', message: '用户名 / 密码 / 验证码错误' });
            } else if (response.data.code == '-3') {
              Notify({ type: 'danger', message: '账号已锁定或封禁' });
            }
          }
        })
        .catch((error) => {
          this.$refs.loading.hide();
          Notify({ type: 'danger', message: '其他服务器错误' + error });
        });
    },
  },
};
</script>