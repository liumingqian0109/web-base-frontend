<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="操作人" collapse-tags>
        <el-input v-model="user" placeholder="请填写操作人"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-button-group class="buttonGroup">
        <el-button class="search" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">重置</el-button>
        <el-button type="primary" icon="el-icon-download">导出excal</el-button>
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
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.description')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.timeConsuming')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timeConsuming }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.methods')" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.methods }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.parameter')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parameter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.IP')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.IP }}</span>
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
import { fetchList, updateLog } from '@/api/log'
export default {
  data() {
    return {
      user: '',
      date: '',
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
      console.log(this.list.indexOf(row))
      updateLog(row).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
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
