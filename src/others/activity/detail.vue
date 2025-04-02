<template>
  <tm-app>
    <!-- 头部信息 -->
    <view class="header">
      <view class="activity-name">{{ activity.name }}</view>
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
        <view class="info-item flex-col">
          <p class="content-title">活动说明:</p>
          <view class="text content-block"
                :class="{'content-collapsed': !isContentExpanded && needFold}"
                style="white-space: pre-wrap;"
                ref="contentBlock">
            {{ activity.content }}
          </view>
          <view v-if="needFold" class="more" @click="toggleContent">
            {{ isContentExpanded ? '收起' : '展开' }}
            <text class="more-icon">{{ isContentExpanded ? '↑' : '↓' }}</text>
          </view>
        </view>
      </view>

    </view>

    <!-- 报名信息 -->
    <view class="signup-section">
      <!-- 报名用户列表 -->
      <view class="user-list-section">
        <view class="section-header">
          <view class="section-title">报名 {{ attendUsers.length }}/{{ activity.max_attend }}</view>
        </view>
        <view class="attendees-list">
          <view v-for="(user, index) in attendUsers" :key="index" class="user-item">
            <img :src="getBaseUrl() + user.avatar_path" alt="用户头像" class="avatar">
            <span class="name">{{ user.username }}</span>
          </view>
          <view class="empty-tip" v-if="attendUsers.length === 0">暂无报名用户</view>
        </view>
      </view>

      <!-- 待定用户列表 -->
      <view class="user-list-section">
        <view class="section-header">
          <view class="section-title">待定 {{ pendingUsers.length }}</view>
        </view>
        <view class="attendees-list">
          <view v-for="(user, index) in pendingUsers" :key="index" class="user-item">
            <img :src="getBaseUrl() + user.avatar_path" alt="用户头像" class="avatar">
            <span class="name">{{ user.username }}</span>
          </view>
          <view class="empty-tip" v-if="pendingUsers.length === 0">暂无待定用户</view>
        </view>
      </view>

      <!-- 请假用户列表 -->
      <view class="user-list-section">
        <view class="section-header">
          <view class="section-title">请假 {{ absentUsers.length }}</view>
        </view>
        <view class="attendees-list">
          <view v-for="(user, index) in absentUsers" :key="index" class="user-item">
            <img :src="getBaseUrl() + user.avatar" alt="用户头像" class="avatar">
            <span class="name">{{ user.name }}</span>
          </view>
          <view class="empty-tip" v-if="absentUsers.length === 0">暂无请假用户</view>
        </view>
      </view>
    </view>

    <!-- 底部固定操作按钮 -->
    <view class="fixed-bottom">
      <view class="action-buttons">
        <button class="btn btn-primary" @click="handleSignup">报名</button>
        <button class="btn btn-secondary" @click="handlePending">待定</button>
        <button class="btn btn-secondary" @click="handleLeave">请假</button>
      </view>
    </view>
  </tm-app>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, nextTick } from 'vue'
import { getBaseUrl } from '@/common/env';
import { debugLog, formatTime } from '@/common/tools';
import { ACT_TYPES, SIGNUP_TYPES } from '@/common/data'
import { apiService } from '@/common/requests';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

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

// 定义三种状态的用户列表
const attendUsers = ref<any[]>([]);
const pendingUsers = ref<any[]>([
  {
    name: 'user1',
    avatar: 'https://img.yzcdn.cn/vant/ipad.png',
  },
  {
    name: 'user2',
    avatar: 'https://img.yzcdn.cn/vant/ipad.png',
  },
]);
const absentUsers = ref<any[]>([]);

const activity = ref({
  id: 0,
  name: '活动名称',
  address: '活动地址',
  type_id: 0,
  fee: '自定义收费 (未开启)',
  start_time: 0,
  content: '',
  attend_cnt: 14,
  max_attend: 18,
  pending_cnt: 0,
  absent_cnt: 2
});

// 内容折叠相关
const isContentExpanded = ref(false);
const needFold = ref(false);
const contentBlock = ref<null>(null);
const MAX_CONTENT_HEIGHT = 80; // 最大显示高度

// 检查内容是否需要折叠
const checkContentHeight = () => {
  // 使用 uni.createSelectorQuery 获取元素高度
  const query = uni.createSelectorQuery();
  query.select('.content-block').boundingClientRect(data => {
    if (data && typeof data === 'object' && 'height' in data) {
      const rect = data as { height: number };
      if (rect.height > MAX_CONTENT_HEIGHT) {
        needFold.value = true;
      } else {
        needFold.value = false;
      }
    }
  }).exec();
};

// 切换内容展开/折叠状态
const toggleContent = () => {
  isContentExpanded.value = !isContentExpanded.value;
};

