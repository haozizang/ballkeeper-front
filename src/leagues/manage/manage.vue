<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]">
      <view class="cover" @click="previewImage">
        <image :src="getBaseUrl() + leagueInfo.cover_path" mode="aspectFill"></image>
        <view class="preview-hint">
          <tm-icon name="tmicon-search" color="white" :font-size="30"></tm-icon>
          <text class="hint-text">点击查看完整图片</text>
        </view>
      </view>

      <view class="manage px-50 pt-30">
        <view class="flex flex-col-top-center">
          <view class="league-name">{{ leagueInfo.name }}</view>
        </view>
        <view class="flex flex-between text-align-center py-50">
          <view class="league-info">
            <view class="info-label">赛制</view>
            <view class="info-circle">
              <text>{{ getLeagueType(leagueInfo.league_type_ind) }}</text>
            </view>
          </view>
          <view class="league-info">
            <view class="info-label">参赛球队</view>
            <view class="info-circle">
              <text>{{ 10 }}</text>
            </view>
          </view>
          <view class="league-info">
            <view class="info-label">状态</view>
            <view class="info-circle">
              <text>{{ '进行中' }}</text>
            </view>
          </view>
        </view>
      </view>
    </tm-sheet>
    <tm-sheet :margin="[0, 30]" :padding="[0, 0]">
      <!-- 组织管理 -->
      <tm-cell :margin="[0, 0]" title="组织管理" :bottomBorder="true" rightIcon=""> </tm-cell>
      <tm-grid :width="750" :col="4">
        <tm-grid-item :height="150" @click="openLink('teams/activity/activity?team_id=' + (leagueInfo.id || ''))">
          <tm-icon name="tmicon-flag-fill" :font-size="40"></tm-icon>
          <tm-text _class="pt-10" :font-size="22" label="全部活动"></tm-text>
        </tm-grid-item>
        <tm-grid-item color="orange" :height="150" @click="openLink('teams/create/create?id=' + (leagueInfo.id || ''))">
          <tm-icon name="tmicon-edit" :font-size="44"></tm-icon>
          <tm-text _class="pt-10" :font-size="22" label="修改组织"></tm-text>
        </tm-grid-item>
        <tm-grid-item color="green" :height="150" @click="openLink('teams/approve/approve?team_id=' + (leagueInfo.id || ''))">
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
        <tm-grid-item :height="150" @click="openLink('teams/images/images?team_id=' + (leagueInfo.id || ''))">
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
import { LEAGUE_TYPES } from '@/common/data';

function getLeagueType(typeId: number): string {
  const type = LEAGUE_TYPES.find(item => item.id === typeId);
  return type ? type.name : '未知类型';
}

const showWin = ref(false);
const leagueInfo = ref({});
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
    id: leagueInfo.value.id
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

function previewImage() {
  if (leagueInfo.value && leagueInfo.value.cover_path) {
    const imageUrl = getBaseUrl() + leagueInfo.value.cover_path;
    uni.previewImage({
      urls: [imageUrl],
      current: imageUrl,
      longPressActions: {
        itemList: ['保存图片', '分享'],
        success: function(data) {
          debugLog('选择了第' + (data.tapIndex + 1) + '个按钮');
        },
        fail: function(err) {
          debugLog('操作失败', err);
        }
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.manage {
  // background: linear-gradient(180deg, #3c8af8, #38cddd);
  // color: #ffffff;

  .league-name {
    font-size: 50rpx;
    font-weight: bold;
    text-align: center;
    letter-spacing: 2rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
    margin: 10rpx 0 30rpx;
    position: relative;
    display: inline-block;
  }

  .league-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;

    .info-label {
      font-size: 28rpx;
      margin-bottom: 20rpx;
      opacity: 0.9;
    }

    .info-circle {
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      background: rgba(170, 170, 170, 0.2);
      border: 2rpx solid rgba(128, 128, 128, 0.4);
      backdrop-filter: blur(5rpx);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

      /* 悬停/点击效果 */
      &:active {
        transform: scale(0.95);
        background: rgba(255, 255, 255, 0.25);
      }

      text {
        font-size: 32rpx;
        font-weight: bold;
        // color: #ffffff;
      }
    }
  }
}
.cover {
  position: relative;
  width: 100%;
  overflow: hidden;

  image {
    height: 450rpx;
    width: 100%;
  }

  .preview-hint {
    position: absolute;
    bottom: 30rpx;
    right: 30rpx;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    display: flex;
    align-items: center;

    .hint-text {
      margin-left: 10rpx;
      font-size: 24rpx;
    }
  }

  &:active {
    opacity: 0.9;
  }
}
</style>
