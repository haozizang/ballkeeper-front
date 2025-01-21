<template>
  <tm-app color="white">
    <view class="top">
      <view class="content">
        <dx-upload v-model="editForm.avatar" :username="username"></dx-upload>
        <view class="ml-30 text-size-xl" style="margin-top: 80px;">{{ username }}</view>
        <view class="ml-30 mt-10 text-size-xl">{{ userStore.userInfo.username }}</view>
      </view>
    </view>
    <view style="margin-top: 100px; padding: 0 40px;">
        <tm-button :margin="[10]" :shadow="0" :round="20" size="small" form-type="submit" block label="完成"></tm-button>
    </view>
  </tm-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {useUserStore} from '@/stores/user';
import {editUserInfo} from '@/common/index';
import { openLink, debugLog } from '@/common/tools';
import { onLoad } from '@dcloudio/uni-app';

const userStore = useUserStore();
const username = ref('');
const editForm = ref({
  nickname: userStore.userInfo.nickname,
  avatar: userStore.userInfo.avatar,
  // mobile: userStore.userInfo.mobile,
  email:  userStore.userInfo.email,
  gender:  userStore.userInfo.gender,
  password: '',
});

onLoad((e: any) => {
  console.log("[onLoad] e: ", e);
  username.value = e.username;
});

function confirm(e:any) {

}
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
