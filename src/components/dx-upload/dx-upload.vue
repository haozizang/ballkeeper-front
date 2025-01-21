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
import { ref, watch, computed } from 'vue';
import { multiUpload } from '@/common/index';
import { debugLog } from '@/common/tools';
import { getBaseUrl } from '@/common/env';
import { ApiCode } from '@/common/data';

const props = withDefaults(defineProps<{
    modelValue: any,
    limit?: number,
    username?: string,
    img_name: string,
}>(), {
    limit: 1,
    username: '',
    img_name: '',
})
const emit = defineEmits(['update:modelValue']);

// 计算属性处理图片URL
const imageUrl = computed(() => {
    return props.modelValue || '';
});

// 是否显示上传按钮
const showUpload = computed(() => {
    return props.limit === 1 ? !props.modelValue : false;
});

watch(() => props.modelValue, (newVal) => {
    console.log("DBG: 2", newVal);
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
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (e) => {
            debugLog("selectImage res: ", e);
            const tempFilePath = e.tempFilePaths[0];
            uni.uploadFile({
                url: '/ballkeeper/upload_avatar/',
                filePath: tempFilePath,
                name: 'avatar',
                formData: {'username': props.username},
                success: (uploadRes) => {
                    debugLog("uploadFile res: ", uploadRes);
                    const data = JSON.parse(uploadRes.data);
                    debugLog("data: ", data);
 
                    let url = getBaseUrl() + data.data.avatar_url;
                    emit('update:modelValue', url);
                },
                fail: (err) => {
                    console.error('上传失败:', err);
                    uni.$tm.u.toast('上传失败,请重试');
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
