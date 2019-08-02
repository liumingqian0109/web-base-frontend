<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" align='center'>
      <el-form-item label="部门名称" collapse-tags>
        <el-input v-model="search.deptName" placeholder="请填写部门名称"></el-input>
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
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">重置</el-button>
        <el-button type="primary" v-hasPermission="'dept:add'" @click="handCreate" icon="el-icon-plus">添加</el-button>
        <el-button type="primary" icon="el-icon-download">导出excal</el-button>
      </el-button-group>
    </el-form>
    <!-- table -->
    <tree-table :data="content" :columns="columns" border/>
    <!-- dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item :label="$t('department.departmentName')" prop="type">
          <el-input v-model="temp.title" class="filter-item" placeholder="请填写部门名称"></el-input>
        </el-form-item>
        <el-form-item :label="$t('department.departmentSort')">
          <el-input class="filter-item" v-model="temp.order" placeholder="请填写部门排序"></el-input>
        </el-form-item>
      </el-form>
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import { fetchList, updateDepartment, createDepartment, deleteDepartment } from '@/api/department'
import treeTable from '@/components/TreeTable'
import Pagination from '@/components/Pagination'
export default {
  name: 'TreeTableDemo',
  components: { treeTable, Pagination },
  data() {
    return {
      search: {
        deptName: ''
      },
      time: '',
      tree: '',
      dialogFormVisible: false,
      dialogStatus: '',
      updateTime: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      columns: [
        {
          text: '序号',
          value: 'id',
          width: 200
        },
        {
          text: '部门名称',
          value: 'title',
          width: 200
        },
        {
          text: '排序',
          value: 'order'
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
      temp: {
        title: '',
        order: ''
      },
      props: {
        label: 'title',
        children: 'children'
      },
      content: Array,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
    // this.treeRole()
  },
  filters: {
    formatDate: function(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
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
      if (this.time === '') {
        this.search.createTimeFrom = ''
        this.search.createTimeTo = ''
      } else {
        this.search.createTimeFrom = this.formatTime(this.time[0])
        this.search.createTimeTo = this.formatTime(this.time[1])
      }
      this.search.listQuery = this.listQuery
      // console.log(this.search)
      fetchList(this.search).then(response => {
        // console.log(response.data.rows.children)
        this.content = response.data.rows.children
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 重置
    handleRefresh() {
      this.listQuery.page = 1
      this.getList()
      this.time = ''
      this.search.dept = ''
    },
    // 搜索
    handleSearch() {
      this.listLoading = true
      this.getList()
    },
    handleNodeClick(data) {
      console.log(data)
    },
    treeRole() {
      fetchList().then(response => {
        this.tree = response.data.rows.children
      })
    },
    handCreate() {
      this.visible = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.treeRole()
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // this.temp.tree = this.tree
          const menuId = this.$refs.tree.getCheckedKeys()
          const temps = {
            deptName: this.temp.title,
            orderNum: this.temp.order,
            parentId: menuId[0]
          }
          const tempData = Object.assign({}, temps)
          if (menuId.length > 1) {
            this.$notify({
              title: '失败',
              message: '最多只能选择一个上级部门,请修改',
              type: 'error'
            })
            return
          } else {
            createDepartment(tempData).then(() => {
            // console.log(this.temp)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const treeKey = []
      treeKey.push(this.temp.parentId)
      // console.log(this.treeKey)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      fetchList().then(response => {
        this.tree = response.data.rows.children
        this.$refs.tree.setCheckedKeys(treeKey)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const menuId = this.$refs.tree.getCheckedKeys()
          this.temp = {
            deptName: this.temp.title,
            orderNum: this.temp.order,
            parentId: menuId[0],
            deptIds: this.temp.id
          }
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData)
          if (tempData.parentId.length > 1) {
            this.$notify({
              title: '失败',
              message: '最多只能选择一个上级部门,请修改',
              type: 'error',
              duration: 2000
            })
            return
          } else {
            updateDepartment(tempData).then(() => {
              console.log(tempData)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        }
      })
    },
    handleDelete(row) {
      console.log(row)
      const ids = row.id
      deleteDepartment(ids).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    // 树形结构拖曳
    // 节点开始拖曳时触发事件
    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    // 拖拽进入其他节点时触发的事件
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    // 拖拽离开某个节点时触发的事件
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    // 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    // 拖拽结束时（可能未成功）触发的事件
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    // 拖拽成功完成时触发的事件
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    }
  }
}
</script>
<style scoped>
  .el-form {
    margin-top: 10px
  }
</style>
