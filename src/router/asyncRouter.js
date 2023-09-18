const asyncRouterMap = [{
        path: '/newCollection',
        meta: {
            title: '新建收藏夹',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/collection/newCollection.vue'], resolve)
    },
    {
        path: '/mine',
        meta: {
            title: '我的',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/mine/mine.vue'], resolve)
    },
    {
        path: '/uploadFile',
        meta: {
            title: '文件上传 - 选择文件',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/upload/uploadFile.vue'], resolve)
    },
    {
        path: '/uploadInfo',
        meta: {
            title: '文件上传 - 补全信息',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/upload/uploadInfo.vue'], resolve)
    },
    {
        path: '/myCollectionList',
        meta: {
            title: '我的收藏',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/collection/myCollectionList.vue'], resolve)
    },
    {
        path: '/myCollectionItem',
        meta: {
            title: '我的收藏',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/collection/myCollectionItem.vue'], resolve)
    },
    {
        path: '/myUpload',
        meta: {
            title: '我的贡献',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/mine/myContent.vue'], resolve)
    },
    {
        path: '/indexResult',
        meta: {
            title: '索引结果',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/index/search/indexResult.vue'], resolve)
    },
    {
        path: '/search',
        meta: {
            title: '搜索结果',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/index/search/search.vue'], resolve)
    },
    {
        path: '/myRecentlyReadList',
        meta: {
            title: '最近浏览',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/mine/myRecentlyReadList.vue'], resolve)
    },
    {
        path: '/myDownloadList',
        meta: {
            title: '最近下载',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/mine/myDownloadList.vue'], resolve)
    },
    {
        path: '/walletChangeRecordList',
        meta: {
            title: '钱包变动',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/mine/walletChangeRecordList.vue'], resolve)
    },
    {
        path: '/notify',
        meta: {
            title: '消息',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/notify/notify.vue'], resolve)
    },
    {
        path: '/notifyLikeList',
        meta: {
            title: '赞同',
            permission: ["user", "admin"]
        },
        component: (resolve) => require(['../views/notify/notifyLikeList.vue'], resolve)
    },
];
export default asyncRouterMap;