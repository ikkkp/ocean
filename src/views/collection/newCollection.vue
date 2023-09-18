<style lang="less" scoped>
@import '~@/vant-variables.less';
.newcollection {
  display: flex;
  flex-direction: column;
  margin: 20px;
  &__input {
    margin-bottom: 15px !important;
    margin-top: 0px !important;
    &__label {
      font-size: 14px;
    }
  }
}
</style>
<template>
  <div>
    <van-nav-bar id="toolbar" :title="moduleTitle" left-text="返回" left-arrow @click-left="back">
      <template #right>
        <van-icon name="more-o" size="18" @click="$refs['moreModel'].open()" v-if="$route.query.isChange" />
      </template>
    </van-nav-bar>
    <div class="newcollection">
      <v-text-field class="newcollection__input small" v-model="collectionName" placeholder="请填写合适的名称" :rules="[titleRule.required]" outlined dense hide-details="auto">
      </v-text-field>
      <v-textarea class="newcollection__input " v-model="collectionDesc" placeholder="收藏夹描述(可选)" outlined dense hide-details></v-textarea>
      <v-switch class="newcollection__input" v-model="isPublic" hide-details>
        <template slot="label">
          <div class="newcollection__input__label">设为公开</div>
        </template>
      </v-switch>
      <v-alert border="right" colored-border type="info" elevation="2">
        收藏夹一旦设置为公开，<span style="color: var(--v-primary-base)">将无法更改为私密</span>。公开的收藏夹在站内可以流通，其他人可以看到你的收藏夹。
      </v-alert>

      <v-btn color="primary" @click="addOrChangeCollection">
        保存
      </v-btn>

      <v-more ref="moreModel">
        <v-moreItem title="删除收藏夹" icon="mdi-delete" @click="deleteCollection"></v-moreItem>
      </v-more>

    </div>
  </div>
</template>

<script>
import moreItem from '@/components/more/moreItem';
import more from '@/components/more/more';
import { Notify } from 'vant';
import qs from 'qs';

export default {
  components: {
    'v-more': more,
    'v-moreItem': moreItem,
  },
  data() {
    return {
      moduleTitle: this.$route.query.isChange ? '修改信息' : '新建收藏夹',
      collectionID: this.$route.query.isChange ? this.$route.query.collectionID : null,
      collectionName: this.$route.query.isChange ? this.$route.query.collectionName : null,
      collectionDesc: this.$route.query.isChange ? (this.$route.query.collectionDesc != null ? this.$route.query.collectionDesc : '') : '',
      isPublic: this.$route.query.isChange ? this.$route.query.isPublic : true,
      titleRule: {
        required: (value) => value == null || (value != null && value != '') || '收藏夹名称不可为空',
      },
    };
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    addOrChangeCollection() {
      if (this.$route.query.isChange) {
        this.changeCollection();
      } else {
        this.addCollection();
      }
    },
    addCollection() {
      this.$Axios({
        method: 'post',
        url: '/docCollectionService/addCollection',
        data: qs.stringify({
          newName: this.collectionName,
          isPublic: this.isPublic,
          desc: this.collectionDesc,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          if (response.data.code == 1) {
            Notify({ type: 'success', message: '创建成功' });
            this.$router.go(-1);
          }
        })
        .catch((response) => {
          if (response.data.code == -2) {
            Notify({ type: 'danger', message: '不能建立名称相同的收藏夹' });
          }
        });
    },
    changeCollection() {
      this.$Axios({
        method: 'post',
        url: '/docCollectionService/changeCollectionInfo',
        data: qs.stringify({
          collectionID: this.collectionID,
          newName: this.collectionName,
          isPublic: this.isPublic,
          desc: this.collectionDesc,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          if (response.data.code == 1) {
            Notify({ type: 'success', message: '修改成功' });
            this.$router.replace('/myCollectionList');
          }
        })
        .catch((response) => {
          if (response.data.code == -2) {
            Notify({ type: 'danger', message: '存在重名的收藏夹，请修改名字重试' });
          }
        });
    },
    deleteCollection() {
      this.$Axios({
        method: 'get',
        url: '/docCollectionService/deleteCollection',
        params: {
          collectionID: this.collectionID,
        },
      }).then((response) => {
        if (response.data.code == 1) {
          Notify({ type: 'success', message: '删除成功' });
          this.$router.replace('/myCollectionList');
        }
      });
    },
  },
};
</script>

<style scoped>
</style>