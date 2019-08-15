<template>
  <div>
    <el-form id="formTitle" :inline="true" class="demo-form-inline" :model="search" >
      <el-form-item label="用户名" collapse-tags>
        <el-input v-model="search.userName" placeholder="请填写名称"></el-input>
      </el-form-item>
      <el-form-item label="部门" collapse-tags>
        <el-select v-model="search.department" placeholder="请选择部门">
          <el-option>请选择部门</el-option>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="search.time"
          type="datetimerange"
          :picker-options="pickerOptions2"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-button class="search" @click="handleFilter" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button-group class="buttonGroup">
        <el-button v-hasPermission="'user:add'" type="primary" @click="handleCreate" icon="el-icon-plus">添加</el-button>
      </el-button-group>
      <el-button-group class="buttonGroup">
        <el-button v-hasPermission="'user:export'" type="primary" @click="ExportData" icon="el-icon-download">导出</el-button>
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
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('system.id')" prop="id" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.timestamp')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.username')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ssex" :label="$t('system.sex')" :formatter="sexChange" align="center">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.ssex | sexChange(scope.row) }}</span>
        </template> -->
      </el-table-column>
      <el-table-column :label="$t('system.department')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.tel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.mail')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.status')" class-name="status-col">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
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
            v-hasPermission="'user:update'"
            @click="handleUpdate(scope.row)"
          >{{ $t('table.edit') }}</el-button>
          <el-button
            v-if="scope.row.status!='deleted'"
            v-hasPermission="'user:delete'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(scope.row,'deleted')"
          >{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 添加编辑窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        hide-required-asterisk
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('system.username')" prop="username">
          <el-input v-model="temp.username" class="filter-item" placeholder="请填写用户名"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.password')" prop="password">
          <el-input show-password v-model="temp.password" class="filter-item" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.roleId')" prop="roleId">
          <el-select v-model="temp.roleId" class="filter-item" placeholder="请选择级别">
            <el-option
              v-for="item in selectRoleId"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.sex')">
          <el-select v-model="temp.ssex" class="filter-item" placeholder="请选择性别">
            <el-option
              v-for="item in selectSex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.tel')" prop="mobile">
          <el-input v-model="temp.mobile" class="filter-item" placeholder="请填写手机号"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.mail')">
          <el-input v-model="temp.email" class="filter-item" placeholder="请填写邮箱"></el-input>
        </el-form-item>
      </el-form>
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
import { fetchList, createUser, updateUser, deleteUser, exportUser } from '@/api/user'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
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
  name: 'UserName',
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
      user: 'admin',
      options: [
        { value: '1', label: '开发部' },
        { value: '2', label: '开发一部' },
        { value: '3', label: '开发二部' },
        { value: '4', label: '市场部' },
        { value: '5', label: '人事部' },
        { value: '6', label: '测试部' }
      ],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: [
        { value: '1', label: 'published' },
        { value: '2', label: 'draft' },
        { value: '3', label: 'deleted' }
      ],
      selectSex: [
        { value: '0', label: '男' },
        { value: '1', label: '女' },
        { value: '2', label: '保密' }
      ],
      selectRoleId: [
        { value: '1', label: '管理员' },
        { value: '2', label: '注册用户' },
        { value: '72', label: '普通用户' }
      ],
      showReviewer: false,
      temp: {
        status: '',
        username: '',
        ssex: '',
        deptName: '',
        mobile: '',
        email: '',
        roleId: '',
        password: ''
      },
      search: {
        department: '',
        time: '',
        userName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      // 校验
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择级别', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
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
      const deptId = this.search.department
      const username = this.search.userName
      const listQuery = this.listQuery
      var createTimeFrom
      var createTimeTo
      var data
      if (this.search.time === '') {
        createTimeFrom = ''
        createTimeTo = ''
      } else {
        createTimeFrom = this.formatTime(this.search.time[0])
        createTimeTo = this.formatTime(this.search.time[1])
      }
      data = {
        createTimeFrom,
        createTimeTo,
        deptId,
        username,
        listQuery
      }
      fetchList(data).then(response => {
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        status: '',
        username: '',
        ssex: '',
        deptName: '',
        mobile: '',
        email: '',
        password: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createUser(this.temp).then(response => {
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
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(response => {
            this.dialogFormVisible = false
            this.success(response.data)
          })
        }
      })
    },
    handleModifyStatus(row, status) {
      const data = row.userId
      deleteUser(data).then(response => {
        this.success(response)
      })
    },
    handleExport() {
      this.listLoading = true
      const deptId = this.search.department
      const username = this.search.userName
      const listQuery = this.listQuery
      var createTimeFrom
      var createTimeTo
      var data
      if (this.search.time === '') {
        createTimeFrom = ''
        createTimeTo = ''
      } else {
        createTimeFrom = this.formatTime(this.search.time[0])
        createTimeTo = this.formatTime(this.search.time[1])
      }
      data = {
        createTimeFrom,
        createTimeTo,
        deptId,
        username,
        listQuery
      }
      exportUser(data).then(() => {
        // console.log(response.data)
        // this.$notify({
        //   title: '失败',
        //   message: '导出成功',
        //   type: 'error',
        //   duration: 2000
        // })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    ExportData() {
      import('@/vendor/Export2Excel').then(excel => {
        // 表格的表头列表
        this.listLoading = true
        const deptId = this.search.department
        const username = this.search.userName
        const listQuery = this.listQuery
        var createTimeFrom
        var createTimeTo
        var data
        if (this.search.time === '') {
          createTimeFrom = ''
          createTimeTo = ''
        } else {
          createTimeFrom = this.formatTime(this.search.time[0])
          createTimeTo = this.formatTime(this.search.time[1])
        }
        data = {
          createTimeFrom,
          createTimeTo,
          deptId,
          username,
          listQuery
        }
        fetchList(data).then(response => {
          console.log(excel)
          const tHeader = ['序号', '创建时间', '用户管理', '性别', '部门', '手机号', '邮箱', '状态']
          // 与表头相对应的数据里边的字段
          const filterVal = ['userId', 'createTime', 'username', 'ssex', 'deptName', 'mobile', 'email', 'status']
          const list = response.data.rows
          const data = this.formatJson(filterVal, list)
          // 这里还是使用export_json_to_excel方法比较好，方便操作数据
          excel.export_json_to_excel(tHeader, data, '用户管理')
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      })
    },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => v[j]))
    // },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'createTime') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    sexChange(val) {
      if (val.ssex === '1') {
        return '女'
      } else if (val.ssex === '0') {
        return '男'
      } else {
        return '保密'
      }
    }
  }
}
</script>
<style scoped>
  #formTitle{
    text-align: center;
    margin-top: 5px
  }
</style>