// 使用async/await和API服务
const getActInfo = async (act_id: any) => {
  try {
    // 获取活动数据
    const activityData = await apiService.getActivity(act_id);
    activity.value = activityData;
    debugLog("活动数据:", activity.value);

    if (activityData.team_id != -1) {
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

    try {
      const act_users = await apiService.getActUsers(activityData.id);
      debugLog("DBG: act_users: ", act_users);
      // 确保act_users是一个数组
      if (Array.isArray(act_users) && act_users.length > 0) {
        // 根据用户状态分类
        // 假设API返回的用户数据中有state字段：1=报名，2=待定，3=请假
        attendUsers.value = act_users.filter((user: any) => user.state === 1 || !user.state);
        pendingUsers.value = act_users.filter((user: any) => user.state === 2);
        absentUsers.value = act_users.filter((user: any) => user.state === 3);

        // 如果API没有提供state字段，可以先测试用临时数据
        if (attendUsers.value.length === 0 && pendingUsers.value.length === 0 && absentUsers.value.length === 0) {
          // 临时测试数据
          attendUsers.value = act_users.slice(0, Math.min(4, act_users.length));
          if (act_users.length > 4) {
            pendingUsers.value = act_users.slice(4, Math.min(5, act_users.length));
          }
          if (act_users.length > 5) {
            absentUsers.value = act_users.slice(5);
          }
        }
      } else {
        debugLog("错误: act_users不是数组", act_users);
        // 设置默认空数组，防止页面渲染错误
        // attendUsers.value = [];
        // pendingUsers.value = [];
        // absentUsers.value = [];
      }
      debugLog("DBG: attendUsers: ", attendUsers.value);
      debugLog("DBG: pendingUsers: ", pendingUsers.value);
      debugLog("DBG: absentUsers: ", absentUsers.value);
    } catch (userError) {
      debugLog("获取用户列表失败:", userError);
      // 设置默认空数组，防止页面渲染错误
      attendUsers.value = [];
      pendingUsers.value = [];
      absentUsers.value = [];
    }

    // 数据加载完成后，在下一个渲染周期检查内容高度
    nextTick(() => {
      checkContentHeight();
    });
  } catch (error: any) {
    debugLog("请求错误:", error);
    uni.$tm.u.toast(error.message || '获取数据失败');
  }
};

// 按钮点击处理函数
const handleSignup = async () => {
  debugLog("用户点击了报名按钮");
  const signup_resp = await apiService.signupAct(activity.value.id, userStore.userInfo.id, SIGNUP_TYPES.attend.id);
  debugLog("DBG: signup_resp: ", signup_resp);
  attendUsers.value.push(signup_resp.user);
};

const handleLeave = () => {
  debugLog("用户点击了请假按钮");
  uni.$tm.u.toast('请假功能开发中...');
  // TODO: 实现请假功能
};

const handlePending = () => {
  debugLog("用户点击了待定按钮");
  uni.$tm.u.toast('待定功能开发中...');
  // TODO: 实现待定功能
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
.header {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

/* 活动名称样式 */
.activity-name {
  font-size: 22px;
  font-weight: 700;
  color: #333333;
  text-align: center;
  padding: 10px 10px;
  width: 100%;
  background-color: #ebebeb;
  margin-bottom: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  padding-bottom: 0;
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

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.more {
  color: #0984e3;
  text-align: center;
  padding: 2px 5px;
  margin-top: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-icon {
  margin-left: 4px;
  font-weight: bold;
}

.signup-section {
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 70px;
}

.user-list-section {
  margin-bottom: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 8px;
}

.section-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-weight: 500;
  color: #333;
  font-size: 15px;
}

.attendees-list {
  display: flex;
  flex-wrap: wrap;
  min-height: 30px;
}

.attendees-list:empty {
  min-height: 0;
}

.empty-tip {
  width: 100%;
  text-align: center;
  color: #999;
  padding: 15px 0;
  font-size: 13px;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 10px;
  width: 55px;
}

.user-item .avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-bottom: 3px;
}

.user-item .name {
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
  transition: max-height 0.3s ease;
  overflow: hidden;
}

.content-collapsed {
  max-height: 80px;
  position: relative;
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}

/* 固定在底部的按钮 */
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 10px 15px;
  box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.btn {
  flex: 1;
  /* padding: 12px 0; */
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin: 0 8px;
  transition: all 0.2s ease;
  height: 40px;
  line-height: 45px;
}

.btn:first-child {
  margin-left: 0;
}

.btn:last-child {
  margin-right: 0;
}

.btn-primary {
  background-color: #3b7aff;
  color: white;
  box-shadow: 0 2px 5px rgba(59, 122, 255, 0.3);
}

.btn-primary:active {
  background-color: #2960d8;
  transform: translateY(1px);
}

.btn-secondary {
  background-color: #f2f2f2;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:active {
  background-color: #e5e5e5;
  transform: translateY(1px);
}
</style>