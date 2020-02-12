import axios from 'axios'
import Store from '@/store/index'
import { Message } from 'element-ui'
import { MUTATION_SIGN_OUT } from '@/store/mutation-types'

// 设置baseURL，判断当前环境是否为生产环境，若不是需设置自己的apiURL
let baseURL = process.env.NODE_ENV !== 'production' ? 'http://tv-api.91ctf.com/' : 'http://tv-api.91ctf.com/'
let config = {
  baseURL,
  timeout: 60 * 1000, // 请求超时时间
  headers: {
    Accept: 'application/json'
  }
}

const _axios = axios.create(config)

// http request 拦截器
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (localStorage.jwtToken) {
      config.headers.authorization = localStorage.jwtToken
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// http response 拦截器
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (response.headers.authorization) {
      localStorage.setItem('jwtToken', response.headers.authorization)
    }
    if (!response.data.code || response.data.code !== '00000') Message({ type: 'error', message: response.data.message })
    if (response.data.code === '40500') {
      Store.commit(MUTATION_SIGN_OUT)
      window.vm.$router.push({ name: 'login' }).catch(err => {
        console.log(err)
      })
      // localStorage.removeItem('jwtToken')
    }
    return response.data
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

// 二次封装方法
/**
 * 接收三个参数，配置参数config可不传
 * @param {String} url
 * @param {Object} data
 * @param {Object} config
 */
const getFn = async (url, data, config = {}) => {
  let params = { params: data, ...config }
  try {
    return _axios.get(url, params)
  } catch (error) {
    return handleError(error)
  }
}
/**
 * 接收三个参数，配置参数config可不传
 * @param {String} url
 * @param {Object} data
 * @param {Object} config
 */
const postFn = async (url, data, config = {}) => {
  try {
    return _axios.post(url, data, config)
  } catch (error) {
    return handleError(error)
  }
}
const deleteFn = async (url, data) => {
  try {
    return _axios.delete(url, data)
  } catch (error) {
    return handleError(error)
  }
}
// 捕获请求错误
// eslint-disable-next-line space-before-function-paren
function handleError(error) {
  Promise.reject(error)
}

export default {
  get: getFn,
  post: postFn,
  delete: deleteFn
}
