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
            <tm-input :inputPadding="[20, 0]" :round="20" prefix="tmicon-account" v-model.lazy="loginForm.username" placeholder="请输入账号" :showBottomBotder="false"> </tm-input>
          </tm-form-item>
          <tm-form-item required field="password" :rules="[{ required: true, message: '请输入密码' }]">
            <tm-input :inputPadding="[20, 0]" type="password" :round="20" prefix="tmicon-lock" v-model.lazy="loginForm.password" placeholder="请输入密码" :showBottomBotder="false">
            </tm-input>
          </tm-form-item>
          <tm-form-item :border="false">
            <tm-button :margin="[10]" :shadow="0" :round="20" size="small" form-type="submit" block label="立即登录"></tm-button>
            <view class="login-tips flex flex-between px-30">
              <text class="" @click="openLink('pages/login/forgot')">忘记密码</text>
              <text class="" @click="openLink('pages/login/register')">没有账号?立即注册</text>
            </view>
          </tm-form-item>
        </tm-form>
      </view>
      <view class="footer">
        <tm-divider align="center" label="更多登录方式"></tm-divider>
        <view class="flex-center pt-30">
          <view>
            <!-- 短信验证码 -->
            <tm-avatar :round="25" :size="60" icon="tmicon-bell" @click="openLink('pages/login/mobile')"></tm-avatar>
          </view>

          <!-- #ifdef H5 -->
          <view class="ml-50" v-if="isWeixin">
            <!-- 公众号 -->
            <tm-avatar :round="25" :size="60" color="#38b434" icon="tmicon-weixin" @click="wechatLogin"></tm-avatar>
          </view>
          <!-- #endif -->

          <!-- #ifdef MP-WEIXIN -->
          <view class="ml-50">
            <!-- 小程序 -->
            <tm-avatar :round="25" :size="60" color="#38b434" icon="tmicon-weixin" @click="showWin = true"></tm-avatar>
          </view>
          <!-- #endif -->

          <!-- #ifdef APP-PLUS -->
          <view class="ml-50" v-if="isShowMobileLogin">
            <!-- 手机一键登录 -->
            <tm-avatar :round="25" :size="60" color="#f08d49" icon="tmicon-md-phone-portrait" @click="mobileLogin"></tm-avatar>
          </view>
          <!-- #endif -->
        </view>
      </view>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <tm-drawer ref="calendarView" :hideHeader="true" :height="800" placement="bottom" v-model:show="showWin">
      <view class="pa-30">
        <view class="pt-10">
          <text class="text-size-g">授权获取您的头像、昵称</text>
        </view>
        <view class="tips mt-15 pb-50">
          <text>获取用户头像、昵称，主要用于完善用户个人资料，向用户提供更好的使用体验～</text>
        </view>
        <view class="flex-row-center-start pt-10" @click="uploadAvatar">
          <text class="mr-30">头像</text>
          <tm-avatar :round="25" :size="70" :img="avatarUrl"></tm-avatar>
        </view>
        <view class="flex mt-30">
          <view class="mr-30">昵称</view>
          <view>
            <input v-model="nickname" placeholder="请输入昵称" type="nickname" @blur="inputBlur" />
          </view>
        </view>
        <view class="mt-50 pt-30 px-30">
          <tm-button :margin="[10]" :shadow="0" :round="20" size="small" block label="立即登录" @click="toAuthLogin"></tm-button>
        </view>
      </view>
    </tm-drawer>
    <!-- #endif -->
  </tm-app>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { login } from '@/common/index';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { openLink, debugLog } from '@/common/tools';
import { onLoad } from '@dcloudio/uni-app';

