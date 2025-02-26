<template>
  <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="navbar-content">
      <view class="left-area">
        <!-- 返回按钮 -->
        <view class="nav-btn" @click="goBack" v-if="showBack">
          <tm-icon name="tmicon-angle-left" :font-size="36" color="#FFFFFF"></tm-icon>
        </view>
        
        <!-- 回到主页按钮 -->
        <view class="nav-btn home-btn" @click="goHome">
          <tm-icon name="tmicon-home" :font-size="32" color="#FFFFFF"></tm-icon>
        </view>
      </view>
      
      <!-- 标题 -->
      <view class="title" v-if="title">{{ title }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 定义属性
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true
  }
});

// 状态栏高度
const statusBarHeight = ref(20);

onMounted(() => {
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;
});

// 返回上一页
function goBack() {
  uni.navigateBack({
    fail: () => {
      goHome();
    }
  });
}

// 返回首页 - 修复 tabBar 跳转错误
function goHome() {
  // 使用 reLaunch 代替 switchTab，确保可以跳转到任何页面
  uni.reLaunch({
    url: '/pages/index/index'
  });
}
</script>

<style lang="scss" scoped>
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0));
  
  .navbar-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    position: relative;
    
    .left-area {
      display: flex;
      align-items: center;
    }
    
    .nav-btn {
      width: 70rpx;
      height: 70rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.2);
      border-radius: 50%;
      margin-right: 20rpx;
      
      &:active {
        opacity: 0.7;
      }
    }
    
    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #FFFFFF;
      font-size: 32rpx;
      font-weight: 500;
    }
  }
}
</style>