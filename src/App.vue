<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getUserInfo } from '@/api/index'
export default {
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
    if (this.$route.meta.requireAuth) this.toGetUserInfo()
  },
  mounted () {},
  methods: {
    ...mapActions([ 'ACTION_GET_USERINFO' ]),
    async toGetUserInfo () {
      let res = {}
      res = await getUserInfo()
      if (res.code && res.code === '00000') {
        this.ACTION_GET_USERINFO(res.data)
      }
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
