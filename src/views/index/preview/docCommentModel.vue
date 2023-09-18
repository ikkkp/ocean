<style scoped lang="less">
.commentBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  &__title {
    margin: 20px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
<template>
  <van-popup :style="{'height':viewareaHeight}" v-model="commentModel" round position="bottom" closeable>
    <div class="commentBox">
      <div class="commentBox__title">全部评论</div>

      <v-commentList :viewareaHeight="viewareaHeight" :bindID="String(fileInfo.fileID)" mainType="DOCUMENT" :isIndex="false" @needLoginNotice="$emit('needLoginNotice')"
        style="flex:1;overflow:auto;width: 100%;" v-if="commentModel">
      </v-commentList>

    </div>
  </van-popup>
</template>

<script>
import commentList from '@/components/comment/commentList';
export default {
  name: 'app',
  components: {
    'v-commentList': commentList,
  },
  props: {
    fileInfo: Object,
  },
  data() {
    return {
      commentModel: false,
      viewareaHeight: '20px',
    };
  },
  mounted() {},
  methods: {
    open(viewareaHeight) {
      this.commentModel = true;
      this.viewareaHeight = viewareaHeight;
    },
  },
};
</script>

<style>
</style>