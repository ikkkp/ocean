export default {
    pullUserNotifyList(self, successCallback = () => {}) {
        let userNotifyList = JSON.parse(localStorage.getItem("userNotifyList"));
        if (userNotifyList == null) {
            userNotifyList = {
                likeList: [],
                downloadAndScoreList: [],
                commentList: [],
                invitationList: [],
            }
        }
        let lastPullDate = localStorage.getItem("notifyLastPullDate");
        self.$Axios({
            method: 'get',
            url: '/notify/getLatestNotifications',
            params: {
                lastPullDate: lastPullDate,
            },
        }).then((response) => {
            let notifyList = response.data.msg;
            notifyList.forEach(element => {
                switch (element.notifyEntity.action) {
                    case "LIKE":
                    case "LIKE_COMMENT":
                        userNotifyList.likeList.push(element.notifyEntity);
                        break;
                    case "DOWNLOAD":
                    case "SCORED":
                        userNotifyList.downloadAndScoreList.push(element.notifyEntity);
                        break;
                    case "NEW_COMMENT":
                    case "NEW_REPLY":
                        userNotifyList.commentList.push(element.notifyEntity);
                        break;
                    case "INVITATION":
                        userNotifyList.invitationList.push(element.notifyEntity);
                        break;
                    default:
                        break;
                }
            });
            localStorage.setItem("userNotifyList", JSON.stringify(userNotifyList));
            localStorage.setItem("notifyLastPullDate", new Date().toLocaleString());
            successCallback();
        }).catch((e) => {
            console.log(e)
        });
    },
    getUserNotifyList() {
        return JSON.parse(localStorage.getItem("userNotifyList"));
    }
}