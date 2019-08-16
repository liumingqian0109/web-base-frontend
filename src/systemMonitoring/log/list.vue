<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="操作人" collapse-tags>
        <el-input v-model="search.username" placeholder="请填写操作人"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="search.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-button-group class="buttonGroup">
        <el-button class="search" @click="handleSearch" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">重置</el-button>
        <el-button type="primary" @click="ExportData" icon="el-icon-download">导出excal</el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('system.user')" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.description')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.timeConsuming')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.methods')" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.parameter')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.IP')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { fetchList, deleteLog } from '@/api/log'
import { parseTime2 } from '@/utils'
export default {
  data() {
    return {
      search: {
        username: '',
        time: ''
      },
      list: '',
      listLoading: true, // 加载动画
      // 分页
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      total: 0,
      tableKey: 0
    }
  },
  created() {
    this.getList()
    // this.treeRole()
  },
  methods: {
    formatTime(value) {
      var d = new Date(value)
      const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
      const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
      return resDate + ' ' + resTime
    },
    p(s) {
      return s < 10 ? '0' + s : s
    },
    getList() {
      this.listLoading = true
      this.listQuery = this.search.listQuery
      if (this.search.time === '') {
        this.search.createTimeFrom = ''
        this.search.createTimeTo = ''
      } else {
        this.search.createTimeFrom = this.formatTime(this.search.time[0])
        this.search.createTimeTo = this.formatTime(this.search.time[1])
      }
      console.log(this.search)
      fetchList(this.search).then(response => {
        // console.log(response.data)
        this.list = response.data.rows
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleSearch() {
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleRefresh() {
      this.listQuery.page = 1
      this.getList()
      this.date = ''
      this.user = ''
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleDelete(row) {
      deleteLog(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    ExportData() {
      const timeName = new Date()
      import('@/vendor/Export2Excel').then(excel => {
        // 表格的表头列表
        this.listLoading = true
        this.listQuery = this.search.listQuery
        if (this.search.time === '') {
          this.search.createTimeFrom = ''
          this.search.createTimeTo = ''
        } else {
          this.search.createTimeFrom = this.formatTime(this.search.time[0])
          this.search.createTimeTo = this.formatTime(this.search.time[1])
        }
        // console.log(this.search)
        fetchList(this.search).then(response => {
          console.log(response.data)
          const tHeader = ['用户', '操作描述', '耗时', '执行方法', '方法参数', 'IP地址']
          // 与表头相对应的数据里边的字段
          const filterVal = ['username', 'operation', 'time', 'method', 'params', 'ip']
          const list = response.data.rows
          const data = this.formatJson(filterVal, list)
          // 这里还是使用export_json_to_excel方法比较好，方便操作数据
          // excel.export_table_to_excel(tHeader, data, '用户管理')
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '日志管理' + parseTime2(timeName)
          })
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>
<style scoped>
.el-form {
  text-align: center;
  margin-top: 10px;
}
</style>
