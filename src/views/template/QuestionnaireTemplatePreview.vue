<template>
  <div>
    <div class="templateQuestion-container" v-if="td">
      <h2 class="text-center text-primary title" v-text="td.name + '（预览）'"></h2>
      <span class="text-primary text-right" v-text="'创建日期:' + td.createDate"></span>
      <h2 v-if="questions.length === 0" class="text-center text-dark-gray" style="position:relative;top:300px">
        <span>此调查问卷模板没有任何问题</span>
      </h2>
      <ul id="questions" v-if="questions.length > 0">
        <li :data-id="q.id" :data-type="q.questionType" v-for="q in questions" :key="q.id">
          <div class="q-header" v-if="q.questionType !== 5">
            <span class="num" v-text="q.questionNum + '、'"></span>
            <span :for="q.id" v-text="q.questionTitle"></span>
          </div>
          <div class="q-body">
            <input v-if="q.questionType === 1" :name="q.id" :placeholder="q.inputPlaceholder" style="width:500px" type="text" />
            <textarea v-if="q.questionType == 2" :name="q.id" :placeholder="q.inputPlaceholder" style="width:500px" cols="60" rows="5"></textarea>
            <div v-if="q.questionType === 3">
              <div v-for="ops in q.options" :key="ops.id">
                <label>
                  <input :id="ops.id" :name="q.id" type="radio" />
                  <span v-text="ops.optionText"></span>
                </label>
              </div>
            </div>
            <div v-if="q.questionType === 4">
              <div v-for="ops in q.options" :key="ops.id">
                <label>
                  <input :id="ops.id" :name="ops.id" type="checkbox" />
                  <span v-text="ops.optionText"></span>
                </label>
              </div>
            </div>
            <hr v-if="q.questionType === 5" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplatePreview',
  data() {
    return {
      tid: null,
      td: null,
      questions: []
    }
  },
  methods: {
    getTemplateDetail() {
      this.$http.get('/template/detail?tid=' + this.tid).then(resp => {
        let data = resp.data
        if (data.code === 0) {
          this.td = data.data
          this.questions = this.td.questions
          document.title = '调查问卷模板预览-' + this.td.name
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  mounted() {
    this.tid = this.$route.query.tid
    this.getTemplateDetail()
    document.title = '调查问卷模板预览'
  }
}
</script>

<style scoped>
.title {
  font-size: 30px;
}
input[type='text'] {
  height: 30px;
}
input[type='text'],
textarea {
  border: 1px solid #0c0c0c;
  border-radius: 3px;
  outline: none;
}
input[type='text']:focus,
textarea:focus {
  border: 1px solid rgb(20, 114, 236);
}
.text-primary {
  color: #1e9fff;
}
.text-dark-gray {
  color: #5a5a5a;
}
.text-gray {
  color: #c2c2c2;
}
.text-dark {
  color: #000;
}
.text-danger {
  color: #ff5722;
}
a[class~='text-primary']:hover {
  color: #1598f8;
}

.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
  display: block;
}
/*自定义背景颜色*/
.bg-primary {
  color: #fff;
  background-color: #1e9fff;
}
.bg-white {
  color: #0c0c0c !important;
  background-color: #fff;
}
body {
  background-color: #ccc;
}

/* 问题展示区样式 */
.templateQuestion-container {
  color: #0c0c0c !important;
  margin: 0 auto;
  width: 760px;
  min-height: 100vh;
  padding: 20px 20px;
  background: white;
}

.templateQuestion-container li {
  display: block;
  margin: 10px auto;
  width: 550px;
  padding: 5px;
  position: relative;
}

.q-header {
  font-size: 18px;
  margin-bottom: 10px;
}

.q-body {
  font-size: 15px;
}
.q-body > div > div {
  margin: 5px 0;
}
</style>
