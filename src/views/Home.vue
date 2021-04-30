<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>调查问卷模板分类统计</span>
          </div>
          <div id="templateStatistics" style="height:400px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户统计</span>
          </div>
          <div id="userStatis" style="height:400px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Home',
  data() {
    return {
      tData: null,
      uData: null,
      userChart: null,
      templateChart: null
    }
  },
  methods: {
    getIndexData() {
      this.$http.get('/index').then(resp => {
        let data = resp.data
        if (data.code === 0) {
          console.log(data)
          this.tData = data.tInfo
          this.uData = data.userInfo
          this.initTemplateStatis()
          this.drawUserStatisChart()
        } else {
          this.$message.error('获取数据失败！')
        }
      })
    },
    initTemplateStatis() {
      var chartDom = document.getElementById('templateStatistics')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          text: '调查问卷模板分类统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.tData
          }
        ]
      }
      option && myChart.setOption(option)
    },
    drawUserStatisChart() {
      if (this.userChart !== null) this.userChart.clear()
      let chartDom = document.getElementById('userStatis')
      this.userChart = echarts.init(chartDom)
      const manICON =
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAABCCAYAAACrS90tAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAJhSURBVFhH7Zm9b9NAGId/dhyTOOBUYcFbAKlbK7rC0gmmlFaIGSY+BJT/ABWhMMACE0gwlQokygITqC0rjFCB1AVUgQQC0ZSGxElDUnPnHKihd/W55MjQe6RT/J4/nvjsu/dsGwEB/5ktSZvNAL4fYG0NSKWMsMQhlrRWCzD9sILJyR/4/KkV1mUyBg4fcXDuvAvPs8K6KKSlS99aKBa/49lTn9V0Mjhoo3g1h337k6xGjMl+N4U259RURSikzM83cPPGCkol0uYRSEkXF5uYna2xSAzd5vWrVRaJkZJ+/NDE+3c/WbQ5CwsNtiRGSlold2o3kZLuziXYUjSWFd19pKT5vIUDQztYJIZ2n4EBm0VipKR7vARGxxwWiRkd2yn156SkBmmxQiGDC+PZ8Gx4FEYcnDnrSo1OsUYkOuzR/vhouoLnc7Ww/w6RMzt2PIPh4TRsW2447MmAL9W83aYn0sjmpSms0Yh3BWhfpTccvQF5CKU0jd29U8Y9ksaq1fiXfeSog/GLWW664zZvi6TKB/cruH2rvCUh5cljH9evraBc3ph1uNKvX1qYI13iX6Gp8O2bjYmCK62vBqiT5u0GS6X2DGM926fLaKlStFQpWqoULVWKliqlJ1LubHD92xPKzIyPiUvL7YDQ35/ElWIOrmvi8sQyXr6oszXAqdMuTpzcxSL+2xfumdJ5Kz1gX1+7pNOdm5kmndea4TaJv45gkyfF3/vRwnug2j7XVEuVoqVK0VKlaKlStFQpWqoUKamTNnDwUOpPye+1kEySncnenpfoWOdmoz8y6JfMSumBFPgFKNjMr0yKvQUAAAAASUVORK5CYII='
      const womanICON =
        'image://data:image/png;base64,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'
      const unknowICON =
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACO0lEQVRYR+3XS+hNURTH8c9/SBgoTAxkIMojRIkBYqYkKcIAUYRSQpmY8BeRSFEeMZCkFAYGjERShORRygAlUeSRGa3aV7vTfexz/7dM/qvu4O6z11rftfY+e/9On+7tONYl9/PY3k2ovm6cEMm3VXxPdAPRLcB3DKsA/MDwugXlADPwuDDAQAFm4lHkygHeYBxO4jRetIHpZgki6SZswF0syAGWYQ9mZ0m/JphLLWBKNmEj6arK8jzAftys7oEAWY8llerf4yyudOhMuEXSNYikYypxLuMCbjXGW23C6diaYKor8TKB5DCTU8KVGN9k6Q6mxK+qzzq9BUOxC5sxunCDNqZ9QH/q3O9Wvp0Acr+oLmCiO+3sIaLiayXAdQAa8f50CFwrZq3JKfEgwGAHBjvwXzswAa87nAMTC+b8C1H3HNiBoxnAYkRHbmdju3Go5BSs6oESnztYmCa+zS6e0A6T0vg9zCsJVhdgCH5lgeOCOpX+r8XF7FnItZ8lEHWWYEW6hiNuM/33DSNS0lA953oNEBVGpWFHsLOSIBRVXL9h17G01wD56xdK51MlwUh8ycaKuls0CXNwPwUPWRVyq5nlYnURYtO2tVKAw1nL52Yw1eDT8CQNnsHGXgF8TAIzKorK2tlVLMdnjOoFwFi8S4FWI2R6OwtFfSNNCIEa50VLK1mC2O2xBM8QLS6x0IWzsBcHBgrwFFMRx/CxkuzYkj5qnmPKQAHicyp+89MBVMIQp2Z8/YQy3tfO4S+FC2wh4K9XfQAAAABJRU5ErkJggg=='
      let total = this.uData.t
      let option = {
        title: {
          text: '用户性别统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          type: 'category',
          data: ['男', '女', '未知'],
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            margin: 10,
            fontSize: 14,
            color: '#000'
          },
          axisPointer: {
            label: {
              show: true,
              margin: 10
            }
          }
        },
        xAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'pictorialBar',
            label: {
              show: true,
              formatter: function(params) {
                let r = params.value / total
                if (r === 0) return ''
                return (r * 100).toFixed(1) + '%'
              },
              position: 'right',
              color: 'green',
              fontSize: 15
            },
            symbolRepeat: true,
            symbolSize: ['50%', '70%'],
            barCategoryGap: '20%',
            data: [
              {
                value: this.uData.m,
                symbol: manICON
              },
              {
                value: this.uData.f,
                symbol: womanICON
              },
              {
                value: this.uData.n,
                symbol: unknowICON
              }
            ]
          }
        ]
      }
      option && this.userChart.setOption(option)
    }
  },
  mounted() {
    this.getIndexData()
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin: 8px 0;
}
</style>
