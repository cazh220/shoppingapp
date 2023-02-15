<template>
  <view id="CollectionGis">
    <map
      id="map"
      :scale="12"
      :max-scale="14"
      :latitude="latitude"
      :enable-poi="true"
      :show-location="true"
      :longitude="longitude"
      :markers="markers"
      @markertap="markertap"
      @tap="maptap"
    ></map>

    <!-- 下方详情  v-if="detail.type_name !== ''" -->
    <view class="action" v-if="vehicleInfoShow">
      <view class="action-top">
        <view class="container-bottom-title">
          <view class="green-line"></view>
          <view class="container-bottom-title_text">车辆信息</view>
        </view>

        <view class="ml25">
          <view class="action-top-field dib">车牌号:</view>
          <view class="action-top-value dib">{{ detail.licensePlateNumber }}</view>
        </view>
        <view class="ml25">
          <view class="action-top-field dib">司机:</view>
          <view class="action-top-value dib">{{ vehicleInfo.driverName }}</view>
        </view>

        <view class="ml25">
          <view class="action-top-field dib">状态:</view>
          <view class="action-top-value dib">{{ stateOptions[detail.state].name }}</view>
        </view>
        <view class="ml25">
          <view class="action-top-field dib">定位时间:</view>
          <view class="action-top-value dib">{{ detail.typeTime }}</view>
        </view>
        <view class="ml25" style="display: flex;">
          <view class="action-top-field dib" style="width: 200rpx;">定位地址:</view>
          <view class="action-top-value dib">{{ detail.address }}</view>
        </view>
      </view>
      <view class="button_list">
        <button @click="showHistoryRoute">查看历史轨迹</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "CollectionGis",
  data() {
    return {
      vehicleInfo: {},
      vehicleInfoShow: false,
      latitude: 32.026465,
      longitude: 120.875942,
      markers: [],
      detail: {},
      stateOptions: [
        { id: 0, name: "不正常" },
        { id: 1, name: "点火" },
        { id: 2, name: "行驶" },
        { id: 3, name: "停车" },
        { id: 4, name: "熄火" },
        { id: 5, name: "点火熄火同一点" }
      ]
    }
  },
  computed: {
    CollectionGISAdd() {
      return this.$com.getPermission("CollectionGISAdd")
    }
  },
  onLoad(options) {
    this.vehicleInfo = JSON.parse(options.info)
    console.log(this.vehicleInfo, "this.vehicleInfo")
    this.getVehicleLocation(this.vehicleInfo.vehicleId)
  },
  created() {},

  methods: {
    // 获取GIS数据
    getVehicleLocation(vehicleId) {
      console.log(vehicleId)
      this.$api.getVehicleLocation({ vehicleId }).then(res => {
        this.detail = res.data
        this.detail.licensePlateNumber = this.vehicleInfo.licensePlateNumber
        this.latitude = res.data.lat
        this.longitude = res.data.lon
        if (res.data.lat && res.data.lon) {
          let item = {
            id: res.data.vehicleId,
            latitude: res.data.lat,
            longitude: res.data.lon,
            width: 38,
            height: 46,
            iconPath: "../../../static/images/work_map_car.png"
          }
          this.markers.push(item)
        }
      })
    },

    // 点击了点标记
    markertap(e) {
      setTimeout(() => {
        this.markers.forEach(item => {
          if (item.id === e.markerId) {
            this.vehicleInfoShow = true
          }
        })
      }, 100)
    },

    // 点击了地图
    maptap() {
      console.log("点击了地图:")
      this.vehicleInfoShow = false
    },

    showHistoryRoute() {
      console.log(this.detail, "action ")
      uni.navigateTo({
        url: `./history-route?info=${JSON.stringify(this.detail)}`
      })
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
}
#CollectionGis {
  height: 100%;

  #map {
    width: 750rpx;
    height: 103%;
  }
  .action {
    padding: 40rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    height: 400rpx;
    width: 90%;
    display: flex;
    flex-flow: column;
    .action-top {
      margin-bottom: 20rpx;

      .container-bottom-title {
        padding: 0rpx 0 20rpx 0;
        align-items: center;
        font-size: 30rpx;
        .container-bottom-title_text {
          display: inline-block;
          vertical-align: middle;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
        }
      }
      .action-top-left-img {
        width: 150rpx;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333333;
        border-radius: 10px;
      }
      .action-top-info {
        display: flex;
        justify-content: space-between;
      }
      .action-top-field {
        margin-right: 10rpx;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .action-top-value {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .action-top-info_third {
        display: flex;
        justify-content: space-between;
      }
      .action-top-box-right {
        margin-bottom: 10rpx;
        display: flex;
        justify-content: flex-start;
      }
      .action-top-box-left {
        margin-bottom: 10rpx;
        display: flex;
        justify-content: flex-end;
      }
    }

    .button_list button {
      width: 184px;
      height: 40px;
      background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
      border-radius: 4px;

      //   width: 96px;
      //   height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 40px;
    }
  }
}
</style>
