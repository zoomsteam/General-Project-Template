<template>
  <div class="live_show">
    <div id="qplayer" v-if="ifSuccess"></div>
    <div class="fail_text" v-else>{{failText}}</div>
  </div>
</template>

<script>
import { getLiveUrl } from '@/api/index'
export default {
  data () {
    return {
      player: '',
      ifSuccess: true,
      failText: '直播资源加载失败，请刷新页面重新尝试'
    }
  },
  computed: {
    token () {
      return this.$route.query.token
    }
  },
  created () {
  },
  mounted () {
    this.toGetLiveUrl()
  },
  methods: {
    async toGetLiveUrl () {
      let res = {}
      res = await getLiveUrl({ token: this.token })
      if (res.code && res.code === '00000') {
        if (res.data.status !== 'online') {
          this.ifSuccess = false
          this.failText = '主播不在家，去其他房间看看吧'
          return
        }
        this.ifSuccess = true
        this.player = new window.QPlayer({
          url: res.data.url,
          // url: 'http://pili-live-hls.91ctf.com/91ctf/demo.m3u8',
          container: document.getElementById('qplayer'),
          isLive: true,
          hls: {
            qualityName: ['低清', '标清', '高清', '超清']
          }
        })
      } else {
        this.ifSuccess = false
        this.failText = res.message
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.live_show {
  min-height: 500px;
  height: calc(100vh);
  overflow: hidden;
  #qplayer {
    height: 100%;
  }
  .fail_text {
    text-align: center;
    font-size: 30px;
    padding-top: 100px;
  }
}
</style>
