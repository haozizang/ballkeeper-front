export enum ApiCode {
  SUCCESS = 0,          // 成功
  FAIL = -1,           // 通用失败
  INVALID_PARAMS = 400, // 参数错误
  UNAUTHORIZED = 401,   // 未授权
  SERVER_ERROR = 500,   // 服务器错误
}