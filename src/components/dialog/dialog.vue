<style scoped>
.button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
<template>
  <v-dialog v-model="showDialog" persistent max-width="290">
    <v-alert border="left" colored-border :color="color" elevation="2" style="margin-bottom:0px">
      <div class="text-h6 mt-2 mb-4 ml-2">
        <v-icon :color="color" class="mr-3">{{icon}}</v-icon>{{title}}
      </div>
      <div class="mb-6 ml-2" v-html="content"></div>
      <div class="button">
        <v-btn class="mr-1" ref="cancel" v-show="isConfirmDialog" text plain>
          {{cancelText}}
        </v-btn>
        <v-btn ref="confirm" :color="this.color" depressed dark>
          {{confirmText}}
        </v-btn>
      </div>
    </v-alert>
  </v-dialog>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      showDialog: false,
      title: null,
      content: null,
      confirmText: null,
      cancelText: null,
      isConfirmDialog: false,
      icon: null,
      color: null,
    };
  },
  methods: {
    newDialog(type, title, content, confirmText, cancelText) {
      switch (type) {
        case "error":
          this.icon = "mdi-alert-octagon";
          this.color = "var(--v-error-darken2)";
          this.isConfirmDialog = false;
          break;
        case "login":
          this.icon = "mdi-account-key";
          this.color = "var(--v-success-darken2)";
          this.isConfirmDialog = true;
          break;
        case "userInfoAsk":
          this.icon = "mdi-account-details";
          this.color = "var(--v-primary-darken2)";
          this.isConfirmDialog = true;
          break;
      }
      this.showDialog = true;
      this.title = title;
      this.content = content;
      this.confirmText = confirmText != null ? confirmText : "确认";
      this.cancelText = cancelText != null ? cancelText : "取消";
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          this.$refs["confirm"].$el.addEventListener("click", () => {
            this.showDialog = false;
            resolve();
          });
          this.$refs["cancel"].$el.addEventListener("click", () => {
            this.showDialog = false;
            reject();
          });
        });
      });
    },
  },
};
</script>