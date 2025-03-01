<template>
  <tm-app color="white">
    <view class="top">
      <view class="logo">
        <tm-avatar :round="26" :size="150" :img="appStore.app_logo"></tm-avatar>
      </view>
    </view>
    <view class="login">
      <view class="box pt-50">
        <tm-form @submit="confirm" ref="form" v-model="registForm" :label-width="190">
          <view class="upload-wrapper">
            <dx-upload v-model="registForm.avatar_path" image_type="avatar"></dx-upload>
            <text>上传头像</text>
          </view>
          <tm-form-item required field="username" :rules="[{ required: true, message: '请输入账号' }]">
            <tm-input :inputPadding="[20, 0]" :round="20" prefix="tmicon-account" v-model.lazy="registForm.username"
              placeholder="请输入账号" :showBottomBotder="false"> </tm-input>
          </tm-form-item>
          <tm-form-item required field="password" :rules="[{ required: true, message: '请输入密码' }]">
            <tm-input :inputPadding="[20, 0]" type="password" :round="20" prefix="tmicon-lock"
              v-model.lazy="registForm.password" placeholder="请输入密码" :showBottomBotder="false"> </tm-input>
          </tm-form-item>
          <tm-form-item :border="false">
            <tm-button :margin="[10]" :shadow="0" :round="20" size="small" form-type="submit" block
              label="立即注册" color="#4CAF50"></tm-button>
            <view class="login-tips flex flex-between px-30">
              <text class="forgot" @click="openLink('pages/login/forgot')">忘记密码</text>
              <text class="login-link" @click="openLink('pages/login/login', 1)">已有账号?立即登录</text>
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
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

const appStore = useAppStore();
const userStore = useUserStore();
const registForm = ref({
  username: '',
  password: '',
  avatar_path: '',
});

function confirm(e: any) {
  debugLog("register with details", e);
  if (e.validate) {
    uni.request({
      url: "/ballkeeper/register/",
      method: 'POST',
      data: e.data,
      success: (res: any) => {
        debugLog("register res: ", res);
        if (res.statusCode !== 200) {
          uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '注册失败');
          return;
        }
        uni.$tm.u.toast('注册成功!');
        // 保存用户信息
        userStore.setUserInfo(res.data.user);
        // 跳转到头像设置页面
        setTimeout(() => {
          debugLog("registForm.value.avatar_path: ", registForm.value.avatar_path);
          if (registForm.value.avatar_path) {
            uni.reLaunch({
              url: '/pages/index/index',
            });
          }
          else {
            openLink('/pages/user/avatar', {username: res.data.user.username}, 1);
          }
        }, 1500);
      },
      fail: () => {
        uni.$tm.u.toast('注册失败,请重试');
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.top {
  /* 方案1：更强烈的绿色渐变 */
  background: linear-gradient(135deg, #89cc8c 0%, #198120 100%);  // 使用更深的绿色作为终点色

  /* 方案2：三色渐变 */
  // background: linear-gradient(135deg, #81C784 0%, #4CAF50 50%, #2E7D32 100%);

  /* 方案3：更生动的渐变角度 */
  // background: linear-gradient(160deg, #4CAF50 0%, #1B5E20 100%);

  /* 方案4：放射状渐变 */
  // background: radial-gradient(circle at top right, #4CAF50 0%, #1B5E20 100%);

  height: 350rpx;
  position: relative;

  .header-text {
    position: absolute;
    left: 50rpx;
    top: 80rpx;
    color: white;

    .title {
      font-size: 48rpx;
      font-weight: bold;
      display: block;
      margin-bottom: 20rpx;
    }

    .subtitle {
      font-size: 28rpx;
      opacity: 0.9;
    }
  }

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
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);

    .login-tips {
      color: #4CAF50;
      font-size: 25rpx;
      margin-top: 30rpx;

      // font-weight: bold;
    }
  }
}

.upload-wrapper {
  margin: 30rpx auto;
  padding-bottom: 100rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  font-size: 40rpx;

  /* 添加更现代的样式 */
  border-radius: 16rpx;
  background: rgba(76, 175, 80, 0.05);
  box-shadow: 0 6rpx 16rpx rgba(76, 175, 80, 0.1);
  padding: 30rpx;
  position: relative;
  overflow: hidden;

  text {
    margin-top: 20rpx;
    color: #4CAF50;
    font-weight: 500;
    letter-spacing: 2rpx;
  }

  /* 让里面的上传组件获得交互感 */
  :deep(.dx-upload .item) {
    transition: all 0.3s ease;
    border-color: rgba(76, 175, 80, 0.5);

    &:hover, &:active {
      border-color: #4CAF50;
      background: rgba(76, 175, 80, 0.05);
    }
  }
}
</style>
n