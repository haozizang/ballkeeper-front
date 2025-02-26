<template>
  <view class="footer">
    <view class="btn" @click="openLink('leagues/create/create')">创建联赛</view>
  </view>
</template>

<script lang="ts" setup>
import { openLink } from '@/common/tools';

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
