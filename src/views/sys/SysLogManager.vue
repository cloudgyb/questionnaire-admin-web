<template>
  <div>
    <div class="tool-box">
      <el-input @change="findLog" v-model="searchUserName" style="width:200px" placeholder="输入日志对应的用户名"></el-input>
      <el-button type="primary" @click="findLog"> <i class="el-icon-search"></i> 过滤</el-button>
      <el-button type="danger" class="float-right" @click="clearLog">
        <i class="el-icon-delete"></i>
        清空日志</el-button
      >
      <el-button type="warning" @click="deleteSelected" class="float-right" v-show="selectedLogs.length > 0">
        <i class="el-icon-delete"></i>
        删除所选</el-button
      >
    </div>
    <el-table :data="tableData" ref="table" @row-click="selectRow" stripe max-height="580" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" width="50" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="operation" label="内容" width="180" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="method" label="方法" width="200" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="params" label="参数" width="100" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="time" label="执行时长(ms)" width="120" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="ip" label="用户IP" width="150" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="createDate" label="产生时间" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="操作" label-class-name="table-label">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.$index, scope.row.id)" circle plain icon="el-icon-delete" title="点击删除"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      class="text-right page"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="page.pageSizes"
      :page-size="page.size"
      :layout="page.layout"
      :total="page.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import qs from 'qs'
import { defaultPage } from '@/utils/page'
export default {
  name: 'SysLogManager',
  data() {
    return {
      tableData: [],
      isLoading: true,
      loading: {},
      page: defaultPage,
      searchUserName: '',
      selectedLogs: []
    }
  },
  methods: {
    getLogList(pageNum, pageSize, username) {
      if (this.isLoading === true) {
        this.createLoading()
      }
      if (pageNum === undefined) pageNum = this.page.current
      if (pageSize === undefined) pageSize = this.page.size
      if (username === undefined) username = this.searchUserName
      this.$http.get('/sys/log/pageList?page=' + pageNum + '&limit=' + pageSize + '&username=' + username).then(resp => {
        let data = resp.data
        console.log(data)
        if (data.code === 0) {
          this.page = data.data
          this.tableData = this.page.records
        } else {
          this.$message.error(data.msg)
        }
        this.loading.close()
      })
    },
    findLog() {
      this.getLogList(1, this.page.size, this.searchUserName)
    },
    clearLog() {
      this.$http.post('/sys/log/clearLog').then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.tableData = []
          this.$message.success('日志已清空！')
        } else this.$message.error(data.msg)
      })
    },
    del(index, id) {
      let reqParam = qs.stringify({ id: id })
      let reqConfig = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      this.$http.post('/sys/log/delete', reqParam, reqConfig).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.tableData = []
          this.getLogList()
          this.$message.success('删除成功！')
        } else this.$message.error(data.msg)
      })
    },
    deleteSelected() {
      let ids = []
      this.selectedLogs.forEach(e => ids.push(e.id))
      this.$http.post('/sys/log/deleteMany', ids).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.getLogList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectedLogs = val
    },
    createLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.getLogList(this.page.current, size, '')
    },
    handleCurrentChange(page) {
      this.getLogList(page, this.page.size, '')
      console.log(`当前页: ${page}`)
    },
    selectRow(row) {
      if (row.selected === undefined) {
        row.selected = true
      } else {
        row.selected = !row.selected
      }
      this.$refs.table.toggleRowSelection(row, row.selected) //点击选中
    }
  },
  mounted: function() {
    this.getLogList(this.page.current, this.page.size, '')
  }
}
</script>

<style scoped>
.tool-box {
  margin-bottom: 10px;
}
.float-right {
  float: right;
}
.text-right {
  text-align: right;
}
.page {
  margin: 10px 10px 0 10px;
}
</style>
<style>
.table-label {
  color: #030303;
  font-weight: 800;
}
</style>
