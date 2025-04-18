<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]" :round="3" :shadow="2">
      <tm-form @submit="confirm" :margin="[0, 0]" ref="form" v-model="ActForm" :label-width="180">
        <tm-form-item :margin="[15, 0]" required label="活动标题" field="name" :rules="[{ required: true, message: '请输入活动标题' }]">
          <tm-input v-model="ActForm.name" showClear placeholder="请输入活动标题"></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="选择球队" field="team_id" :rules="[{ required: true, message: '请选择球队' }]">
          <dx-select-team v-model="ActForm.team_id"></dx-select-team>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="活动分类" field="type_id" :rules="[{ required: true, message: '请选择活动分类' }]">
          <view @click="showActType = true" class="input-select round-3" :class="{ 'no-select': !ActForm.type_id }"> {{ actTypeText }}</view>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="人数上限" field="max_attend" :rules="[{ required: true, message: '请输入参加人数上限' }]">
          <tm-input v-model="ActForm.max_attend" type="number" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="开始时间" field="start_time" :rules="[{ required: true, message: '请选择开始时间' }]">
          <view @click="openSelectTime('start_time')" class="input-select round-3" :class="{ 'no-select': !ActForm.start_time }"> {{ start_time_text || '请选择开始时间' }}</view>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="活动地址" field="address" :rules="[{ message: '请输入或点击地图定位' }]">
          <tm-input v-model="ActForm.address" showClear>
            <template #right>
              <tm-icon name="tmicon-location" color="#999999" :font-size="30" @click="chooseAddress"></tm-icon>
            </template>
          </tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="是否公开" field="is_public">
          <tm-switch v-model="ActForm.is_public" :defaultValue="ActForm.is_public"></tm-switch>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="组织者电话" field="mobile" :rules="[{ message: '请输入组织者电话' }]">
          <tm-input v-model="ActForm.mobile" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="活动介绍" field="content">
          <tm-input type="textarea" :inputPadding="[24, 15]" :height="100" v-model="ActForm.content" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" :border="false">
          <tm-button :margin="[15]" :shadow="0" :round="20" size="small" form-type="submit" block :label="ActForm.id ? '保存' : '立即发布'"></tm-button>
        </tm-form-item>
      </tm-form>
    </tm-sheet>

    <tm-picker v-model:show="showActType" :columns="ACT_TYPES" mapKey="name" v-model="actTypeInd"></tm-picker>
    <tm-time-picker
      v-if="showDate"
      :showDetail="{
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
      }"
      v-model:show="showDate"
      v-model="dateSAva"
      :defaultValue="defaultDate"
      format="YYYY年MM月DD日 HH时mm分"
      v-model:model-str="dateStr"
    ></tm-time-picker>
  </tm-app>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {debugLog} from '@/common/tools'
import { ACT_TYPES } from '@/common/data'
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const showActType = ref(false);
const actTypeInd = computed({
  get: () => {
    const index = ACT_TYPES.findIndex(item => item.id === ActForm.value.type_id);
    return index >= 0 ? [index] : [0];
  },
  set: (newVal) => {
    const selectedActType = ACT_TYPES[newVal[0]];
    if (selectedActType) {
      ActForm.value.type_id = selectedActType.id;
    }
  }
});

const actTypeText = computed(() => {
  if (!ActForm.value.type_id) return '请选择活动分类';
  const actType = ACT_TYPES.find(item => item.id === ActForm.value.type_id);
  return actType ? actType.name : '请选择活动分类';
})

const showDate = ref(false);
const dateStr = ref('');
const dateSAva = ref<number>();
const defaultDate = ref();
const currentField = ref('');
const start_time_text = ref('');

const ActForm = ref<any>({
  name: '普通足球活动',
  creator_id: userStore.userInfo.id,
  team_id: -1,
  type_id: 0,
  cover_path: '',
  address: '',
  lat: 0,
  lon: 0,
  start_time: undefined,
  is_public: true,
  mobile: '',
  max_attend: 20,
  content: '',
});

function openSelectTime(field:string){
  currentField.value = field;
  showDate.value = true;
  if(ActForm.value[field]){
    defaultDate.value = ActForm.value[field];
  }else{
    defaultDate.value = new Date().getTime();
  }
}

function chooseAddress() {
  uni.chooseLocation({
    success: function (res) {
      ActForm.value.address = res.address;
      ActForm.value.lat = res.latitude;
      ActForm.value.lon = res.longitude;
    }
  });
}

watch(actTypeInd, (val) => {
  debugLog('actTypeInd: ', val);
  const selectedActType = ACT_TYPES[val[0]];
  if (selectedActType) {
    ActForm.value.type_id = selectedActType.id;
  }
}, {immediate: true});

watch(
  () => dateSAva.value,
  (val) => {
    console.log('dateSAva', val);
    switch (currentField.value) {
      case 'start_time':
        start_time_text.value = dateStr.value;
        ActForm.value.start_time = new Date(val as any).getTime();
        break;
      default:
        break;
    }
  }
);

onLoad(async (e: any) => {
  debugLog('userStore.userInfo.id: ', userStore.userInfo);
  if (userStore.userInfo.team_id) {
    ActForm.value.team_id = userStore.userInfo.team_id;
  }

  if (e.id) {
    /*
    myActivityInfo({ id: e.id }).then(res => {
      if (res.code === 1000) {
        ActForm.value.id = e.id;
        ActForm.value.is_public = res.data.is_public;
        ActForm.value.name = res.data.name;
        ActForm.value.address = res.data.address;
        ActForm.value.mobile = res.data.mobile;
        ActForm.value.content = res.data.content;
        ActForm.value.cover_path = res.data.cover_path;
        ActForm.value.team_id = res.data.team_id;
        ActForm.value.start_time = res.data.start_time;
        start_time_text.value = dayjs.default(res.data.start_time).format('YYYY年MM月DD日 HH时mm分');
      }
    })
    */
  }
})

function confirm(e:any) {
  debugLog('confirm', ActForm.value);
  if(e.validate){
    uni.request({
      url: '/ballkeeper/create_activity/',
      method: 'POST',
      data: {
        ...ActForm.value,
      },
      success: (res: any) => {
        debugLog("create_activity res: ", res);
        if (res.statusCode !== 200) {
          uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '获取失败');
          return;
        }
        uni.$tm.u.toast('创建活动成功!');
        uni.navigateBack();
      },
      fail: () => {
        uni.$tm.u.toast('创建活动失败,请重试');
      }
    })

    /*
    activitySave({
      ...e.data,
      form_list: activityStore.fieldList,
    }).then((res:any) => {
      uni.$tm.u.toast(res.message);
      if (res.code === 1000) {
        if (e.data.id) {
          uni.navigateBack();
        } else {
          setTimeout(() => {
            openLink('others/activity/manage?id=' + res.data)
          }, 1500)
        }
      }
    })
    */
  }
}
</script>
<style lang="scss" scoped>
</style>