const appStore = useAppStore();
const userStore = useUserStore();
const loginForm = ref({
  username: '',
  password: '',
});
// #ifdef MP-WEIXIN
const showWin = ref(false);
const nickname = ref('');
const avatarUrl = ref('');
async function uploadAvatar() {
  const res = await uni.chooseImage({ count: 1 });
  const { tempFilePath }: any = await uni.cropImage({ src: res.tempFilePaths[0], cropScale: '1:1' });
  let y, m, d, day, rand, cloudPath;
  d = new Date();
  y = d.getFullYear().toString();
  m = (d.getMonth() + 1).toString().padStart(2, '0');
  day = d.getDate().toString().padStart(2, '0');
  rand = Math.floor(Math.random() * 900) + 100;
  cloudPath = y + '/' + m + '/' + day + '/' + Date.now() + rand + '.' + tempFilePath.split('.').pop();
  const result = await uniCloud.uploadFile({
    filePath: tempFilePath,
    cloudPath,
    onUploadProgress(e) {
      console.log(e);
    },
  });
  let url = '';
  if (/^cloud:\/\//.test(result.fileID)) {
    //腾讯云处理
    const { fileList } = await uniCloud.getTempFileURL({
      fileList: [result.fileID],
    });
    if (fileList.length) {
      url = fileList[0].tempFileURL || fileList[0].download_url;
    }
  } else {
    url = result.fileID;
  }
  avatarUrl.value = url;
}
function inputBlur(e: any) {
  nickname.value = e.detail.value;
}
function toAuthLogin() {
  uni.login({
    provider: 'weixin', //使用微信登录
    success: function (res) {
      if (res.code) {
        login({
          code: res.code,
          nickname: nickname.value,
          avatar: avatarUrl.value,
          loginType: 'mpWechat',
        }).then(res => {
          if (res.code === 1000) {
            userStore.setUserInfo(res.data);
            uni.reLaunch({
              url: '/pages/index/index',
            });
          } else {
            uni.$tm.u.toast(res.message);
          }
        });
      }
    }
  });
}
// #endif
// #ifdef H5
const isWeixin = computed(() => {
  // H5 判断 是否是微信环境
  return window.navigator.userAgent.toLowerCase().includes('micromessenger');
});

function wechatLogin() {
  // 微信登录
  console.log('微信登录');
  login({
    url: window.location.href,
    loginType: 'wechat',
  }).then(res => {
    console.log(res);
    if (res.code === 1000) {
      window.location.href = res.data;
    } else {
      uni.$tm.u.toast(res.message);
    }
  });
}
// #endif
// #ifdef APP-PLUS
const isShowMobileLogin = ref(false);
function mobileLogin() {
  uni.login({
  provider: 'univerify',
  univerifyStyle: { // 自定义登录框样式
    //参考`univerifyStyle 数据结构`
  },
  success(res:any){ // 登录成功
    console.log(res.authResult);  // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
    login({
      openid: res.authResult.openid,
      access_token: res.authResult.access_token,
      loginType: 'mobile',
    }).then(res => {
      if (res.code === 1000) {
        uni.closeAuthView();
        userStore.setUserInfo(res.data);
        uni.reLaunch({
          url: '/pages/index/index',
        });
      } else {
        uni.$tm.u.toast(res.message);
      }
    });
  },
  fail(res){  // 登录失败
    console.log(res)
  }
})

}
// #endif

function confirm(e: any) {
  if (e.validate) {
    uni.request({
      url: "/ballkeeper/login/",
      method: 'POST',
      data: {
        ...e.data,
        loginType: 'account'
      },
      success: (res: any) => {
        debugLog("login res: ", res);
        if (res.statusCode !== 200) {
          uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '登录失败');
          return;
        }
        userStore.setUserInfo(res.data.user);
        debugLog("login userInfo: ", userStore.userInfo);
        uni.reLaunch({
          url: '/pages/index/index',
        });
      },
      fail: (err) => {
        console.error('login failed: ', err);
        uni.$tm.u.toast('登录请求失败, 请稍后重试');
      }
    });
  }
}

onLoad((e: any) => {
  // #ifdef H5
  if (e.code && e.state) {
    // 微信登录
    console.log(e);
    login({
      code: e.code,
      state: e.state,
      loginType: 'wechat',
    }).then(res => {
      console.log(res);
      if (res.code === 1000) {
        userStore.setUserInfo(res.data);
        uni.reLaunch({
          url: '/pages/index/index',
        });
      } else {
        uni.$tm.u.toast(res.message);
      }
    });
  }
  // #endif
  // #ifdef APP-PLUS
  uni.preLogin({
    provider: 'univerify',
    success() {  //预登录成功
      isShowMobileLogin.value = true;
    },
    fail(err) {  // 预登录失败
      isShowMobileLogin.value = false;
      console.log(err);
    }
  })
  // #endif
});
</script>

<style lang="scss" scoped>
.top {
  background: linear-gradient(135deg, #96c0fc 0%, #0359d1 100%);  // 使用更深的绿色作为终点色
  // background-color: #3c8af8;
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
}

.footer {
  padding-bottom: 20vh;
}
</style>
