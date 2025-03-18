<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]">
      <view class="list">
        <view class="item my-15 flex flex-between pa-30" @click="openLink('teams/detail/detail?id='+item.id)" v-for="(item, index) in teamList" :key="index">
          <view class="logo round-3">
            <tm-avatar :size="200" :img="getBaseUrl() + item.logo_path"></tm-avatar>
            <view class="is_identification" v-if="item.is_identification">已认证</view>
          </view>
          <view class="flex-1 ml-30 right">
            <view class="top">
              <view class="name text-overflow-1">{{ item.name }}</view>
              <view class="tips mt-15 text-overflow-2">{{ item.content }}</view>
            </view>
            <view class="flex flex-between">
              <view class="tips">
                <text>活动数量:</text>
                <text class="mx-10 num">{{item.activity_count}}</text>
                <text>场</text>
              </view>
              <view>
                <view class="btn" @click.stop="openLink('teams/manage/manage?id='+item.id)">管理</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="load-more mt-15" v-if="teamList.length">
        <tm-divider align="center" :label="hasMore && loading?'加载中...':hasMore?'上拉加载更多～':'没有更多啦～'"></tm-divider>
      </view>
      <view class="mt-50 pt-50" v-else>
        <tm-result :showBtn="false" title="暂无数据～" subTitle=" " v-if="!teamList.length && !loading"></tm-result>
      </view>
      <view class="gap"></view>
      <!--  -->
      <view class="footer">
        <view class="btn" @click="goCreateTeam">创建球队</view>
      </view>
    </tm-sheet>
  </tm-app>
</template>

<script setup lang="ts">
import { openLink, debugLog } from '@/common/tools';
import { ref, reactive, onMounted } from 'vue';
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { getBaseUrl } from '@/common/env';

const userStore = useUserStore();

const teamList = ref<any>([]);
const hasMore = ref(true);
const loading = ref(false);
const param = reactive<any>({
  keyword: '',
  limit: 10,
  offset: 0
})

function getList(is_more = false){
  loading.value = true;

  // 如果不是加载更多，重置偏移量
  if (!is_more) {
    param.offset = 0;
  }

  uni.request({
    url: "/ballkeeper/get_team_list/",
    method: 'GET',
    data: {
      username: String(userStore.userInfo.username),
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
        hasMore.value = true;
      }

      if (is_more) {
        teamList.value = teamList.value.concat(res.data.team_list);
      } else {
        teamList.value = res.data.team_list;
      }

      loading.value = false;

      // 停止下拉刷新状态
      uni.stopPullDownRefresh();
    },
    fail: () => {
      uni.$tm.u.toast('获取球队列表失败,请重试');
      loading.value = false;
      uni.stopPullDownRefresh();
    }
  });
}

// 初始加载
onMounted(() => {
  getList();
});

function goCreateTeam() {
  debugLog('userStore.userInfo: ', userStore.userInfo);
  if (userStore.userInfo.team_id) {
    uni.$tm.u.toast('用户只能创建1支球队');
    return;
  }
  openLink('teams/create/create');
}

// 修复触底加载逻辑
onReachBottom(() => {
  console.log('触底加载更多');
  if (hasMore.value && !loading.value) {
    getList(true);
  }
});

// 添加下拉刷新
onPullDownRefresh(() => {
  console.log('下拉刷新');
  hasMore.value = true;
  getList(false);
});
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .logo{
    position: relative;
    overflow: hidden;
    .is_identification{
      position: absolute;
      background-color: #0bbb08;
      color: #ffffff;
      font-size: 24rpx;
      top: 0rpx;
      padding: 5rpx 10rpx;
      left: 0rpx;
      border-bottom-right-radius: 15rpx;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 220rpx);
    .name{
      font-size: 30rpx;
      color: #333333;
    }
  }
  .num {
    color: #3c8af8;
    font-size: 35rpx;
  }
  .btn {
    background-color: #ffffff;
    border: 1px solid #6ca9ff;
    border-radius: 5px;
    padding: 3px 8px;
    font-size: 26rpx;
    color: #3c8af8;
  }
}

// 增加底部空间，避免内容被底部栏遮挡
.gap {
  height: 180rpx;  // 增加高度
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30rpx 80rpx;
  background: #fff;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  z-index: 999;  // 确保在最上层

  .btn {
    width: 100%;
    background: #3c8af8;
    border-radius: 50rpx;
    padding: 15rpx 0;
    text-align: center;
    color: #ffffff;
  }
}

.load-more{
  padding: 0 25vw;
  height: 80rpx;  // 确保加载提示有足够高度
}
</style>
