<template>
  <tm-app color="white">
    <view class="top">
      <view class="logo">
        <tm-avatar :round="26" :size="150" :img="appStore.app_logo"></tm-avatar>
      </view>
    </view>
    <view class="login">
      <view class="box pt-50">
        <tm-form @submit="confirm" ref="form" v-model="loginForm" :label-width="190">
          <tm-form-item required field="username" :rules="[{ required: true, message: '请输入账号' }]">
            <tm-input :inputPadding="[20, 0]" :round="20" prefix="tmicon-account" v-model.lazy="loginForm.username"
              placeholder="请输入账号" :showBottomBotder="false"> </tm-input>
          </tm-form-item>
          <tm-form-item required field="password" :rules="[{ required: true, message: '请输入密码' }]">
            <tm-input :inputPadding="[20, 0]" type="password" :round="20" prefix="tmicon-lock"
              v-model.lazy="loginForm.password" placeholder="请输入密码" :showBottomBotder="false"> </tm-input>
          </tm-form-item>
          <tm-form-item :border="false">
            <tm-button :margin="[10]" :shadow="0" :round="20" size="small" form-type="submit" block
              label="立即注册"></tm-button>
            <view class="login-tips flex flex-between px-30">
              <text class="" @click="openLink('pages/login/forgot')">忘记密码</text>
              <text class="" @click="openLink('pages/login/login', 1)">已有账号?立即登录</text>
            </view>
          </tm-form-item>
        </tm-form>
      </view>
    </view>
  </tm-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { openLink, debugLog } from '@/common/tools';
import { ApiCode } from '@/common/data';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

const appStore = useAppStore();
const userStore = useUserStore();
const loginForm = ref({
  username: '',
  password: '',
});

function confirm(e: any) {
  debugLog("register with details", e);
  if (e.validate) {
    uni.request({
      url: "/ballkeeper/register/",
      method: 'POST',
      data: e.data,
      success: (res: any) => {
        debugLog("response of register: ", res);
        if (res.data.code === ApiCode.SUCCESS) {
          uni.$tm.u.toast('注册成功！');
          // 保存用户信息
          userStore.setUserInfo(res.data.data);
          // 跳转到头像设置页面
          setTimeout(() => {
            openLink('/pages/user/avatar', {username: res.data.data.username}, 1);
          }, 1500);
        } else {
          uni.$tm.u.toast(res.data.msg || '注册失败');
        }
      },
      fail: () => {
        uni.$tm.u.toast('注册失败，请重试');
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.top {
  background-color: #3c8af8;
  height: 350rpx;
  position: relative;

  .logo {
    position: absolute;
    left: 50%;
    top: 170rpx;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
}

.login {
  flex: 1;
  margin-top: -170rpx;
  position: relative;
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .box {
    height: 100%;
    background-color: #fff;
    border-top-right-radius: 15rpx;
    border-top-left-radius: 15rpx;

    .login-tips {
      color: #3c8af8;
      font-size: 24rpx;
      margin-top: 30rpx;
    }
  }
}</style>
