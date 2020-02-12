<template>
  <div class="common-table" v-loading="loading">
    <header class="table-header" v-if="showHeader">
      <div class="operate-area clearfix">
        <div class="header-operate">
          <slot name="header"></slot>
        </div>
        <div class="header-filter" v-if="!isHavaHideFilter">
          <slot name="filter"></slot>
          <el-select
            class="filter-item"
            v-if="showFilter"
            v-model="filter"
            size="small"
            :placeholder="filterScope"
            :clearable="true"
            filterable
            @change="handleSelect"
          >
            <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker
            class="filter-item"
            v-if="showDatePick"
            v-model="dateRange"
            :type="datePickType"
            :clearable="true"
            :start-placeholder="datePickStart"
            :end-placeholder="datePickEnd"
            :default-time="['00:00:00', '23:59:59']"
            align="right"
            range-separator="~"
            @change="handleTimerange"
          ></el-date-picker>
          <el-input
            class="table-search filter-item"
            v-if="showSearch"
            size="small"
            :placeholder="searchScope"
            v-model="search"
            :disabled="isDisabled"
            @keyup.13.native="toSearch"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="toSearch"></i>
          </el-input>
        </div>
        <div class="header-filter" v-if="isHavaHideFilter">
          <lucky-button @click="toShowFilterArea">
            {{$t('filterQuery')}}
            <i
              class="icon-right"
              :class="showFilterArea ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
          </lucky-button>
        </div>
      </div>
      <div class="filter-area clearfix" v-if="showFilterArea && isHavaHideFilter">
        <slot name="filter"></slot>
        <el-select
          class="filter-item"
          v-if="showFilter"
          v-model="filter"
          size="small"
          :placeholder="filterScope"
          :clearable="true"
          filterable
          @change="handleSelect"
        >
          <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker
          class="filter-item"
          v-if="showDatePick"
          v-model="dateRange"
          :type="datePickType"
          :clearable="true"
          :start-placeholder="datePickStart"
          :end-placeholder="datePickEnd"
          :default-time="['00:00:00', '23:59:59']"
          align="right"
          range-separator="~"
          @change="handleTimerange"
        ></el-date-picker>
        <el-input
          class="table-search filter-item"
          v-if="showSearch"
          size="small"
          :placeholder="searchScope"
          v-model="search"
          :disabled="isDisabled"
          @keyup.13.native="toSearch"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="toSearch"></i>
        </el-input>
      </div>
    </header>
    <section class="table-area">
      <el-table
        :data="tables.tbody"
        style="width: 100%"
        @selection-change="handleSelection"
        :load="treeLoad"
        lazy
        :indent="30"
        ref="commonTable"
        :cell-style="cellStyle"
        @sort-change="handleSort"
        :max-height="maxHeight"
        :tree-props="treeProps"
        :row-key="rowKey"
        :highlight-current-row="isHightLight"
        @row-click="handleRowClick"
      >
        <slot name="expandRow"></slot>
        <el-table-column v-if="tables.isMulti" type="selection" width="50"></el-table-column>
        <template v-for="(item, index) in tables.thead">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :sortable="item.sortable"
            :fixed="item.prop === 'operation' ? 'right' : false"
          >
            <template slot-scope="scope">
              <span class="table-operation" v-if="item.prop === 'operation' && scope.row.hasOwnProperty('operation')">
                <template v-for="(item, index) in scope.row.operation">
                  <span
                    class="text-btn"
                    v-if="!useMoreOpt || index < useMoreIndex"
                    :class="item.type"
                    :key="index"
                    @click="eventBus(item.event, scope.row)"
                  >{{item.text}}</span>
                </template>
                <el-dropdown
                  @command="handleCommand"
                  v-if="useMoreOpt && (scope.row.operation.length > useMoreIndex)"
                  trigger="click"
                  style="margin-left:10px;"
                >
                  <span class="text-btn">
                    {{$t('moreOptions')}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <template v-for="(item, index) in scope.row.operation">
                      <el-dropdown-item
                        v-if="index > (useMoreIndex - 1)"
                        :command="{opt:item, row: scope.row}"
                        :key="index"
                      >{{item.text}}</el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <span
                v-else-if="item.formatType === 'linkByName'"
                :class="item.formatClass || 'to-detail-link'"
                :title="scope.row[item.prop]"
                @click="toRouteName(scope.row, item.linkInfo)"
              >{{scope.row[item.prop]}}</span>
              <span
                v-else-if="item.formatType === 'link'"
                :class="item.formatClass || 'to-detail-link'"
                :title="scope.row[item.prop]"
                @click="toLink(item.linkUrl, scope.row, item.linkInfo)"
              >{{scope.row[item.prop]}}</span>
              <span
                v-else-if="item.formatType === 'hasParentLink'"
                :class="item.formatClass || 'to-detail-link'"
                :title="scope.row[item.prop]"
                @click="toLinkWithParent(item.linkUrl, scope.row)"
              >{{scope.row[item.prop]}}</span>
              <span
                class="default-cell"
                v-else-if="!item.formatFn || item.formatFn === ''"
                :title="scope.row[item.prop]"
              >{{scope.row[item.prop]}}</span>
              <span
                :class="item.formatFn"
                v-else-if="item.formatType === 'normal'"
                :title="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
                v-html="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
              ></span>
              <span
                v-else-if="item.formatType === 'has-empty-text-link'"
                :class="scope.row[item.prop] ? item.formatClass || 'to-detail-link' : 'default-cell'"
                :title="scope.row[item.prop] ? scope.row[item.prop] : '—'"
                @click="scope.row[item.prop] ? toLink(item.linkUrl, scope.row, item.linkInfo) : null"
                v-html="formatFunc('emptyText', scope.row[item.prop], scope.row)"
              ></span>
              <span
                class="default-cell"
                v-else-if="item.formatType === 'has-empty-text'"
                :title="scope.row[item.prop] ? scope.row[item.prop] : '—'"
                v-html="formatFunc('emptyText', scope.row[item.prop], scope.row)"
              ></span>
              <div v-else-if="item.formatType === 'dialog'" @click="eventBus('toShowDialog', scope.row)">
                <span
                  class="table-show-dialog"
                  :class="item.formatFn"
                  v-html="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
                ></span>
              </div>
              <el-tooltip
                v-else-if="item.formatType === 'tip'"
                class="item"
                effect="dark"
                :content="scope.row[item.prop] + ''"
                placement="top"
              >
                <span :class="item.formatFn" v-html="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"></span>
              </el-tooltip>
              <span :class="item.formatFn" v-else v-html="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"></span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </section>
    <el-pagination
      class="table-pagination"
      v-if="tables.pageInfo.total > tables.pageInfo.size"
      @current-change="pageChange"
      :current-page.sync="tables.pageInfo.page"
      :page-size="tables.pageInfo.size * 1"
      layout="total, prev, pager, next, jumper"
      :total="tables.pageInfo.total"
    ></el-pagination>
  </div>
</template>

<script>
import { timeToUnix } from '@/utils/time'
export default {
  components: {},
  props: {
    tables: {
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
    rowKey: { type: String, default: '' },
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: '',
          hasChildren: ''
        }
      }
    },
    tableIsExpand: { type: Boolean, default: false },
    rowExpand: { type: Boolean, default: false },
    maxHeight: { type: Number },
    clearFiletType: { type: String, default: '' },
    showHeader: { type: Boolean, default: true },
    useMoreOpt: { type: Boolean, default: false },
    useMoreIndex: { type: Number, default: 3 },
    datePickType: { type: String, default: 'daterange' },
    searchScope: { type: String, default: '请输入' },
    datePickStart: { type: String, default: '开始日期' },
    datePickEnd: { type: String, default: '结束日期' },
    filterScope: { type: String, default: '请选择' },
    loading: { type: Boolean, default: false },
    showSearch: { type: Boolean, default: true },
    showDatePick: { type: Boolean, default: false },
    showFilter: { type: Boolean, default: false },
    filterOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    isDisabled: { type: Boolean, default: false },
    isHightLight: { type: Boolean, default: false },
    isHavaHideFilter: { type: Boolean, default: false }
  },
  data () {
    return {
      showFilterArea: false,
      search: '',
      dateRange: [],
      filter: ''
    }
  },
  computed: {},
  watch: {
    'clearFiletType': function () {
      this.search = ''
    },
    // 监听select下拉，如果为空执行
    'isDisabled': function (newVal) {
      if (newVal === true) {
        this.search = ''
      }
    }
  },
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
    treeLoad (tree, treeNode, resolve) {
      resolve(tree.child)
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (this.rowExpand) {
        if (!row.hasChild && row.level === 1 && column.label === '名称') {
          return 'padding-left: 30px;'
        }
      }
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
    handleRowClick (row, column, event) {
      this.eventBus('rowClickEvent', row, column, event)
    },
    handleTimerange () {
      if (this.dateRange) {
        this.eventBus('turnPage', {
          startTime: timeToUnix(this.dateRange[0])[0],
          endTime: timeToUnix(this.dateRange[1])[0],
          page: 1
        })
      } else {
        this.eventBus('turnPage', {
          startTime: '',
          endTime: '',
          page: 1
        })
      }
    },
    handleSelect () {
      this.eventBus('turnPage', {
        filter: this.filter,
        page: 1
      })
    },
    toLinkWithParent (url, row) {
      this.$router.push({ path: `${url}/${row.id}`, query: { parentId: row.trainId } }).catch(err => {
        console.log(err)
      })
    },
    toLink (url, row, info) {
      if (info) {
        this.$orter.push({ name: info.name, params: { ...info.params, detailId: row.id } })
      } else if (url) {
        this.$router.push(`${url}/${row.id}`).catch(err => {
          console.log(err)
        })
      } else {
        this.$router.push(this.$route.path + '/detail/' + row.id).catch(err => {
          console.log(err)
        })
      }
    },
    toRouteName (row, info) {
      let params = {}
      if (info && info.idKey) this.$set(params, info.idKey, row[info.idKey])
      else this.$set(params, 'id', row.id)
      this.$router.push({ name: info.name, params: params }).catch(err => {
        console.log(err)
      })
    },
    handleCommand (val) {
      this.$emit(val.opt.event, val.row)
    },
    toShowFilterArea () {
      this.showFilterArea = !this.showFilterArea
    }
  }
}
</script>

