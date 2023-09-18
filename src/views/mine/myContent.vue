<style lang="less" scoped>
@import '~@/vant-variables.less';
.page {
  background-color: @gray-1;
}
.pullRefresh {
  margin-bottom: 40px;
}
.myUpload {
  margin: 10px 10px 0px 10px;
  &__fileBox {
    padding: 10px;
  }
}
</style>
<style lang="less" scoped>
/deep/ .v-data-table > .v-data-table__wrapper > table {
  width: 550px !important;
}
/deep/ .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 12px;
}
/deep/ .van-tabs__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <div class="page">
    <van-nav-bar ref="toolbar" title="我的内容" left-text="返回" left-arrow @click-left="back" fixed placeholder></van-nav-bar>
    <van-tabs sticky class="full" :offset-top="tabsOffset">
      <van-tab title="文档" name="0" class="full">
        <van-pull-refresh class="pullRefresh full" v-model="content.fileList.refreshing" @refresh="getMyFileList(true)">
          <van-list v-model="content.fileList.loading" :finished="content.fileList.finished" @load="getMyFileList()" class="full">
            <div v-for="fileInfo in myFileList" :key="fileInfo.fileID">
              <v-card class="myUpload" outlined>
                <v-fileBox class="myUpload__fileBox" :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
                  :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
                  :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
                  :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames"></v-fileBox>
                <v-card-actions>
                  <v-btn fab dark x-small color="primary" @click="changeFileInfo(fileInfo.fileID)">
                    <v-icon>mdi-note-edit</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="primary">
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="warning">
                    <v-icon>mdi-file-cancel</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="fileInfo.show = !fileInfo.show;$forceUpdate();">
                    <v-icon>{{ fileInfo.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="fileInfo.show">
                    <v-divider></v-divider>
                    <v-simple-table dense style="width:500px">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">下载量</th>
                            <th class="text-left">点赞量</th>
                            <th class="text-left">收藏量</th>
                            <th class="text-left">评论量</th>
                            <th class="text-left">精品</th>
                            <th class="text-left">上传时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="">{{fileInfo.fileExtraEntity.downloadNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.likeNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.collectionNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.commentNum}}次</td>
                            <td>
                              <v-icon :color="fileInfo.fileExtraEntity.isProCert==0?'warning':'success'" size="16">
                                mdi-circle
                              </v-icon>
                            </td>
                            <td>{{fileInfo.uploadDate}}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </v-expand-transition>
              </v-card>
            </div>
            <template #finished>
              <!--若无文件则显示空提示-->
              <van-empty description="您还没有已经发布的文档呢" v-if="myFileList.length==0">
                <template slot="image">
                  <img src="@/images/empty-picture/no_record.svg" />
                </template>
                <template>
                  <v-btn color="primary" small class="mr-2" to="/uploadFile">上传更多文档
                    <v-icon right dark>mdi-file-upload</v-icon>
                  </v-btn>
                  <v-btn color="primary" small>查看草稿箱文档
                    <v-icon right dark>mdi-seal-variant</v-icon>
                  </v-btn>
                </template>
              </van-empty>
              <div v-else class="notice-nomore__text">没有更多已经发布的文档了</div>
              <v-btn color="primary" small class="mr-2" to="/uploadFile">上传更多文档
                <v-icon right dark>mdi-file-upload</v-icon>
              </v-btn>
              <v-btn color="primary" small>查看草稿箱文档
                <v-icon right dark>mdi-seal-variant</v-icon>
              </v-btn>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="专栏" name="1">
        <van-empty description="程序猿们正在努力开发中">
          <template slot="image">
            <img src="@/images/empty-picture/no_internet.svg" />
          </template>
          <v-btn color="primary" small class="mr-2" to="/about">加入我们
            <v-icon right dark>mdi-account-cog</v-icon>
          </v-btn>
        </van-empty>
      </van-tab>
      <van-tab title="帮帮帖" name="2">
        <van-empty description="程序猿们正在努力开发中">
          <template slot="image">
            <img src="@/images/empty-picture/no_internet.svg" />
          </template>
          <v-btn color="primary" small class="mr-2" to="/about">加入我们
            <v-icon right dark>mdi-account-cog</v-icon>
          </v-btn>
        </van-empty>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import fileBox from '../../components/fileBox';

export default {
  components: {
    'v-fileBox': fileBox,
  },
  data() {
    return {
      tabsOffset: 0,
      myFileList: [],
      content: {
        fileList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        folderList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        noteList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
      },
    };
  },
  mounted() {
    this.tabsOffset = this.$refs['toolbar'].height;
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getMyFileList(isRefreshing = false) {
      if (isRefreshing) {
        this.content.fileList.pageNum = 1;
        this.content.fileList.finished = false;
      }
      this.$Axios({
        method: 'get',
        url: '/docInfoService/getMyFileList',
        params: {
          isFolder: false,
          pageNum: this.content.fileList.pageNum,
          pageSize: 4,
        },
      }).then((response) => {
        if (!isRefreshing) {
          this.myFileList.push(...response.data.msg.list);
        } else {
          this.myFileList = response.data.msg.list;
        }
        this.myFileList.map((data) => {
          data.show = false;
        });
        if (response.data.msg.isLastPage) {
          this.content.fileList.finished = true;
        } else {
          this.content.fileList.pageNum += 1;
        }
        this.content.fileList.loading = false;
        this.content.fileList.refreshing = false;
      });
    },
    changeFileInfo(fileID) {
      this.$router.push({
        path: '/uploadInfo',
        query: {
          fileID: fileID,
        },
      });
    },
  },
};
</script>

<style scoped>
</style>