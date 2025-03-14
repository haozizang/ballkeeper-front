import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserInfoState } from './interface';

// 用户store
export const useUserStore = defineStore('userStore', () => {
	const initInfo = {
		id: -1,
		username: '',
		avatar_path: '',
		gender: 0,
		mobile: '',
		team_id: 0,
		token: '',
		tokenExpired: 0,
		create_time: 0,
	};
	//用户信息
	const userInfo = ref<UserInfoState>(
		uni.getStorageSync('dx_activity_user_info') || initInfo
	);
	// 是否登录
	const isLogin = ref(false);
	// 设置用户信息
	const setUserInfo = (info : any) => {
		userInfo.value.id = info.id;
		userInfo.value.username = info.username;
		userInfo.value.avatar_path = info.avatar_path;
		userInfo.value.gender = info.gender;
		userInfo.value.mobile = info.mobile;
		userInfo.value.team_id = info.team_id;
		userInfo.value.create_time = info.create_time;

		// uni.setStorageSync('dx_activity_user_info', info);
		// uni.setStorageSync('uni_id_token', info.token);
		// uni.setStorageSync('uni_id_token_expired', info.tokenExpired);
		isLogin.value = true;
	};
	// 退出登录
	const logout = () => {
		if (!isLogin.value) return;
		isLogin.value = false;
		userInfo.value = initInfo;
		uni.clearStorageSync();
		console.log('退出登录');
		uni.reLaunch({
			url: '/pages/login/login',
		});
	};
	// 判断是否登录
	const checkLogin = () => {
		if (userInfo.value.tokenExpired - Date.now() <= 0) {
			logout();
		} else {
			isLogin.value = true;
		}
		return userInfo.value.tokenExpired - Date.now() <= 60000 && userInfo.value.tokenExpired - Date.now() > 0;
	};
	// 检查登录
	checkLogin();
	
	return {
		isLogin,
		userInfo,
		setUserInfo,
		checkLogin,
		logout,
	};
});