<style lang="scss">
.common-table {
  background: #ffffff;
  .table-header {
    min-height: 36px;
    // margin-bottom: 20px;
    overflow: hidden;
    .operate-area {
      margin-bottom: 20px;
      .header-operate {
        float: left;
      }
      .header-filter {
        float: right;
        .el-cascader {
          line-height: 36px;
        }
        .table-search {
          width: 200px;
          .el-icon-search {
            cursor: pointer;
          }
        }
        .el-select {
          width: 150px;
        }
        .filter-item {
          float: left;
          margin-left: 10px;
        }
        .el-date-editor--timerange,
        .el-date-editor--daterange {
          &.el-input__inner {
            // width: 220px;
            .el-range-input {
              width: 70px;
            }
            .el-range__close-icon {
              width: 14px;
            }
          }
        }
      }
    }
    .filter-area {
      clear: both;
      text-align: right;
      margin-bottom: 20px;
      .filter-item {
        margin-left: 10px;
        &.set-level {
          position: relative;
          margin: 10px;
          &:hover {
            box-shadow: 0 0 6px 0 rgba(96, 98, 107, 0.12);
            border-radius: 4px;
          }
        }
      }
      .table-search {
        width: 200px;
        .el-icon-search {
          cursor: pointer;
        }
      }
      .el-select {
        width: 150px;
      }
      .el-input__inner {
        height: 36px;
      }
      .el-input-number .el-input__inner {
        text-align: left;
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
  .table-area {
    // background: #ffffff;
    border: 1px solid #dcdee6;
    border-radius: 4px;
    padding: 0 24px;
    .el-table {
      &::before {
        height: 0;
      }
      .el-table__row {
        .cell {
          font-size: 12px;
          color: #48494d;
          white-space: nowrap;
        }
      }
      .el-table__body {
        tr:last-child {
          td {
            border-bottom: 0;
          }
        }
      }
      td,
      th.is-leaf {
        border-bottom: 1px solid #dcdee6;
      }
      th {
        .cell {
          font-size: 12px;
          color: #909199;
          font-weight: normal;
        }
      }
      .el-table__empty-text {
        color: #c0c1cc;
      }
    }
  }
  .table-pagination {
    margin-top: 20px;
    text-align: center;
    color: #48494d;
    .el-pagination__total {
      font-size: 14px;
      color: #48494d;
    }
    .btn-next,
    .btn-prev {
      border: 0;
      color: #48494d;
      &:hover {
        color: #1c92ff;
      }
    }
    .el-pager {
      .number {
        border: 0;
        font-weight: bold;
        margin: 0 8px;
        &.active {
          background: #ffffff;
          color: #1c92ff;
        }
      }
      .more {
        border: 0;
      }
    }
    .el-pagination__editor {
      width: 55px;
    }
  }
  .level-icon {
    overflow: hidden;
    float: left;
    &.higeLevel {
      i {
        &.active {
          color: #ff6001;
        }
      }
    }
    i {
      font-size: 12px;
      color: #ffd7a6;
      &.active {
        color: #ff9901;
      }
    }
  }
  .level-tip {
    display: flex;
    width: 150px;
    justify-content: space-between;
    padding-top: 12px;
    .level-tip-item {
      width: 14px;
      height: 8px;
      border-radius: 2px;
      background-color: #ffd7a6;
      &.active {
        background-color: #ff9901;
      }
    }
    &.higeLevel {
      .level-tip-item {
        &.active {
          background-color: #ff6001;
        }
      }
    }
    &.lowLevel {
      .level-tip-item {
        background-color: #d1dbe5;
      }
    }
  }
  .table-show-dialog {
    color: #1c92ff;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
