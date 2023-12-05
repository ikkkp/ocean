import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'  // 引入本地的Material Design Icons资源

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',	// 设置使用本地的icon资源
    }, theme: {
        options: { customProperties: true },
    },
});
