const constantRouterMap = [{
        path: '/login',
        meta: {
            title: '用户登录'
        },
        component: (resolve) => require(['../views/login.vue'], resolve)
    },
    {
        path: '/reg',
        meta: {
            title: '用户注册'
        },
        component: (resolve) => require(['../views/reg.vue'], resolve)
    },
    {
        path: '/',
        meta: {
            title: '主页',
        },
        component: (resolve) => require(['../views/index/index/index.vue'], resolve)
    },
    {
        path: '/index',
        meta: {
            title: '主页',
        },
        component: (resolve) => require(['../views/index/index/index.vue'], resolve)
    },
    {
        path: '/wall',
        meta: {
            title: '互助墙',
        },
        component: (resolve) => require(['../views/wall/index/index.vue'], resolve)
    },
    {
        path: '/preview',
        meta: {
            title: '预览',
        },
        component: (resolve) => require(['../views/index/preview/preview.vue'], resolve)
    },
    {
        path: '/about',
        meta: {
            title: '关于',
        },
        component: (resolve) => require(['../views/function/about.vue'], resolve)
    }, {
        path: '/result',
        meta: {
            title: '结果',
        },
        component: (resolve) => require(['../views/function/result.vue'], resolve)
    }, {
        path: '/vip',
        meta: {
            title: 'VIP申请',
        },
        component: (resolve) => require(['../views/function/vip.vue'], resolve)
    },
    {
        path: '/freePrint',
        meta: {
            title: '免费打印',
        },
        component: (resolve) => require(['../views/function/freePrint.vue'], resolve)
    }, 
    {
        path: '/statement/uploadFileStatement',
        meta: {
            title: '文件上传须知',
        },
        component: (resolve) => require(['../views/statement/uploadFileStatement.vue'], resolve)
    }
];
export default constantRouterMap;