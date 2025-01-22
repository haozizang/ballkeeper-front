<template>
  <view class="py-20 bg-white">
    <tm-grid :width="750" :col="4">
      <tm-grid-item color="orange" :height="180" @click="openLink('/others/activity/activity')">
        <image class="icon" src="../../static/a3.png"></image>
        <tm-text :font-size="22" label="我的活动"></tm-text>
      </tm-grid-item>
      <tm-grid-item color="green" :height="180" @click="openLink('/teams/index/index')">
        <image class="icon" src="../../static/a4.png"></image>
        <tm-text :font-size="22" label="我的球队"></tm-text>
      </tm-grid-item>
      <tm-grid-item color="pink" :height="180" @click="openLink('/others/publish/publish')">
        <image class="icon" src="../../static/a1.png"></image>
        <tm-text :font-size="22" label="发布活动"></tm-text>
      </tm-grid-item>
      <tm-grid-item :height="180" @click="openLink('/others/follow/follow')">
        <image class="icon" src="../../static/a2.png"></image>
        <tm-text :font-size="22" label="我的关注"></tm-text>
      </tm-grid-item>
    </tm-grid>
  </view>
  
  
  <view class="list2 bg-white px-30 flex flex-between flex-wrap round-3">
    <view class="item pb-20 mb-30 round-3" v-for="(item, index) in newActivity" :key="index" @click="openLink('/others/activity/detail?id=' + item._id)">
      <image :src="item.cover" style="width: 100%; height: 250rpx"></image>
      <view class="px-20 pt-10">
        <view class="title text-overflow-2"> {{ item.title }} </view>
        <view class="flex align-center mt-15">
          <tm-icon name="tmicon-clock" color="#6d6868" :font-size="24"></tm-icon>
          <text class="tips ml-10">{{ timeText(item.start_date) }}</text>
        </view>
        <view class="flex align-center mt-8">
          <tm-icon name="tmicon-position" color="#6d6868" :font-size="24"></tm-icon>
          <text class="tips ml-10 text-overflow-1">{{ item.address }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { openLink,timeText } from '@/common/tools';
import { useAppStore } from '@/stores/app'
import { indexHome,followTeam } from '@/common/index'
const appStore = useAppStore();
const activity = ref<any>([]);
const newActivity = ref<any>([]);
const team = ref<any>([]);

function init() {
  indexHome().then(res => {
    if (res.code === 1000) {
      activity.value = res.data.activity;
      newActivity.value = res.data.newActivity;
      team.value = res.data.team;
    }
  })
}
init();
</script>

<style lang="scss" scoped>
.icon {
  width: 90rpx;
  height: 90rpx;
  margin-bottom: 20rpx;
}

.list {
  .item {
    &:not(:last-child) {
      border-bottom: 2rpx solid rgb(230, 230, 230);
    }
  }
}

.list2 {
  .item {
    width: calc((100vw - 90rpx) / 2);
    box-shadow: 0 0 10rpx rgb(230, 230, 230);
    overflow: hidden;
  }
}

.address {
  font-size: 26rpx;
}

.recommend {
  display: flex;
  padding-left: 30rpx;

  .item {
    position: relative;
    box-shadow: 0 0 10rpx rgb(230, 230, 230);

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 420rpx;
    }

    .num {
      color: #3c8af8;
      font-size: 35rpx;
    }

    .btn {
      border: 1px solid #999999;
      color: #999999;
      border-radius: 5px;
      padding: 3px 5px;
      position: absolute;
      right: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      font-size: 26rpx;

      &.follow {
        border: 1px solid #3c8af8;
        color: #3c8af8;
      }
    }
  }
}
</style>
