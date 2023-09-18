export default {
    updataFileUserBehavior(fileID, self, successCallback = null, errorCallback = null) {
        if (localStorage.getItem('token') == null) {
            return false;
        }
        self.$Axios({
            method: 'get',
            url: '/docFunctionService/getUserBehaviorByFileID',
            params: {
                fileID: fileID,
            },
        }).then((response) => {
            let userBehaviorList = response.data.msg;
            this.setUserBehaviorList("DOCUMENT", fileID, userBehaviorList);
            if (successCallback != null) {
                successCallback(userBehaviorList);
            }
        }).catch((e) => {
            if (errorCallback != null) {
                errorCallback(e);
            }
        });
    },

    setUserBehaviorList(type, bindID, userBehaviorList) {
        let name = this.getItemName(type, bindID);
        sessionStorage.setItem(name, JSON.stringify(userBehaviorList));
    },

    addFakeUserBehaviorToList(type, bindID, behaviorType, extraInfo) {
        let name = this.getItemName(type, bindID);
        let userBehaviorList = JSON.parse(sessionStorage.getItem(name));
        userBehaviorList.push({
            type: type,
            bindID: bindID,
            behaviorType: behaviorType,
            extraInfo: extraInfo,
            doUsername: null,
            id: null,
        })
        this.setUserBehaviorList(type, bindID, userBehaviorList)
    },

    deleteFakeUserBehaviorToList(type, bindID, behaviorType, extraInfo) {
        let name = this.getItemName(type, bindID);
        let userBehaviorList = JSON.parse(sessionStorage.getItem(name));
        this.setUserBehaviorList(type, bindID, userBehaviorList.filter((item) => {
            if (item.type != type || item.bindID != bindID || item.behaviorType != behaviorType ||
                JSON.stringify(item.extraInfo) != JSON.stringify(extraInfo)) {
                return true
            } else {
                return false
            }
        }))

    },

    getUserBehaviorList(type, bindID, self, isUpdate = false) {
        let name = this.getItemName(type, bindID);
        let userBehaviorList = JSON.parse(sessionStorage.getItem(name));
        return new Promise((resolve, reject) => {
            if (userBehaviorList != null && !isUpdate) {
                resolve(userBehaviorList);
                return;
            }
            switch (type) {
                case "DOCUMENT":
                    this.updataFileUserBehavior(bindID, self, resolve, reject);
                    break;
                default:
                    reject();
                    break;
            }
        });
    },
    clearUserBehaviorList(type, bindID) {
        let name = this.getItemName(type, bindID);
        sessionStorage.removeItem(name);
    },
    getItemName(type, bindID) {
        return "userBehavior_" + type + "_" + bindID
    }
}