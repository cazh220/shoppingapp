// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core"
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, LineChart, PieChart, MapChart, EffectScatterChart, PictorialBarChart } from "echarts/charts"
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import { TitleComponent, LegendComponent, TooltipComponent, TimelineComponent, GridComponent, DatasetComponent, DatasetComponentOption, TransformComponent } from "echarts/components"
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features"
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers"

// import { Scatter3DChart, Bar3DChart, SurfaceChart } from "echarts-gl/charts"
// import { Grid3DComponent, Geo3DComponent } from "echarts-gl/components"

// echarts.use([Scatter3DChart, Grid3DComponent]);

// 注册必须的组件
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TimelineComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  PictorialBarChart,
  CanvasRenderer,
  LineChart,
  PieChart,
  MapChart,
  EffectScatterChart,
  // Grid3DComponent,
  // Geo3DComponent,
  // Bar3DChart,
  // Scatter3DChart,
  // SurfaceChart
])

// import * as echarts from "echarts"
// import "echarts-gl"
// import china from "@/assets/china.json" // 引入中国地图数据

const $echarts = {
  // 油耗折现图

  //作业单数据柱状图
  initWorkColumn(data, boxName) {
    // var newchartName = data.type,
    //   newchartValue1 = data.state1,
    //   newchartValue2 = data.state2,
    //   newchartValue3 = data.state3,
    //   newchartValue4 = data.state4,
    //   newchartValue5 = data.state5,
    //   seriesName = ["已分配", "进行中", "已完成", "已关闭", "已取消"]

    // var path = "path://M1390,595h79l-39,22Z"
    // var barWidth = 15

    let options = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };

    if (this[boxName]) {
      this[boxName].setOption(options)
    } else {
      this[boxName] = echarts.init(this.$refs[boxName])
      this[boxName].setOption(options)
    }
    // 自动适应
    this.$nextTick(() => {
      this[boxName].resize()
    })
    let that = this
    window.addEventListener("resize", function () {
      that[boxName].resize()
    })
  },




}
export default $echarts
