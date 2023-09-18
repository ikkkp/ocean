<template>
  <div>
    <v-alert class="login__alert" border="bottom" colored-border type="info" elevation="2">
      我们将在注册时向北京理工大学获取您的个人信息，这些信息我们将严格保密且不会用于任何其他用途。您可查阅<a>用户隐私保护声明</a>了解详情。
    </v-alert>
    <my-dialog ref="dialog"></my-dialog>
  </div>
</template>
<script>
import dialog from '@/components/dialog/dialog.vue';
import { Notify } from 'vant';

export default {
  components: {
    'my-dialog': dialog,
  },
  data() {
    return {};
  },
  props: {
    studentID: String,
    cookie: String,
  },
  methods: {
    reg(callback) {
      this.$refs['dialog']
        .newDialog(
          'userInfoAsk',
          '用户个人信息授权',
          "<p>注册时将通过北京理工大学电子身份管理系统获取您的下列个人信息:</p><p style='color:var(--v-error-darken2)'>真实姓名、学号、邮箱地址</p><p>这些信息将用于且仅用于验证身份或找回账号。我们将对您的个人信息严格保密，<span style='color:var(--v-error-darken2)'>若您拒绝授权我们获得您的个人信息，请点击拒绝按钮退出用户注册。</span></p>",
          '授权获取',
          '拒绝'
        )
        .then(() => {
          callback();
        })
        .catch(() => {
          Notify({ type: 'danger', message: '您已拒绝获取您的个人信息，无法完成注册' });
        });
    },
  },
};
</script>