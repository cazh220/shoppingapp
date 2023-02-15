<template>
  <view id="CollectionWorkProgress">
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

    <view class="header">
      <view class="header-steps"><ty-steps :active="steps" :options="all_points" direction="column" active-color="#89D13F"></ty-steps></view>
      <view class="header-nums">
        <view class="">{{ all_points.length ? all_points.length - 2 : 0 }}</view>
        <view class="">收集点</view>
        <view class="track-class">
          <view data-type="0" @click="play" class="track-btn">{{ playing ? "暂停" : "播放" }}轨迹</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      steps: 0,
      latitude: 32.026465,
      longitude: 120.875942,
      job: {}, // 工作详情
      all_points: [], // 所有收集点
      polyline: [],
      markers: [], // 所有的设施
      points: [],
      mapCtx: {},
      animationEnd: true,
      steps: 0, // 当前移动的下标位置
      vehicleId: -1,
      playing: false,
      facilities: []
    }
  },

  onLoad(options) {
    this.vehicleId = Number(options.vehicleId)
    this.getCollectionProcess(options.license_plate_number)
  },
  onReady() {
    // 创建map对象
    let mapCtx = uni.createMapContext("map", this)
    this.mapCtx = mapCtx
  },

  methods: {
    getCollectionProcess(license_plate_number) {
      this.$api.getCollectionProcess({ license_plate_number }).then(res => {
        console.log("res:", res)
        // 所有需要经过的收集点
        this.all_points = res.data.all_points.map((item, index) => {
          if (item.transportation_state === 1) {
            this.steps = index + 1
          }
          item.title = item.name
          return item
        })
        // const start = res.data.all_points[0].transportation_state // 起点
        // const end = res.data.all_points[res.data.all_points.length - 1].transportation_state // 终点
        // this.all_points.unshift({ title: "起点", transportation_state: start })
        // this.all_points.push({ title: "终点", transportation_state: end })

        // 作业单详情
        this.job = res.data.job

        // 地图所有设施点
        this.facilities = res.data.all_facilities.map((item, index) => {
          item.longitude = item.location.split(",")[0]
          item.latitude = item.location.split(",")[1]
          if (item.longitude || item.latitude) {
            item.id = index
            item.width = 38
            item.height = 46
            item.iconPath = "../../../static/gis/" + item.type + ".png"
            item.imgUrl = item.pic_url ? this.$api.getUrl(item.pic_url) : "../../../static/gis/no.png"
            return item
          }
        })
        this.markers = this.facilities
        if (res.data.card_info.length > 0) {
          // 视图中心点经纬度
          this.longitude = +res.data.card_info[0].lon
          this.latitude = +res.data.card_info[0].lat
          this.points = res.data.card_info.map(item => {
            item.latitude = Number(item.lat)
            item.longitude = Number(item.lon)
            return item
          })
          // 作业轨迹路线
          this.polyline = [
            {
              points: this.points,
              color: "#89D13F",
              width: 5,
              arrowLine: true,
              borderWidth: 0
            }
          ]
          this.initStartEndMarker(this.points) // 创建起点终点marker,车辆marke
        }
      })
    },
    // 创建起点终点,车辆marke
    initStartEndMarker(points) {
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
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        id: this.vehicleId,
        width: 50,
        height: 25,
        iconPath: "../../../static/gis/car.png" // 因为起点的行驶方向不一定   车辆图片又不能根据行驶方向自动调整  所以暂不使用需要转方向的车辆图片
      })
      this.mapCtx.addMarkers({
        markers: this.markers,
        clear: false
      })
      this.markers = [...this.facilities, ...this.markers]
    },
    // 播放轨迹
    play() {
      this.playing = !this.playing
      if (this.animationEnd) {
        if (this.points.length > 0) {
          this.trackAnimation()
        } else {
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
      this.mapCtx.translateMarker({
        markerId: this.vehicleId,
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
              markerIds: [this.vehicleId]
            })
            this.initStartEndMarker(this.points)
          } else {
            this.trackAnimation()
          }
        }
      })
    },

  }
}
</script>

<style lang="scss">
page {
  height: 100%;
}
#CollectionWorkProgress {
  height: 100%;
  .uni-steps__column-text {
    border: none;
  }
  #map {
    width: 750rpx;
    height: 104%;
  }
  .header {
    position: absolute;
    top: 0;
    height: 140px;
    padding: 10px;
    background-color: #fff;
    width: 100%;
    box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    .header-steps {
      width: 50%;
      height: 100%;
      overflow-y: auto;
      padding-left: 22px;
    }
    .header-nums {
      width: 40%;
      display: flex;
      justify-content: space-around;
      flex-flow: column;
      align-items: center;
      //   font-size: 40rpx;
      padding: 20px 0;
      //   color: #79ca1e;

      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    .uni-steps__column-title {
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000 !important;
    }
    .track-class {
      display: flex;
      justify-content: center;
      width: 104px;
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

  .footer {
    position: absolute;
    bottom: 0;
    height: 160px;
    padding: 10px 20px;
    background-color: #fff;
    display: flex;
    flex-flow: column;
    font-size: 14px;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
