<template>
  <view class="flex-row-center-between py-20 px-30 mt-20" :style="{ backgroundColor: '#3c8af8' }">
    <view class="text-white">我参与的联赛</view>
    <view>
      <tm-icon name="tmicon-angle-right" color="#ffffff"></tm-icon>
    </view>
  </view>

  <view class="list bg-white">
    <view class="item flex-row-center-between pa-30" v-for="(item, index) in leagueList" :key="index" @click="openLink('leagues/manage/manage?id=' + item.id)">
      <view class="pl-20 flex flex-1 flex-col flex-between" style="height: 200rpx">
        <view>
          <view class="title text-overflow-2">{{ item.name }}</view>
          <view class="address mt-20 flex-col-top-center">
            <tm-icon name="tmicon-position" color="#999999" :font-size="24"></tm-icon>
            <text class="ml-8 text-overflow-1">{{ item.address }}</text>
          </view>
          <text class="ml-8 text-overflow-1">{{ item.content }}</text>
        </view>
        <view class="time flex flex-between">
          <view class="flex-col-top-center">
            <tm-icon name="tmicon-time-fill" color="#999999"></tm-icon>
            <!-- <text class="tips">{{ timeText(item.start_date) }}</text> -->
          </view>
        </view>
      </view>
    </view>
  </view>


  <view class="flex-row-center-between py-20 px-30 mt-20" :style="{ backgroundColor: '#3c8af8' }">
    <view class="text-white">其他联赛</view>
    <view>
      <tm-icon name="tmicon-angle-right" color="#ffffff"></tm-icon>
    </view>
  </view>
  <view class="footer">
    <view class="btn" @click="openLink('leagues/create/create')">创建联赛</view>
  </view>
</template>

<script lang="ts" setup>
import { openLink, debugLog } from '@/common/tools';
import { useUserStore } from '@/stores/user';
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const leagueList = ref<any>([]);
const userStore = useUserStore();

const param = reactive({
  offset: 0,
  limit: 10,
});

const hasMore = ref(true);
const loading = ref(false);

function getLeagueList(is_more = false) {
  loading.value = true;

  // 如果不是加载更多，重置 offset
  if (!is_more) {
    param.offset = 0;
  }

  uni.request({
    url: "/ballkeeper/get_my_leagues/",
    method: 'GET',
    data: {
      username: userStore.userInfo.username,
      limit: param.limit,
      offset: param.offset
    },
    success: (res: any) => {
      debugLog("get_league_list res: ", res);
      if (res.statusCode !== 200) {
        uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取球队列表失败');
        return;
      }

      if (res.data.leagues.length < param.limit || res.data.leagues.length === 0) {
        hasMore.value = false;
      } else {
        // 更新 offset 用于下次加载
        param.offset += param.limit;
      }

      if (is_more) {
        leagueList.value = leagueList.value.concat(res.data.leagues);
      } else {
        leagueList.value = res.data.leagues;
      }

      loading.value = false;
    },
    fail: () => {
      uni.$tm.u.toast('获取球队列表失败,请重试');
      loading.value = false;  // 确保失败时也重置加载状态
    }
  });
}

onLoad(() => {
  getLeagueList();
});
</script>

<style lang="scss" scoped>
.list {
	.item {
    border-bottom: 4rpx solid rgb(230, 230, 230);
	}
}

.address {
	font-size: 26rpx;
}

.footer {
  position: fixed;
  bottom: 130rpx;
  left: 0;
  width: 100%;
  padding: 30rpx 80rpx;
  background: #fff;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  z-index: 0;  // 确保在最下层
 
  .btn {
    width: 100%;
    background: #3c8af8;
    border-radius: 50rpx;
    padding: 15rpx 0;
    text-align: center;
    color: #ffffff;
  }
}
</style>
