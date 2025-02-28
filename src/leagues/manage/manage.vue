<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]">
      <view class="cover">
        <!-- <image :src="getBaseUrl() + leagueInfo.logo_path" mode="aspectFill"></image> -->
        <image :src="getBaseUrl() + leagueInfo.logo_path" mode="fit"></image>
      </view>

      <view class="manage px-50 pt-30">
        <view class="flex flex-col-top-center">
          <tm-avatar :size="150" :img="getBaseUrl() + leagueInfo.logo_path"></tm-avatar>
          <view class="ml-30">{{ leagueInfo.name }}</view>
        </view>
        <view class="flex flex-between text-align-center py-50">
          <view>
            <view class="number">{{ leagueInfo.activityCount }}</view>
            <view class="mt-10">活动总数</view>
          </view>
          <view>
            <view class="number">{{ leagueInfo.joinCount }}</view>
            <view class="mt-10">累计报名人数</view>
          </view>
          <view>
            <view class="number">{{ leagueInfo.followCount }}</view>
            <view class="mt-10">关注</view>
          </view>
        </view>
      </view>
    </tm-sheet>
    <tm-sheet :margin="[0, 30]" :padding="[0, 0]">
      <!-- 组织管理 -->
      <tm-cell :margin="[0, 0]" title="组织管理" :bottomBorder="true" rightIcon=""> </tm-cell>
      <tm-grid :width="750" :col="4">
        <tm-grid-item :height="150" @click="openLink('teams/activity/activity?team_id=' + (leagueInfo._id || ''))">
          <tm-icon name="tmicon-flag-fill" :font-size="40"></tm-icon>
          <tm-text _class="pt-10" :font-size="22" label="全部活动"></tm-text>
        </tm-grid-item>
        <tm-grid-item color="orange" :height="150" @click="openLink('teams/create/create?id=' + (leagueInfo._id || ''))">
          <tm-icon name="tmicon-edit" :font-size="44"></tm-icon>
          <tm-text _class="pt-10" :font-size="22" label="修改组织"></tm-text>
        </tm-grid-item>
        <tm-grid-item color="green" :height="150" @click="openLink('teams/approve/approve?team_id=' + (leagueInfo._id || ''))">
          <tm-icon name="tmicon-md-ribbon" :font-size="44"></tm-icon>
          <tm-text :font-size="22" label="组织认证"></tm-text>
        </tm-grid-item>
        <tm-grid-item color="pink" :height="150" @click="showWin = true">
          <tm-icon name="tmicon-delete" :font-size="42"></tm-icon>
          <tm-text _class="pt-10" :font-size="22" label="删除组织"></tm-text>
        </tm-grid-item>
      </tm-grid>
    </tm-sheet>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]">
    </tm-sheet>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]">
      <tm-cell :margin="[0, 0]" title="相册管理" :bottomBorder="true" rightIcon=""> </tm-cell>
      <tm-grid :width="750" :col="4">
        <tm-grid-item :height="150" @click="openLink('teams/images/images?team_id=' + (leagueInfo._id || ''))">
          <tm-icon name="tmicon-picture-fill" :font-size="42"></tm-icon>
          <tm-text _class="pt-10" :font-size="22" label="相册"></tm-text>
        </tm-grid-item>
      </tm-grid>
    </tm-sheet>
    <tm-modal title="温馨提示" content="您确认删除当前组织嘛？" :height="300" okText="确定" v-model:show="showWin" @ok="deleteConfirm"></tm-modal>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getBaseUrl } from '@/common/env';
import { openLink } from '@/common/tools';
import { onLoad } from '@dcloudio/uni-app';
import { delTeam } from '@/common/index';
import { debugLog } from '@/common/tools';

const showWin = ref(false);
const leagueInfo = ref({
  _id: '',
  name: '联赛名称',
  logo_path: '',
  activityCount: 0,
  joinCount: 0,
  followCount: 0
});
onLoad((e: any) => {
  if (e.id) {
    uni.request({
      url: '/ballkeeper/get_league/',
      method: 'GET',
      data: { league_id: parseInt(e.id) },
      success: (res: any) => {
        debugLog("get_league res: ", res);
        if (res.statusCode !== 200) {
          uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取失败');
          return;
        }
        uni.$tm.u.toast('获取联赛成功!');
        leagueInfo.value = res.data.league;
        debugLog("leagueInfo: ", leagueInfo.value);
      }
    })
  }
});

function deleteConfirm() {
  delTeam({
    id: leagueInfo.value._id
  }).then(res => {
    if (res.code === 1000) {
      uni.$tm.u.toast('删除成功');
      showWin.value = false;
      uni.navigateBack();
    } else {
      uni.$tm.u.toast(res.message);
    }
  })
}
</script>
<style lang="scss" scoped>
.manage {
  background: linear-gradient(180deg, #3c8af8, #38cddd);
  color: #ffffff;

  .number {
    font-size: 38rpx;
  }
}
.cover {
  position: relative;
  width: 100%;

  image {
    height: 450rpx;
    // width: 100%;
  }

  .upload {
    position: absolute;
    bottom: 30rpx;
    right: 30rpx;
    background: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    padding: 10rpx 20rpx;
  }
}
</style>
