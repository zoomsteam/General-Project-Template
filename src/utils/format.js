import { unixToTime } from './time'
export default {
  install (Vue, options) {
    Vue.prototype.formatFunc = (fnName = 'default', data = '', row = {}) => {
      const fnMap = {
        default: data => data,

        // 时间戳转换时间
        timeFormat: (data = 0, row) => {
          return unixToTime(data)[0]
        },
        // 直播状态转标签
        liveStatus: (data, row) => {
          return data === 'online' ? '在线' : '离线'
        }
      }
      return fnMap[fnName](data, row)
    }
  }
}
