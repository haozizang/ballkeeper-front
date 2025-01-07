<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]" :transprent="true">
      <dx-home v-if="acc === 0"></dx-home>
      <dx-activity :category-list="categoryList" v-else-if="acc === 1"></dx-activity>
      <dx-team :category-list="categoryList" v-else-if="acc == 3"></dx-team>
      <dx-member v-else-if="4"></dx-member>
    </tm-sheet>
    <view style="height: 150rpx"></view>
    <tm-tabbar :autoSelect="false" v-model:active="acc" :showSafe="false" @change="tabbarChange">
      <tm-tabbar-item @click="acc = 0" activeColor="#3c8af8" open-type="reLaunch" text="首页" icon="tmicon-md-home"></tm-tabbar-item>
      <tm-tabbar-item @click="acc = 1" activeColor="#3c8af8" text="找活动" icon="tmicon-flag-fill"></tm-tabbar-item>
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
      ></tm-tabbar-item>
      <tm-tabbar-item @click="acc = 3" activeColor="#3c8af8" text="找组织" icon="tmicon-layergroup-fill"></tm-tabbar-item>
      <tm-tabbar-item @click="acc = 4" activeColor="#3c8af8" text="我的" icon="tmicon-md-person"></tm-tabbar-item>
    </tm-tabbar>
  </tm-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getCategory } from '@/common/index';
const categoryList = ref<any>([]);
const acc = ref(0);
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
        title: '首页',
      });
      break;
    case 1:
      uni.setNavigationBarTitle({
        title: '找活动',
      });
      break;
    case 3:
      uni.setNavigationBarTitle({
        title: '找组织',
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

<style lang="scss" scoped></style>
