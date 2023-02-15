<template>
  <view id="vehicleGIS">
    <!-- 搜索项 -->
    <view class="search-box">
      <uni-list>
        <uni-list-item :title="'部门：' + departmentName" link="redirectTo" @click="selectDepartmentType" />
        <uni-list-item :title="'姓名：' + personnelName" link="redirectTo" @click="selectPersonnelName" />
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
                <cover-view>{{ item.personnelName }}</cover-view>
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
    <view class="action" v-if="personnelShow">
      <view class="action-top">
        <view class="action-top-info">
          <view class="">
            <view class="action-top-box-right">
              <view class="action-top-field">姓名:</view>
              <view class="action-top-value">
                {{ detail.personnelInfo.personnelName }}
              </view>
            </view>
            <view class="action-top-box-right">
              <view class="action-top-field">当日里程:</view>
              <view class="action-top-value">{{ detail.personnelInfo.todayMileage }}km</view>
            </view>
            <view class="action-top-box-right" v-if="detail.personnelJob.jobState">
              <view class="action-top-field">作业名称:</view>
              <view class="action-top-value">{{ detail.personnelJob.jobName }}</view>
            </view>
          </view>
          <view class="">
            <view class="action-top-box-left">
              <view class="action-top-field">部门:</view>
              <view class="action-top-value">{{ detail.personnelInfo.departmentName }}</view>
            </view>
            <view class="action-top-box-left">
              <view class="action-top-field">状态:</view>
              <view class="action-top-value">{{ vehicleOptions[detail.personnelInfo.state].name }}</view>
            </view>
            <view class="action-top-box-left" v-if="detail.personnelJob.jobState">
              <view class="action-top-field">作业状态:</view>
              <view class="action-top-value">{{ jobStateOptions[detail.personnelJob.jobState].name }}</view>
            </view>
          </view>
        </view>
        <view class="action-top-info_third" v-if="detail.personnelJob.jobName">
          <view class="action-top-box-left">
            <view class="action-top-field dib">预计开始时间:</view>
            <view class="action-top-value dib">{{ detail.personnelJob.shouldStartTime }}</view>
          </view>
          <view class="action-top-box-left">
            <view class="action-top-field dib">预计结束时间:</view>
            <view class="action-top-value dib">{{ detail.personnelJob.shouldEndTime }}</view>
          </view>
        </view>
        <view class="">
          <view class="action-top-box-left">
            <view class="action-top-field dib">定位时间:</view>
            <view class="action-top-value dib">{{ detail.personnelInfo.locateTime }}</view>
          </view>
          <view class="action-top-box-left">
            <view class="action-top-field dib" style="width: 100rpx;">地址:</view>
            <view class="action-top-value dib">{{ detail.personnelInfo.address }}</view>
          </view>
        </view>
      </view>
      <view class="button_list">
        <button @click="showRouter">查看轨迹</button>
        <!-- <button @click="showVideo">查看视频</button> -->
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
    <!-- 姓名 -->
    <lb-picker
      ref="pickerPersonnelType"
      :list="personnelNameList"
      v-model="personnelId"
      @confirm="confirmPersonnelType"
      @cancel="cancelPersonnelTypeShow"
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
      personnelName: "请选择",
      personnelNameList: [],
      personnelId: undefined,

      latitude: 32.026465,
      longitude: 120.875942,
      markers: [],
      mapCtx: undefined,
      customCalloutMarkerIds: [],

      detail: {},
      personnelInfo: {},
      personnelShow: false,
      jobStateOptions: [
        { id: 0, name: "删除" },
        { id: 1, name: "已分配" },
        { id: 2, name: "进行中" },
        { id: 3, name: "已完成" },
        { id: 4, name: "已关闭" }
      ],
      vehicleOptions: [
        { id: 1, name: "在线" },
        { id: 2, name: "离线" }
      ],
      alarmOptions: [
        { id: 0, name: "无警告" },
        { id: 1, name: "一级告警" },
        { id: 2, name: "二级告警" },
        { id: 3, name: "三级告警" },
        { id: 4, name: "四级告警" }
      ],
      typeOptions: [
        {
          id: 1,
          name: "缺勤"
        },
        {
          id: 2,
          name: "人员出围栏"
        },
        {
          id: 3,
          name: "低电量"
        },
        {
          id: 4,
          name: "SOS"
        },
        {
          id: 5,
          name: "关机报警"
        },
        {
          id: 6,
          name: "久坐"
        },
        {
          id: 7,
          name: "迟到"
        },
        {
          id: 8,
          name: "早退"
        },
        {
          id: 9,
          name: "信号异常"
        }
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
    this.getPersonnelNameList()
    this.getDepartmentList()
    this.getPersonnelGISData()
  },
  methods: {
    getPersonnelNameList() {
      this.$api.getPersonnelNameList().then(res => {
        this.personnelNameList = res.data.map(item => {
          item.label = item.personnelName
          item.value = item.personnelId
          return item
        })
        this.personnelNameList.unshift({
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
    getPersonnelGISData(figureType) {
      this.markers = []
      const data = {
        deptId: this.deptId,
        figureType,
        personnelId: this.personnelId
      }
      this.$api.getPersonnelGIS(data).then(res => {
        this.longitude = Number(res.data[0].longitude)
        this.latitude = Number(res.data[0].latitude)
        this.markers = res.data.filter((item, index) => {
          if (item.longitude !== null || item.latitude !== null) {
            item.id = item.personnelId
            item.width = 40
            item.height = 50
            item.iconPath = "../../../static/images/work_map_person.png"
            // item.imgUrl = item.pic_url ? this.$api.getUrl(item.pic_url) : "../../../static/gis/no.png"
            return item
          }
        })
        console.log(this.markers, "this.markers")
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
          width: 40,
          height: 50,
          joinCluster: true, // 指定了该参数才会参与聚合
          iconPath: item.iconPath
        })
        
        points.push({
          latitude: item.latitude,
          longitude: item.longitude
        })
      })
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
        const markerss = clusters.map(cluster => {
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
          markers: markerss,
          // clear: true
        })
      })
	  
    },

    trigger(e) {
      console.log(e)
      this.content[e.index].active = !e.item.active
      const type = e.index + 1
      this.getPersonnelGISData(type)
    },

    // 点击了点标记
    markertap(e) {
      setTimeout(() => {
        this.markers.forEach(item => {
          if (item.id === e.markerId) {
            this.$api.getPersonnelDetail({ personnelId: e.markerId }).then(res => {
              this.detail = res.data
              this.personnelShow = true
              this.personnelInfo = res.data.personnelInfo
              this.personnelInfo.personnelId = e.markerId
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
      }, 100)
    },

    // 点击了地图
    maptap() {
      console.log("点击了地图")
      this.personnelShow = false
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

    // 选择部门大类
    confirmDepartmentType(e) {
      this.departmentName = e.item.label || ""
      this.deptId = e.value || ""
      this.getPersonnelGISData()
      this.personnelShow = false
    },
    // 取消部门选择弹窗
    cancelDepartmentTypeShow() {
      this.$refs.pickerDepartmentTypeList.hide()
    },

    // 确认人员
    selectPersonnelName() {
      this.$refs.pickerPersonnelType.show()
    },
    // 选择人员
    confirmPersonnelType(e) {
      this.personnelName = e.item.label || ""
      this.personnelId = e.value || ""
      this.getPersonnelGISData()
      this.personnelShow = false
    },
    // 取消人员选择弹窗
    cancelPersonnelTypeShow() {
      this.$refs.pickerPersonnelType.hide()
    },
    showRouter() {
      uni.navigateTo({
        url: `../history-route?info=${JSON.stringify(this.personnelInfo)}`
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
      margin: 0 auto;
    }

    .button_list button {
      width: 200px;
      height: 34px;
      line-height: 34px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
    }

    .button_list button:nth-child(1) {
      color: #f2f2f2;
      background: #69ba15;
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
  }
}
</style>
