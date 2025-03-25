<template>
  <tm-app>
    <view class="activity-detail">
      <!-- 头部信息 -->
      <view class="header">
        <!-- 球队信息 - 只有当活动属于球队时才显示 -->
        <view class="team-logo-info" v-if="hasTeam">
          <view class="logo">
            <img :src="getBaseUrl() + actTeam.logo_path" alt="球队Logo">
          </view>
          <view class="basic-info">
            <h2>{{ actTeam.name }}</h2>
            <p class="stats">成员 {{ actTeam.memberCnt }} 活动 {{ actTeam.actCnt }}</p>
          </view>
        </view>

        <!-- 活动主要信息 -->
        <view class="info-list">
          <view class="ml-30">{{ activity.name }}</view>
          <view class="info-item">
            <view class="icon"><i class="calendar-icon"></i></view>
            <view class="text">{{ activity.start_time }}</view>
            <view class="views">{{ activity.viewCnt }}</view>
          </view>

          <view class="info-item">
            <view class="icon"><i class="location-icon"></i></view>
            <view class="text">{{ activity.address }}</view>
            <view class="nav-link">场地导航 ></view>
          </view>

          <view class="info-item">
            <view class="icon"><i class="type-icon"></i></view>
            <view class="text">{{ activity.type }}</view>
          </view>

          <view class="info-item">
            <view class="icon"><i class="fee-icon"></i></view>
            <view class="text">收费: {{ activity.fee }}</view>
          </view>
        </view>

        <!-- 发布者信息 -->
        <view class="publisher-info">
          <view class="publisher">
            <img :src="activity.publisher.avatar" alt="发布者头像" class="avatar">
            <span class="name">{{ activity.publisher.name }}</span>
          </view>
          <view class="rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ 'active': i <= activity.publisher.rating }"></span>
          </view>
        </view>

        <!-- 活动详细说明 -->
        <view class="activity-details">
          <p>时间: {{ activity.start_time }}</p>
          <p>需知:</p>
          <view class="details-content" v-html="activity.detailsHtml"></view>
          <view v-if="activity.detailsExpanded" class="more">展开</view>
        </view>
      </view>

      <!-- 报名信息 -->
      <view class="signup-section">
        <view class="signup-header">
          <view class="signup-count">报名 {{ activity.signupCnt }}/{{ activity.maxSignupCnt }}</view>
          <view class="signup-waiting">待定 {{ activity.waitingCnt }}</view>
          <view class="signup-declined">请假 {{ activity.declinedCnt }}</view>
        </view>

        <!-- 报名用户列表 -->
        <view class="attendees-list">
          <view v-for="(attendee, index) in activity.attendees" :key="index" class="attendee-item">
            <img :src="getBaseUrl() + attendee.avatar" alt="用户头像" class="avatar">
            <span class="name">{{ attendee.name }}</span>
          </view>
        </view>
      </view>
    </view>
  </tm-app>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
import { getBaseUrl } from '@/common/env';
import { debugLog } from '@/common/tools';

// 控制是否显示球队信息
const hasTeam = ref(false);  // 默认为false，表示由个人创建的活动

const actTeam = ref({
  id: '',
  name: '组织名称',
  logo_path: '',
  act_cnt: 0,
  join_cnt: 0,
  follow_cnt: 0
});

const activity = ref({
  name: '活动名称',
  viewCnt: 137,
  address: '活动地址',
  type: '活动类型',
  fee: '自定义收费 (未开启)',
  start_time: '开始时间',
  publisher: {
    name: '晓蒙',
    avatar: '/avatar1.png',
    rating: 4
  },
  detailsHtml: `
    1. 场地：东城区天坛东门足球场，地铁5号线天坛东门站C出口向东30米；<br>
    2. 费用AA，人均30元左右，每次招募14-16人左右，6人制场地（含门将6vs6或7vs7）；<br>
    3. 长期招募门将，专职门将免费；<br>
    4. 防止报名爽约及该场地预定需全额费用，请合理安排时间，报名后尽量不要请假，活动当日取消报名的队员仍需缴纳费用；报名后临时请假取消的请及时点击请假，以便腾出名额给其他需要报名参加的队友；首次报...
  `,
  detailsExpanded: false,
  signupCnt: 14,
  maxSignupCnt: 18,
  waitingCnt: 0,
  declinedCnt: 2,
  attendees: [
    { name: '晓蒙', avatar: '/avatar1.png' },
    { name: 'sunshuo', avatar: '/avatar2.png' },
    { name: 'jacklee', avatar: '/avatar3.png' },
    { name: '鞍', avatar: '/avatar4.png' },
    { name: '刘世华', avatar: '/avatar5.png' },
    { name: 'john', avatar: '/avatar6.png' }
  ]
});

onLoad((e: any) => {
  debugLog("DBG: e: ", e);
  if (!e.id) {
    uni.$tm.u.toast('活动ID为空!terminate');
    return;
  }
  uni.request({
    url: '/ballkeeper/get_activity/',
    method: 'GET',
    data: { activity_id: e.id },
    success: (res: any) => {
      debugLog("get_activity res: ", res);
      if (res.statusCode !== 200) {
        uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取失败');
        return;
      }
      uni.$tm.u.toast('获取活动成功!');
      activity.value = res.data.activity;
      debugLog("activity: ", activity.value);
    }
  });
});

// 实际应用中，可以在组件挂载后从API获取活动信息，并根据返回的数据设置hasTeam的值
// 例如：
// onMounted(async () => {
//   const activityData = await getActivityDetail(activityId);
//   if (activityData.teamId) {
//     hasTeam.value = true;
//     // 加载球队信息
//     const teamData = await getTeamDetail(activityData.teamId);
//     Object.assign(actTeam, teamData);
//   }
//   Object.assign(activity, activityData);
// });

// Vue 3下组件名称可以通过defineOptions设置(如果需要的话)
// defineOptions({
//   name: 'ActivityDetail'
// })
</script>

<style scoped>
.activity-detail {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.header {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.team-logo-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.basic-info h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.stats {
  color: #999;
  font-size: 14px;
  margin: 5px 0 0 0;
}

.info-list {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.icon {
  width: 24px;
  margin-right: 10px;
  color: #666;
}

.views {
  margin-left: auto;
  color: #999;
  font-size: 14px;
}

.nav-link {
  margin-left: auto;
  color: #666;
  font-size: 14px;
}

.publisher-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.publisher {
  display: flex;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.rating {
  margin-left: 10px;
}

.star {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #e0e0e0;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  margin-right: 2px;
}

.star.active {
  background-color: #ff9800;
}

.activity-details {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.more {
  color: #0984e3;
  text-align: center;
  padding: 5px;
  margin-top: 10px;
}

.signup-section {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
}

.signup-header {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.signup-count {
  font-weight: 500;
  margin-right: 15px;
}

.signup-waiting, .signup-declined {
  color: #666;
  margin-right: 15px;
}

.attendees-list {
  display: flex;
  flex-wrap: wrap;
}

.attendee-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 15px;
  width: 60px;
}

.attendee-item .avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 5px;
}

.attendee-item .name {
  font-size: 12px;
  text-align: center;
  color: #333;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 图标样式 */
.calendar-icon::before {
  content: "📅";
}

.location-icon::before {
  content: "📍";
}

.type-icon::before {
  content: "⚽";
}

.fee-icon::before {
  content: "💰";
}
</style>