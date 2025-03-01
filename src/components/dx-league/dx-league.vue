<template>
  <view class="flex-row-center-between py-20 px-30 mt-20" :style="{ backgroundColor: '#3c8af8' }">
    <view class="text-white">我参与的联赛</view>
    <view>
      <tm-icon name="tmicon-angle-right" color="#ffffff"></tm-icon>
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
import { openLink } from '@/common/tools';

function getLeagueList(is_more = false) {
  loading.value = true;

  // 如果不是加载更多，重置 offset
  if (!is_more) {
    param.offset = 0;
  }

  uni.request({
    url: "/ballkeeper/get_team_list/",
    method: 'POST',
    data: {
      username: userStore.userInfo.username,
      keyword: param.keyword,
      limit: param.limit,
      offset: param.offset
    },
    success: (res: any) => {
      debugLog("get_team_list res: ", res);
      if (res.statusCode !== 200) {
        uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取球队列表失败');
        return;
      }

      if (res.data.team_list.length < param.limit || res.data.team_list.length === 0) {
        hasMore.value = false;
      } else {
        // 更新 offset 用于下次加载
        param.offset += param.limit;
      }

      if (is_more) {
        teamList.value = teamList.value.concat(res.data.team_list);
      } else {
        teamList.value = res.data.team_list;
      }

      loading.value = false;
    },
    fail: () => {
      uni.$tm.u.toast('获取球队列表失败,请重试');
      loading.value = false;  // 确保失败时也重置加载状态
    }
  });
}


</script>

<style lang="scss" scoped>
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
