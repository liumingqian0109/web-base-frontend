<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" align='center'>
      <el-form-item label="菜单名称" collapse-tags>
        <el-input v-model="search.menuName" placeholder="请填写菜单名称"></el-input>
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
        <el-button class="search" @click="handleSearch" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="handCreate" v-hasPermission="'menu:add'" type="primary" icon="el-icon-plus">添加</el-button>
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">重置</el-button>
        <el-button type="primary" v-hasPermission="'menu:export'" @click="ExportData" icon="el-icon-download">导出excal</el-button>
      </el-button-group>
    </el-form>
    <!-- table -->
    <tree-table :data="content" :columns="columns" border/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item :label="$t('menu.menuName')" prop="type">
          <el-input v-model="temp.menuName" class="filter-item" placeholder="请填写菜单名"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuAddress')">
          <el-input class="filter-item" v-model="temp.path" placeholder="请填写菜单地址"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuComponent')">
          <el-input class="filter-item" v-model="temp.component" placeholder="请填写组件地址"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuImg')">
          <el-input class="filter-item" v-model="temp.icon" placeholder="请选择菜单图标">
            <el-button @click="IconOpen" slot="append" icon="el-icon-setting"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuRole')">
          <el-input class="filter-item" v-model="temp.perms" placeholder="请选择相关权限"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuSorting')">
          <el-input class="filter-item" v-model="temp.orderNum" placeholder="菜单排序"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.type')">
          <el-input class="filter-item" v-model="temp.type" placeholder="类型"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加窗口的树形结构 -->
      <el-tree
      :data="tree"
      ref="tree"
      check-strictly
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog
      class='IconDialog'
      title="选择菜单图标"
      :visible.sync="dialogVisibleIcon"
      width="50%"
      height="50%"
      :before-close="handleClose">
      <Icons @func='IconWrite'></Icons>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleIcon = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleIcon = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import Icons from './icon'
import { fetchList, updateMenu, createMenu, treeList, deleteMenu, excelMenu } from '@/api/menu'
// table tree
import treeTable from '@/components/TreeTable'
import Pagination from '@/components/Pagination'
import { parseTime2 } from '@/utils'
import waves from '@/directive/waves' // Waves directive
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
  name: 'TreeTableDemo',
  components: { treeTable, Pagination, Icons },
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
      search: {
        menuName: ''
      },
      treeKey: [],
      time: '',
      columns: [
        {
          text: '名称',
          value: 'title',
          width: '200'
        },
        {
          text: '图标',
          value: 'icon'
        },
        {
          text: '类型',
          value: 'type'
        },
        {
          text: '地址',
          value: 'path'
        },
        {
          text: 'VUE组件',
          value: 'component'
        },
        {
          text: '权限',
          value: 'permission'
        },
        {
          text: '创建时间',
          value: 'createTime'
        },
        {
          text: '修改时间',
          value: 'modifyTime'
        }
      ],
      content: Array,
      total: 0,
      listLoading: true,
      calendarTypeOptions,
      listQuery: {
        page: 1,
        limit: 20
      },
      props: {
        label: 'title',
        children: 'children'
      },
      dialogStatus: '',
      dialogFormVisible: false, // dialog开关
      dialogVisibleBtn: false,
      dialogVisibleIcon: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false, // dialog确定开关
      pvData: [],
      temp: {
        menuName: '',
        path: '',
        component: '',
        icon: '',
        perms: '',
        orderNum: ''
      },
      tree: '',
      list: ''
    }
  },
  created() {
    this.getList()
    this.treeRole()
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
      if (this.time === '') {
        this.search.createTimeFrom = ''
        this.search.createTimeTo = ''
      } else {
        this.search.createTimeFrom = this.formatTime(this.time[0])
        this.search.createTimeTo = this.formatTime(this.time[1])
      }
      this.search.listQuery = this.listQuery
      fetchList(this.search).then(response => {
        this.content = response.data.rows.children
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
    resetTemp() {
      this.temp = {
        menuName: '',
        path: '',
        component: '',
        icon: '',
        perms: '',
        orderNum: '',
        type: ''
      }
    },
    handCreate() {
      this.resetTemp()
      this.treeRole()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const menuId = this.$refs.tree.getCheckedKeys()
          this.temp.parentId = menuId[0]
          const tempData = Object.assign({}, this.temp)
          if (menuId.length > 1) {
            this.$notify({
              title: '失败',
              message: '最多只能选择一个上级部门,请修改',
              type: 'error'
            })
            return
          } else {
            createMenu(tempData).then(response => {
              // console.log(response.data)
              this.success(response.data)
              this.dialogFormVisible = false
            })
          }
        }
      })
    },
    // 重置刷新
    handleRefresh() {
      this.listQuery.page = 1
      this.date = ''
      this.userName = ''
      this.getList()
    },
    treeRole() {
      treeList().then(response => {
        this.tree = response.data.rows.children
      })
    },
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.menuName = row.title
      this.temp.orderNum = row.order
      this.temp.perms = row.permission
      const treeKey = []
      treeKey.push(row.parentId)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(row)
      treeList().then(response => {
        this.tree = response.data.rows.children
        this.$refs.tree.setCheckedKeys(treeKey)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const pIdArr = this.$refs.tree.getCheckedKeys()
          const tempData = {
            parentId: pIdArr[0],
            menuId: this.temp.id,
            menuName: this.temp.menuName,
            path: this.temp.path,
            component: this.temp.component,
            perms: this.temp.permission,
            type: this.temp.type,
            orderNum: this.temp.order,
            icon: this.temp.icon
          }
          console.log(tempData)
          if (pIdArr.length > 1) {
            this.$notify({
              title: '失败',
              message: '最多只能选择一个上级部门,请修改',
              type: 'error',
              duration: 2000
            })
            return
          } else {
            updateMenu(tempData).then(response => {
              // console.log(tempData)
              this.dialogFormVisible = false
              this.success(response.data)
            })
          }
        }
      })
    },
    handleDelete(row) {
      // console.log(row.id)
      const data = row.id
      deleteMenu(data).then(response => {
        this.success(response.data)
      })
    },
    handleClose() {
      this.dialogVisibleIcon = false
    },
    IconOpen() {
      this.dialogVisibleIcon = true
    },
    IconWrite(data) {
      this.temp.icon = data
      console.log(this.temp.icon)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    ExportData() {
      var time = new Date()
      import('@/vendor/Export2Excel').then(excel => {
        this.listLoading = true
        if (this.time === '') {
          this.search.createTimeFrom = ''
          this.search.createTimeTo = ''
        } else {
          this.search.createTimeFrom = this.formatTime(this.time[0])
          this.search.createTimeTo = this.formatTime(this.time[1])
        }
        this.search.listQuery = this.listQuery
        excelMenu(this.search).then(response => {
          // console.log(response)
          const tHeader = ['名称', '图标', '类型', '地址', 'VUE组件', '权限', '创建时间', '修改时间']
          // 与表头相对应的数据里边的字段
          const filterVal = ['menuName', 'icon', 'type', 'path', 'component', 'perms', 'createTime', 'modifyTime']
          const list = response.data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '菜单列表' + parseTime2(time)
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
  .el-form {
    margin-top: 10px
  }
</style>
