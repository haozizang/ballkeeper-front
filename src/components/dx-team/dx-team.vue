<template>
  <view class="bg-white">
    <view class="activity-top">
      <view class="px-30 pt-30 pb-10">
        <tm-input prefix="tmicon-search" v-model="param.keyword"></tm-input>
      </view>
      <view>
        <tm-tabs @change="tabsChange" showTabsLineAni :item-width="80" :width="750" :height="90" default-name="2">
          <tm-tabs-pane v-for="(item, index) in props.categoryList" :key="index" :name="item._id" :title="item.name"> </tm-tabs-pane>
        </tm-tabs>
      </view>
    </view>
    <!-- 添加顶部间距，防止被搜索栏遮挡 -->
    <view class="content-wrapper">
      <view class="list bg-white">
        <view class="item flex-row-center-between pa-30" 
              v-for="(item,index) in teamList" 
              :key="index" 
              @click="openLink('teams/detail/detail?id='+item._id)"
        >
          <view class="team-content flex flex-row">
            <!-- 左侧头像 -->
            <tm-avatar :font-size="120" :round="25" :img="item.logo"></tm-avatar>
            
            <!-- 右侧内容 -->
            <view class="team-info ml-24">
              <view class="title text-overflow-1">{{item.title}}</view>
              <view class="tips text-overflow-2 mt-15">{{ item.content }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
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
import { ref, reactive, watch } from 'vue';
import { openLink } from '@/common/tools';
import { debounce } from '@/tmui/tool/function/util';

const props = defineProps<{
  categoryList: any[];
}>();

const hasMore = ref(true);
const loading = ref(false);

const teamList = ref([
  { _id: 1, logo: 'https://img1.baidu.com/it/u=3956679599,3956476954&fm=253&fmt=auto&app=138&f=JPEG?w=510&h=500', title: '万众篮球队', content: '内容' },
  { _id: 2, logo: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', title: '功夫足球队', content: '足球' },
  { _id: 3, logo: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', title: '兄弟连', content: '足球' },
  { _id: 4, logo: 'https://img1.baidu.com/it/u=1697989098,4244944766&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=586', title: 'FC80S', content: '内容' }
]);

const param = reactive<any>({
  parent_id: '',
  nextDate: '',
  keyword: '',
  limit: 20
})

watch(() => param.keyword, () => {
  debounce(() => {
    getTeamList();
  }, 500)
})

function tabsChange(e: string) {
  param.parent_id = e;
  getTeamList();
}

function getTeamList(is_more = false) {
  loading.value = true;  // 设置加载状态
  
  // 模拟 API 调用
  setTimeout(() => {
    // 这里暂时使用静态数据，实际项目中应该替换为真实的 API 调用
    const mockData = teamList.value;
    
    if (mockData.length < param.limit) {
      hasMore.value = false;
    }
    
    if (is_more) {
      teamList.value = teamList.value.concat(mockData);
    } else {
      teamList.value = mockData;
    }
    
    loading.value = false;  // 重置加载状态
  }, 500);
  
  // 当你准备使用真实 API 时，取消注释下面的代码
  /*
  uni.showLoading({
    title: '加载中...'
  })
  teamList(param).then((res) => {
    if (res.code === 1000) {
      if (res.data.length < param.limit || res.data.length === 0) {
        hasMore.value = false
      }
      if (is_more) {
        teamList.value = teamList.value.concat(res.data)
      } else {
        teamList.value = res.data
      }
    }
  }).finally(() => {
    uni.hideLoading()
    loading.value = false  // 重置加载状态
  });
  */
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
  // #ifndef H5
  margin-top: 200rpx;  // 非H5环境
  // #endif
  // #ifdef H5
  margin-top: 244rpx;  // H5环境
  // #endif
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
