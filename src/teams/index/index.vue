<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]">
      <view class="list">
        <view class="item my-15 flex flex-between pa-30" @click="openLink('teams/detail/detail?id='+item._id)" v-for="(item, index) in list" :key="index">
          <view class="logo round-3">
            <tm-avatar :size="200" :img="item.logo"></tm-avatar>
            <view class="is_identification" v-if="item.is_identification">已认证</view>
          </view>
          <view class="flex-1 ml-30 right">
            <view class="top">
              <view class="name text-overflow-1">{{ item.title }}</view>
              <view class="tips mt-15 text-overflow-2">{{ item.content }}</view>
            </view>
            <view class="flex flex-between">
              <view class="tips">
                <text>活动数量:</text>
                <text class="mx-10 num">{{item.activity_count}}</text>
                <text>场</text>
              </view>
              <view>
                <view class="btn" @click.stop="openLink('teams/manage/manage?id='+item._id)">管理</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="load-more mt-15" v-if="list.length">
        <tm-divider align="center" :label="hasMore && loading?'加载中...':hasMore?'上拉加载更多～':'没有更多啦～'"></tm-divider>
      </view>
      <view class="mt-50 pt-50" v-else>
        <tm-result :showBtn="false" title="暂无数据～" subTitle=" " v-if="!list.length && !loading"></tm-result>
      </view>
      <view class="gap"></view>
      <!--  -->
      <view class="footer">
        <view class="btn" @click="openLink('teams/create/create')">创建组织</view>
      </view>
    </tm-sheet>
  </tm-app>
</template>
<script setup lang="ts">
import { openLink } from '@/common/tools';
import { ref } from 'vue';
import {myTeamList} from '@/common/index'
import { onReachBottom } from '@dcloudio/uni-app';
const list = ref<any>([]);
const hasMore = ref(true);
const loading = ref(false);
const param = ref({
  nextDate:'',
  limit:10
})
function getList(is_more = false){
  loading.value = true;
    myTeamList(param).then(res=>{
        if(res.code === 1000){
          if(res.data.length < param.value.limit || res.data.length === 0){
            hasMore.value = false
          }
          if(is_more){
            list.value = list.value.concat(res.data)
          }else{
            list.value = res.data
          }
        }
    }).finally(()=>{
      loading.value = false;
    })
}
getList()
onReachBottom(()=>{
   if(hasMore.value){
      param.value.nextDate = list.value[list.value.length - 1].create_date;
      getList();
   }
})
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  // &:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  // }
  .logo{
    position: relative;
    overflow: hidden;
    .is_identification{
      position: absolute;
      background-color: #0bbb08;
      color: #ffffff;
      font-size: 24rpx;
      top: 0rpx;
      padding: 5rpx 10rpx;
      left: 0rpx;
      border-bottom-right-radius: 15rpx;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 220rpx);
    .name{
      font-size: 30rpx;
      color: #333333;
    }
  }
  .num {
      color: #3c8af8;
      font-size: 35rpx;
    }
  .btn {
    background-color: #ffffff;
    border: 1px solid #6ca9ff;
    border-radius: 5px;
    padding: 3px 8px;
    font-size: 26rpx;
    color: #3c8af8;
  }
}
.gap {
  height: 150rpx;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30rpx 80rpx;
  background: #fff;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  .btn {
    width: 100%;
    background: #3c8af8;
    border-radius: 50rpx;
    padding: 15rpx 0;
    text-align: center;
    color: #ffffff;
  }
}
.load-more{
  padding: 0 25vw;
}
</style>
