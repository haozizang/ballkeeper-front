<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useAppStore } from '@/stores/app'
import { debugLog } from '@/common/tools'
import { useUserStore } from '@/stores/user'

onLaunch((e) => {
    console.log('App Launch',e);
    // #ifdef H5
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const code = params.get('code');
    const state = params.get('state');
    // 携带了 # 号的参数
    if(state?.includes('dxadmin__') && code){
        let stateArr = state.split('__');
        window.location.href = window.location.origin + '/#'+stateArr[1]+'?code=' + code + '&state=' + stateArr[0];
    }
    // #endif
});
onShow(() => {
    console.log('App Show');
    const appStore = useAppStore();
    const userStore = useUserStore();
    debugLog("userStore.userInfo: ", userStore.userInfo);
    uni.request({
      url: "/ballkeeper/get_app_info/",
      method: 'GET',
      success: (res: any) => {
        debugLog("get app info res: ", res);
        if (res.statusCode !== 200) {
          uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取应用信息失败');
          return;
        }
        debugLog("get app info succeeded, res: ", res);
        appStore.setAppInfo(res.data);
        /* if not logined, go to login page */
        if (!userStore.isLogin) {
          uni.reLaunch({
            url: '/pages/login/login',
          });
        }
      },
      fail: (err) => {
        console.error('login failed: ', err);
        uni.$tm.u.toast('登录请求失败, 请稍后重试');
      }
    });
});

onHide(() => {
    console.log('App Hide');
});
</script>
<style>
/* #ifdef APP-NVUE */
@import './tmui/scss/nvue.css';
/* #endif */
/* #ifndef APP-NVUE */
@import './tmui/scss/noNvue.css';

/* #endif */
view {
    box-sizing: border-box;
}

.bg-white {
    background-color: #fff;
}

.align-center {
    align-items: center;
}

.tips {
    font-size: 26rpx;
    color: #6d6868;
}

.price {
    color: #ff0405;
}

.approve {
    color: #999999;
    font-size: 26rpx;
}

.success {
    color: #0bbb08;
    font-size: 26rpx;
}
.input-select{
   padding: 12rpx 0.75rem;
   border: 0px solid rgb(230, 230, 230);
   background-color: rgb(245, 245, 245);
   transition: border 0.24s ease 0s;
}
.no-select{
  color: #808080;
}
.load-more{
  padding: 30rpx 30vw;
}
</style>
