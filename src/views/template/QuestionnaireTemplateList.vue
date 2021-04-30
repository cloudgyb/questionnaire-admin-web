<template>
  <div>
    <div class="tool-box">
      当前模板类型：
      <el-select v-model="currType" filterable @change="getTemplateListByTypeId" placeholder="请选择活动区域">
        <el-option v-for="item in types" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
      </el-select>
      <el-input @change="findTemplate" v-model="searchTemplateName" style="width:200px;margin-left:10px" placeholder="输入模板名..."></el-input>
      <el-button type="primary" @click="findTemplate"> <i class="el-icon-search"></i> 查找模板</el-button>
      <el-button style="float:right" type="primary" @click="addDialogVisible = true"><i class="el-icon-circle-plus"></i> 创建新的调查问卷模板</el-button>
    </div>
    <el-table :data="templates" stripe highlight-current-row max-height="580" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="name" label="模板名称" width="300" :show-overflow-tooltip="true" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="createDate" label="创建日期" width="200" :show-overflow-tooltip="true" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="publishDate" label="发布日期" width="200" :show-overflow-tooltip="true" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="status" label="状态" width="150" :show-overflow-tooltip="true" label-class-name="table-label">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ toTemplateStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="questionCount" label="问题数" width="100" :show-overflow-tooltip="true" label-class-name="table-label"> </el-table-column>
      <el-table-column prop="" label="操作" label-class-name="table-label">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="preview(scope.$index, scope.row)" icon="el-icon-view" title="预览" circle plain></el-button>
          <el-button size="mini" type="info" @click="edit(scope.$index, scope.row)" icon="el-icon-edit" circle plain title="编辑"></el-button>
          <el-button size="mini" type="success" @click="design(scope.$index, scope.row)" icon="el-icon-edit-outline" circle plain title="设计"></el-button>
          <el-button
            size="mini"
            type="success"
            @click="publish(scope.$index, scope.row)"
            icon="el-icon-s-promotion"
            title="发布"
            circle
            plain
            v-if="scope.row.status === 0"
          ></el-button>
          <el-button
            size="mini"
            type="warning"
            @click="switchOffline(scope.$index, scope.row)"
            icon="el-icon-turn-off"
            :title="scope.row.status === 1 ? '下线' : '点击重新上线'"
            circle
            :plain="scope.row.status === 1"
            v-if="scope.row.status === 1 || scope.row.status === 2"
          ></el-button>
          <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)" title="永久删除" icon="el-icon-delete" circle plain></el-button>
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
    <el-dialog title="添加调查问卷模板" :visible.sync="addDialogVisible" width="45%">
      <el-form :model="addForm">
        <el-form-item label-width="0">
          <el-select placeholder="请选择模板类别...." v-model="addForm.typeId">
            <el-option v-for="item in types" :label="item.typeName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input placeholder="输入调查问卷模板名称" v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addQuestionnaireTemplate" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑调查问卷模板" :visible.sync="editDialogVisible" width="45%">
      <el-form :model="editForm">
        <el-form-item label-width="0">
          <el-select placeholder="请选择模板类别...." v-model="editForm.typeId">
            <el-option v-for="item in types" :label="item.typeName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input placeholder="输入调查问卷模板名称" v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="updateQuestionnaireTemplate" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defaultPage } from '@/utils/page'
import { copyProperties } from '@/utils'
import qs from 'qs'
export default {
  name: 'TemplateList',
  data() {
    return {
      currType: NaN,
      types: [],
      templates: [],
      loading: null,
      addDialogVisible: false,
      addForm: {
        typeId: '',
        name: ''
      },
      editDialogVisible: false,
      editForm: {
        id: NaN,
        typeId: NaN,
        name: ''
      },
      currRow: null,
      currIndex: NaN,
      page: defaultPage,
      searchTemplateName: ''
    }
  },
  methods: {
    getAllType() {
      this.$http.get('/template/type/list').then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.types = data.data
          //第一次进入路由
          if (isNaN(this.currType)) {
            this.currType = this.types[0].id
            this.getTemplateListByTypeId(this.currType, this.page.current, this.page.size)
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getTemplateListByTypeId(typeId, page, size) {
      this.loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (page === undefined) page = this.page.current
      if (size === undefined) size = this.page.size
      let reqUrl = `/template/pageList?typeId=${typeId}&templateName=${this.searchTemplateName}&page=${page}&limit=${size}`
      this.$http.get(reqUrl).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.page = data.data
          this.templates = data.data.records
        } else {
          this.$message.error(data.msg)
        }
        this.loading.close()
      })
    },
    findTemplate() {
      this.getTemplateListByTypeId(this.currType, this.page.current, this.page.size)
    },
    updateQuestionnaireTemplate() {
      this.$http.post('/template/update', this.editForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          //如果分类没有修改，直接更新
          if (this.currRow.typeId === this.editForm.typeId) copyProperties(this.editForm, this.currRow)
          else {
            //分类修改了，直接从当前分类的调查问卷列表移除
            this.templates.splice(this.currIndex, 1)
          }
          this.editDialogVisible = false
          this.$message.success('修改成功！')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addQuestionnaireTemplate() {
      this.$http.post('/template/add', this.addForm).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('添加成功！')
          this.addDialogVisible = false
          this.currType = this.addForm.typeId
          this.getTemplateListByTypeId(this.currType, this.page.current, this.page.size)
          this.addForm = { typeId: '', name: '' }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    edit(index, row) {
      this.currRow = row
      this.currIndex = index
      this.editForm = { ...row }
      this.editDialogVisible = true
    },
    del(index, row) {
      this.$confirm('确定要删除问卷模板《' + row.name + '》?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.doDelete(index, row)
        })
        .cache(() => {})
    },
    preview(index, row) {
      let path = this.$router.resolve({ name: 'TemplatePreview', query: { tid: row.id } })
      window.open(path.href, '_blank')
    },
    doDelete(index, row) {
      this.$http.post('/template/delete/' + row.id).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.templates.splice(index, 1)
          this.$message.success('删除成功！')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    design(index, row) {
      let path = this.$router.resolve({ name: 'TemplateDesign', query: { tid: row.id } })
      window.open(path.href, '_blank')
    },
    publish(index, row) {
      let reqConfig = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      this.$http.post('/template/publish', qs.stringify({ tid: row.id }), reqConfig).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success('发布成功！')
          this.getTemplateListByTypeId(this.currType, this.page.current, this.page.size)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    switchOffline(index, row) {
      let reqConfig = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      this.$http.post('/template/switchOffline', qs.stringify({ tid: row.id }), reqConfig).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.$message.success(row.status === 1 ? '下线成功！' : '已重新上线！')
          row.status = row.status === 1 ? 2 : 1
          //this.getTemplateListByTypeId(this.currType, this.page.current, this.page.size)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.getTemplateListByTypeId(this.currType, this.page.current, size)
    },
    handleCurrentChange(page) {
      this.getTypeList(this.currType, page, this.page.size)
      console.log(`当前页: ${page}`)
    },
    toTemplateStatusText(status) {
      switch (status) {
        case 0:
          return '未发布'
        case 1:
          return '已发布'
        case 2:
          return '已下线'
        default:
          return '未知'
      }
    }
  },
  mounted: function() {
    this.getAllType()
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
