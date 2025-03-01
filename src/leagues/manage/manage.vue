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
    </tm-sheet>
    <tm-sheet :margin="[0, 0, 0, 30]" :padding="[0, 0]">
        <view class="header-container">
          <view class="league-name">{{ leagueInfo.name }}</view>
        </view>
    </tm-sheet>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]">
      <view class="basic-info px-50 pt-30">
        <view class="flex flex-between text-align-center py-50">
          <view class="league-info">
            <view class="info-circle">
              <text>{{ getLeagueType(leagueInfo.league_type_ind) }}</text>
            </view>
            <view class="info-label">赛制</view>
          </view>
          <view class="league-info">
            <view class="info-circle">
              <text>{{ 10 }}</text>
            </view>
            <view class="info-label">参赛球队</view>
          </view>
          <view class="league-info">
            <view class="info-circle">
              <text>{{ '进行中' }}</text>
            </view>
            <view class="info-label">状态</view>
          </view>
        </view>
      </view>
    </tm-sheet>

  <view class="flex-row-center-between py-20 px-30 mt-20" :style="{ backgroundColor: '#dddddd' }">
    <view class="text-black">参赛球队</view>
    <view>
      <tm-icon name="tmicon-angle-right" color="#ffffff"></tm-icon>
    </view>
  </view>
  <view class="list bg-white">
    <view class="item flex-row-center-between pa-30"
          v-for="(item,index) in teamList"
          :key="index"
          @click="openLink('teams/detail/detail?id='+item.id)"
    >
      <view class="team-content flex flex-row">
        <!-- 左侧头像 -->
        <tm-avatar :font-size="120" :round="25" :img="getBaseUrl() + item.logo_path"></tm-avatar>

        <!-- 右侧内容 -->
        <view class="team-info ml-24">
          <view class="title text-overflow-1">{{item.title}}</view>
          <view class="tips text-overflow-2 mt-15">{{ item.content }}</view>
        </view>
      </view>
    </view>
  </view>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getBaseUrl } from '@/common/env';
import { openLink,timeText } from '@/common/tools';
import { onLoad } from '@dcloudio/uni-app';
import { delTeam } from '@/common/index';
import { debugLog } from '@/common/tools';
import { LEAGUE_TYPES } from '@/common/data';

const teamList = ref([
  { id: 1, logo_path: 'https://img1.baidu.com/it/u=3956679599,3956476954&fm=253&fmt=auto&app=138&f=JPEG?w=510&h=500', title: '万众篮球队', content: '内容' },
  { id: 2, logo_path: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', title: '功夫足球队', content: '足球' },
  { id: 3, logo_path: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', title: '兄弟连', content: '足球' },
  { id: 4, logo_path: 'https://img1.baidu.com/it/u=1697989098,4244944766&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=586', title: 'FC80S', content: '内容' }
]);

const teams = ref<any>([]);
onLoad((e: any) => {
  teams.value = [
    {
      title: '精神糖训练赛',
      cover: 'https://example.com/image1.jpg',
      address: '精神糖足球场',
      start_date: '2023-04-15',
      views: 150,
      is_hidden_views: false,
      _id: '1',
    },
    {
      title: '丰台区足球联赛',
      cover: 'https://example.com/image2.jpg',
      address: '上海博物馆',
      start_date: '2023-06-20',
      views: 100,
      is_hidden_views: false,
      _id: '2',
    },
    {
      title: '奥体中心篮球赛',
      cover: 'https://example.com/image3.jpg',
      address: '广州国际美食中心',
      start_date: '2023-09-10',
      views: 75,
      is_hidden_views: false,
      _id: '3',
    },
    {
      title: '冬季滑雪活动',
      cover: 'https://example.com/image4.jpg',
      address: '长白山滑雪场',
      start_date: '2023-12-05',
      views: 200,
      is_hidden_views: false,
      _id: '4',
    },
  ];
});

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
.header-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rpx 0;
}

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

.basic-info {
  // background: linear-gradient(180deg, #3c8af8, #38cddd);
  // color: #ffffff;

  .league-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;

    .info-label {
      font-size: 40rpx;
      margin-top: 20rpx;
      opacity: 0.9;
    }

    .info-circle {
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      background: #eeeeee;
      border: 5rpx solid #cccccc;
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
