<template>
  <div class="manage_home">
    <div class="manage_header">
      <span>直播管理平台</span>
      <el-button class="to_exit" type="primary" size="small" @click="toExit">退 出</el-button>
    </div>
    <div class="manage_content">
      <div class="left_content">
        <el-menu
          :default-active="defaultActive"
          class="left-menu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#1c92ff"
          @select="handleSelect"
        >
          <el-menu-item v-for="(item, index) in currentMenuList" :key="index" :index="item.name">
            <i :class="item.icon" style="padding-right: 5px">&nbsp;&nbsp;</i>
            <span slot="title">{{item.desc}}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right_content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { logout } from '@/api/index'
export default {
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {
    defaultActive () {
      return this.$route.name
    },
    currentMenuList () {
      return [
        {
          name: 'liveManage',
          desc: '直播列表',
          icon: 'el-icon-video-camera-solid'
        }
      ]
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    ...mapActions([ 'ACTION_SIGN_OUT' ]),
    handleSelect (key, keyPath) {
      this.$router.push({ name: key }).catch(err => {
        console.log(err)
      })
    },
    async toExit () {
      let res = {}
      res = await logout(this.operateForm)
      if (res && res.code === '00000') {
        this.ACTION_SIGN_OUT()
        this.$router.push({ name: 'login' })
      }
    }
  }
}
</script>

<style lang="scss">
.manage_home {
  .manage_header {
    height: 50px;
    background: #545c64;
    box-shadow: 0 0 11px #555;
    color: #ffffff;
    line-height: 50px;
    padding: 0 20px;
    .to_exit {
      position: absolute;
      right: 20px;
      top: 9px;
    }
  }
  .manage_content {
    height: calc(100vh - 50px);
    .left_content {
      width: 200px;
      height: 100%;
      overflow: auto;
      float: left;
      border-right: solid 1px #e6e6e6;
      box-sizing: border-box;
      background: #545c64;
      .el-menu {
        border: 0;
        .el-menu-item {
          text-align: center;
          &.is-active {
            background: rgb(67, 74, 80) !important;
          }
        }
      }
    }
    .right_content {
      width: calc(100% - 200px);
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      float: right;
      padding: 20px;
    }
  }
}
</style>
