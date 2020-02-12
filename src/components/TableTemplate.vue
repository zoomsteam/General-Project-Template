<template>
  <div class="common-table" v-loading="loading">
    <header>
      <div class="header-operate">
        <!-- 操作按钮插槽 -->
        <slot name="operateBtn"></slot>
      </div>
      <div class="header-filter">
        <!-- 筛选项插槽 -->
        <slot name="filter"></slot>
        <el-select
          class="filter-iterm"
          v-if="propConfig.showFilter"
          v-model="filter"
          size="small"
          :placeholder="propConfig.filterPlaceholder"
          :clearable="true"
          filterable
          @change="handleSelect"
        >
          <el-option v-for="item in propConfig.filterOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker
          class="filter-iterm"
          v-if="propConfig.showDatePick"
          v-model="dateRange"
          size="small"
          :type="propConfig.datePickType"
          align="right"
          :clearable="true"
          :start-placeholder="propConfig.startPlaceholder"
          :end-placeholder="propConfig.endPlaceholder"
          @change="handleTimerange"
        ></el-date-picker>
        <el-input
          class="table-search filter-iterm"
          v-if="propConfig.showSearch"
          size="small"
          :placeholder="propConfig.searchPlaceholder"
          v-model="search"
          @keyup.13.native="toSearch"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="toSearch"></i>
        </el-input>
      </div>
    </header>
    <section class="table-area"></section>
    <el-pagination
      class="table-pagination"
      v-if="tableData.pageInfo.total > tableData.pageInfo.size"
      layout="total, prev, pager, next, jumper"
      :current-page.sync="tableData.pageInfo.page"
      :page-size="tableData.pageInfo.size"
      :total="tableData.pageInfo.total"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tableConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableData: {
      type: Object,
      default: () => {
        return {
          thead: [],
          tbody: [],
          isMulti: false,
          pageInfo: { page: 1, size: 10, total: 0 }
        }
      }
    },
    loading: { type: Boolean, default: false }
  },
  data () {
    return {
      defaultConfig: {
        btnList: [],
        showSearch: true,
        searchPlaceholder: '请输入',
        showFilter: false,
        filterPlaceholder: '请选择',
        filterOptions: [],
        showDatePick: false,
        datePickType: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      },
      search: '',
      dateRange: [],
      filter: ''
    }
  },
  computed: {
    propConfig () {
      return { ...this.defaultConfig, ...this.tableConfig }
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    eventBus (param, scope, scope2) {
      this.$emit(param, scope, scope2)
    },
    toSearch () {
      this.eventBus('turnPage', { search: this.search, page: 1 })
    },
    pageChange (val) {
      this.eventBus('turnPage', { page: val })
    },
    handleSelection (val) {
      let cluster = {
        id: [],
        status: [],
        grantee: [],
        rows: []
      }
      val.forEach(function (element) {
        cluster.id.push(element.id)
        cluster.status.push(element.status)
        cluster.rows.push(element)
        if (element.grantee) cluster.grantee.push(element.grantee)
      })
      this.eventBus('selectionChange', cluster)
    },
    handleSort (value) {
      this.eventBus('turnPage', {
        prop: value.prop,
        order: value.order
      })
    },
    handleTimerange () {
      this.eventBus('turnPage', {

      })
    },
    handleSelect () {
      this.eventBus('turnPage', {
        filter: this.filter
      })
    },
    toLink (url, row) {
      if (url) {
        this.$router.push(`${url}/${row.id}`).catch(err => {
          console.log(err)
        })
      } else {
        this.$router.push(this.$route.path + '/detail/' + row.id).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.common-table {
  background: #ffffff;
  header {
    height: 36px;
    margin-bottom: 18px;
    overflow: hidden;
    .header-operate {
      float: left;
    }
    .header-filter {
      float: right;
      .table-search {
        width: 200px;
        .el-icon-search {
          cursor: pointer;
        }
      }
      .el-select {
        width: 150px;
      }
      .filter-iterm {
        float: left;
        margin-left: 10px;
      }
      .el-date-editor--timerange,
      .el-date-editor--daterange {
        &.el-input__inner {
          width: 220px;
          .el-range-input {
            width: 70px;
          }
          .el-range__close-icon {
            width: 14px;
          }
        }
      }
    }
    .el-input__inner {
      height: 36px;
      border-radius: 4px;
      border: 1px solid #dcdee6;
      &:hover,
      &:focus {
        border-color: #1c92ff;
      }
    }
  }
}
</style>
