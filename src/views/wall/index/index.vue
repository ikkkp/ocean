<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>
<style scoped lang="less">
@import "~@/vant-variables.less";
.wall {
  background-color: @gray-1;
  height: 100%;
  &__title {
    padding: 20px;
    font-size: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__search {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 10px;
    &__box {
      padding: 0px 20px;
    }
  }

  &__card {
    margin: 0px 20px 10px 20px;
    &__title {
      margin: 10px;
    }
    &__type {
      font-size: 16px;
    }
    &__content {
      font-size: 14px;
      padding: 0px 20px;
      word-break: break-all;
      word-wrap: break-word;
      line-break: anywhere;
    }
    &__action {
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      &__avater {
        margin-right: 10px;
      }
    }
  }

  &__bottom {
    margin-bottom: 60px;
  }
}
</style>
<template>
  <div class="wall full">
    <div class="wall__title">互助集市
      <v-icon color="var(--v-primary-base)">mdi-sticker</v-icon>
      <van-tag type="primary" size="medium" class="ml-2">内测</van-tag>
    </div>
    <div class="wall__search__box">
      <van-sticky :offset-top="0">
        <div class="wall__search">
          <v-toolbar dark color="var(--v-primary-base)">
            <v-text-field hide-details prepend-icon="mdi-magnify" single-line></v-text-field>
            <v-btn icon>
              <v-icon>mdi-filter</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </van-sticky>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="getNote(true)" class="full">
      <van-list v-model="loading" :finished="finished" @load="getNote()" :immediate-check="false">

        <div v-for="(item,index) in noteList" :key="index">
          <v-card class="wall__card" v-if="item.isAD" dark max-width="400">
            <v-parallax height="150" src="@/images/ad-2.png"></v-parallax>
          </v-card>
          <v-card class="wall__card" :color="item.cardColor" dark v-else>
            <v-card-title>
              <v-icon left>
                {{item.typeIcon}}
              </v-icon>
              <span class="wall__card__type">{{item.typeName}}</span>
            </v-card-title>

            <v-card-text class="wall__card__content">
              {{item.content}}
            </v-card-text>

            <div class="wall__card__action">
              <div>
                <v-username class="wall__card__action__avater" type="avater" :avatarSize="28" :username="item.buildUsername" v-if="item.isAnon==0"></v-username>
                <v-avatar class="wall__card__action__avater" color="grey darken-3" size="28" v-else>
                  <v-img src="https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Round&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Serious&skinColor=Light" alt="Avatar" />
                </v-avatar>
                <span v-if="item.isAnon==1">匿名纸条</span>
                <v-username type="username" :username="item.buildUsername" v-else></v-username>
              </div>

              <div>
                <v-icon class="mr-1" size="22">
                  mdi-comment-eye
                </v-icon>
                <span class="text-caption mr-2">{{item.readNum}}</span>
                <span class="mr-1">·</span>
                <v-icon class="mr-1" size="22">
                  mdi-comment
                </v-icon>
                <span class="text-caption">{{item.commentNum}}</span>
              </div>
            </div>
          </v-card>
        </div>
        <template #finished>
          <van-empty description="墙上暂时还没有相关的纸条" v-if="noteList.length==0">
            <template slot="image">
              <img src="@/images/empty-picture/no_record.svg" />
            </template>
          </van-empty>
          <div v-else class="notice-nomore__text wall__bottom">没有更多的纸条了</div>
        </template>
      </van-list>
    </van-pull-refresh>


    <div style="position: fixed;bottom: 0;left: 0;right: 0;">
      <v-bottom-navigation shift color="primary" grow class="index__bottom__navigation" v-model="navigation" fixed placeholder>
        <v-btn link to="/index">
          <span>文库</span>
          <v-icon>mdi-text-box-search</v-icon>
        </v-btn>
        <v-btn link to="/wall">
          <span>互助</span>
          <v-icon>mdi-handshake</v-icon>
        </v-btn>
        <v-btn link to="/mine">
          <span>我的</span>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>
    <!-- <div style="position: fixed;bottom: 60px;right: 10px;">
      <v-speed-dial v-model="fab" bottom right direction="top" transition="slide-y-reverse-transition">
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-fountain-pen-tip
            </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="red">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab dark small color="green">
          <v-icon>mdi-account-details</v-icon>
        </v-btn>
      </v-speed-dial>
    </div> -->
  </div>
</template>

<script>
import Username from "@/components/common/username/username";
export default {
  components: {
    "v-username": Username,
  },
  data() {
    return {
      fab: false,
      navigation: 1,
      noteTypeList: [],
      noteList: [],
      selectedTypeID: null,
      loading: false,
      refreshing: false,
      finished: false,
      pageNum: 1,
    };
  },
  mounted() {
    this.$Axios({
      method: "get",
      url: "/noteService/getAllNoteType",
    }).then((response) => {
      this.noteTypeList = response.data.msg;
      console.log(this.noteTypeList);
      this.getNote();
    });
  },
  methods: {
    getNote(refresh = false) {
      if (refresh) {
        this.pageNum = 1;
      }
      this.$Axios({
        method: "get",
        url: "/noteService/getNoteByNoteType",
        params: {
          pageNum: this.pageNum,
          pageSize: 5,
          typeID: this.selectedTypeID,
        },
      }).then((response) => {
        let newNoteList = response.data.msg.list;

        newNoteList = newNoteList.map((note) => {
          this.noteTypeList.forEach((noteType) => {
            if (noteType.typeID == note.noteType) {
              note.typeName = noteType.typeName;
              note.typeIcon = noteType.typeIcon;
              note.cardColor = noteType.cardColor;
            }
          });
          note.isAD = false;
          return note;
        });

        this.pageNum += 1;
        if (refresh) {
          this.noteList = newNoteList;
        } else {
          this.noteList.push(...newNoteList);
        }
        if (!response.data.msg.hasNextPage) {
          this.finished = true;
        }else{
          this.finished = false;
        }
        this.loading = false;
        this.refreshing = false;
      });
    },
  },
};
</script>

<style scoped>
</style>