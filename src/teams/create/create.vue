<template>
  <tm-app>
    <tm-sheet :margin="[0, 0]" :padding="[0, 0]" :round="3" :shadow="2">
      <!-- <view class="cover" @click="uploadCover">
        <image :src="teamForm.cover || '../../static/image.jpg'" mode="aspectFill"></image>
        <view class="upload round-3 flex-row-center-center">
          <tm-icon name="tmicon-plus" color="white" :font-size="25"></tm-icon>
          <text class="ml-5">上传封面(800*500)</text>
        </view>
      </view> -->
      <tm-form @submit="confirm" :margin="[0, 0]" ref="form" v-model="teamForm" :label-width="150">
        <tm-form-item :margin="[15, 0]" required label="组织名称" field="name" :rules="[{ required: true, message: '请输入组织名称' }]">
          <tm-input v-model="teamForm.name" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="组织分类" field="category_id" :rules="[{ required: true, message: '请选择活动分类' }]">
          <view @click="showCategory = true" class="input-select round-3" :class="{ 'no-select': !teamForm.category_id }"> {{ categoryText }}</view>
        </tm-form-item>
        <!-- <tm-form-item :margin="[15, 0]" required label="组织地址" field="address" :rules="[{ required: true, message: '请输入或点击地图定位' }]">
          <tm-input v-model="teamForm.address" showClear>
            <template #right>
              <tm-icon name="tmicon-location" color="#999999" :font-size="30" @click="chooseAddress"></tm-icon>
            </template>
          </tm-input>
        </tm-form-item> -->
        <tm-form-item :margin="[15, 0]" label="是否公开" field="is_public">
          <tm-switch v-model="teamForm.is_public"></tm-switch>
        </tm-form-item>
        <tm-form-item
          :margin="[15, 0]"
          label="联系电话"
          field="mobile"
          :rules="[{ message: '请输入联系人电话' }, {
          validator: (val: string) => {
            if (!/^1[3456789]\d{9}$/.test(val)) {
              return false
            }
            return true
          },
          message: '请输入正确的手机号码'
        }]"
        >
          <tm-input v-model="teamForm.mobile" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="组织介绍" field="content">
          <tm-input type="textarea" :inputPadding="[24, 15]" :height="100" v-model="teamForm.content" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" :border="false">
          <tm-button :margin="[15]" :shadow="0" :round="20" size="small" form-type="submit" block :label="teamForm.id ? '保存' : '立即创建'"></tm-button>
        </tm-form-item>
      </tm-form>
    </tm-sheet>
    <!--  -->
    <tm-picker v-model:show="showCategory" :columns="categoryList" mapKey="name" v-model="categoryIndex"></tm-picker>
  </tm-app>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { debugLog } from '@/common/tools';
import { upload, myTeamDetail } from '@/common/index'
import { openLink } from '@/common/tools';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const categoryList = ref([
  { id: 2, name: '足球' },
  { id: 3, name: '其他' }
]);
const showCategory = ref(false);
const categoryIndex = ref<number[]>([]);
const categoryStr = ref('');
const teamForm = ref({
  cover: '',
  name: '',
  category_id: categoryList.value.length > 0 ? categoryList.value[0].id : '',
  is_public: false,
  address: '',
  mobile: '',
  content: '',
  lat: 0,
  lon: 0,
  id: ''
});
const categoryText = computed(() => {
  if (!categoryList.value.length) return '请选择分类'
  if (!teamForm.value.category_id && teamForm.value.category_id !== 0) return '请选择分类'

  const category = categoryList.value.find(item => item.id === teamForm.value.category_id)
  return category ? category.name : '请选择分类'
})
watch(categoryIndex, (val) => {
  const selectedCategory = categoryList.value[val[0]];
  if (selectedCategory) {
    teamForm.value.category_id = selectedCategory.id;
    categoryStr.value = selectedCategory.name;
  }
});
onMounted(() => {
  if (!teamForm.value.category_id && categoryList.value.length > 0) {
    teamForm.value.category_id = categoryList.value[0].id
  }
})
onLoad(async (e: any) => {
  if (e.id) {
    myTeamDetail({ id: e.id }).then(res => {
      if (res.code === 1000) {
        teamForm.value.id = e.id;
        teamForm.value.is_public = res.data.is_public;
        teamForm.value.name = res.data.name;
        teamForm.value.address = res.data.address;
        teamForm.value.mobile = res.data.mobile;
        teamForm.value.content = res.data.content;
        teamForm.value.cover = res.data.cover;
        categoryList.value.map((item: any, index: number) => {
          item.children.map((row: any, rowIndex: number) => {
            if (row.id === res.data.category_id) {
              categoryIndex.value = [index, rowIndex];
            }
          })
        })
      }
    })
  }
})
function uploadCover() {
  uni.chooseImage({
    count: 1,
    success(res: any) {
      upload(res.tempFiles[0]).then((url: any) => {
        teamForm.value.cover = url;
      });
    },
  });
}
function chooseAddress() {
  uni.chooseLocation({
    success: function (res) {
      teamForm.value.address = res.address;
      teamForm.value.lat = res.latitude;
      teamForm.value.lon = res.longitude;
    }
  });
}
function confirm(e: any) {
  if (e.validate) {
    debugLog("e.data: ", e.data);
    debugLog("teamForm: ", teamForm.value);
    uni.request({
      url: '/ballkeeper/create_team/',
      method: 'POST',
      data: { ...e.data, username: userStore.userInfo.username },
      success: (res: any) => {
        debugLog("create_team res: ", res);
        if (res.statusCode !== 200) {
          uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '创建失败');
          return;
        }
        uni.$tm.u.toast('创建成功!');
        userStore.userInfo.team_id = res.data.team.id;
        if (e.data.id) {
          uni.navigateBack();
        } else {
          setTimeout(() => {
            openLink('/teams/manage/manage?id=' + res.data.team.id)
          }, 1500)
        }
      }
    })
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
