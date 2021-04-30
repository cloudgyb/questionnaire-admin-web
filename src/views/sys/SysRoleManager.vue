<template>
  <div>
    <div class="tool-box">
      <el-input @change="findRole" v-model="searchRoleName" style="width:200px" placeholder="输入查找角色名"></el-input>
      <el-button type="primary" @click="findRole"> <i class="el-icon-search"></i> 查找角色</el-button>
      <el-button type="primary" @click="isShowAddRoleDialog = true" style="float:right"> <i class="el-icon-circle-plus"></i> 添加用户角色</el-button>
      <el-button type="danger" @click="deleteSelected" style="float:right" v-show="selected.length > 0">
        <i class="el-icon-delete"></i>
        删除所选</el-button
      >
    </div>
    <el-table :data="tableData" ref="table" @row-click="selectRow" @selection-change="handleSelectionChange" stripe max-height="580" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="roleId" label="ID" width="100" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="roleName" label="角色名" width="260" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="remark" label="角色描述" width="260" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="操作" label-class-name="table-label">
        <template slot-scope="scope">
          <el-button type="warning" @click="updateRole(scope.row)" circle plain size="mini" icon="el-icon-edit" title="修改角色信息"></el-button>
          <el-button
            type="primary"
            @click="updateRoleMenu(scope.row)"
            circle
            plain
            size="mini"
            icon="el-icon-menu"
            :title="scope.row.roleId === 1 ? `禁止修改“${scope.row.roleName}”的菜单` : '角色菜单配置'"
            :disabled="scope.row.roleId === 1"
          ></el-button>
          <el-button type="danger" @click="deleteRole(scope.row, scope.$index)" circle plain size="mini" icon="el-icon-delete" title="删除角色"></el-button>
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
    <!-- 添加用戶角色对话框 -->
    <el-dialog title="添加用户角色" :visible.sync="isShowAddRoleDialog" width="45%">
      <el-form :model="addForm" label-width="100px" @submit.native.prevent>
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName" placeholder="输入用户名..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.remark" placeholder="输入用户密码..." autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddRoleDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addRole" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用戶角色信息对话框 -->
    <el-dialog title="修改角色信息" :visible.sync="isShowUpdateRoleDialog" width="45%">
      <el-form :model="updateForm" label-width="100px" @submit.native.prevent>
        <el-form-item label="角色ID">
          <el-input v-model="updateForm.roleId" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名">
          <el-input v-model="updateForm.roleName" placeholder="输入角色名..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="updateForm.remark" placeholder="输入角色描述..." autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdateRoleDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="doUpdateRole" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用戶角色菜单对话框 -->
    <el-dialog title="角色菜单配置" :visible.sync="isShowUpdateRoleMenuDialog" fullscreen>
      <el-tag>
        勾选（取消勾选）菜单对该角色进行菜单的分配（取消）。 由于菜单中包含了权限，所以分配菜单的过程也是对该角色进行授权的过程。 点击<el-tag
          type="success"
          size="mini"
          >保存修改</el-tag
        >按钮使更改生效；按 <el-tag type="danger" size="mini">ESC</el-tag>键或<el-tag type="danger" size="mini">关闭</el-tag>按钮关闭当前对话框。
      </el-tag>
      <el-divider></el-divider>
      <el-row :gutter="10" style="height:100%;">
        <el-col :span="10" style="height:100%;">
          <el-card class="box-card" style="height:100%;display:flex;flex:1;flex-direction:column;align-item:normal;overflow-y:auto">
            <el-tree
              ref="menuTree"
              :data="menuTree"
              @node-click="showMenuDetail"
              show-checkbox
              node-key="id"
              :current-node-key="currentNodeKey"
              :highlight-current="true"
              :expand-on-click-node="false"
              :default-expanded-keys="openedMenuTreeId"
              :props="defaultMenuProps"
              @check="checkMenu"
            >
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="14" style="height:100%">
          <el-card class="box-card" style="height:100%;display:flex;flex:1;flex-direction:column;align-item:normal;overflow-y:auto">
            <el-form :model="currMenuData" @submit.native.prevent label-width="100px" size="mini">
              <el-form-item label="菜单ID">
                <el-input v-model="currMenuData.id" disabled class="form-field"></el-input>
              </el-form-item>
              <el-form-item label="菜单名称">
                <el-input v-model="currMenuData.label" :disabled="currMenuData.id === 0" class="form-field"></el-input>
              </el-form-item>
              <el-form-item label="菜单类型">
                <el-select v-model="currMenuData.type" :disabled="true" :placeholder="currMenuData.id === 0 ? '顶级菜单' : '请选择菜单类型'" class="form-field">
                  <el-option label="顶级菜单" :value="-1" disabled></el-option>
                  <el-option label="一级菜单" :value="0"></el-option>
                  <el-option label="二级菜单" :value="1"></el-option>
                  <el-option label="非菜单(功能或按钮)" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="功能URL" v-show="currMenuData.id !== 0">
                <el-input v-model="currMenuData.url" placeholder="对于非菜单类型，URL可以为空" class="form-field"></el-input>
              </el-form-item>
              <el-form-item label="权限代码" v-show="currMenuData.id !== 0">
                <el-input v-model="currMenuData.perms" class="form-field"></el-input>
              </el-form-item>
              <el-form-item label="排序号" v-show="currMenuData.id !== 0">
                <el-input v-model="currMenuData.orderNum" placeholder="同级菜单的顺序"></el-input>
              </el-form-item>
              <el-form-item label="菜单图标" v-if="currMenuData.id !== 0 && currMenuData.type !== 2">
                <el-input v-model="currMenuData.icon" :suffix-icon="currMenuData.icon"></el-input>
              </el-form-item>
              <el-form-item label="展开子菜单">
                <el-switch v-model="currMenuData.open" :disabled="currMenuData.id === 0" class="form-field"></el-switch>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="doUpdateRoleMenu" size="medium" type="primary">保存修改</el-button>
        <el-button @click="isShowUpdateRoleMenuDialog = false" size="medium" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defaultPage } from '@/utils/page'
