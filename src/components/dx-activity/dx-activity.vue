<template>
  <view class="flex-row-center-between py-20 px-30 mt-20" :style="{ backgroundColor: '#3c8af8' }">
    <view class="text-white">我的活动</view>
    <view>
      <tm-icon name="tmicon-angle-right" color="#ffffff"></tm-icon>
    </view>
  </view>
  <view class="list bg-white">
    <view class="item flex-row-center-between pa-30" v-for="(item, index) in myActivities" :key="index" @click="openLink('others/activity/detail?id=' + item.id)">
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
    <view class="item flex-row-center-between pa-30" v-for="(item, index) in other_activities" :key="index" @click="openLink('others/activity/detail?id=' + item.id)">
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
import { onLoad } from '@dcloudio/uni-app';
const myActivities = ref<any>([]);
const other_activities = ref<any>([]);

onLoad((e: any) => {
  /*
	indexHome().then(res => {
		if (res.code === 1000) {
			myActivities.value = res.data.activity;
			other_activities.value = res.data.other_activities;
			team.value = res.data.team;
		}
	});
  */

  // DEL: 模拟活动数据
  myActivities.value = [
    {
      title: '我创建的比赛',
      cover: 'https://example.com/image1.jpg',
      address: '北京音乐厅',
      start_date: '2023-04-15',
      views: 150,
      is_hidden_views: false,
      id: '1',
    },
    {
      title: '我报名的比赛',
      cover: 'https://example.com/image2.jpg',
      address: '上海博物馆',
      start_date: '2023-06-20',
      views: 100,
      is_hidden_views: false,
      id: '2',
    },
    {
      title: '我报名的聚餐',
      cover: 'https://example.com/image3.jpg',
      address: '广州国际美食中心',
      start_date: '2023-09-10',
      views: 75,
      is_hidden_views: false,
      id: '3',
    },
  ];

  other_activities.value = [
    {
      title: '精神糖训练赛',
      cover: 'https://example.com/image1.jpg',
      address: '精神糖足球场',
      start_date: '2023-04-15',
      views: 150,
      is_hidden_views: false,
      id: '1',
    },
    {
      title: '丰台区足球联赛',
      cover: 'https://example.com/image2.jpg',
      address: '上海博物馆',
      start_date: '2023-06-20',
      views: 100,
      is_hidden_views: false,
      id: '2',
    },
    {
      title: '奥体中心篮球赛',
      cover: 'https://example.com/image3.jpg',
      address: '广州国际美食中心',
      start_date: '2023-09-10',
      views: 75,
      is_hidden_views: false,
      id: '3',
    },
    {
      title: '冬季滑雪活动',
      cover: 'https://example.com/image4.jpg',
      address: '长白山滑雪场',
      start_date: '2023-12-05',
      views: 200,
      is_hidden_views: false,
      id: '4',
    },
  ];
});

function toFollow(id: string) {
	/* 关注
  followTeam({id}).then(res=>{
    uni.$tm.u.toast(res.message);
    if(res.code===1000){
      init()
    }
  })
  */
}
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
