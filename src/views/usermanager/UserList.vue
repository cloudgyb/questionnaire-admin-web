<template>
  <div>
    <div class="tool-box">
      <el-input @change="findUser" v-model="searchUserName" style="width:200px" placeholder="输入查找用户的用户名"></el-input>
      <el-button type="primary" @click="findUser"> <i class="el-icon-search"></i> 查找用户</el-button>
      <el-switch
        style="float:right;margin-top:10px"
        :title="isShowDeleteUser ? '显示' : '不显示'"
        v-model="isShowDeleteUser"
        active-color="#13ce66"
        active-text="是否显示注销用户"
        @change="changeShowDeleteUser"
      >
      </el-switch>
    </div>
    <el-table :data="tableData" stripe max-height="580" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="phone" label="电话" width="180" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="sex" label="性别" width="100" label-class-name="table-label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <i class="el-icon-male" style="color:#409EFF" v-if="scope.row.sex === 0" :title="formatSex(scope.row.sex)"></i>
          <i class="el-icon-female" style="color:#F56C6C" v-if="scope.row.sex === 1" :title="formatSex(scope.row.sex)"></i>
          <i class="el-icon-minus" style="color:#909399" v-if="scope.row.sex !== 1 && scope.row.sex !== 0" :title="formatSex(scope.row.sex)"></i>
        </template>
      </el-table-column>
      <el-table-column prop="isVip" label="vip？" width="100" label-class-name="table-label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.isVip === 0 ? 'danger' : 'success'">
            {{ formatVip(null, null, scope.row.isVip) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="注册日期" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="status" label="用户状态" label-class-name="table-label">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.status !== 0"
            :title="scope.row.status === 1 ? '用户未锁定,点击锁定' : '用户已锁定，点击解锁'"
            v-model="scope.row.status"
            active-color="#F56C6C"
            :active-value="2"
            active-icon-class="el-icon-lock"
            :inactive-value="1"
            inactive-icon-class="el-icon-unlock"
            :disabled="scope.row.status === 0"
            @change="switchUserStatus(scope.row.id, scope.row.status)"
          >
          </el-switch>
          <el-tag size="mini" type="danger" v-if="scope.row.status === 0">
            以被注销
          </el-tag>
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
import { defaultPage } from '@/utils/page'
import qs from 'qs'
export default {
  name: 'UserList',
  data() {
    return {
      tableData: [],
      isLoading: true,
      loading: {},
      page: defaultPage,
      searchUserName: '',
      isShowDeleteUser: true
    }
  },
  methods: {
    formatSex(cellValue) {
      if (cellValue === 0) return '男'
      else if (cellValue === 1) return '女'
      return '未知'
    },
    formatVip(row, column, cellValue) {
      if (cellValue === 0) return '否'
      else if (cellValue === 1) return '是'
      return '未知'
    },
    switchUserStatus(userId, status) {
      console.log(userId, status)
      let reqConfig = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }
      let reqParam = qs.stringify({ userId: userId })
      this.$http.post('/app/user/switchLock', reqParam, reqConfig).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          if (status === 1) {
            this.$message.success('用户已解锁！')
          } else if (status === 2) {
            this.$message.success('用户已锁定！')
          }
        } else {
          if (status === 1) {
            this.$message.success('用户解锁失败！')
          } else if (status === 2) {
            this.$message.success('用户锁定失败！')
          }
        }
      })
    },
    getUserList(pageNum, pageSize, username) {
      if (this.isLoading === true) {
        this.createLoading()
      }
      if (pageNum === undefined) pageNum = this.page.current
      if (pageSize === undefined) pageSize = this.page.size
      if (username === undefined) username = ''
      let reqURL = `/app/user/pageList?page=${pageNum}&limit=${pageSize}&isShowDeleteUser=${this.isShowDeleteUser}&username=${username}`
      this.$http.get(reqURL).then(resp => {
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
    changeShowDeleteUser(isShow) {
      console.log(isShow)
      this.isShowDeleteUser = isShow
      this.getUserList()
    },
    findUser() {
      this.getUserList(1, this.page.size, this.searchUserName)
    },
    createLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    addUser() {},
    updateUser() {},
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.getUserList(this.page.current, size, '')
    },
    handleCurrentChange(page) {
      this.getTypeList(page, this.page.size, '')
      console.log(`当前页: ${page}`)
    }
  },
  mounted: function() {
    this.getUserList(this.page.current, this.page.size, '')
  }
}
</script>

<style scoped>
.tool-box {
  margin-bottom: 10px;
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