export default {
  name: 'RoleList',
  data() {
    return {
      tableData: [],
      addForm: {
        roleName: '',
        remark: ''
      },
      updateForm: {},
      loading: {},
      page: defaultPage,
      searchRoleName: '',
      isShowAddRoleDialog: false,
      isShowUpdateRoleDialog: false,
      isShowUpdateRoleMenuDialog: false,
      selected: [],
      currRole: {},
      //菜单操作相关数据
      menuTree: [],
      currMenuData: {},
      currRoleMenuIds: [],
      currRoleUpdateMenuIds: [],
      defaultMenuProps: {
        children: 'children',
        label: 'label'
      },
      currentNodeKey: 0
    }
  },
  methods: {
    getRoleList(pageNum, pageSize, roleName) {
      this.createLoading()
      if (pageNum === undefined) pageNum = this.page.current
      if (pageSize === undefined) pageSize = this.page.size
      if (roleName === undefined) roleName = this.searchRoleName
      let reqURL = `/sys/role/listPage?page=${pageNum}&limit=${pageSize}&roleName=${roleName}`
      this.$http.get(reqURL).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.page = data.data
          this.tableData = this.page.records
        } else {
          this.$message.error(data.msg)
        }
        this.loading.close()
      })
    },
    addRole() {
      this.$http.post('/sys/role/save', this.addForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('角色添加成功！')
          this.getRoleList()
          this.isShowAddRoleDialog = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    findRole() {
      this.getRoleList(1, this.page.size, this.searchUserName)
    },
    createLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    updateRole(role) {
      this.updateForm = { ...role }
      this.isShowUpdateRoleDialog = true
    },
    doUpdateRole() {
      this.$http.post('/sys/role/update', this.updateForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('角色信息已保存！')
          let currRole = this.tableData.find(e => e.roleId == this.updateForm.roleId)
          currRole.roleName = this.updateForm.roleName
          currRole.remark = this.updateForm.remark
          this.isShowUpdateRoleDialog = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    deleteRole(role, index) {
      console.log(role)
      console.log(index)
      this.doDeleteUser([role.roleId])
    },
    /**
     * @param roleIds 待删除用户id数组
     */
    doDeleteRole(roleIds) {
      this.$http.post('/sys/role/delete', roleIds).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('角色已删除！')
          this.getRoleList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    deleteSelected() {
      let ids = []
      this.selected.forEach(e => ids.push(e.roleId))
      this.doDeleteRole(ids)
    },
    updateRoleMenu(role) {
      console.debug(role)
      this.currRole = role
      this.isShowUpdateRoleMenuDialog = true
      this.getMenuTree()
    },
    doUpdateRoleMenu() {
      let roleId = this.currRole.roleId
      this.$http.post(`/sys/role/menu/save?roleId=${roleId}`, this.currRoleUpdateMenuIds).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('菜单已保存！')
        } else {
          this.$message.error('获取角色菜单失败！')
        }
      })
    },
    getRoleMenuIds(roleId) {
      this.$http.get(`/sys/role/menu/list?roleId=${roleId}`).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          let currRoleMenuIds = data.data
          let _self = this
          currRoleMenuIds.forEach(menuId => _self.$refs.menuTree.setChecked(menuId, true, false))
        } else {
          this.$message.error('获取角色菜单失败！')
        }
      })
    },
    getMenuTree() {
      this.$http.get('/sys/menu/tree').then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.menuTree = data.data
          this.currMenuData = this.menuTree[0]
          this.getRoleMenuIds(this.currRole.roleId)
        } else {
          this.$message.error('获取菜单树失败！')
        }
      })
    },
    showMenuDetail(data) {
      this.currMenuData = data
    },
    checkMenu(menuData, checkStatus) {
      console.debug(menuData)
      console.debug(checkStatus)
      this.currRoleUpdateMenuIds.splice(0)
      this.currRoleUpdateMenuIds.push(...checkStatus.checkedKeys)
      this.currRoleUpdateMenuIds.push(...checkStatus.halfCheckedKeys.filter(e => e !== 0))
      console.debug(this.currRoleUpdateMenuIds)
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
      this.getRoleList(this.page.current, size, '')
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page}`)
      this.getRoleList(page, this.page.size, '')
    }
  },
  computed: {
    openedMenuTreeId() {
      if (this.menuTree.length === 0) {
        return [0]
      } else {
        let l0 = this.menuTree[0]
        let ids = [0]
        for (let l1 of l0.children) {
          ids.push(l1.id)
        }
        return ids
      }
    }
  },
  created: function() {
    this.getRoleList(this.page.current, this.page.size, '')
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
.el-dialog__body {
  padding-top: 10px;
}
</style>
