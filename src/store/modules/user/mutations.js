import { MUTATION_SIGN_IN, MUTATION_SIGN_OUT, MUTATION_GET_USERINFO } from '../../mutation-types'

export default {
  [MUTATION_SIGN_IN] (state, payload) {
    state.isLogin = true
  },
  [MUTATION_SIGN_OUT] (state, payload) {
    state.isLogin = false
    localStorage.removeItem('jwtToken')
  },
  [MUTATION_GET_USERINFO] (state, payload) {
    state.userInfo = JSON.parse(JSON.stringify(payload))
  }
}
