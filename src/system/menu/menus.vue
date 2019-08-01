<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" align='center'>
      <el-form-item label="角色" collapse-tags>
        <el-input v-model="userName" placeholder="请填写角色"></el-input>
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
      <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <p>请选择创建类型</p>
        <div style="text-align: right; margin: 0">
          <el-button size="primary" type="mini" @click="handCreate">菜单</el-button>
          <!-- <el-button type="primary" size="mini" @click="dialogVisibleBtn = true">按钮</el-button> -->
        </div>
        <el-button v-hasPermission="'menu:add'" type="primary" icon="el-icon-plus" slot="reference">添加</el-button>
      </el-popover>
      <el-button-group class="buttonGroup">
        <el-button class="search" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">重置</el-button>
        <el-button type="primary" icon="el-icon-download">导出excal</el-button>
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
          <el-input v-model="temp.title" class="filter-item" placeholder="请填写菜单名"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuAddress')">
          <el-input class="filter-item" v-model="temp.path" placeholder="请填写菜单地址"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuName')">
          <el-input class="filter-item" v-model="temp.component" placeholder="请填写组件地址"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuImg')">
          <el-input class="filter-item" v-model="temp.icon" placeholder="请选择菜单图标">
            <el-button @click="IconOpen" slot="append" icon="el-icon-setting"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuRole')">
          <el-input class="filter-item" v-model="temp.permission" placeholder="请选择相关权限"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuSorting')">
          <el-input class="filter-item" v-model="temp.order" placeholder="菜单排序"></el-input>
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
import { fetchList, updateMenu, createMenu, treeList, updateTree } from '@/api/menu'
// table tree
import treeTable from '@/components/TreeTable'
import Pagination from '@/components/Pagination'
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
      visible: false,
      userName: '',
      treeKey: [],
      date: '',
      columns: [
        {
          text: '名称',
          value: 'title'
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
        }
      ],
      content: Array,
      total: 0,
      listLoading: true,
      calendarTypeOptions,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
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
        title: '',
        path: '',
        component: '',
        icon: '',
        permission: '',
        order: ''
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response.data)
        this.content = response.data.rows.children
        this.total = response.data.total
        // console.log(this.total)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        title: '',
        path: '',
        component: '',
        icon: '',
        permission: '',
        order: ''
      }
    },
    handCreate() {
      this.resetTemp()
      this.treeRole()
      this.visible = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.menuId = this.$refs.tree.getCheckedKeys()
          const tempData = Object.assign({}, this.temp)
          createMenu(tempData).then(() => {
            console.log(tempData)
            if (tempData.menuId.length > 1) {
              this.$notify({
                title: '失败',
                message: '最多只能选择一个上级部门,请修改',
                type: 'error'
              })
              return
            } else {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            }
          })
        }
      })
    },
    // 重置刷新
    handleRefresh() {
      this.listQuery.page = 1
      this.getList()
      this.date = ''
      this.userName = ''
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      const data = this.temp.id
      updateTree(data).then(response => {
        this.tree = response.data.rows.rows.children
        this.treeKey = response.data.menuIds
        this.$refs.tree.setCheckedKeys(this.treeKey)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp = {
            event: this.temp.event,
            address: this.temp.address,
            component: this.temp.component,
            icon: this.temp.icon,
            role: this.temp.role,
            sort: this.temp.sort,
            tree: this.tree,
            menuId: this.$refs.tree.getCheckedKeys()
          }
          const tempData = Object.assign({}, this.temp)
          updateMenu(tempData).then(() => {
            if (tempData.pId.length > 1) {
              this.$notify({
                title: '失败',
                message: '最多只能选择一个上级部门,请修改',
                type: 'error',
                duration: 2000
              })
              return
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
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
    }
  }
}
</script>
<style scoped>
  .el-form {
    margin-top: 10px
  }
</style>
