<template>
  <view id="vehicleGIS">
    <!-- 搜索项 -->
    <view class="search-box">
      <uni-list>
        <uni-list-item :title="'部门：' + departmentName" link="redirectTo" @click="selectDepartmentType" />
        <uni-list-item :title="'车牌号：' + licensePlateNumber" link="redirectTo" @click="selectCarNumType" />
      </uni-list>
    </view>
    <!-- 地图 -->
    <map
      id="map"
      :scale="12"
      :latitude="latitude"
      :enable-poi="true"
      :show-location="true"
      :longitude="longitude"
      :markers="markers"
      @markertap="markertap"
      @tap="maptap"
    >
      <!-- 自定义气泡 -->
      <cover-view slot="callout">
        <block v-for="(item, index) in markers" :key="index">
          <cover-view class="customCallout" :marker-id="item.id">
            <cover-view class="content">
              <cover-view style=" background: #CAC2C2;padding: 20rpx;color: #E29837;">
                <cover-view>{{ item.licensePlateNumber }}</cover-view>
                <cover-view v-for="el in violationVOList" :key="index">
                  <cover-view>
                    <image style="width: 15px; height: 15px; " :mode="item.mode" :src="alarmPic[el.alarmLevel].name"></image>&nbsp;&nbsp; ({{
                      alarmOptions[alarmIndex].name
                    }})&nbsp;&nbsp;{{ typeOptions[typeIndex].name }}&nbsp;&nbsp;{{ el.createTime }}</cover-view
                  >
                </cover-view>
              </cover-view>
            </cover-view>
          </cover-view>
        </block>
      </cover-view>
    </map>
    <!-- 信息窗 -->
    <view class="action" v-if="vehicleInfoShow">
      <view class="action-top">
        <view class="action-top-info">
          <view class="">
            <view class="action-top-box-right">
              <view class="action-top-field">车牌号:</view>
              <view class="action-top-value">
                {{ detail.vehicleVO.licensePlateNumber }}
              </view>
            </view>
            <view class="action-top-box-right">
              <view class="action-top-field">当日里程:</view>
              <view class="action-top-value">{{ detail.vehicleVO.todayMileage }}km</view>
            </view>
            <view class="action-top-box-right">
              <view class="action-top-field">状态:</view>
              <view class="action-top-value">{{ vehicleOptions[detail.vehicleVO.gpsStatus].name }}</view>
            </view>
          </view>
          <view class="">
            <view class="action-top-box-left">
              <view class="action-top-field">部门:</view>
              <view class="action-top-value">{{ detail.vehicleVO.departmentName }}</view>
            </view>
            <view class="action-top-box-left">
              <view class="action-top-field">速度:</view>
              <view class="action-top-value">{{ detail.vehicleVO.speed }}km/h</view>
            </view>
            <view class="action-top-box-left" v-if="detail.jobVO.jobState">
              <view class="action-top-field">作业状态:</view>
              <view class="action-top-value">{{ jobStateOptions[detail.jobVO.jobState].name }}</view>
            </view>
          </view>
        </view>
        <view class="">
          <view class="action-top-box-left">
            <view class="action-top-field dib">定位时间:</view>
            <view class="action-top-value dib">{{ detail.vehicleVO.typeTime }}</view>
          </view>
          <view class="action-top-box-left">
            <view class="action-top-field dib" style="width: 100rpx;">地址:</view>
            <view class="action-top-value dib">{{ detail.vehicleVO.address }}</view>
          </view>
        </view>
        <view class="action-top-info_third" v-if="detail.jobVO.jobName">
          <view class="action-top-box-right">
            <view class="action-top-field">作业名称:</view>
            <view class="action-top-value">{{ detail.jobVO.jobName }}</view>
          </view>
          <view class="action-top-box-left">
            <view class="action-top-field dib">预计开始时间:</view>
            <view class="action-top-value dib">{{ detail.jobVO.shouldStartTime }}</view>
          </view>
          <view class="action-top-box-left">
            <view class="action-top-field dib">预计结束时间:</view>
            <view class="action-top-value dib">{{ detail.jobVO.shouldEndTime }}</view>
          </view>
        </view>
      </view>
      <view class="button_list">
        <!-- <button @click="showOil">查看油耗</button> -->
        <button @click="showRouter">查看轨迹</button>
        <button @click="showVideo">查看视频</button>
      </view>
    </view>
    <!-- 图例 -->
    <uni-fab ref="fab" :pattern="pattern" :content="content" horizontal="right" vertical="top" direction="horizontal" @trigger="trigger" />
    <!-- 部门 -->
    <lb-picker
      ref="pickerDepartmentTypeList"
      :list="departmentTypeList"
      v-model="deptId"
      @confirm="confirmDepartmentType"
      @cancel="cancelDepartmentTypeShow"
    ></lb-picker>
    <!-- 车牌号 -->
    <lb-picker
      ref="pickerCarNumType"
      :list="carNumTypeList"
      v-model="vehicleId"
      @confirm="confirmCarNumType"
      @cancel="cancelCarNumTypeShow"
    ></lb-picker>
  </view>
