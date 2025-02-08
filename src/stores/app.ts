import { defineStore } from 'pinia';
import { getBaseUrl } from '@/common/env';

export const useAppStore = defineStore('appStore', {
  state: () => {
    return {
      app_name: '',
      app_logo: '',
      app_carousel:[]
    };
  },
  actions: {
    setAppInfo(data : any) {
      this.app_name = data.name;
	  // NOTE: url = base_url + logo_path
      this.app_logo = getBaseUrl() + data.logo_path;
      this.app_carousel = data.app_carousel || [];
    },
  },
});