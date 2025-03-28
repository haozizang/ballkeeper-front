<template>
  <tm-app>
    <view class="activity-detail">
      <!-- 头部信息 -->
      <view class="header">
        <!-- 发布者与球队信息行 -->
        <view class="info-row">
          <!-- 发布者信息 -->
          <view class="publisher-info">
            <view class="publisher">
              <img :src="getBaseUrl() + publisher.avatar_path" alt="发布者头像" class="avatar">
              <span class="name">{{ publisher.username }}</span>
            </view>
          </view>
          
          <!-- 球队信息 - 只有当活动属于球队时才显示 -->
          <view class="team-logo-info" v-if="hasTeam">
            <view class="logo">
              <img :src="getBaseUrl() + actTeam.logo_path" alt="球队Logo">
            </view>
            <view class="basic-info">
              <h2>{{ actTeam.name }}</h2>
              <p class="stats">成员 {{ actTeam.member_cnt }} 活动 {{ actTeam.act_cnt }}</p>
            </view>
          </view>
        </view>

        <!-- 活动主要信息 -->
        <view class="info-list">
          <view class="info-item">
            <view class="activity-name">{{ activity.name }}</view>
          </view>
          <view class="info-item">
            <view class="icon"><i class="calendar-icon"></i></view>
            <view class="text">活动时间: {{ formatTime(activity.start_time) }}</view>
          </view>

          <view class="info-item">
            <view class="icon"><i class="location-icon"></i></view>
            <view class="text">地址: {{ activity.address }}</view>
            <view class="nav-link">场地导航 ></view>
          </view>

          <view class="info-item">
            <view class="icon"><i class="type-icon"></i></view>
            <view class="text">{{ ACT_TYPES.find(item => item.id === activity.type_id)?.name || '未知' }}</view>
          </view>

          <view class="info-item">
            <view class="icon"><i class="fee-icon"></i></view>
            <view class="text">收费: {{ activity.fee }}</view>
          </view>
          <!-- 活动详细说明 -->
          <!-- <view class="activity-details"> -->
          <view class="info-item flex-col">
            <p class="content-title">活动说明:</p>
            <view class="text content-block" style="white-space: pre-wrap;">{{ activity.content }}</view>
            <view v-if="activity.detailsExpanded" class="more">展开</view>
          </view>
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
          <view v-for="(attendee, index) in attendees" :key="index" class="attendee-item">
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
import { debugLog, formatTime } from '@/common/tools';
import { ACT_TYPES } from '@/common/data'
import { apiService } from '@/common/requests';
// 控制是否显示球队信息
const hasTeam = ref(false);  // 默认为false,表示由个人创建的活动

const actTeam = ref({
  id: '',
  name: '组织名称',
  logo_path: '',
  act_cnt: 0,
  member_cnt: 0,
  join_cnt: 0,
  follow_cnt: 0
});

const publisher = ref({
  username: '晓蒙',
  avatar_path: '',
});

const attendees = ref([
  { name: '晓蒙', avatar: '/avatar1.png' },
  { name: 'sunshuo', avatar: '/avatar2.png' },
  { name: 'jacklee', avatar: '/avatar3.png' },
  { name: '鞍', avatar: '/avatar4.png' },
  { name: '刘世华', avatar: '/avatar5.png' },
  { name: 'john', avatar: '/avatar6.png' }
]);

const activity = ref({
  name: '活动名称',
  address: '活动地址',
  type_id: 0,
  fee: '自定义收费 (未开启)',
  start_time: 0,
  content: '',
  detailsExpanded: false,
  signupCnt: 14,
  maxSignupCnt: 18,
  waitingCnt: 0,
  declinedCnt: 2
});

// 使用async/await和API服务
const getActInfo = async (act_id: any) => {
  try {
    // 获取活动数据
    const activityData = await apiService.getActivity(act_id);
    activity.value = activityData;
    debugLog("活动数据:", activity.value);

    if (activityData.team_id) {
      const teamData = await apiService.getTeam(activityData.team_id);
      actTeam.value = teamData;
      hasTeam.value = true;
    }

    // 如果有创建者ID，获取创建者信息
    if (activityData.creator_id) {
      const userData = await apiService.getUser(activityData.creator_id);
      publisher.value = userData;
      debugLog("发布者数据:", publisher.value);
    }


    const act_users = await apiService.getActUsers(activityData.id);
    attendees.value = act_users;
  } catch (error: any) {
    debugLog("请求错误:", error);
    uni.$tm.u.toast(error.message || '获取数据失败');
  }
};

onLoad((e: any) => {
  debugLog("DBG: e: ", e);
  if (!e.id) {
    uni.$tm.u.toast('活动ID为空!terminate');
    return;
  }

  // 执行数据加载
  getActInfo(e.id);
});
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

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.team-logo-info {
  display: flex;
  align-items: center;
  padding: 5px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  margin-left: auto;
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
}

.publisher {
  display: flex;
  align-items: center;
}

/* 活动名称样式 */
.activity-name {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  text-align: left;
  padding: 10px 15px;
  width: 100%;
  background-color: #ebebeb;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
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
  content: "⏰";
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

.flex-col {
  flex-direction: column;
  align-items: flex-start;
}

.content-title {
  margin-bottom: 10px;
  font-weight: bold;
}

.content-block {
  width: 100%;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 6px;
  font-size: 14px;
}

</style>