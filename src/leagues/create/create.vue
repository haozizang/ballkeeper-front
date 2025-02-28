<template>
  <tm-app>
    <!-- 透明导航栏:暂不启用 -->
    <!-- <view> <custom-nav title="创建联赛"></custom-nav> </view> -->


    <tm-sheet :margin="[0, 0]" :padding="[0, 0]" :round="3" :shadow="2">
      <view class="cover" @click="uploadCover">
        <image :src="formData.cover || '../../static/image.jpg'" mode="aspectFill"></image>
        <view class="upload round-3 flex-row-center-center">
          <tm-icon name="tmicon-plus" color="white" :font-size="25"></tm-icon>
          <text class="ml-5">上传封面(800*500)</text>
        </view>
      </view>
      <tm-form @submit="confirm" :margin="[0, 0]" ref="form" v-model="formData" :label-width="150">
        <tm-form-item :margin="[15, 0]" required label="联赛名称" field="name" :rules="[{ required: true, message: '请输入联赛名称' }]">
          <tm-input v-model="formData.name" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="赛制" field="league_type_ind" :rules="[{ required: true, message: '请选择赛制' }]">
          <view @click="showLeagueTypeList = true" class="input-select round-3" :class="{ 'no-select': !formData.league_type_ind }"> {{ leagueTypeText }}</view>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="球场地址" field="address" :rules="[{ message: '请输入球场地址' }]">
          <tm-input v-model="formData.address" showClear></tm-input>
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
          <tm-input v-model="formData.mobile" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" required label="联系姓名" field="contactor" :rules="[{ required: true, message: '请输入联系人姓名' }]">
          <tm-input v-model="formData.contactor" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" label="联赛介绍" field="content">
          <tm-input type="textarea" :inputPadding="[24, 15]" :height="100" v-model="formData.content" showClear></tm-input>
        </tm-form-item>
        <tm-form-item :margin="[15, 0]" :border="false">
          <tm-button :margin="[15]" :shadow="0" :round="20" size="small" form-type="submit" block :label="formData.id ? '保存' : '立即创建'"></tm-button>
        </tm-form-item>
      </tm-form>
    </tm-sheet>
    <tm-picker v-model:show="showLeagueTypeList" :columns="leagueTypeList" mapKey="name" v-model="leagueTypeInd"></tm-picker>
  </tm-app>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { debugLog } from '@/common/tools';
import { myTeamDetail } from '@/common/index'
import { openLink } from '@/common/tools';
import { onLoad } from '@dcloudio/uni-app';
import {useUserStore} from '@/stores/user';
import { getBaseUrl } from '@/common/env';

const userStore = useUserStore();
const leagueTypeList = ref([
  { id: 0, name: '循环赛' },
  { id: 1, name: '淘汰赛' }
]);
const showLeagueTypeList = ref(false);
const leagueTypeInd = ref<number[]>([]);
const leagueTypeStr = ref('');
const formData = ref({
  cover: '',
  name: '',
  league_type_ind: leagueTypeList.value.length > 0 ? leagueTypeList.value[0].id : '',
  address: '',
  mobile: '',
  contactor: '',
  content: '',
  lat: 0,
  lon: 0,
  id: ''
});
const leagueTypeText = computed(() => {
  if (!leagueTypeList.value.length) return '请选择赛制'
  if (!formData.value.league_type_ind && formData.value.league_type_ind !== 0) return '请选择赛制'

  const leagueType = leagueTypeList.value.find(item => item.id === formData.value.league_type_ind)
  return leagueType ? leagueType.name : '请选择赛制'
})
watch(leagueTypeInd, (val) => {
  const selectedLeagueType = leagueTypeList.value[val[0]];
  if (selectedLeagueType) {
    formData.value.league_type_ind = selectedLeagueType.id;
    leagueTypeStr.value = selectedLeagueType.name;
  }
});
onMounted(() => {
  if (!formData.value.league_type_ind && leagueTypeList.value.length > 0) {
    formData.value.league_type_ind = leagueTypeList.value[0].id
  }
})
onLoad(async (e: any) => {
  if (e.id) {
    myTeamDetail({ id: e.id }).then(res => {
      if (res.code === 1000) {
        formData.value.id = e.id;
        formData.value.name = res.data.name;
        formData.value.address = res.data.address;
        formData.value.mobile = res.data.mobile;
        formData.value.name = res.data.name;
        formData.value.content = res.data.content;
        formData.value.cover = res.data.cover;
        leagueTypeList.value.map((item: any, index: number) => {
          item.children.map((row: any, rowIndex: number) => {
            if (row.id === res.data.league_type_ind) {
              leagueTypeInd.value = [index, rowIndex];
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
        const tempFilePath = res.tempFilePaths[0];
        uni.uploadFile({
            url: '/ballkeeper/upload_image/',
            filePath: tempFilePath,
            name: 'image',
            formData: {
                'image_type': 'cover',
            },
            success: (res) => {
                debugLog("uploadCover res: ", res);
                if (res.statusCode !== 200) {
                    const data_json = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                    uni.$tm.u.toast(`${data_json.detail}(${res.statusCode})` || '上传失败');
                    return;
                }
                const data = JSON.parse(res.data);
                debugLog("data: ", data);
                formData.value.cover = getBaseUrl() + data.img_path;
            },
            fail: (err) => {
                console.error('上传失败:', err);
                uni.$tm.u.toast('上传请求失败,请重试');
            }
        })
    },
  });
}

function confirm(e: any) {
  if (e.validate) {
    debugLog("e.data: ", e.data);
    debugLog("formData: ", formData.value);
    uni.request({
      url: '/ballkeeper/create_league/',
      method: 'POST',
      data: { ...e.data, creator: userStore.userInfo.username },
      success: (res: any) => {
        debugLog("create_league res: ", res);
        if (res.statusCode !== 200) {
          uni.$tm.u.toast(`${res.data.detail}(${res.statusCode})` || '创建失败');
          return;
        }
        uni.$tm.u.toast('创建成功!');
        if (e.data.id) {
          debugLog("DBG: 1");
          uni.navigateBack();
        } else {
          debugLog("DBG: 2");
          setTimeout(() => {
            debugLog("DBG: 3");
            openLink('/leagues/manage/manage?id=' + res.data.league.id)
          }, 1500)
          debugLog("DBG: 4");
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.page-content {
  /* 确保内容不被导航栏遮挡 */
  padding-top: 160rpx; /* 状态栏 + 导航栏高度 */
}
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
