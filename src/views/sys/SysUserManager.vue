<template>
  <div>
    <div class="tool-box">
      <el-input @change="findUser" v-model="searchUserName" style="width:200px" placeholder="输入查找用户的用户名"></el-input>
      <el-button type="primary" @click="findUser"> <i class="el-icon-search"></i> 查找用户</el-button>
      <el-button type="primary" @click="isShowAddUserDialog = true" style="float:right"> <i class="el-icon-circle-plus"></i> 添加系统用户</el-button>
      <el-button type="danger" @click="deleteSelected" style="float:right" v-show="selected.length > 0">
        <i class="el-icon-delete"></i>
        删除所选</el-button
      >
    </div>
    <el-table :data="tableData" ref="table" @row-click="selectRow" @selection-change="handleSelectionChange" stripe max-height="580" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="userId" label="ID" width="50" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="mobile" label="手机" width="180" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="createTime" label="注册日期" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="status" label="用户状态" label-class-name="table-label">
        <template slot-scope="scope">
          <div :title="scope.row.status === 1 ? '用户未锁定,点击锁定' : '用户已锁定，点击解锁'">
            <el-button type="text" :icon="scope.row.status === 1 ? 'el-icon-unlock' : 'el-icon-lock'" style="margin-right:10px"></el-button>
            <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" @change="switchUserStatus(scope.row.userId, scope.row.status)">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" label-class-name="table-label">
        <template slot-scope="scope">
          <el-button type="primary" @click="viewUser(scope.row)" circle plain size="mini" icon="el-icon-view" title="查看用户信息"></el-button>
          <el-button type="warning" @click="updateUser(scope.row)" circle plain size="mini" icon="el-icon-edit" title="修改用户信息"></el-button>
          <el-button type="danger" @click="deleteUser(scope.row, scope.$index)" circle plain size="mini" icon="el-icon-delete" title="删除用户"></el-button>
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
    <!-- 添加系統用戶对话框 -->
    <el-dialog title="添加系统用户" :visible.sync="isShowAddUserDialog" width="45%">
      <el-form :model="addForm" label-width="100px" @submit.native.prevent>
        <el-form-item label="用户名">
          <el-input v-model="addForm.username" placeholder="输入用户名..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="addForm.password" placeholder="输入用户密码..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.mobile" placeholder="手机号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addForm.email" placeholder="邮箱" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-checkbox-group v-model="addForm.roleIdList">
            <el-checkbox v-for="r in roleList" :value="r.roleId" :disabled="r.roleId === 1" :key="r.roleId" :label="r.roleId">{{ r.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddUserDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addUser" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改系統用戶对话框 -->
    <el-dialog title="修改系统用户信息" :visible.sync="isShowUpdateUserDialog" width="45%">
      <el-form :model="updateForm" label-width="100px" @submit.native.prevent>
        <el-form-item label="用户ID">
          <el-input v-model="updateForm.userId" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="updateForm.username" placeholder="输入用户名..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="updateForm.password" placeholder="输入用户密码..." type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="updateForm.mobile" placeholder="手机号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="updateForm.email" placeholder="邮箱" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-checkbox-group v-model="updateForm.roleIdList">
            <el-checkbox v-for="r in roleList" :value="r.roleId" :disabled="r.roleId === 1" :key="r.roleId" :label="r.roleId">{{ r.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdateUserDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="doUpdateUser" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看系統用戶对话框 -->
    <el-dialog title="查看系统用户信息" :visible.sync="isShowViewUserDialog" width="45%">
      <el-form :model="currUser" label-width="100px" @submit.native.prevent>
        <el-form-item label="用户名">
          <el-input v-model="currUser.username" placeholder="输入用户名..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="currUser.mobile" placeholder="手机号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="currUser.email" placeholder="邮箱" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-checkbox-group v-model="currUser.roleIdList">
            <el-checkbox v-for="r in roleList" :value="r.roleId" :key="r.roleId" :label="r.roleId">{{ r.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowViewUserDialog = false" size="mini">关 闭</el-button>
      </div>
    </el-dialog>
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
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: '',
        roleIdList: []
      },
      updateForm: {},
      currUser: { roleIdList: [] },
      isLoading: true,
      loading: {},
      page: defaultPage,
      searchUserName: '',
      isShowViewUserDialog: false,
      isShowAddUserDialog: false,
      isShowUpdateUserDialog: false,
      roleList: [{ roleName: '' }],
      selected: []
    }
  },
  methods: {
    getUserList(pageNum, pageSize, username) {
      if (this.isLoading === true) {
        this.createLoading()
      }
      if (pageNum === undefined) pageNum = this.page.current
      if (pageSize === undefined) pageSize = this.page.size
      if (username === undefined) username = this.searchUserName
      let reqURL = `/sys/user/list?page=${pageNum}&limit=${pageSize}&username=${username}`
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
    getAllRole() {
      this.$http.get('/sys/role/list').then(resp => {
        let data = resp.data
        console.log(data)
        if (data.code === 0) {
          this.roleList = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addUser() {
      this.$http.post('/sys/user/save', this.addForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('用户添加成功！')
          this.getUserList()
          this.isShowAddUserDialog = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    viewUser(userInfo) {
      this.currUser = { ...userInfo }
      this.isShowViewUserDialog = true
    },
    getUserInfo(userId) {
      this.$http.get(`/sys/user/info/${userId}`).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.currUser = data.data
          this.isShowViewUserDialog = true
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    switchUserStatus(userId, status) {
      console.log(userId, status)
      let reqConfig = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }
      let reqParam = qs.stringify({ userId: userId })
      this.$http.post('/sys/user/switchLock', reqParam, reqConfig).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          if (status === 1) {
            this.$message.success('用户已解锁！')
          } else if (status === 0) {
            this.$message.success('用户已锁定！')
          }
        } else {
          if (status === 1) {
            this.$message.success('用户解锁失败！')
          } else if (status === 0) {
            this.$message.success('用户锁定失败！')
          }
        }
      })
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
    updateUser(user) {
      this.currUser = user
      this.updateForm = { ...user }
      this.isShowUpdateUserDialog = true
    },
    doUpdateUser() {
      this.$http.post('/sys/user/update', this.updateForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('用户信息已保存！')
          this.currUser = { ...this.updateForm }
          this.isShowUpdateUserDialog = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    deleteUser(user, index) {
      console.log(user)
      console.log(index)
      this.doDeleteUser([user.userId])
    },
    /**
     * @param userIds 待删除用户id数组
     */
    doDeleteUser(userIds) {
      this.$http.post('/sys/user/delete', userIds).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('用户已删除！')
          this.getUserList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    deleteSelected() {
      let ids = []
      this.selected.forEach(e => ids.push(e.userId))
      this.doDeleteUser(ids)
    },
    /**
     * 点击行选中
     */
    selectRow(row) {
      if (row.selected === undefined) {
        row.selected = true
      } else {
        row.selected = !row.selected
      }
      this.$refs.table.toggleRowSelection(row, row.selected)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selected = val
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.getUserList(this.page.current, size, '')
    },
    handleCurrentChange(page) {
      this.getTypeList(page, this.page.size, '')
      console.log(`当前页: ${page}`)
    }
  },
  created: function() {
    this.getUserList(this.page.current, this.page.size, '')
    this.getAllRole()
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
