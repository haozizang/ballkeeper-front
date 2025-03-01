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

    <!-- 添加标签导航栏 -->
    <view class="tabs-container">
      <view 
        class="tab-item" 
        v-for="(tab, index) in tabs" 
        :key="index"
        :class="{ 'active-tab': activeTabIndex === index }"
        @click="activeTabIndex = index"
      >
        <text>{{ tab }}</text>
        <view class="tab-indicator" v-if="activeTabIndex === index"></view>
      </view>
    </view>

    <!-- 标签内容区域 -->
    <view class="tab-content">

      <view v-if="activeTabIndex === 0">
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
      </view>

      <!-- 参赛球队 -->
      <view v-if="activeTabIndex === 1">
        <view class="list">
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
      </view>

      <!-- 赛程 -->
      <view v-else-if="activeTabIndex === 2">
        <view class="schedule-list">
          <view class="schedule-header">近期赛程</view>
          <view class="schedule-item" v-for="(item, index) in scheduleList" :key="index">
            <view class="match-date">{{ item.date }} {{ item.time }}</view>
            <view class="match-teams">
              <view class="team-left">
                <text>{{ item.teamA }}</text>
                <tm-avatar size="60" :round="12" :img="item.teamALogo"></tm-avatar>
              </view>
              <view class="match-vs">VS</view>
              <view class="team-right">
                <tm-avatar size="60" :round="12" :img="item.teamBLogo"></tm-avatar>
                <text>{{ item.teamB }}</text>
              </view>
            </view>
            <view class="match-location">{{ item.location }}</view>
          </view>
        </view>
      </view>

      <!-- 积分榜 -->
      <view v-else-if="activeTabIndex === 3">
        <view class="standings">
          <view class="standings-header">
            <view class="rank-column">排名</view>
            <view class="team-column">球队</view>
            <view class="stats-column">胜/平/负</view>
            <view class="points-column">积分</view>
          </view>
          <view class="standings-item" v-for="(item, index) in standingsList" :key="index">
            <view class="rank-column">{{ index + 1 }}</view>
            <view class="team-column">
              <tm-avatar size="40" :round="8" :img="item.logo"></tm-avatar>
              <text class="team-name">{{ item.name }}</text>
            </view>
            <view class="stats-column">{{ item.wins }}/{{ item.draws }}/{{ item.losses }}</view>
            <view class="points-column">{{ item.points }}</view>
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

// 添加标签和内容切换相关代码
const tabs = ref(['基本信息', '参赛球队', '赛程', '积分榜']);
const activeTabIndex = ref(0);

const scheduleList = ref([
  { 
    date: '2025-03-02', 
    time: '11:00', 
    teamA: '云动足球队', 
    teamB: '嘟嘟妈妈英货铺',
    teamALogo: '/static/teams/team1.png',
    teamBLogo: '/static/teams/team2.png',
    location: '北京市第五十四中学东操场(黄-松)'
  },
  { 
    date: '2025-03-02', 
    time: '13:00', 
    teamA: '六艺足球队', 
    teamB: '鱼腩FC',
    teamALogo: '/static/teams/team3.png',
    teamBLogo: '/static/teams/team4.png',
    location: '北京市第五十四中学左操场(红-蓝)'
  },
  { 
    date: '2025-03-02', 
    time: '13:00', 
    teamA: '万聚广宏足球队', 
    teamB: '晋大狼足球队',
    teamALogo: '/static/teams/team5.png',
    teamBLogo: '/static/teams/team6.png',
    location: '北京市第五十四中学西操场(绿-白)'
  }
]);

const standingsList = ref([
  { name: '云动足球队', logo: '/static/teams/team1.png', wins: 5, draws: 2, losses: 1, points: 17 },
  { name: '六艺足球队', logo: '/static/teams/team2.png', wins: 4, draws: 3, losses: 1, points: 15 },
  { name: '万聚FC', logo: '/static/teams/team3.png', wins: 4, draws: 2, losses: 2, points: 14 },
  { name: '鱼腩FC', logo: '/static/teams/team4.png', wins: 3, draws: 3, losses: 2, points: 12 },
  { name: '嘟嘟妈妈英货铺', logo: '/static/teams/team5.png', wins: 3, draws: 2, losses: 3, points: 11 },
  { name: '晋大狼足球队', logo: '/static/teams/team6.png', wins: 2, draws: 2, losses: 4, points: 8 }
]);
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

// 添加标签样式
.tabs-container {
  display: flex;
  border-bottom: 1rpx solid #eee;
  background-color: #fff;
}

.tab-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 28rpx;
  color: #666;

  &.active-tab {
    color: #ff6b00;
    font-weight: 500;
  }

  .tab-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60rpx;
    height: 6rpx;
    background-color: #ff6b00;
    border-radius: 6rpx;
  }
}

// 标签内容区域样式
.tab-content {
  background-color: #f5f7fa;
  min-height: 600rpx;
}

// 列表样式
.list {
  background-color: #fff;

  .item {
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .team-content {
      width: 100%;
    }

    .team-info {
      flex: 1;

      .title {
        font-size: 32rpx;
        font-weight: 500;
      }

      .tips {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 赛程样式
.schedule-list {
  background-color: #fff;
  padding: 20rpx;

  .schedule-header {
    font-size: 28rpx;
    color: #999;
    padding: 20rpx;
    background-color: #f5f7fa;
    border-radius: 8rpx;
  }

  .schedule-item {
    margin: 20rpx 0;
    padding: 20rpx;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    background-color: #fff;

    .match-date {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 20rpx;
    }

    .match-teams {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .team-left, .team-right {
        display: flex;
        align-items: center;
        gap: 20rpx;
        width: 40%;

        text {
          font-size: 28rpx;
          font-weight: 500;
        }
      }

      .team-left {
        justify-content: flex-end;
      }

      .team-right {
        flex-direction: row-reverse;
      }

      .match-vs {
        font-size: 28rpx;
        color: #ff6b00;
        font-weight: bold;
      }
    }

    .match-location {
      font-size: 24rpx;
      color: #999;
      text-align: center;
    }
  }
}

// 积分榜样式
.standings {
  background-color: #fff;
  padding: 20rpx;

  .standings-header, .standings-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;

    .rank-column {
      width: 15%;
      text-align: center;
      font-weight: 500;
    }

    .team-column {
      width: 45%;
      display: flex;
      align-items: center;
      gap: 10rpx;

      .team-name {
        font-size: 28rpx;
        margin-left: 10rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .stats-column {
      width: 20%;
      text-align: center;
      font-size: 24rpx;
    }

    .points-column {
      width: 20%;
      text-align: center;
      font-weight: 600;
      color: #ff6b00;
    }
  }

  .standings-header {
    font-size: 24rpx;
    color: #999;
    background-color: #f5f7fa;
  }
}
</style>
