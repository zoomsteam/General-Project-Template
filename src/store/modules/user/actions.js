import { ACTION_SIGN_OUT, ACTION_SIGN_IN, ACTION_GET_USERINFO } from '../../action-types'
import { MUTATION_SIGN_IN, MUTATION_SIGN_OUT, MUTATION_GET_USERINFO } from '../../mutation-types'

export default {
  [ACTION_SIGN_OUT] ({ commit, state }, payload) {
    commit(MUTATION_SIGN_OUT, false)
  },
  [ACTION_SIGN_IN] ({ commit, state }, payload) {
    commit(MUTATION_SIGN_IN, true)
  },
  [ACTION_GET_USERINFO] ({ commit, state }, payload) {
    commit(MUTATION_GET_USERINFO, payload)
  }
}
