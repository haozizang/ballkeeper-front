<template>
  <view class="flex-row-center-between py-20 px-30 mt-20" :style="{ backgroundColor: '#3c8af8' }">
    <view class="text-white">已完成的活动</view>
    <view>
      <tm-icon name="tmicon-angle-right" color="#ffffff"></tm-icon>
    </view>
  </view>
  <view class="list bg-white">
    <view class="item flex-row-center-between pa-30" v-for="(item, index) in my_activities" :key="index" @click="openLink('others/activity/detail?id=' + item._id)">
      <view class="pl-20 flex flex-1 flex-col flex-between" style="height: 200rpx">
        <view>
          <view class="title text-overflow-2">{{ item.title }}</view>
          <view class="address mt-20 flex-col-top-center">
            <tm-icon name="tmicon-position" color="#999999" :font-size="24"></tm-icon>
            <text class="ml-8 text-overflow-1">{{ item.address }}</text>
          </view>
        </view>
        <view class="time flex flex-between">
          <view class="flex-col-top-center">
            <tm-icon name="tmicon-time-fill" color="#999999"></tm-icon>
            <text class="tips">{{ timeText(item.start_date) }}</text>
          </view>
          <text class="tips" v-if="!item.is_hidden_views">浏览数：{{ item.views || 0 }}</text>
        </view>
      </view>
    </view>
  </view>

  <view class="flex-row-center-between py-20 px-30 mt-20" :style="{ backgroundColor: '#3c8af8' }">
    <view class="text-white">推荐活动</view>
    <view>
      <tm-icon name="tmicon-angle-right" color="#ffffff"></tm-icon>
    </view>
  </view>

  <view class="list bg-white">
    <view class="item flex-row-center-between pa-30" v-for="(item, index) in other_activities" :key="index" @click="openLink('others/activity/detail?id=' + item._id)">
      <view class="pl-20 flex flex-1 flex-col flex-between" style="height: 200rpx">
        <view>
          <view class="title text-overflow-2">{{ item.title }}</view>
          <view class="address mt-20 flex-col-top-center">
            <tm-icon name="tmicon-position" color="#999999" :font-size="24"></tm-icon>
            <text class="ml-8 text-overflow-1">{{ item.address }}</text>
          </view>
        </view>
        <view class="time flex flex-between">
          <view class="flex-col-top-center">
            <tm-icon name="tmicon-time-fill" color="#999999"></tm-icon>
            <text class="tips">{{ timeText(item.start_date) }}</text>
          </view>
          <text class="tips" v-if="!item.is_hidden_views">浏览数：{{ item.views || 0 }}</text>
        </view>
      </view>
    </view>
  </view>
  <!-- <view class="list2 bg-white px-30 flex flex-between flex-wrap round-3"> -->  <!-- flex:view成为flex容器,子元素为flex项; flex-between:等价`justify-content:space-between,子元素间空间平均分配; flex-wrap:允许flex子元素换行 -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { openLink,timeText } from '@/common/tools';
const my_activities = ref<any>([]);
const other_activities = ref<any>([]);
const team = ref<any>([]);

function init() {
  /*
	indexHome().then(res => {
		if (res.code === 1000) {
			my_activities.value = res.data.activity;
			other_activities.value = res.data.other_activities;
			team.value = res.data.team;
		}
	});
  */
  // DEL: 模拟活动数据
  my_activities.value = [
  ];

  other_activities.value = [
  ];
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
    border-bottom: 4rpx solid rgb(230, 230, 230);
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