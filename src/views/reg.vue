<style scoped lang="less">
@import '~@/vant-variables.less';
.reg {
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
    flex: 5;
  }
  &__button {
    margin-top: 5px;
  }
  &__bottom {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 12px;
    text-align: center;
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

<template>
  <div class="reg container md-body-1">
    <div class="reg__title">
      <img class="reg__logo" src="../images/main-picture/logo.png" />
      <br />
      <span class="text-h5" style="color:rgba(0,0,0,0.7)"><strong>用户注册</strong></span>
    </div>
    <div class="reg__body">

      <v-bitRegNotice ref="bitRegNotice" v-if="univ=='BIT'"></v-bitRegNotice>
      <v-csuRegNotice ref="csuRegNotice" v-if="univ=='CSU'"></v-csuRegNotice>
      <v-text-field v-model="username" type="text" name="username" label="用户名" placeholder="请输入您的用户名" hint="用户名一经设置不可修改" @blur="checkUsername(username)"
        :error-messages="!isSameUsername?null:'用户名已被注册，请更换后重试'"></v-text-field>

      <v-text-field v-model="nickname" type="text" name="username" label="昵称" placeholder="请输入您的昵称"></v-text-field>

      <v-text-field v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[passwordRules.required, passwordRules.min]"
        :type="showPassword ? 'text' : 'password'" name="password" label="密码" placeholder="请输入账号密码" hint="密码至少为6位" counter @click:append="showPassword = !showPassword">
      </v-text-field>

      <v-text-field v-model="password2" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[passwordRules.required, passwordRules.min, passwordRules.issame]"
        :type="showPassword ? 'text' : 'password'" name="password" label="验证密码" placeholder="请再次输入账号密码" hint="密码至少为6位" counter @click:append="showPassword = !showPassword">
      </v-text-field>

      <v-btn class="reg__button" depressed color="primary" @click="reg()">
        确认并注册
      </v-btn>
    </div>

    <div class="reg__bottom">
      <div>
        注册即视为同意<a>《OceanLib文库用户协议》</a>、<a>《用户隐私保护声明》</a>、<a>《文档类内容发布与下载须知》</a>及所在高校相关规定
      </div>
      <p class="md-caption reg__copyright">Oriole 亦师 (CSU/BIT) © Copyright 2019-2022</p>
    </div>
  </div>
</template>
<script>
import * as axios from 'axios';
import qs from 'qs';
import bitRegNotice from '@/components/univlogin/bit/bitRegNotice.vue';
import csuRegNotice from '@/components/univlogin/csu/csuRegNotice.vue';
import { Notify } from 'vant';

export default {
  data() {
    return {
      univ: this.$route.query.univ,
      username: '',
      nickname: null,
      password: null,
      password2: null,
      showPassword: false,
      isSameUsername: false,
      passwordRules: {
        required: (value) => value == null || (value != null && value != '') || '密码不可为空',
        min: (value) => value == null || value.length >= 6 || value.length == 0 || '密码至少为 6 字符',
        issame: (value) => this.password == value || '两次输入的密码不一致',
      },
    };
  },
  components: {
    'v-bitRegNotice': bitRegNotice,
    'v-csuRegNotice': csuRegNotice,
  },
  mounted() {},
  methods: {
    checkUsername(username) {
      axios({
        method: 'get',
        url: this.$root.businessServer + 'userInfoService/checkSameUsername',
        params: {
          username: username,
        },
      }).then((response) => {
        if (response.data.state == 'SUCCESS') {
          this.isSameUsername = false;
        } else {
          this.isSameUsername = true;
        }
      });
    },
    reg() {
      if (this.isSameUsername) {
        Notify({ type: 'danger', message: '用户名已被注册，请更换后重试' });
        return;
      }
      if (this.password != this.password2) {
        Notify({
          type: 'danger',
          message: '两次输入的密码不一致，请检查后重试',
        });
        return;
      }
      if (this.username == '' || this.password == null) {
        Notify({ type: 'danger', message: '必填项未完成，请检查后重试' });
        return;
        
      }
      switch (this.univ) {
        case 'BIT':
          this.$refs['bitRegNotice'].reg(this.doReg);
          break;
        case 'CSU':
          this.$refs['csuRegNotice'].reg(this.doReg);
          break;
        default:
          Notify({
            type: 'danger',
            message: '错误：不存在的高校，请联系管理员',
          });
      }
    },
    doReg() {
      axios({
        method: 'post',
        url: this.$root.businessServer + 'userAuth/reg',
        data: qs.stringify({
          username: this.username,
          password: this.password,
          nickname: this.nickname,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: localStorage.getItem('regToken'),
        },
      })
        .then((response) => {
          if (response.data.state == 'SUCCESS') {
            localStorage.clear();
            localStorage.setItem('token', response.data.msg);
            Notify({ type: 'success', message: '注册成功' });
            this.$router.push('/index');
          }
        })
        .catch((error) => {
          Notify({ type: 'danger', message: '其他服务器错误' + error });
        });
    },
  },
};
</script>
