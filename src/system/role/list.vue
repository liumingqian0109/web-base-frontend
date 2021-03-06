<template>
  <div>
    <el-form id="formTitle" :inline="true" class="demo-form-inline" align="center">
      <el-form-item label="角色" collapse-tags>
        <el-input v-model="userName" class='userName' placeholder="请填写角色"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-button-group class="buttonGroup">
        <el-button class="search" @click="handleFilter" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">重置</el-button>
        <el-button type="primary" v-hasPermission="'role:add'"  @click="handleCreate" icon="el-icon-plus">添加</el-button>
        <el-button type="primary" @click="ExportData" icon="el-icon-download">导出excal</el-button>
      </el-button-group>
    </el-form>
    <!-- table -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @selection-change="handleSelectChangeLeft"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('system.id')" prop="id" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.role')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.describe')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.timestamp')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.endTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.modifyTime }}</span>
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
            type="primary"
            size="mini"
            v-hasPermission="'role:update'"
            @click="handleUpdate(scope.row)"
          >{{ $t('table.edit') }}</el-button>
          <el-button
            v-if="scope.row.status!='deleted'"
            size="mini"
            type="danger"
            v-hasPermission="'role:delete'"
            @click="handleDelete(scope.row)"
          >{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item :label="$t('system.role')" prop="type">
          <el-input v-model="temp.roleName" class="filter-item" placeholder="请填写角色名"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.describe')">
          <el-input type="textarea" v-model="temp.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-tree
      :data="tree"
      ref="tree"
      check-on-click-node
      :props="props"
      show-checkbox
      current-node-key
      node-key="id"
      highlight-current
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      draggable></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, treeList, createRole, updateRole, updateTree, deleteRole } from '@/api/role'
import waves from '@/directive/waves' // Waves directive
import { parseTime2 } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { generateTitle } from '@/utils/i18n'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Role',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      userName: '',
      dialogStatus: '',
      time: '',
      tree: Array,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true, // 加载动画
      treeKey: [],
      // 分页
      pageNum: 1,
      pageList: 20,
      // 树形菜单
      props: {
        label: 'title',
        children: 'children'
      },
      calendarTypeOptions, // 国际化
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      showReviewer: false,
      // 数据
      temp: {
        id: '',
        roleName: '',
        remark: ''
      },
      dialogFormVisible: false, // dialog开关
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false, // dialog确定开关
      pvData: [],
      rules: {
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 时间戳转换
    formatTime(value) {
      var d = new Date(value)
      const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
      const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
      return resDate + ' ' + resTime
    },
    p(s) {
      return s < 10 ? '0' + s : s
    },
    success(res) {
      if (res.retureCode === 0) {
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.getList()
      } else {
        this.$notify({
          title: '失败',
          message: res.message,
          type: 'error',
          duration: 2000
        })
      }
    },
    getList() {
      this.listLoading = true
      // const deptId = this.search.department
      const roleName = this.userName
      const pageList = this.pageList
      const pageNum = this.pageNum
      var createTimeFrom
      var createTimeTo
      if (this.time === '') {
        createTimeFrom = ''
        createTimeTo = ''
      } else {
        createTimeFrom = this.formatTime(this.time[0])
        createTimeTo = this.formatTime(this.time[1])
      }
      const data = {
        createTimeFrom,
        createTimeTo,
        roleName,
        pageList,
        pageNum
      }
      fetchList(data).then(response => {
        console.log(response.data)
        this.list = response.data.rows
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },
    // 树形结构操作
    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    sortChange(data) {
      const { prop, roleId } = data
      if (prop === 'id') {
        this.sortByID(roleId)
      }
    },
    sortByID(roleId) {
      if (roleId === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        remark: '',
        roleName: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.treeRole()
    },
    handleRefresh() {
      this.listQuery.page = 1
      this.getList()
      this.date = ''
      this.userName = ''
    },
    createData() {
      const keyArr = this.$refs.tree.getCheckedKeys()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.menuId = keyArr
          createRole(this.temp).then(response => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.success(response.data)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      const data = this.temp.roleId
      treeList().then(response => {
        this.tree = response.data.rows.children
        updateTree(data).then(response => {
          // console.log(response.data)
          this.treeKey = response.data
          this.$refs.tree.setCheckedKeys(this.treeKey)
        })
      })
    },
    updateData() {
      const keyArr = this.$refs.tree.getCheckedKeys()
      // console.log(keyArr)
      this.temp.menuId = keyArr
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateRole(tempData).then(response => {
            console.log(response)
            this.dialogFormVisible = false
            this.success(response.data)
          })
        }
      })
    },
    handleDelete(row) {
      console.log(row)
      const data = row.roleId
      deleteRole(data).then(response => {
        this.success(response.data)
      })
    },
    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate)
    // },
    handleNodeClick(data) {
      console.log(data)
    },
    treeRole() {
      treeList().then(response => {
        console.log(response)
        this.tree = response.data.rows.children
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    handleSelectChangeLeft(rows) {
      var ids = []
      for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].id)
        var row = rows[i].id
      }
      ids.push(row)
      console.log(ids)
    },
    ExportData() {
      const time = new Date()
      import('@/vendor/Export2Excel').then(excel => {
        // 表格的表头列表
        this.listLoading = true
        // const deptId = this.search.department
        const roleName = this.userName
        const listQuery = this.listQuery
        var createTimeFrom
        var createTimeTo
        if (this.time === '') {
          createTimeFrom = ''
          createTimeTo = ''
        } else {
          createTimeFrom = this.formatTime(this.time[0])
          createTimeTo = this.formatTime(this.time[1])
        }
        const data = {
          createTimeFrom,
          createTimeTo,
          roleName,
          listQuery
        }
        fetchList(data).then(response => {
          const tHeader = ['序号', '角色', '描述', '创建时间', '修改时间']
          // 与表头相对应的数据里边的字段
          const filterVal = ['roleId', 'roleName', 'remark', 'createTime', 'modifyTime']
          const list = response.data.rows
          const data = this.formatJson(filterVal, list)
          // 这里还是使用export_json_to_excel方法比较好，方便操作数据
          // excel.export_table_to_excel(tHeader, data, '用户管理')
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '角色列表' + parseTime2(time)
          })
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      })
    }
  }
}
</script>
<style scoped>
  #formTitle{
    margin-top: 5px
  }
</style>
