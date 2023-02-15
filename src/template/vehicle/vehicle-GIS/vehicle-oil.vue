<template>
  <view id="VehicleOil">
    <view class="search-box">
      <uni-forms ref="form" :modelValue="formData" :rules="rules" border>
        <uni-forms-item name="vehicle_name">
          <view slot="left" class="form-label">
            <text>当前车辆：</text>
          </view>
          <view class="text-center" v-if="formData.vehicle_name">{{ formData.vehicle_name }}</view>
          <view class="text-center text-placeholder" v-else>请输入车辆类型</view>
        </uni-forms-item>
        <uni-forms-item required name="driver_id">
          <view slot="left" class="form-label">
            <text>询查时间：</text>
          </view>
          <uni-datetime-picker :border="false" v-model="datetimerange" type="datetimerange" rangeSeparator="至" />
        </uni-forms-item>
      </uni-forms>
    </view>
    <view class="vehicle-video-box">
      <view class="container-bottom-title">
        <view class="green-line"></view>
        <view class="container-bottom-title_text">车辆油耗</view>
      </view>
      <view>
        <canvas canvas-id="jZuXgXDtBJOjjOzlbqZfwyOcVmyQvWSo" id="jZuXgXDtBJOjjOzlbqZfwyOcVmyQvWSo" class="charts" @touchend="tap" />
      </view>
    </view>
  </view>
</template>

<script>
import uCharts from "@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js"
var uChartsInstance = {}
export default {
  name: "VehicleOil",
  components: {},
  data() {
    return {
      cWidth: 750,
      cHeight: 500
    }
  },
  onReady() {
    //这里的 750 对应 css .charts 的 width
    this.cWidth = uni.upx2px(750)
    //这里的 500 对应 css .charts 的 height
    this.cHeight = uni.upx2px(500)
    this.getServerData()
  },
  methods: {
    getServerData() {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
          categories: ["11-23", "11-24", "11-25", "11-26", "11-27", "11-28"],
          series: [
            {
              name: "油耗",
              data: [35, 8, 25, 37, 4, 20]
            }
          ]
        }
        this.drawCharts("jZuXgXDtBJOjjOzlbqZfwyOcVmyQvWSo", res)
      }, 500)
    },
    drawCharts(id, data) {
      const ctx = uni.createCanvasContext(id, this)
      uChartsInstance[id] = new uCharts({
        type: "line",
        context: ctx,
        width: this.cWidth,
        height: this.cHeight,
        categories: data.categories,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        color: ["#73C41B"],
        padding: [15, 15, 0, 0],
        legend: {},
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2
        },
        extra: {
          line: {
            type: "curve",
            width: 2
          }
        }
      })
    },
    tap(e) {
      uChartsInstance[e.target.id].touchLegend(e)
      uChartsInstance[e.target.id].showToolTip(e)
    }
  }
}
</script>

<style lang="scss">
page {
  background: #fff;
}
#VehicleOil {
  background: #fff;
  height: 100%;
  .search-box {
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
    .form-label {
      width: 90px;
      margin-left: 40rpx;
    }
    .text-center {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .text-placeholder {
      color: #999999;
    }
  }
  .vehicle-video-box {
    background: #fff;
    padding: 40rpx;
    margin-top: 40rpx;
    box-shadow: 0px -23px 0px 0px rgba(0, 0, 0, 0.06);

    .container-bottom-title {
      margin-bottom: 40rpx;
      display: flex;
      //   padding: 24rpx 40rpx;
      align-items: center;
      font-size: 30rpx;
      .container-bottom-title_text {
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-left: 20rpx;
      }
    }
    .charts {
      width: 750rpx;
      height: 500rpx;
    }
  }
}
</style>
