<template>
  <view class="dx-upload">
    <template v-if="limit === 1">
      <view class="item flex-center" v-if="!!modelValue">
        <image class="upload-img" :src="imageUrl"></image>
        <view class="close">
            <tm-icon name="tmicon-times-circle-fill" color="#fe1b00" @click="clearImage"></tm-icon>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="item flex-center" :class="{'ml-15':index%3!==0}" v-for="(item,index) in modelValue" :key="index">
        <image class="upload-img" :src="item"></image>
        <view class="close">
            <tm-icon name="tmicon-times-circle-fill" color="#fe1b00" @click="remove(index)"></tm-icon>
        </view>
      </view>
    </template>
    <view class="item flex-center ml-15" v-if="showUpload" @click="selectImage">
      <view>
        <tm-icon name="tmicon-plus" color="#999999"></tm-icon>
        <view class="tips">点击上传</view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { watch, computed } from 'vue';
import { debugLog } from '@/common/tools';
import { getBaseUrl } from '@/common/env';

const props = withDefaults(defineProps<{
    modelValue: any,
    limit?: number,
    image_name?: string,
    image_type?: string,
    username?: string,
}>(), {
    limit: 1,
    image_name: '',
    image_type: '',
    username: '',
})
const emit = defineEmits(['update:modelValue']);

// 计算属性处理图片URL
const imageUrl = computed(() => {
    debugLog("imageUrl: ", props.modelValue);
    return props.modelValue || '';
});

// 是否显示上传按钮
const showUpload = computed(() => {
    return props.limit === 1 ? !props.modelValue : false;
});

watch(() => props.modelValue, (newVal) => {
    if (props.limit === 1) {
        // No need to update the modelValue directly as it's already managed by the computed property
    } else {
        // No need to update the modelValue directly as it's already managed by the computed property
    }
}, {
    immediate: true
})

// 删除图片
function remove(index: number) {
    // No need to update the modelValue directly as it's already managed by the computed property
}

// 清除图片
function clearImage() {
    emit('update:modelValue', '');
}

function selectImage() {
    debugLog("username: ", props.username);
    debugLog("image_name: ", props.image_name);
    debugLog("image_type: ", props.image_type);
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (e) => {
            debugLog("selectImage res: ", e);
            const tempFilePath = e.tempFilePaths[0];
            uni.uploadFile({
                url: '/ballkeeper/upload_image/',
                filePath: tempFilePath,
                name: 'image',
                formData: {
                    'username': props.username,
                    'image_name': props.image_name,
                    'image_type': props.image_type,
                },
                success: (res) => {
                    debugLog("uploadFile res: ", res);
                    if (res.statusCode !== 200) {
                        const data_json = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                        uni.$tm.u.toast(`${data_json.detail}(${res.statusCode})` || '上传失败');
                        return;
                    }
                    const data = JSON.parse(res.data);
                    debugLog("data: ", data);
 
                    let url = getBaseUrl() + data.avatar_path;
                    emit('update:modelValue', url);
                },
                fail: (err) => {
                    console.error('上传失败:', err);
                    uni.$tm.u.toast('上传请求失败,请重试');
                }
            })
        }
    })
}

</script>
<style lang="scss" scoped>
.dx-upload{
    display: flex;
    flex-wrap: wrap;
    .item{
        margin-bottom: 15rpx;
        color: #888888;
        width: 180rpx;
        height: 180rpx;
        border: 2rpx dashed #b3c3e0;
        border-radius: 5rpx;
        position: relative;
        .upload-img{
            width: 100%;
            height: 100%;
        }
        .tips{
            font-size: 24rpx;
        }
        .close{
            position: absolute;
            top: 10rpx;
            right: 10rpx;
            z-index: 100;
            background: #ffffff;
            border-radius: 50%;
        }
    }
}
</style>
