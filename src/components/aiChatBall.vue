<!-- 
 * @description: 
 * @fileName: aiChatBall.vue 
 * @author: Huangzl 
 * @date: 2023-11-26 12:27:41
 * @version: V1.0.0 
!-->

<!-- 可拖拽的小球 封装 -->
<template>
    <div ref="floatButton" class="backHome" @click="goCreatePage()" :style="{
        width: itemWidth + 'px',
        height: itemHeight + 'px',
        left: left + 'px',
        top: top + 'px',
    }">
        <v-btn v-model="fab" class="ma-2" mid fab color="primary">
            <v-img src="../images/main-picture/great_blue_whale.svg" style="width: 20px;"></v-img>
        </v-btn>
    </div>
</template>
 
<script>
export default {
    name: 'aiChatBall',
    props: {
        itemWidth: {
            // 悬浮按钮宽度
            type: Number,
            default: 64,
        },
        itemHeight: {
            // 悬浮按钮高度
            type: Number,
            default: 64,
        },
        gapWidth: {
            // 距离左右两边距离
            type: Number,
            default: 10,
        },
        coefficientHeight: {
            // 从上到下距离比例
            type: Number,
            default: 0.72,
        },
    },
    data() {
        return {
            fab: false,
            top: 0,
            left: 0,
            currentTop: 0,
            clientWidth: 0,
            clientHeight: 0,
            timer: null,
        };
    },
    created() {
        this.clientWidth = document.documentElement.clientWidth; // 手机宽度
        this.clientHeight = document.documentElement.clientHeight;
        this.left = this.clientWidth - this.itemWidth - this.gapWidth;
        this.top = this.clientHeight * this.coefficientHeight;
    },
    mounted() {
        this.$nextTick(() => {
            const floatButton = this.$refs.floatButton;
            floatButton.addEventListener('touchstart', (e) => {
                floatButton.style.transition = 'none';
                e.preventDefault(); // Disable scroll
            });
            // 在拖拽过程中，组件应该跟随手指的移动而移动
            floatButton.addEventListener('touchmove', (e) => {
                e.preventDefault(); // Disable scroll
                if (e.targetTouches.length === 1) {
                    // 获取手指的平面位置
                    let touch = e.targetTouches[0];
                    this.left = touch.clientX - 20;
                    this.top = touch.clientY - 25;

                }
            });
            // 拖拽结束后，重新调整组件的位置并重新设置过渡动画
            floatButton.addEventListener('touchend', () => {
                floatButton.style.transition = 'all 0.3s';
                if (this.left > document.documentElement.clientWidth / 2) {
                    this.left = this.clientWidth - this.itemWidth - this.gapWidth;
                } else {
                    this.left = 20;
                } if (this.top < 0) {
                    this.top = 0;
                } else if (this.top > this.clientHeight - this.itemHeight) {
                    this.top = this.clientHeight - this.itemHeight - 80;
                }
            });
        });
    },
    methods: {
        // 返回首页菜单
        goCreatePage() {
            console.log('返回首页');
        },
    },
};
</script>
 
<style lang="scss" scoped>
.backHome {
    position: fixed;
    z-index: 999;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>