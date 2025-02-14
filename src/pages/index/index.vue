<template>
  <tm-app>
    <view v-if="tab_ind === 0">
      <tm-sheet :margin="[0, 0]" :padding="[0, 0]" :transprent="true">
        <view class="py-20 bg-white">
          <tm-grid :width="750" :col="2">
            <tm-grid-item
              :height="180"
              @click="grid_ind = 0"
              :shadow="grid_ind === 0 ? 3 : 0"
              :round="10"
              hover-class="grid-hover"
              :margin="[0,0,0,0]"
            >
              <view class="grid-content">
                <view class="icon-wrapper">
                  <image
                    class="icon"
                    :class="{
                      'active-icon': grid_ind === 0,
                      'inactive-icon': grid_ind !== 0
                    }"
                    src="../../static/a3.png"
                  ></image>
                </view>
                <view class="text-wrapper" :class="{ 'active-text': grid_ind === 0 }">
                  <tm-text
                    :font-size="grid_ind === 0 ? 30 : 24"
                    :color="grid_ind === 0 ? 'white' : ''"
                    label="当前活动"
                  ></tm-text>
                </view>
              </view>
            </tm-grid-item>

            <tm-grid-item
              :height="180"
              @click="grid_ind = 1"
              :shadow="grid_ind === 1 ? 3 : 0"
              :round="10"
              hover-class="grid-hover"
              :margin="[0,0,0,0]"
            >
              <view class="grid-content">
                <view class="icon-wrapper">
                  <image
                    class="icon"
                    :class="{
                      'active-icon': grid_ind === 1,
                      'inactive-icon': grid_ind !== 1
                    }"
                    src="../../static/a4.png"
                  ></image>
                </view>
                <view class="text-wrapper" :class="{ 'active-text': grid_ind === 1 }">
                  <tm-text
                    :font-size="grid_ind === 1 ? 30 : 24"
                    :color="grid_ind === 1 ? 'white' : ''"
                    label="历史活动"
                  ></tm-text>
                </view>
              </view>
            </tm-grid-item>
          </tm-grid>
        </view>
        <dx-activity :category-list="categoryList" v-if="grid_ind === 0"></dx-activity>
        <dx-activity-history :category-list="categoryList" v-else-if="grid_ind === 1"></dx-activity-history>
      </tm-sheet>
    </view>
    <dx-team :category-list="categoryList" v-else-if="tab_ind === 1"></dx-team>
    <view v-else-if="tab_ind === 3" class="py-30 bg-white">TODO: 数据页</view>
    <dx-member v-else-if="tab_ind === 4"></dx-member>
    <view style="height: 150rpx"></view>
    <tm-tabbar :autoSelect="false" v-model:active="tab_ind" :showSafe="false" @change="tabbarChange">
      <tm-tabbar-item @click="tab_ind = 0" activeColor="#3c8af8" open-type="reLaunch" text="活动" icon="tmicon-md-home"></tm-tabbar-item>
      <tm-tabbar-item @click="tab_ind = 1" activeColor="#3c8af8" text="球队" icon="tmicon-flag-fill"></tm-tabbar-item>
      <tm-tabbar-item :shadow="2" btn-top fontColor="white" activeColor="white" linear="top" linearDeep="accent" color="#38cdde" icon="tmicon-paperplane-fill" url="/others/publish/publish" text="发起活动"></tm-tabbar-item>
      <tm-tabbar-item @click="tab_ind = 3" activeColor="#3c8af8" text="数据" icon="tmicon-layergroup-fill"></tm-tabbar-item>
      <tm-tabbar-item @click="tab_ind = 4" activeColor="#3c8af8" text="我的" icon="tmicon-md-person"></tm-tabbar-item>
    </tm-tabbar>
  </tm-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getCategory } from '@/common/index';

const categoryList = ref<any>([]);
const tab_ind = ref(0);
const grid_ind = ref(0);
getCategory({
  level: 1,
}).then((res) => {
  if(res.code === 1000){
    categoryList.value = [{
      name:'全部',
      _id:'0'
    },...res.data];
  }
});
function tabbarChange(e: number) {
  switch(e){
    case 0:
      uni.setNavigationBarTitle({
        title: '活动',
      });
      break;
    case 1:
      uni.setNavigationBarTitle({
        title: '球队',
      });
      break;
    case 2:
      uni.setNavigationBarTitle({
        title: '数据',
      });
      break;
    case 3:
      uni.setNavigationBarTitle({
        title: '我的',
      });
      break;
  }
}

</script>

<style lang="scss" scoped>
.grid-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-wrapper {
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
}

.active-text {
  background-color: rgb(1, 107, 255);  // 使用主题蓝色的透明版本
}

.icon {
  width: 90rpx;
  height: 90rpx;
  transition: all 0.3s ease;
}

.active-icon {
  width: 110rpx;
  height: 110rpx;
  opacity: 1;
}

.inactive-icon {
  opacity: 0.4;
}

.grid-hover {
  transform: scale(0.95);
  opacity: 0.8;
  transition: all 0.2s ease;
}

// 添加动画效果
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
