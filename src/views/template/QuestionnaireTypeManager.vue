<template>
  <div>
    <div class="tool-box">
      <el-input @change="findType" v-model="searchTypeName" style="width:200px" placeholder="输入查找分类名..."></el-input>
      <el-button type="primary" @click="findType"> <i class="el-icon-search"></i> 查找分类</el-button>
      <el-button type="primary" @click="addDialogVisible = true" style="float:right"> <i class="el-icon-circle-plus"></i> 添加新的问卷类别</el-button>
    </div>
    <el-table :data="tableData" stripe highlight-current-row max-height="580" style="width: 100%">
      <el-table-column prop="id" label="ID" sortable width="180" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="typeName" label="分类名称" sortable width="180" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="typeDesc" label="分类描述" :show-overflow-tooltip="true" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="" label="操作" width="200" label-class-name="table-label">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" title="编辑" icon="el-icon-edit" circle plain></el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" title="删除" icon="el-icon-delete" circle plain></el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 添加问卷分类对话框 -->
    <el-dialog title="添加问卷分类" :visible.sync="addDialogVisible" width="45%">
      <el-form :model="addForm">
        <el-form-item label-width="0">
          <el-input v-model="addForm.typeName" placeholder="输入调查问卷分类名称..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input type="textarea" v-model="addForm.typeDesc" placeholder="输入调查问卷分类描述..." autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addQuestionnaireType" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑问卷分类" :visible.sync="editDialogVisible" width="45%">
      <el-form :model="editForm">
        <el-form-item label-width="0">
          <el-input :placeholder="'问卷分类ID:' + editForm.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input v-model="editForm.typeName" placeholder="输入调查问卷分类名称..." autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input type="textarea" v-model="editForm.typeDesc" placeholder="输入调查问卷分类描述..." autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="updateQuestionnaireType" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copyProperties } from '@/utils'
import { defaultPage } from '@/utils/page'
export default {
  name: 'TemplateTypeList',
  data() {
    return {
      tableData: [],
      addForm: {
        typeName: '',
        typeDesc: ''
      },
      editForm: {},
      currUpdateRow: null,
      isLoading: true,
      loading: {},
      addDialogVisible: false,
      editDialogVisible: false,
      page: defaultPage,
      searchTypeName: ''
    }
  },
  methods: {
    getTypeList(page, size) {
      if (this.isLoading === true) {
        this.createLoading()
      }
      let url = `/template/type/pageList?typeName=${this.searchTypeName}&page=${page}&limit=${size}`
      this.$http.get(url).then(resp => {
        let data = resp.data
        console.log(data)
        if (data.code === 0) {
          this.page = data.data
          this.tableData = data.data.records
        } else {
          this.$message.error(data.msg)
        }
        this.loading.close()
      })
    },
    findType() {
      this.getTypeList(this.page.current, this.page.size)
    },
    addQuestionnaireType() {
      this.$http.post('/template/type/add', this.addForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('添加成功！')
          this.tableData.push({
            id: data.data,
            typeName: this.addForm.typeName,
            typeDesc: this.addForm.typeDesc
          })
          this.addDialogVisible = false
          this.addForm.typeName = ''
          this.addForm.typeDesc = ''
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    updateQuestionnaireType() {
      this.$http.post('/template/type/update', this.editForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.editDialogVisible = false
          this.$message({ message: '修改成功！', type: 'success' })
          this.editDialogVisible = false
          copyProperties(this.editForm, this.currUpdateRow)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleEdit(index, row) {
      this.currUpdateRow = row
      this.editForm = { ...row }
      this.editDialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('确定删除问卷类别 “' + row.typeName + '” ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.doDelete(index, row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    doDelete(index, row) {
      this.$http.post('/template/type/delete/' + row.id).then(resp => {
        let data = resp.data
        if (data && data.code === 0) {
          this.tableData.splice(index, 1)
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.getTypeList(this.page.current, size)
    },
    handleCurrentChange(page) {
      this.getTypeList(page, this.page.size)
      console.log(`当前页: ${page}`)
    },
    createLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  },
  mounted: function() {
    this.getTypeList(this.page.current, this.page.size)
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
