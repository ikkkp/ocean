<!-- 
 * @description: 使用vuex管理状态，将text2SpeechSheet状态统一放在store中管理
 * @fileName: aiChatSheet.vue 
 * @author: Huangzl 
 * @date: 2023-11-27 16:11:11
 * @version: V1.0.0 
!-->
<style lang="less" scoped>
.content {
    padding: 16px 16px 160px;

    &__textField {
        padding-left: 0px;
        &__textArea {
            padding-left: 0px;
        }
    }
}
</style>
<template>
    <van-action-sheet v-model="text2SpeechSheet" title="Ocean copilot">
        <div class="content">对话文本内容，占位</div>
        <template>
            <v-toolbar dark color="primary" class="content____textField">
                <v-autocomplete v-model="text" rounded class="content__textField__textArea" hide-no-data hide-details label="message copilot"
                    solo-inverted ></v-autocomplete>
                <v-btn icon>
                    <v-icon>mdi-waveform</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>mdi-send</v-icon>
                </v-btn>
            </v-toolbar>
        </template>
    </van-action-sheet>
</template>
<script>
export default {
    computed: {
        text2SpeechSheet: {
            get() {
                return this.$store.state.text2SpeechSheet;
            },
            set(value) {
                this.$store.commit('setText2SpeechSheet', value);
            }
        }
    },
    data() {
        return {
            text: "",
        }
    },
}
</script>
