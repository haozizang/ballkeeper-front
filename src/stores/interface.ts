export interface UserInfoState {
  // 前后端共有字段
  id: number;
  username: string;
  avatar_path: string;
  gender: number;
  mobile: string;
  team_id: number;

  // 前端独有字段
  token: string;
  tokenExpired: number;
  create_time: number;
}
