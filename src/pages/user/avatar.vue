<template>
  <tm-app color="white">
    <view class="top">
      <view class="content">
        <dx-upload v-model="editForm.avatar_path" image_type="avatar"></dx-upload>
        <view class="ml-30 mt-10 text-size-xl">{{ userStore.userInfo.username }}</view>
      </view>
    </view>
    <view style="margin-top: 100px; padding: 0 40px;">
        <tm-button
          :margin="[10]" 
          :shadow="0" 
          :round="20" 
          size="small" 
          block 
          :label="hasUploadedImage ? '完成' : '使用默认头像'" 
          @click="handleButtonClick"
        ></tm-button>
    </view>
  </tm-app>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import {useUserStore} from '@/stores/user';

const userStore = useUserStore();
const editForm = ref({
  avatar_path: userStore.userInfo.avatar_path,
  mobile: userStore.userInfo.mobile,
  gender: userStore.userInfo.gender,
});

const hasUploadedImage = ref(false);  // 用于跟踪是否有上传的图片

// 监听图片上传状态
watch(() => editForm.value.avatar_path, (newVal) => {
  hasUploadedImage.value = !!newVal;
  if (newVal) {
    userStore.userInfo.avatar_path = newVal;
  }
});

// 按钮点击处理
const handleButtonClick = () => {
  if (hasUploadedImage.value) {
    // 有图片时直接跳转
    uni.reLaunch({
      url: '/pages/index/index',
    });
  } else {
    // 无图片时显示确认提示
    uni.showModal({
      title: '提示',
      content: '确认跳过头像上传吗？',
      success: (res) => {
        if (res.confirm) {
          uni.reLaunch({
            url: '/pages/index/index',
          });
        }
      }
    });
  }
};

</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 200rpx;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
