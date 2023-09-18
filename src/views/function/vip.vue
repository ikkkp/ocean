<template>
    <div>
        <van-nav-bar id="toolbar" title="VIP申请" left-text="返回" left-arrow @click-left="back">
        </van-nav-bar>
        <div style="display: flex;flex-direction: column">
            <img id="title" src="../../images/main-picture/background_vip.png" style="width: 100%" @load="changeIframe"/>
            <iframe id="iframe" src='https://www.wjx.top/jq/82526447,i,t.aspx?width=760&source=iframe'
                    width="100%" frameborder='0' style='overflow:auto'></iframe>
        </div>
    </div>
</template>

<script>
    export default {
        name: "about",
        mounted() {
        },
        methods: {
            changeIframe() {
                const iframe = document.getElementById('iframe');
                const deviceHeight = document.documentElement.clientHeight;
                const topHeight = document.getElementById('title').offsetHeight + document.getElementById('toolbar').offsetHeight;
                iframe.style.height = (deviceHeight - topHeight) + 'px'; //数字是页面布局高度差
            },
            back() {
                this.$router.go(-1);//返回上一层
            },
        }
    }
</script>

<style scoped>

</style>