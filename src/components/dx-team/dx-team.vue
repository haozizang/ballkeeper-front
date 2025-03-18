<template>
  <view class="bg-white">
    <view class="activity-top">
      <view class="px-30 pt-30 pb-10">
        <tm-input prefix="tmicon-search" v-model="param.keyword"></tm-input>
      </view>
      <view>
        <tm-tabs @change="tabsChange" showTabsLineAni :item-width="80" :width="750" :height="90" default-name="2">
          <tm-tabs-pane v-for="(item, index) in props.categoryList" :key="index" :name="item.id" :title="item.name"> </tm-tabs-pane>
        </tm-tabs>
      </view>
    </view>

    <!-- 使用 scroll-view 替换原来的 view, 在组件中onReachBottom无效! -->
    <scroll-view
      scroll-y 
      class="content-wrapper"
      @scrolltolower="onLoadMore"
      :style="{ height: scrollViewHeight }"
    >
      <view class="list mt-40 bg-white">
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
              <view class="title text-overflow-1">{{ item.name }}</view>
              <view class="tips text-overflow-2 mt-15">{{ item.content }}</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
  <!-- 数据空 -->
  <view class="load-more px-50 pb-30" v-if="teamList.length">
    <tm-divider align="center" :label="hasMore && loading?'加载中...':hasMore?'上拉加载更多～':'没有更多啦～'"></tm-divider>
  </view>
  <view class="mt-50 py-50" v-else>
    <tm-result :showBtn="false" title="暂无数据～" subTitle=" " v-if="!teamList.length && !loading"></tm-result>
  </view>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { getBaseUrl } from '@/common/env';
import { openLink, debugLog } from '@/common/tools';
import { debounce } from '@/tmui/tool/function/util';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
  categoryList: any[];
}>();

const userStore = useUserStore();
const hasMore = ref(true);  // 是否还有更多球队
const loading = ref(false);

const teamList = ref([
  { id: 1, logo_path: 'https://img1.baidu.com/it/u=3956679599,3956476954&fm=253&fmt=auto&app=138&f=JPEG?w=510&h=500', title: '万众篮球队', content: '内容' },
  { id: 2, logo_path: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', title: '功夫足球队', content: '足球' },
  { id: 3, logo_path: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', title: '兄弟连', content: '足球' },
  { id: 4, logo_path: 'https://img1.baidu.com/it/u=1697989098,4244944766&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=586', title: 'FC80S', content: '内容' }
]);

const param = reactive<any>({
  parent_id: '',
  keyword: '',
  limit: 8,
  offset: 0
})

// watch 监听 param.keyword（搜索关键词）的变化
watch(() => param.keyword, () => {
  // debounce 防抖：在用户停止输入500ms后才发起请求
  debounce(() => {
    hasMore.value = true;  // 重置加载更多状态
    getTeamList(false);    // 重新加载第一页
  }, 500)
})

function tabsChange(e: string) {
  param.parent_id = e;
  getTeamList();
}

function getTeamList(is_more = false) {
  loading.value = true;

  // 如果不是加载更多，重置 offset
  if (!is_more) {
    param.offset = 0;
  }

  uni.request({
    url: "/ballkeeper/get_team_list/",
    method: 'POST',
    data: {
      username: userStore.userInfo.username,
      keyword: param.keyword,
      limit: param.limit,
      offset: param.offset
    },
    success: (res: any) => {
      debugLog("get_team_list res: ", res);
      if (res.statusCode !== 200) {
        uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取球队列表失败');
        return;
      }

      if (res.data.team_list.length < param.limit || res.data.team_list.length === 0) {
        hasMore.value = false;
      } else {
        // 更新 offset 用于下次加载
        param.offset += param.limit;
      }

      if (is_more) {
        teamList.value = teamList.value.concat(res.data.team_list);
      } else {
        teamList.value = res.data.team_list;
      }

      loading.value = false;
    },
    fail: () => {
      uni.$tm.u.toast('获取球队列表失败,请重试');
      loading.value = false;  // 确保失败时也重置加载状态
    }
  });
}

// 添加 scrollViewHeight 计算
const scrollViewHeight = ref('calc(100vh - 200rpx - 150rpx)');  // 减去顶部搜索和标签的高度

// 计算实际高度
onMounted(() => {
  // #ifdef H5
  scrollViewHeight.value = 'calc(100vh - 244rpx - 150rpx)';  // H5 环境需要考虑导航栏高度
  // #endif
})

// 触底加载更多的处理函数
function onLoadMore() {
  console.log('触底加载更多');
  debugLog('scrollViewHeight: ', scrollViewHeight.value);
  if (hasMore.value && !loading.value) {
    getTeamList(true);
  }
}

// 初始加载
getTeamList();
</script>
<style lang="scss" scoped>
.activity-top {
  position: fixed;
  // #ifndef H5
  top: 0;
  // #endif
  // #ifdef H5
  top: 44px;
  // #endif
  left: 0;
  right: 0;
  z-index: 999;
  background: #ffffff;
}

// 添加内容区域的样式
.content-wrapper {
  // 移除原来的 margin-top
  // #ifndef H5
  top: 200rpx;  // 非H5环境
  // #endif
  // #ifdef H5
  top: 244rpx;  // H5环境
  // #endif
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}

.list {
  width: 100%;

  .item {
    border-bottom: 6rpx solid rgb(230, 230, 230);  // 添加底部分割线
    background-color: #fff;

    &:last-child {
      border-bottom: none;  // 最后一个元素不需要分割线
    }
  }
}

.team-content {
  width: 100%;
  align-items: flex-start;
}

.team-info {
  flex: 1;
  padding-right: 20rpx;  // 右侧留出一些间距
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.tips {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}

// 添加点击效果
.item {
  transition: background-color 0.3s;

  &:active {
    background-color: #f5f5f5;
  }
}
</style>