</template>

<script>
export default {
  name: "vehicleGIS",
  data() {
    return {
      pattern: {
        color: "#8AD03F",
        backgroundColor: "#fff",
        selectedColor: "#8AD03F",
        buttonColor: "#8AD03F",
        iconColor: "#fff"
      },
      content: [
        {
          iconPath: require("@/static/vehicle/online.png"),
          selectedIconPath: require("@/static/vehicle/online.png"),
          text: "在线",
          active: false
        },
        {
          iconPath: require("@/static/vehicle/offline.png"),
          selectedIconPath: require("@/static/vehicle/offline.png"),
          text: "离线",
          active: false
        },
        {
          iconPath: require("@/static/vehicle/working.png"),
          selectedIconPath: require("@/static/vehicle/working.png"),
          text: "正在作业",
          active: false
        },
        {
          iconPath: require("@/static/vehicle/warning_1.png"),
          selectedIconPath: require("@/static/vehicle/warning_1.png"),
          text: "告警",
          active: false
        }
      ],

      departmentTypeList: [],
      deptId: undefined,
      departmentName: "请选择",
      licensePlateNumber: "请选择",
      carNumTypeList: [],
      vehicleId: undefined,

      latitude: 32.026465,
      longitude: 120.875942,
      markers: [],
      mapCtx: undefined,
      customCalloutMarkerIds: [],

      detail: {},
      vehicleInfo: {},
      vehicleInfoShow: false,
      jobStateOptions: [
        { id: 1, name: "已分配" },
        { id: 2, name: "进行中" },
        { id: 3, name: "已完成" }
      ],
      vehicleOptions: [
        { id: 0, name: "离线" },
        { id: 1, name: "在线" }
      ],
      alarmOptions: [
        { id: 0, name: "无警告" },
        { id: 1, name: "一级告警" },
        { id: 2, name: "二级告警" },
        { id: 3, name: "三级告警" },
        { id: 4, name: "四级告警" }
      ],
      typeOptions: [
        { id: 12, name: "超速" },
        { id: 16, name: "疲劳驾驶" },
        { id: 18, name: "抽烟" },
        { id: 19, name: "接打电话" },
        { id: 21, name: "驾驶员异常" },
        { id: 22, name: "前向碰撞" },
        { id: 23, name: "右侧后方接近报警" },
        { id: 24, name: "行人碰撞" },
        { id: 27, name: "定位天线异常" },
        { id: 28, name: "卫星数量少" },
        { id: 29, name: "网络信号弱" },
        { id: 30, name: "轨迹点相邻间隔异常" },
        { id: 31, name: "工作时间无轨迹移动" },
        { id: 32, name: "分神驾驶" },
        { id: 34, name: "车距过近" }
      ],
      alarmPic: [
        { id: 1, name: require("@/static/vehicle/warning_1.png") },
        { id: 2, name: require("@/static/vehicle/warning_1.png") },
        { id: 3, name: require("@/static/vehicle/warning_1.png") },
        { id: 4, name: require("@/static/vehicle/warning_1.png") }
      ],
      violationVOList: [],
      alarmIndex: -1,
      typeIndex: -1
    }
  },
  computed: {
    CollectionGISAdd() {
      return this.$com.getPermission("CollectionGISAdd")
    }
  },
  created() {
    // 创建map对象
    let mapCtx = uni.createMapContext("map", this)
    this.mapCtx = mapCtx
    this.getCarNumList()
    this.getDepartmentList()
    this.getCollectionGISData()
  },
  methods: {
    getCarNumList() {
      this.$api.getLicensePlateNumbertList().then(res => {
        this.carNumTypeList = res.data.map(item => {
          item.label = item.licensePlateNumber
          item.value = item.vehicleId
          return item
        })
        this.carNumTypeList.unshift({
          label: "请选择",
          value: 0
        })
      })
    },
    getDepartmentList() {
      this.$api.getDepartmentList().then(res => {
        this.departmentTypeList = res.data.map(item => {
          item.label = item.departmentName
          item.value = item.deptId
          return item
        })
        this.departmentTypeList.unshift({
          label: "请选择",
          value: 0
        })
      })
    },
    // 获取GIS数据
    getCollectionGISData(figureType) {
      this.markers = []
      const data = {
        deptId: this.deptId,
        figureType,
        vehicleId: this.vehicleId
      }
      this.$api.getVehicleGIS(data).then(res => {
        this.longitude = Number(res.data[0].lon)
        this.latitude = Number(res.data[0].lat)

        this.markers = res.data.filter((item, index) => {
          item.longitude = Number(item.lon)
          item.latitude = Number(item.lat)
          if (item.lon && item.lat) {
            item.id = item.vehicleId
            item.width = 38
            item.height = 46
            item.iconPath = "../../../static/images/work_map_car.png"
            // item.imgUrl = item.pic_url ? this.$api.getUrl(item.pic_url) : "../../../static/gis/no.png"

            return item
          }
        })
        this.addMarkers()
      })
    },
    // 渲染地图marker
    addMarkers() {
      let markers = []
      let points = []
      this.mapCtx.initMarkerCluster({
        enableDefaultStyle: false,
        zoomOnClick: true,
        gridSize: 60
      })
	  
      this.markers.forEach((item, index) => {
        markers.push({
          id: item.id,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          width: 38,
          height: 46,
          joinCluster: true, // 指定了该参数才会参与聚合
          iconPath: item.iconPath
        })
        points.push({
          latitude: item.latitude,
          longitude: item.longitude
        })
      })
	  console.log(markers, "======");
	  this.mapCtx.addMarkers({
	    markers,
		clear: true
	  })
      this.mapCtx.includePoints({
        points
      }) // 缩放视野展示所有经纬度
      // 点聚合监听
		  this.mapCtx.on("markerClusterCreate", res => {
		    const clusters = res.clusters
			console.log(clusters);
		    const markers = clusters.map(cluster => {
		      const { center, clusterId, markerIds } = cluster
		      return {
		        ...center,
		        width: 0,
		        height: 0,
		        clusterId,
		        label: {
		          content: markerIds.length + "",
		          fontSize: 15,
		          width: 40,
		          height: 40,
		          color: "#fff",
		          bgColor: "#78B93C",
		          borderRadius: 30,
		          textAlign: "center",
		          anchorX: 0,
		          anchorY: -30
		        }
		      }
		    })
		    this.mapCtx.addMarkers({
		      markers: markers,
		      // clear: true
		    })
		  })
    },

    trigger(e) {
      console.log(e)
      this.content[e.index].active = !e.item.active
      const type = e.index + 1
      this.getCollectionGISData(type)
    },

    // 点击了点标记
    markertap(e) {
        this.markers.forEach(item => {
          if (item.id === e.markerId) {
            this.$api.viewVehicleDetail({ vehicleId: e.markerId }).then(res => {
              this.detail = res.data
              this.vehicleInfoShow = true
              this.vehicleInfo = res.data.vehicleVO
              this.violationVOList = res.data.violationVOList
              this.violationVOList.map(el => {
                this.alarmIndex = this.alarmOptions.findIndex(role => role.id === el.alarmLevel)
                this.typeIndex = this.typeOptions.findIndex(role => role.id === el.alarmType)
                item.customCallout = {
                  color: "#E29837",
                  fontSize: 16,
                  borderRadius: 5,
                  bgColor: "#CAC2C2",
                  padding: 20,
                  textAlign: "center",
                  display: "ALWAYS"
                }
              })
            })
          }
        })
    },

    // 点击了地图
    maptap() {
      console.log("点击了地图")
      this.vehicleInfoShow = false
      this.detail = {}
      this.markers.forEach(item => {
        item.customCallout = {
          display: "NONE"
        }
      })
    },

    // 选择部门
    selectDepartmentType() {
      this.$refs.pickerDepartmentTypeList.show()
    },
    // 选择车牌号
    selectCarNumType() {
      this.$refs.pickerCarNumType.show()
    },
    // 选择部门大类
    confirmDepartmentType(e) {
      this.departmentName = e.item.label || ""
      this.deptId = e.value || ""
      this.getCollectionGISData()
      this.vehicleInfoShow = false
    },
    // 取消部门选择弹窗
    cancelDepartmentTypeShow() {
      this.$refs.pickerDepartmentTypeList.hide()
    },
    // 确认车牌号
    confirmCarNumType(e) {
      this.licensePlateNumber = e.item.label || ""
      this.vehicleId = e.value || ""
      this.getCollectionGISData()
      this.vehicleInfoShow = false
    },
    // 取消车牌号选择弹窗
    cancelCarNumTypeShow() {
      this.$refs.pickerCarNumType.hide()
    },
    showRouter() {
      uni.navigateTo({
        url: `./history-route?info=${JSON.stringify(this.vehicleInfo)}`
      })
    },
    showVideo() {
      uni.navigateTo({
        url: `./vehicle-video?info=${JSON.stringify(this.vehicleInfo)}`
      })
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
}
.uni-fab--rightTop {
  top: 180rpx !important;
}
.uni-fab__circle--rightTop {
  top: 200rpx !important;
}

#vehicleGIS {
  height: 100%;

  .search-box {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
  }

  .vehicle-legend {
    position: fixed;
    top: 198rpx;
    right: 40rpx;
    z-index: 999;
    width: 150rpx;
    height: 50rpx;
    line-height: 50rpx;

    .vehicle-legend-button {
      background: #8ad03f;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      border-radius: 8rpx;
    }

    .state_icon {
      width: 20rpx;
      height: 20rpx;
    }

    .legend {
      height: 20rpx;
      width: 35rpx;
      margin: 0rpx 20rpx;
    }
  }

  #map {
    width: 750rpx;
    height: 88%;
    position: absolute;
    top: 170rpx;
  }
  // .customCallout {
  //   box-sizing: border-box;
  //   background-color: #fff;
  //   background: #ffffff;
  //   box-shadow: 0px 4rpx 16px 0px rgba(189, 191, 193, 0.4);
  //   border-radius: 4rpx;
  //   display: inline-flex;
  //   padding: 6rpx 24rpx;
  //   justify-content: center;
  //   align-items: center;
  //   color: #2a7be2;
  // }

  .action {
    padding: 40rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    // height: 400rpx;
    width: 90%;
    display: flex;
    flex-flow: column;

    .action-top {
      margin-bottom: 20rpx;

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
        // display: flex;
        // justify-content: space-between;
      }

      .action-top-box-right {
        margin-bottom: 10rpx;
        display: flex;
        justify-content: flex-start;
      }

      .action-top-box-left {
        margin-bottom: 10rpx;
        display: flex;
        // justify-content: flex-end;
      }
    }

    .button_list {
      display: flex;
    }

    .button_list button {
      width: 104px;
      height: 34px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
    }

    .button_list button:nth-child(1) {
      background: #f2f2f2;
      color: #69ba15;
      margin: 0;
    }

    .button_list button:nth-child(2) {
      background: #7dce20;
      color: #ffffff;
      margin: 0 auto;
    }

    .button_list button:nth-child(3) {
      background: #f2f2f2;
      color: #69ba15;
      margin: 0;
    }

    // .action-bottom {
    //   padding: 0 20rpx;
    //   .button {
    //     width: 46%;
    //     display: inline-block;
    //   }
    // }
  }
}
</style>
