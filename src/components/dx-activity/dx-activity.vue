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
          <view class="text-overflow-2">{{ item.name }}</view>
          <view class="address mt-20 flex-col-top-center">
            <tm-icon name="tmicon-position" color="#999999" :font-size="24"></tm-icon>
            <text class="ml-8 text-overflow-1">{{ item.address }}</text>
          </view>
          <view class="content mt-20">
            <text class="ml-8 text-overflow-1">简介: {{ item.content }}</text>
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
    <view class="item flex-row-center-between pa-30" v-for="(item, index) in otherActivities" :key="index" @click="openLink('others/activity/detail?id=' + item.id)">
      <view class="pl-20 flex flex-1 flex-col flex-between" style="height: 200rpx">
        <view>
          <view class="text-overflow-2">{{ item.name }}</view>
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
import { ref, reactive } from 'vue';
import { openLink,timeText, debugLog } from '@/common/tools';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const myActivities = ref<any>([]);
const otherActivities = ref<any>([]);

const param = reactive({
  offset: 0,
  limit: 10,
});

const hasMore = ref(true);
const loading = ref(false);

function getMyActivities(is_more = false) {
  loading.value = true;

  // 如果不是加载更多，重置 offset
  if (!is_more) {
    param.offset = 0;
  }
  uni.request({
    url: "/ballkeeper/get_my_activities/",
    method: 'GET',
    data: {
      user_id: userStore.userInfo.id,
      limit: param.limit,
      offset: param.offset
    },
    success: (res: any) => {
      debugLog("get_my_activities res: ", res);
      if (res.statusCode !== 200) {
        uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取球队列表失败');
        return;
      }

      if (res.data.activities.length < param.limit || res.data.activities.length === 0) {
        hasMore.value = false;
      } else {
        // 更新 offset 用于下次加载
        param.offset += param.limit;
      }

      if (is_more) {
        myActivities.value = myActivities.value.concat(res.data.activities);
      } else {
        myActivities.value = res.data.activities;
      }

      loading.value = false;
    },
    fail: () => {
      uni.$tm.u.toast('获取球队列表失败,请重试');
      loading.value = false;  // 确保失败时也重置加载状态
    }
  });
}

onShow((e: any) => {
  debugLog("[dx-activity.vue]onShow");
  getMyActivities(false);
});

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
