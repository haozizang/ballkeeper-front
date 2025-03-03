<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]" :round="3" :shadow="2">
      <tm-form @submit="confirm" :margin="[0, 0]" ref="form" v-model="formData" :label-width="180">
        <tm-form-item :margin="[15, 0]" required label="活动标题" field="title" :rules="[{ required: true, message: '请输入活动标题' }]">
          <tm-input v-model="formData.title" showClear placeholder="请输入活动标题"></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="选择球队" field="team_id" :rules="[{ message: '请选择球队' }]">
          <dx-select-team v-model="formData.team_id"></dx-select-team>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="活动分类" field="category_id" :rules="[{ required: true, message: '请选择活动分类' }]">
          <view @click="showCategory = true" class="input-select round-3" :class="{ 'no-select': !formData.category_id }"> {{ categoryText }}</view>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="开始时间" field="start_date" :rules="[{ required: true, message: '请选择开始时间' }]">
          <view @click="openSelectTime('start_date')" class="input-select round-3" :class="{ 'no-select': !formData.start_date }"> {{ start_date_text || '请选择开始时间' }}</view>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="活动地址" field="address" :rules="[{ message: '请输入或点击地图定位' }]">
          <tm-input v-model="formData.address" showClear>
            <template #right>
              <tm-icon name="tmicon-location" color="#999999" :font-size="30" @click="chooseAddress"></tm-icon>
            </template>
          </tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="是否公开" field="is_public">
          <tm-switch v-model="formData.is_public" :defaultValue="formData.is_public"></tm-switch>
        </tm-form-item>
      <tm-form-item :margin="[15, 0]" label="组织者电话" field="mobile" :rules="[{ message: '请输入组织者电话' }]">
          <tm-input v-model="formData.mobile" showClear></tm-input>
        </tm-form-item>
        <view class="mt-30 pl-30">活动介绍</view>
        <tm-form-item :margin="[15, 0]" required field="content" :rules="[{ required: true, message: '请输入活动介绍' }]">
          <dx-editor v-model="formData.content"></dx-editor>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" :border="false">
          <tm-button :margin="[15]" :shadow="0" :round="20" size="small" form-type="submit" block :label="formData.id ? '保存' : '立即发布'"></tm-button>
        </tm-form-item>
      </tm-form>
    </tm-sheet>
    <!--  -->
    <tm-picker v-model:show="showCategory" :columns="categoryList" mapKey="name" v-model="categoryIndex"></tm-picker>
    <!-- 时间 -->
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
import { ref,watch,computed } from 'vue';
import {myActivityInfo} from '@/common/index'
import {debugLog} from '@/common/tools'
import { onLoad } from '@dcloudio/uni-app';
import * as dayjs from "@/tmui/tool/dayjs/esm/index"

const categoryList = ref([
  { id: '0', name: '足球(6人制)' },
  { id: '1', name: '足球(8人制)' },
  { id: '2', name: '足球(11人制)' }
]);
const showCategory = ref(false);
const categoryIndex = ref<number[]>([]);
const categoryStr = ref('');
const categoryText = computed(() => {
  if (!formData.value.category_id) return '请选择活动分类';
  const category = categoryList.value.find(item => item.id === formData.value.category_id);
  return category ? category.name : '请选择活动分类';
})

const showDate = ref(false);
const dateStr = ref('');
const dateSAva = ref<number>();
const defaultDate = ref();
const currentField = ref('');
const start_date_text = ref('');
const formData = ref<any>({
  id: '',
  title: '',
  team_id: '',
  category_id: '',
  cover: '',
  address: '',
  lat: 0,
  lon: 0,
  start_date: 0,
  is_public: true,
  mobile: '',
  content: '',
});
function openSelectTime(field:string){
  currentField.value = field;
  showDate.value = true;
  if(formData.value[field]){
    defaultDate.value = formData.value[field];
  }else{
    defaultDate.value = new Date().getTime();
  }
}

function chooseAddress() {
  uni.chooseLocation({
    success: function (res) {
      formData.value.address = res.address;
      formData.value.lat = res.latitude;
      formData.value.lon = res.longitude;
    }
  });
}

watch(categoryIndex, (val) => {
  const selectedCategory = categoryList.value[val[0]];
  if (selectedCategory) {
    formData.value.category_id = selectedCategory.id;
    categoryStr.value = selectedCategory.name;
  }
});

watch(
  () => dateSAva.value,
  (val) => {
    console.log('dateSAva', val);
    switch (currentField.value) {
      case 'start_date':
        start_date_text.value = dateStr.value;
        formData.value.start_date = new Date(val as any).getTime();
        break;
      default:
        break;
    }
  }
);
onLoad(async (e: any) => {
  if (e.id) {
    myActivityInfo({ id: e.id }).then(res => {
      if (res.code === 1000) {
        formData.value.id = e.id;
        formData.value.is_public = res.data.is_public;
        formData.value.title = res.data.title;
        formData.value.address = res.data.address;
        formData.value.mobile = res.data.mobile;
        formData.value.content = res.data.content;
        formData.value.cover = res.data.cover;
        formData.value.team_id = res.data.team_id;      
        formData.value.start_date = res.data.start_date;
        start_date_text.value = dayjs.default(res.data.start_date).format('YYYY年MM月DD日 HH时mm分');
      }
    })
  }
})
function confirm(e:any) {
  debugLog('confirm',formData.value);
  if(e.validate){
    uni.request({
      url: '/ballkeeper/create_activity/',
      method: 'POST',
      data: {
        ...formData.value,
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
.cover {
  position: relative;
  width: 100%;
  image {
    height: 450rpx;
    width: 100%;
  }
  .upload {
    position: absolute;
    bottom: 30rpx;
    right: 30rpx;
    background: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    padding: 10rpx 20rpx;
  }
}
</style>
