import axios from 'axios';
import {
    baseURL
} from '@/config.js';
import router from "../router";

export const Axios = axios.create({
    timeout: 10 * 1000,
});

export function enableIntranetSites() {
    Axios({
            method: 'get',
            url: '/serverInfo/getIntranetSiteURLList',
        })
        .then(async (response) => {
            let intranetSiteURLList = response.data.msg
            for (let intranetSiteURL of intranetSiteURLList) {
                //let isConnected = await testIntranetSites(intranetSiteURL)
                if (isConnected) {
                    console.log("尝试接入内网服务器结束");
                    break;
                }
            }
        })
}

function testIntranetSites(url) {
    let result = new Promise(result => {
        axios({
            method: 'get',
            url: url + '/serverInfo/testIntranetServer',
            timeout: 3 * 1000,
        }).then((response) => {
            if (response.data.state == "SUCCESS") {
                localStorage.setItem("intranetURL", url);
                console.log("已经接入内部网络服务器:" + url);
            }
            result(true);
        }).catch(e => {
            console.log("无法接入内部网络服务器，已经终止:" + e);
            result(false);
        })
    })
    return result;
}

//请求拦截器
Axios.interceptors.request.use(config => {
    //若存在这样的token，则从本地存储取出
    if (localStorage.token) {
        config.headers.Authorization = localStorage.getItem("token")
    }

    if (localStorage.intranetURL) {
        config.url = localStorage.getItem("intranetURL") + config.url
    } else {
        config.url = baseURL + config.url
    }
    console.log(config.url)

    return config
}, error => {
    return Promise.reject(error)
});

//响应拦截器
Axios.interceptors.response.use(res => {
    if (res.headers.Authorization) {
        localStorage.setItem("token", res.headers.Authorization);
    }

    if (res.data.state !== 'SUCCESS') {
        //送入失败流程处理
        console.log("业务失败")
        return Promise.reject(res)
    }
    return res
}, error => {

    if (error.message.includes('timeout') && localStorage.intranetURL) { // 判断是否是用户已经离开校园网导致的超时问题
        console.log("无法接入内部网络服务器:", error);
        let config = error.config;
        config.url = config.url.replace(localStorage.getItem("intranetURL"), '');
        localStorage.removeItem("intranetURL");
        return Axios.request(config);
    }

    if (error.response == null) { // 不是响应问题，直接过
        console.log(error);
        return Promise.reject(error)
    }

    if (error.response.status === 401 || error.response.status === 403) {
        // 401表明用户登录状态已经丢失，需跳转至登录页面重新登录获取 token
        router.push('/login');
    }
    return Promise.reject(error.response)
});

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$Axios', {
            value: Axios
        })
    }
}