<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]" :transprent="true">
      <!-- <dx-home v-if="act_ind === 0"></dx-home> -->
      <dx-my-activity :category-list="categoryList" v-if="act_ind === 0"></dx-my-activity>
      <dx-activity :category-list="categoryList" v-else-if="act_ind === 1"></dx-activity>
      <dx-team :category-list="categoryList" v-else-if="act_ind == 3"></dx-team>
      <dx-member v-else-if="4"></dx-member>
    </tm-sheet>
    <view style="height: 150rpx"></view>
    <tm-tabbar :autoSelect="false" v-model:active="act_ind" :showSafe="false" @change="tabbarChange">
      <tm-tabbar-item @click="act_ind = 0" activeColor="#3c8af8" open-type="reLaunch" text="活动" icon="tmicon-md-home"></tm-tabbar-item>
      <tm-tabbar-item @click="act_ind = 1" activeColor="#3c8af8" text="球队" icon="tmicon-flag-fill"></tm-tabbar-item>
      <tm-tabbar-item
        :shadow="2"
        btn-top
        fontColor="white"
        activeColor="white"
        linear="top"
        linearDeep="accent"
        color="#38cdde"
        icon="tmicon-paperplane-fill"
        url="/others/publish/publish"
        text="发起" 
      ></tm-tabbar-item>
      <tm-tabbar-item @click="act_ind = 3" activeColor="#3c8af8" text="待定" icon="tmicon-layergroup-fill"></tm-tabbar-item>
      <tm-tabbar-item @click="act_ind = 4" activeColor="#3c8af8" text="我的" icon="tmicon-md-person"></tm-tabbar-item>
    </tm-tabbar>
  </tm-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getCategory } from '@/common/index';
const categoryList = ref<any>([]);
const act_ind = ref(0);
getCategory({
  level: 1,
}).then((res) => {
  if(res.code === 1000){
    categoryList.value = [{
      name:'全部',
      _id:'0'
    },...res.data];
  }
});
function tabbarChange(e: number) {
  switch(e){
    case 0:
      uni.setNavigationBarTitle({
        title: '活动',
      });
      break;
    case 1:
      uni.setNavigationBarTitle({
        title: '找活动',
      });
      break;
    case 3:
      uni.setNavigationBarTitle({
        title: '找球队',
      });
      break;
    case 4:
      uni.setNavigationBarTitle({
        title: '我的',
      });
      break;
  }
}

</script>

<style lang="scss" scoped>
</style>
