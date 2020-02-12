import axios from '@/plugins/axios'

/**
 * 获取直播链接
 * @param { Object } queryParams
 */
export const getLiveUrl = queryParams => {
  return axios.get('/api/stream/play-url', queryParams)
}
/**
 * 登录
 * @param { Object } queryParams
 */
export const login = queryParams => {
  return axios.post('/api/backend/login', queryParams)
}
/**
 * 登出
 * @param { Object } queryParams
 */
export const logout = queryParams => {
  return axios.post('/api/backend/logout', queryParams)
}
/**
 * 获取登录用户信息
 * @param { Object } queryParams
 */
export const getUserInfo = queryParams => {
  return axios.get('/api/backend/me', queryParams)
}
/**
 * 获取直播列表
 * @param { Object } queryParams
 */
export const getLiveList = queryParams => {
  return axios.get('/api/backend/stream/list', queryParams)
}
/**
 * 创建直播
 * @param { Object } queryParams
 */
export const createLive = queryParams => {
  return axios.post('/api/backend/stream/create', queryParams)
}
