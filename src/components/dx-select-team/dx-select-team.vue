<template>
  <view class="input-select round-3" :class="{ 'no-select': !teamName }" @click="showWin = true">{{teamName||'请选择球队'}}</view>
  <tm-drawer ref="calendarView" placement="bottom" v-model:show="showWin" @ok="confirm">
    <tm-radio-group v-model="radio">
      <view class="item flex" v-for="(item, index) in teamList" :key="index">
        <view class="pl-15">
          <tm-radio :value="item.id"></tm-radio>
        </view>
        <view class="flex flex-between flex-1" @click="radio=item.id">
          <view class="flex">
            <tm-avatar :size="50" :img="getBaseUrl() + item.logo_path"></tm-avatar>
            <view class="title ml-15 text-overflow-1">{{item.name}}</view>
          </view>
          <view class="pr-30">
            <tm-icon name="tmicon-angle-right" size="20" color="#999"></tm-icon>
          </view>
        </view>
      </view>
    </tm-radio-group>
  </tm-drawer>
</template>

<script setup lang="ts">
import { ref,watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getBaseUrl } from '@/common/env';
import {debugLog} from '@/common/tools'

const props = defineProps<{
  modelValue: any;
}>();
const emit = defineEmits(['update:modelValue']);
const showWin = ref(false);
const radio = ref('');
const teamName = ref('');
const teamList = ref<any>([]);

// 添加一个默认的空元素，表示不选择球队的选项，创建独立活动
teamList.value.push({
  id: '0',
  name: '独立活动(不选择球队)',
});

onLoad(async (e: any) => {
  console.log('props.modelValue: ', props.modelValue);

  if (!props.modelValue) {
    uni.$tm.u.toast('无team_id传入,无法获取球队信息');
    return;
  }
  uni.request({
    url: '/ballkeeper/get_team/',
    method: 'GET',
    data: {
      team_id: props.modelValue,
    },
    success: (res: any) => {
      debugLog("get_team res: ", res);
      if (res.statusCode !== 200) {
        uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取球队失败');
        return;
      }
      teamList.value.push(res.data.team);
      // teamName.value = res.data.team.name;
    },
    fail: () => {
      uni.$tm.u.toast('获取球队失败,请重试');
    }
  })
})

watch(() => props.modelValue, (val) => {
  debugLog('DBG: props.modelValue: ', val);
  radio.value = val;
  teamName.value = teamList.value.find((item:any)=>item.id === val)?.name;
})

function confirm(){
  const item = teamList.value.find((item:any)=>item.id === radio.value);
  teamName.value = item?.name;
  emit('update:modelValue', radio.value);
  showWin.value = false;
}
</script>
<style lang="scss" scoped>
.item{
  width: 100%;
  padding: 15rpx 0;
  border-top: 1px solid #e8e8e8;
}
.flex{
  align-items: center;
}
</style>
