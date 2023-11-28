/**
* @description store 入口文件
* @version 1.0
* @author Huangzl
* @fileName index.js
* @date 2023/11/27 16:10:46
*/
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    text2SpeechSheet: false,
  },
  // 在 Vuex store mutations 部分
  mutations: {
    setText2SpeechSheet(state, value) {
      state.text2SpeechSheet = value;
    },
    // 其他 mutations...
  },

  actions: {},
  getters: {},
});
