import Vue from 'vue';


export const state = Vue.observable({
    userInfoArray: [],
})

export const action = {
    setUserInfoArray(newValue) {
        state.userInfoArray = newValue
    },
    clearUserInfoArray() {
        state.userInfoArray = []
    }
}