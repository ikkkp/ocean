<template>
    <van-empty image="error" :description="state + '-' + msg">
        <p style="font-size:18px;text-align: center;" v-html="describe"></p>
        <p style="margin-top: 10px;font-size:16px;text-align: center;">如有疑问请联系网站管理员</p>
    </van-empty>
    <!-- <Layout class="layout" style="background-color:#f5f7f9;justify-content: center;align-items: flex-end;position: absolute;top:0px;bottom: 0px;left: 0px;right: 0px;">
        <Card style="margin-right: 10%;padding:20px;text-align: right">
            <div slot="title">
                <img src="../images/notice-icon/error.svg" width="100"/>
                <h1>{{state}} - {{msg}}</h1>
            </div>
            <h3 v-html="describe"></h3>
            <p style="margin-top: 10px;">如有疑问请联系网站管理员</p>
        </Card>
    </Layout> -->
</template>

<script>
    import asyncRouters from "../router/asyncRouter";

    export default {
        data(){
            return{
                state:"404",
                msg:"Not Found",
                describe:"您访问的页面"+this.$route.query.url+"不存在",
                url:this.$route.query.url
            }
        },
        mounted() {
            for(let index in asyncRouters) {
                if(asyncRouters[index].path===this.url){
                    this.state="403";
                    this.msg="Forbidden";
                    let userInfo="未登录用户";
                    if(sessionStorage.getItem("userID")!=null&&sessionStorage.getItem("username")!=null){
                        userInfo="登录用户 [ 用户名："+sessionStorage.getItem("username")+" ]<br/>";
                    }
                    this.describe=userInfo+"无权访问此页面";
                }
            }
        }
    }
</script>

<style scoped>

</style>