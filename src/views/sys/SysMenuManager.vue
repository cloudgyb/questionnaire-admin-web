<template>
  <div style="height:100%;">
    <el-row :gutter="10" style="height:100%;">
      <el-col :span="8" style="height:100%;">
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
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="menu-oper-btn">
                <el-button type="text" icon="el-icon-circle-plus" size="mini" @click="() => addMenu(node, data)" title="点击添加子菜单"> </el-button>
                <el-button
                  slot="reference"
                  type="text"
                  icon="el-icon-delete"
                  :disabled="data.id === 0"
                  size="mini"
                  @click="deleteMenu(node, data)"
                  title="点击删除此菜单"
                  style="color:red"
                >
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16" style="height:100%">
        <el-card class="box-card" style="height:100%;display:flex;flex:1;flex-direction:column;align-item:normal;overflow-y:auto">
          <el-form :model="editForm" @submit.native.prevent label-width="100px">
            <el-form-item label="菜单ID">
              <el-input v-model="editForm.id" disabled class="form-field"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称">
              <el-input v-model="editForm.label" :disabled="editForm.id === 0" class="form-field"></el-input>
              <el-popover
                placement="top-start"
                title="什么是菜单名称？"
                width="200"
                trigger="hover"
                content="菜单名称用于展示在系统左侧边栏导航菜单，每一个菜单尽量使用不同的名称，便于区分。"
              >
                <el-button slot="reference" type="text" plain icon="el-icon-question" title="查看帮助"></el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="菜单类型">
              <el-select v-model="editForm.type" :disabled="true" :placeholder="editForm.id === 0 ? '顶级菜单' : '请选择菜单类型'" class="form-field">
                <el-option label="顶级菜单" :value="-1" disabled></el-option>
                <el-option label="一级菜单" :value="0"></el-option>
                <el-option label="二级菜单" :value="1"></el-option>
                <el-option label="非菜单(功能或按钮)" :value="2"></el-option>
              </el-select>
              <el-popover
                placement="top-start"
                title="有哪些菜单类型？"
                width="200"
                trigger="hover"
                content="‘菜单’分为一级菜单、二级菜单和按钮（或叫做功能）,暂时不提供菜单类型的更改！"
              >
                <el-button slot="reference" type="text" plain icon="el-icon-question" title="查看帮助"></el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="功能URL" v-show="editForm.id !== 0">
              <el-input v-model="editForm.url" placeholder="对于非菜单类型，URL可以为空" class="form-field"></el-input>
              <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <el-button slot="reference" type="text" plain icon="el-icon-question" title="查看帮助"></el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="权限代码" v-show="editForm.id !== 0">
              <el-input v-model="editForm.perms" class="form-field"></el-input>
              <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <el-button slot="reference" type="text" plain icon="el-icon-question" title="查看帮助"></el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="排序号" v-show="editForm.id !== 0">
              <el-input v-model="editForm.orderNum" placeholder="同级菜单的顺序" class="form-field"></el-input>
              <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <el-button slot="reference" type="text" plain icon="el-icon-question" title="查看帮助"></el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="菜单图标" v-if="editForm.id !== 0 && editForm.type !== 2">
              <el-input v-model="editForm.icon" :suffix-icon="editForm.icon" class="form-field"></el-input>
              <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <el-button slot="reference" type="text" plain icon="el-icon-question" title="查看帮助"></el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="展开子菜单">
              <el-switch v-model="editForm.open" :disabled="editForm.id === 0" class="form-field"></el-switch>
              <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <el-button slot="reference" type="text" plain icon="el-icon-question" title="查看帮助"></el-button>
              </el-popover>
            </el-form-item>
            <el-form-item v-show="editForm.id != 0">
              <el-button type="primary" @click="updateMenu">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加菜单对话框 -->
    <el-dialog title="添加菜单" :visible.sync="showAddDialog" width="45%">
      <el-form :model="addForm" label-position="right" label-width="110px">
        <el-form-item label="上级菜单ID">
          <el-input v-model="addForm.parentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="addForm.label" placeholder="备注" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="addForm.icon" :suffix-icon="addForm.icon" placeholder="用于展示在导航菜单上的图标" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL">
          <el-input v-model="addForm.url" placeholder="菜单的URL" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="绑定权限">
          <el-input v-model="addForm.perms" placeholder="权限代码，多个以‘,’分割" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序号">
          <el-input v-model="addForm.orderNum" placeholder="排序号决定该菜单在同级菜单的展示顺序" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否展开子菜单">
          <el-switch v-model="addForm.open"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="doAddMenu" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SysMenuManager',
  data() {
    return {
      menuTree: [],
      currentNodeKey: 0,
      defaultMenuProps: {
        children: 'children',
        label: 'label'
      },
      addForm: {},
      editForm: {},
      editNode: {},
      showAddDialog: false,
      menuDataForAddMenu: {},
      menuNoteForAddMenu: {}
    }
  },
  methods: {
    getMenuTree() {
      this.$http.get('/sys/menu/tree').then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.menuTree = data.data
          this.editForm = this.menuTree[0]
        } else {
          this.$message.error('获取菜单树失败！')
        }
      })
    },
    showMenuDetail(data, node, nodeVueComponent) {
      console.log(data)
      console.log(node)
      console.log(nodeVueComponent)
      this.editForm = { ...data }
      this.selectedNodeData = data
      this.editNode = node
    },
    addMenu(parentNode, parnetData) {
      this.showAddDialog = true
      let menuType = parnetData.type + 1
      this.addForm = { parentId: parnetData.id, type: menuType }
      this.menuNoteForAddMenu = parentNode
      this.menuDataForAddMenu = parnetData
    },
    doAddMenu() {
      this.$http.post('/sys/menu/add', this.addForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          //添加之后接口将菜单数据返回（包含ID）
          let nodeData = data.data
          let afterNodeKey = null
          //找出待插入Node的下一个Node的Key
          for (let e of this.menuNoteForAddMenu.childNodes) {
            if (nodeData.orderNum <= e.data.orderNum) {
              afterNodeKey = e.key
              break
            }
          }
          if (afterNodeKey === null) {
            this.$refs.menuTree.append(nodeData, this.menuNoteForAddMenu)
          } else {
            this.$refs.menuTree.insertBefore(nodeData, afterNodeKey)
          }
          this.showAddDialog = false
          this.$message.success('菜单已添加！')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    updateMenu() {
      this.$http.post('/sys/menu/update', this.editForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.editNode.data = { ...this.editForm }
          this.$message.success('修改已保存！')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    deleteMenu(node, data) {
      this.$http.post(`/sys/menu/delete/${data.id}`).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          //让选中跳至菜单的父菜单
          this.$refs.menuTree.setCurrentKey(node.parent.key)
          this.editForm = { ...node.parent.data }
          this.$refs.menuTree.remove(node)
          this.$message.success('菜单已删除！')
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  computed: {
    openedMenuTreeId() {
      if (this.menuTree.length === 0) {
        return [0]
      } else {
        let l0 = this.menuTree[0]
        if (!l0.open) {
          return []
        }
        let ids = [0]
        for (let l1 of l0.children) {
          if (l1.open) {
            ids.push(l1.id)
          }
        }
        return ids
      }
    }
  },
  created() {
    this.getMenuTree()
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
<style>
.menu-oper-btn {
  display: none;
}
.el-tree-node__content:hover .menu-oper-btn {
  display: inline;
}
.form-field {
  width: 80%;
  margin-right: 20px;
}
</style>
