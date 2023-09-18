import ConstantRouters from "./constantRouter";
import asyncRouters from "./asyncRouter";
import VueRouter from 'vue-router';
import Vue from 'vue';
import axios from 'axios'
import {
    baseURL
} from '@/config.js'

//import ViewUI from 'view-design';
//Vue.use(ViewUI);

Vue.use(VueRouter);

const RouterConfig = {
    mode: 'hash',
    routes: ConstantRouters,
    base: '/platform/',
};

const router = NewRouter();

//路由转发拦截器
router.beforeEach((to, from, next) => {

    //ViewUI.LoadingBar.start();
    window.document.title = "OceanLib-" + to.meta.title;

    if (sessionStorage.getItem("role") == null && localStorage.getItem("token") != null) {
        getUserInfo(() => {
            customNext(to, next);
        });
    } else {
        customNext(to, next);
    }
    if (to.matched.length === 0) { //to.matched（路由匹配到的所有路由记录）的匹配会在beforeEach前进行，若更新了路由，则需要重新匹配，否则将导致进入空白页
        customNext(to, next);
    }
});

function customNext(to, next) {
    next();
}

router.afterEach((to, from) => {
    //若访问页面最终导向为错误页则带上访问来源地址
    if (to.matched[0] != null && to.matched[0].path === "*") {
        to.query["url"] = to.path;
    }
    //ViewUI.LoadingBar.finish();
});

//生成新路由（token有效时将包含动态权限路由，token无效将跳转登录页）
function NewRouter() {
    let router = new VueRouter(RouterConfig);
    if (sessionStorage.getItem("role")) {
        //若存在sessionStorage保存的ROLE值（说明单次会话未结束），则直接生成动态权限路由表
        router.addRoutes(routerMatch(sessionStorage.getItem("role")));
    } else if (localStorage.getItem("token")) {
        //若不存在localStorage保存的ROLE值（单次会话已结束，但token不一定失效），则利用token重新获取之
        getUserInfo();
    }
    return router;
}

//向服务器请求用户基本信息并建立会话缓存
function getUserInfo(callback = function () {}) {
    //向服务器请求用户基本信息
    axios({
        method: 'get',
        url: baseURL + '/userInfoService/getUserBaseInfo',
        headers: {
            Authorization: localStorage.getItem("token"),
        }
    }).then((response) => {
        //token未失效时
        let responseData = response.data;

        // 获取用户基本信息并存入sessionStorage
        sessionStorage.setItem("nickname", responseData.msg.nickname);
        sessionStorage.setItem("username", responseData.msg.username);
        sessionStorage.setItem("role", responseData.msg.role);
        sessionStorage.setItem("regDate", responseData.msg.regDate);
        sessionStorage.setItem("phoneNum", responseData.msg.phoneNum);
        sessionStorage.setItem("realname", responseData.msg.realname);
        sessionStorage.setItem("studentID", responseData.msg.studentID);
        sessionStorage.setItem("avatar", responseData.msg.avatar);
        sessionStorage.setItem("isVip", responseData.msg.wallet.isVip);
        sessionStorage.setItem("vipValidDate", responseData.msg.wallet.vipValidDate);
        //生成动态权限路由表
        router.addRoutes(routerMatch(responseData.msg.role));
        //执行回调
        callback();
    }).catch((error) => {
        console.log(error)
        //返回登录页
        localStorage.removeItem("token");
        router.push("/login");
        //执行回调
        callback();
    })
}

function routerMatch(role) {
    let routers = [];
    for (let index in asyncRouters) {
        let permission = asyncRouters[index].meta.permission;
        if (permission.indexOf(role) !== -1) {
            routers.push(asyncRouters[index]);
        }
    }
    routers.push({
        path: '*',
        meta: {
            title: '访问受限',
        },
        component: (resolve) => require(['../views/errorPage.vue'], resolve)
    });
    return routers;
}

export default router;