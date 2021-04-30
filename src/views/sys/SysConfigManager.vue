<template>
  <div>
    <div class="tool-box">
      <el-input @change="findConfig" v-model="searchConfigKey" style="width:200px" placeholder="输入配置参数名"></el-input>
      <el-button type="primary" @click="findConfig"> <i class="el-icon-search"></i> 搜索</el-button>
      <el-button type="primary" class="float-right" @click="addDialogVisible = true">
        <i class="el-icon-circle-plus"></i>
        添加配置</el-button
      >
      <el-button type="warning" class="float-right" @click="deleteSelected" v-show="selectedConfig.length > 0">
        <i class="el-icon-delete"></i>
        删除所选</el-button
      >
    </div>
    <el-table
      :data="tableData"
      ref="multipleTable"
      @row-click="selectRow"
      stripe
      max-height="580"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="paramKey" label="配置KEY" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="paramValue" label="配置VALUE" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="remark" label="备注" label-class-name="table-label" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="" label="操作" label-class-name="table-label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" circle plain icon="el-icon-edit" title="点击编辑"> </el-button>
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
    <!-- 添加配置对话框 -->
    <el-dialog title="添加配置" :visible.sync="addDialogVisible" width="45%">
      <el-form :model="addForm" label-position="right" label-width="100px">
        <el-form-item label="配置KEY：">
          <el-input v-model="addForm.paramKey" placeholder="输入配置KEY"></el-input>
        </el-form-item>
        <el-form-item label="配置VALUE：">
          <el-input placeholder="输入参数值" v-model="addForm.paramValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input placeholder="备注" v-model="addForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addConfig" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更新配置对话框 -->
    <el-dialog title="编辑配置" :visible.sync="editDialogVisible" width="45%">
      <el-form :model="editForm" label-position="right" label-width="100px">
        <el-form-item label="ID：">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="配置KEY：">
          <el-input v-model="editForm.paramKey" disabled></el-input>
        </el-form-item>
        <el-form-item label="配置VALUE：">
          <el-input placeholder="输入参数值" v-model="editForm.paramValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input placeholder="备注" v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="updateConfig" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defaultPage } from '@/utils/page'
export default {
  name: 'SysLogManager',
  data() {
    return {
      tableData: [],
      isLoading: true,
      loading: {},
      page: defaultPage,
      searchConfigKey: '',
      selectedConfig: [],
      editDialogVisible: false,
      editForm: {},
      addDialogVisible: false,
      addForm: {}
    }
  },
  methods: {
    getConfigList(pageNum, pageSize, paramKey) {
      if (this.isLoading === true) {
        this.createLoading()
      }
      if (pageNum === undefined) pageNum = this.page.current
      if (pageSize === undefined) pageSize = this.page.size
      this.$http.get('/sys/config/pageList?page=' + pageNum + '&limit=' + pageSize + '&paramKey=' + paramKey).then(resp => {
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
    findConfig() {
      this.getConfigList(1, this.page.size, this.searchConfigKey)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectedConfig = val
    },
    createLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    selectRow(row) {
      if (row.selected === undefined) row.selected = true
      else row.selected = !row.selected
      this.$refs.multipleTable.toggleRowSelection(row, row.selected) //点击选中
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.getConfigList(this.page.current, size, '')
    },
    handleCurrentChange(page) {
      this.getConfigList(page, this.page.size, '')
      console.log(`当前页: ${page}`)
    },
    handleEdit(index, row) {
      console.log(index)
      console.log(row)
      this.editForm = { ...row }
      this.editDialogVisible = true
    },
    addConfig() {
      this.$http.post('/sys/config/save', this.addForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('添加成功！')
          this.addForm = {}
          this.addDialogVisible = false
          this.getConfigList(this.page.current, this.page.size, '')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    updateConfig() {
      this.$http.post('/sys/config/save', this.editForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('修改成功！')
          this.editDialogVisible = false
          this.getConfigList(this.page.current, this.page.size, this.searchConfigKey)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    deleteSelected() {
      let ids = []
      this.selectedConfig.forEach(e => {
        ids.push(e.id)
      })
      this.$http.post('/sys/config/delete', ids).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('删除成功！')
          this.getConfigList(this.page.current, this.page.size, this.searchConfigKey)
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  mounted: function() {
    this.getConfigList(this.page.current, this.page.size, '')
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
