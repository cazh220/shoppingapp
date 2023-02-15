<template>
  <view id="CollectionGis">
    <view class="search-box">
      <view class="example-body">
        <uni-datetime-picker @change="change" v-model="datetimerange" type="datetimerange" rangeSeparator="至" />
      </view>
      <view class="action1">
        <view class="action-top">
          <view class="container-bottom-title">
            <view class="green-line"></view>
            <view class="container-bottom-title_text">车辆信息</view>
          </view>
          <view class="ml25">
            <view class="action-top-field dib">车牌号:</view>
            <view class="action-top-value dib">{{ vehicleInfo.licensePlateNumber }}</view>
          </view>

          <view class="ml25">
            <view class="action-top-field dib">定位时间:</view>
            <view class="action-top-value dib">{{ vehicleInfo.typeTime }}</view>
          </view>
          <view class="ml25" style="display: flex;">
            <view class="action-top-field dib" style="width:200rpx">定位地址:</view>
            <view class="action-top-value dib">{{ vehicleInfo.address }}</view>
          </view>
        </view>
        <view class="track-class">
          <view data-type="0" @click="play" class="track-btn">{{ playing ? "暂停" : "播放" }}</view>
        </view>
      </view>
    </view>
    <map
      id="map"
      :scale="12"
      :latitude="latitude"
      :enable-poi="true"
      :show-location="true"
      :longitude="longitude"
      :markers="markers"
      :polyline="polyline"
    ></map>

    <view class="action">
   
    </view>
  </view>
</template>

<script>
import utils from "@/utils/utils"
export default {
  name: "CollectionGis",
  components: {
  },
  data() {
    return {
      vehicleInfo: {},
      datetimerange: [utils.forMatDate(Date.now() - 1 * 24 * 3600 * 1000), utils.forMatDate(new Date())],
      endTime: "",
      startTime: "",

      latitude: 32.026465,
      longitude: 120.875942,
      markers: [],
      polyline: [], // 经纬度数组
      playing: false,
      points: [],
      mapCtx: {},
      animationEnd: true,
      steps: 0, // 当前移动的下标位置

      rangeMin: 5,
      rangMax: 200,
      rangeValue: [10, 50]
    }
  },
  computed: {
    CollectionGISAdd() {
      return this.$com.getPermission("CollectionGISAdd")
    }
  },
  created() {},
  onLoad(options) {
    this.vehicleInfo = JSON.parse(options.info)
    this.getHistoryTrack(this.vehicleInfo.vehicleId)
  },
  onReady() {
    // 创建map对象
    let mapCtx = uni.createMapContext("map", this)
    this.mapCtx = mapCtx
  },
  methods: {
    format(val) {
      return val + "%"
    },
    handleRangeChange(e) {
      this.rangeValue = e
    },
    change(e) {
      this.datetimerange = e
      this.startTime = e[0]
      this.endTime = e[1]
      this.getHistoryTrack(this.vehicleInfo.vehicleId)
    },
    // 获取GIS数据
    getHistoryTrack(vehicleId) {
      const data = {
        vehicleId,
        startTime: this.datetimerange[0],
        endTime: this.datetimerange[1]
      }
      let points = []
      this.$api.getTrackList(data).then(res => {
        console.log(res, "轨迹")
        if ((res.code == 200) & (res.data.length > 0)) {
          res.data.forEach(item => {
            if (item.lat && item.lon) {
              points.push({
                latitude: item.lat,
                longitude: item.lon
              })
            } else {
              uni.showToast({
                title: "轨迹点位异常",
                icon: "error",
                duration: 2000
              })
            }
          })
          this.polyline.push({
            width: 4,
            color: "#0091ff",
            points
          }) // 创建实际路线
          this.points = points
          this.initStartEndMarker(points) // 创建起点终点marker,车辆marke
          // this.remove()

          this.mapCtx.includePoints({
            points: this.polyline[0].points
          }) // 缩放视野展示所有经纬度
        }
      })
    },

    // 创建起点终点,车辆marke
    initStartEndMarker(points) {
      this.markers = []
      // 起点图标
      this.markers.push({
        id: 11,
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        width: 36,
        height: 48,
        iconPath: "../../../static/images/start.png"
      })
      // 终点图标
      this.markers.push({
        id: 22,
        latitude: points[points.length - 1].latitude,
        longitude: points[points.length - 1].longitude,
        width: 36,
        height: 48,
        iconPath: "../../../static/images/end.png"
      })
      // 车辆图标
      this.markers.push({
        id: this.vehicleInfo.vehicleId,
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        width: 42,
        height: 50,
        iconPath: "../../../static/images/work_map_car.png" // 因为起点的行驶方向不一定   车辆图片又不能根据行驶方向自动调整  所以暂不使用需要转方向的车辆图片
      })
      this.mapCtx.addMarkers({
        markers: this.markers,
        clear: false
      })
    },
    // 播放
    play() {
      console.log(this.points, "this.points")
      this.playing = !this.playing
      if (this.animationEnd === true) {
        if (this.points.length > 0) {
          this.trackAnimation()
        } else {
          // this.playing = false
          uni.showToast({
            title: "暂无轨迹",
            icon: "error",
            duration: 2000
          })
        }
      }
    },

    // 轨迹动画
    trackAnimation() {
      if (this.playing === false) return false
      this.animationEnd = false
      console.log(this.markers, "this.data.markers")
      this.mapCtx.translateMarker({
        markerId: this.vehicleInfo.vehicleId,
        destination: {
          longitude: this.points[this.steps].longitude,
          latitude: this.points[this.steps].latitude
        },
        duration: 2000,
        autoRotate: true,
        moveWithRotate: true,
        // rotate: 90,
        animationEnd: () => {
          this.animationEnd = true
          console.log("成功了")
          this.steps++
          // 递归调用 一直执行动画
          if (this.steps === this.points.length) {
            this.steps = 0
            this.playing = false

            this.mapCtx.removeMarkers({
              markerIds: [this.vehicleInfo.vehicleId]
            })
            this.initStartEndMarker(this.points)
          } else {
            this.trackAnimation()
          }
        }
      })
    },
    // 清楚地图上的makers和points
    remove() {
      // 清除已有的路线
      this.points = []
      this.polyline = []
      this.mapCtx.removeMarkers({
        markerIds: [this.vehicleInfo.vehicleId, 11, 22]
      }) // 清除已有的点标记
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
  .search-box {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    .action1 {
      padding: 40rpx;
      // position: absolute;
      // bottom: 0;
      // left: 0;
      background-color: #fff;
      height: 320rpx;
      // width: 90%;
      // display: flex;
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
      .track-class {
        display: flex;
        justify-content: center;
        width: 368rpx;
        height: 80rpx;
        background: #78b93c;
        border-radius: 8rpx;
        margin: 30rpx auto;
      }

      .track-btn {
        width: 144rpx;
        text-align: center;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #fff;
        line-height: 80rpx;
      }
    }
  }
  #map {
    width: 750rpx;
    height: 100%;
  }
  .action {
    padding: 40rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    // height: 520rpx;
    width: 90%;
    display: flex;
    flex-flow: column;

    .button_list button {
      width: 104px;
      height: 34px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
