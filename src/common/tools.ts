import * as dayjs from "@/tmui/tool/dayjs/esm/index"
import { computed } from "vue";
//导航
export const openLink = (url: string, type?: number) => {
  url = url.startsWith('/') ? url : `/${url}`;
  if (type) {
    uni.redirectTo({
      url,
    });
  } else {
    uni.navigateTo({
      url,
    });
  }
};

/**
 * 转树形
 * @param items
 * @param idField
 * @param pidField
 * @returns
 */
export const arrayToTree = function (items: any, idField = '_id', pidField = 'parent_id') {
  const result: any = []; // 存放结果集
  if (!items) return result;
  const itemMap: any = {}; //
  for (const item of items) {
    const id = item[idField];
    const pid = item[pidField];
    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }
    itemMap[id] = {
      ...item,
      children: itemMap[id]['children'],
    };
    const treeItem = itemMap[id];
    if (!pid) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
};

// debug专用日志
export const debugLog = function (...args: any[]) {
    // 创建一个错误对象以获取堆栈信息
    const stack = new Error().stack?.split("\n");
    if (!stack) return;
    // 获取调用的行
    const callerLine = stack[2].trim(); // 这通常是我们需要的调用函数行

    // 从 callerLine 中提取函数名和行号
    const match = callerLine.match(/at (.+):(\d+):(\d+)/);
    const functionName = match ? match[1] : 'unknown function';
    const lineNumber = match ? match[2] : 'unknown line';

    // 输出日志带上调用信息
    console.log(`[${functionName}:${lineNumber}]`, ...args);
};

/**
 * 格式化时间
 */
export const timeText = computed(() => (time: number) => {
  // 4月25日 周二
  const DayJs = dayjs.default;
  let str = DayJs(time).format('MM月DD日-d');
  let arr = str.split('-');
  let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return arr[0] + ' ' + week[Number(arr[1])]
})