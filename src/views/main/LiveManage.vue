<template>
  <div class="live_manage">
    <common-table :tables="tables" :showSearch="false" :loading="loading" @turnPage="toGetList">
      <el-button type="primary" slot="header" @click="toAdd" size="medium">
        <i class="iconfont iconchuangjian"></i>
        创建直播
      </el-button>
    </common-table>
    <el-dialog title="创建直播" :visible.sync="operateDialog" width="500px" top="25vh">
      <el-form ref="operateForm" :model="operateForm" :rules="rules" label-width="100px" label-position="left">
        <el-form-item prop="streamName" label="流名称" style="margin-bottom: 0;">
          <el-input v-model="operateForm.streamName" placeholder="请输入流名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="operateDialog = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="toSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable'
import tableMixins from '@/components/table/tableMixins'
import { getLiveList, createLive } from '@/api/index'
export default {
  components: { CommonTable },
  mixins: [ tableMixins ],
  props: {},
  data () {
    return {
      operateDialog: false,
      operateForm: { streamName: '' },
      rules: {
        streamName: [{ required: true, message: '流名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    'operateDialog' (val) {
      if (!val) {
        this.$refs.operateForm.resetFields()
      }
    }
  },
  created () {
    if (this.$route.query.page) this.tables.pageInfo.page = this.$route.query.page
  },
  mounted () {
    // 设置表头信息
    this.theadSet()
    // 获取列表数据
    this.toGetList({ page: this.tables.pageInfo.page })
  },
  methods: {
    async toGetList (params) {
      this.loading = true
      this.searchCondition = Object.assign(this.searchCondition, params)
      let res = {}
      res = await getLiveList({ ...this.searchCondition })
      let formatData = this.setOperation(res)
      if (res && res.code === '00000') {
        this.afterListSet(formatData)
      } else this.loading = false
    },
    theadSet () {
      let thead = [
        {
          prop: 'name',
          label: '直播名称',
          minWidth: '150'
        }, {
          prop: 'publishUrl',
          label: '推流地址',
          minWidth: '350'
        }, {
          prop: 'status',
          label: '状态',
          minWidth: '100',
          formatFn: 'liveStatus'
        }
      ]
      this.tables.thead = [...thead]
    },
    toAdd () {
      this.operateDialog = true
    },
    toSubmit () {
      let that = this
      that.$refs['operateForm'].validate(async value => {
        if (!value) return false
        let res = {}
        res = await createLive(that.operateForm)
        if (res && res.code === '00000') {
          that.$message({ type: 'success', message: res.message })
          that.toGetList()
          that.operateDialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
