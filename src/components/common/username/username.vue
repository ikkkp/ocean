<template>
  <span>
    <v-avatar color="primary" :size="avatarSize" v-if="type=='avater' && userInfo!=null">
      <v-img :src="userInfo.avatar" alt="Avatar" v-if="userInfo.avatar != null && userInfo.avatar != ''" />
      <span style="color:white" v-else-if="userInfo.nickname!=null">{{userInfo.nickname.substring(0, 1) }}</span>
    </v-avatar>

    <span v-if="type=='username'">
      {{userInfo!=null?userInfo.nickname:username}}
    </span>

    <van-tag type="primary" color="#2d8bf0" v-if="type=='level' && userInfo!=null && userInfo.level!=null">
      {{userInfo.level}}
    </van-tag>
  </span>
</template>

<script>
import { state, action } from './store.js';
export default {
  name: 'username',
  props: {
    username: String,
    user: {
      default: null,
      type: Object,
    },
    avatarSize: {
      default: 24,
      type: Number,
    },
    type: {
      default: 'username',
      type: String,
    },
  },
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.userInfo = this.user;
  },
  mounted() {
    //未自行指定用户信息则默认从服务器获取
    if (this.userInfo == null) {
      this.getUserInfo(this.username);
    }
  },
  computed: {
    //从store获取已经从服务器拉取到的用户信息
    userInfoArray() {
      return state.userInfoArray;
    },
  },
  watch: {
    //观察store的信息更新
    userInfoArray(value) {
      //只有当信息来源为自行获取时才需要监听
      if (this.user == null) {
        value.map((userInfo) => {
          if (userInfo.username == this.username) {
            this.userInfo = userInfo;
          }
        });
      }
    },
  },
  methods: {
    getUserInfo(username) {
      let hasFind = false;
      //检查store的userInfoArray中是否已经存在username对应的信息，存在则直接跳过请求
      this.userInfoArray.map((userInfo) => {
        if (userInfo.username == username) {
          this.userInfo = userInfo; //有这样的信息直接取出，无论是不是占位
          hasFind = true;
        }
      });
      if (hasFind) {
        return;
      }

      //没有这样的信息，添加占位，以阻止其他组件重复请求
      this.userInfoArray.push({ username: username });

      //请求信息
      this.$Axios({
        method: 'get',
        url: '/userInfoService/getUserLimitedInfo',
        params: {
          username: username,
        },
      }).then((response) => {
        if (response.data.code == 1) {
          //向store的userInfoArray中补回信息
          action.setUserInfoArray(
            this.userInfoArray.map((userInfo) => {
              if (userInfo.username == username) {
                return response.data.msg;
              } else {
                return userInfo;
              }
            })
          );
        }
      });
    },
  },
};
</script>