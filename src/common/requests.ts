

// API服务函数 - 使用uni.request
export const apiService = {
  // 获取活动详情
  getActivity: (act_id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: '/ballkeeper/get_activity/',
        method: 'GET',
        data: { activity_id: act_id },
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject(new Error(`${res.data.detail}(${res.statusCode})` || '获取失败'));
            return;
          }
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  getTeam: (team_id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: '/ballkeeper/get_team/',
        method: 'GET',
        data: { team_id: team_id },
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject(new Error(`${res.data.detail}(${res.statusCode})` || '获取失败'));
            return;
          }
          resolve(res.data.team);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  // 获取用户信息
  getUser: (user_id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: '/ballkeeper/get_user/',
        method: 'GET',
        data: { user_id: user_id },
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject(new Error(`${res.data.detail}(${res.statusCode})` || '获取用户失败'));
            return;
          }
          resolve(res.data.user);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  getActUsers: (act_id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: '/ballkeeper/get_act_users/',
        method: 'GET',
        data: { act_id: act_id },
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject(new Error(`${res.data.detail}(${res.statusCode})` || '获取用户失败'));
            return;
          }
          resolve(res.data.user);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  signupAct: (act_id: number, user_id: number, signup_type: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: '/ballkeeper/signup_act/',
        method: 'POST',
        data: {
          act_id: act_id,
          user_id: user_id,
          signup_type: signup_type
        },
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject(new Error(`${res.data.detail}(${res.statusCode})` || '报名失败'));
            return;
          }
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
};