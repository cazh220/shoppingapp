<template>
  <view id="Vehicle">
    <view class="top">
      <view class="header-contener">
        <view class="header">
          <view class="header-top">
            <text class="header-top-words">车辆总数 (辆)</text>
            <text class="header-top-text">{{ vehicleTotalNum }}</text>
          </view>
          <view class="header-bottom">
            <view class="header-bottom-right">
              <text class="header-bottom-right-words">在线 (辆)</text>
              <text class="header-bottom-right-num">{{ vehicleOnlineNum }}</text>
            </view>
            <view class="header-left-line"></view>
            <view class="header-bottom-left">
              <text class="header-bottom-left-words">离线 (辆)</text>
              <text class="header-bottom-left-num">{{ vehicleOffline }}</text>
            </view>
          </view>
        </view>
        <view class="header-menu">
          <div class="selected_img" v-for="(item, index) in menuType" :key="index" @click="onClickMenu(item)">
            <div class="img_box">
              <img :src="item.img" class="inset_img" />
            </div>
            <div class="selected_title">
              {{ item.label }}
            </div>
          </div>
        </view>
      </view>
    </view>
    <view class="container">
      <view class="container-bottom">
        <view class="container-bottom-title">
          <view class="green-line"></view>
          <view class="container-bottom-title_text">车辆列表</view>
          <view class="container-bottom-title-right">
            <text @click="more">更多</text>
            <uni-icons type="arrowright" size="22r" color="#999"></uni-icons>
          </view>
        </view>
        <xw-empty :isShow="orderEmptyShow" text="暂无相关订单数据" textColor="#777777"></xw-empty>
        <view class="container-bottom-list" v-for="(item, index) in list" :key="index">
          <view class="container-bottom-list-box">
            <view class="pore container-bottom-list-box-left-img-box">
              <image v-if="item.picUrl" class="container-bottom-list-box-left-img" :src="item.picUrl"></image>
              <image v-else class="container-bottom-list-box-left-img" src="@/static/gis/collection_car.png"></image>
              <view class="number-box text-out">{{ item.licensePlateNumber }}</view>
            </view>
            <view class="container-bottom-list-box-info">
              <view class="">
                <text class="container-bottom-list-box-field">车辆类型:</text>
                <text class="container-bottom-list-box-type">{{ item.vehicleTypeName }}</text>
              </view>
              <view class="">
                <text class="container-bottom-list-box-field">司机:</text>
                <text>{{ item.driverName }}</text>
              </view>
              <view class="">
                <text class="container-bottom-list-box-field">部门:</text>
                <text>{{ item.departmentName }}</text>
              </view>
              <view v-if="item.videoStatus == 1" class="container-bottom-list-box-status">
                <text>视频在线</text>
              </view>
              <view v-else class="container-bottom-list-box-status-off">
                <text>视频离线</text>
              </view>
            </view>
          </view>
          <view class="button_list">
            <!-- <button @click="showOil">查看油耗</button> -->
            <!-- <button @click="showPosition(item)">查看定位</button> -->
            <button
              @click="showPosition(item)"
              :disabled="item.gpsStatus != 1"
              :style="{ backgroundColor: item.gpsStatus != 1 ? '#ccc' : '#7dce20' }"
            >
              查看定位
            </button>
            <button @click="showVideo(item)">查看视频</button>
          </view>
          <view class="ty-bottom-line"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Vehicle",
  data() {
    return {
      vehicleTotalNum: 0,
      vehicleOnlineNum: 0,
      vehicleOffline: 0,
      orderEmptyShow: false,
      list: [],
      page: 1,
      last_page: 1,
      menuType: [
        {
          value: 1,
          type: "vehicleGIS",
          label: "车辆GIS",
          link: "./vehicle-GIS/vehicle-GIS",
          img: require("@/static/vehicle/cheliangGIS.png")
        },
        {
          value: 2,
          type: "collection",
          label: "收运作业",
          link: "../collection/collection",
          img: require("@/static/vehicle/shouyunzuoye.png")
        },
        {
          value: 3,
          type: "vehicleOil",
          label: "车辆加油",
          link: "../oil/index/index",
          img: require("@/static/vehicle/vehiclejiayou.png")
        },
        {
          value: 4,
          type: "vehicleRepair",
          label: "车辆维修",
          link: "../maintenance/index",
          img: require("@/static/vehicle/vehicleweixiu.png")
        }
      ]
    }
  },
  created() {
    this.getCollectionNumber()
    this.getCollectionVehicle()
  },
  methods: {
    // 点击菜单
    onClickMenu(item) {
      switch (item.type) {
        case "vehicleGIS":
          // 车辆GIS
          uni.navigateTo({
            url: item.link
          })
          break
        case "collection":
          // 收运作业
          uni.navigateTo({
            url: item.link
          })
          break
        case "vehicleOil":
          // 车辆加油
          uni.navigateTo({
            url: item.link
          })
          break
        case "vehicleRepair":
          // 车辆维修
          uni.navigateTo({
            url: item.link
          })
          break
        default:
          uni.navigateTo({
            url: "#"
          })
      }
    },

    // 获取收运点数
    getCollectionNumber() {
      this.$api.appletsVehicleManager().then(res => {
        this.vehicleOnlineNum = res.data.vehicleOnlineNum || 0
        this.vehicleOffline = res.data.vehicleOffline || 0
        this.vehicleTotalNum = res.data.vehicleTotalNum || 0
      })
    },

    // 获取收运车辆作业
    getCollectionVehicle(type) {
      if (type !== "nextPage") this.page = 1
      this.$api.getVehicleList({ pageNum: this.page }).then(res => {
        if (type === "nextPage") {
          // 下一页
          this.list.push(
            ...res.data.data.map(item => {
              item.picUrl = this.$api.getUrl(item.picUrl)
              return item
            })
          )
        } else {
          this.list = res.data.data.map(item => {
            item.picUrl = this.$api.getUrl(item.picUrl)
            return item
          })
        }
        this.last_page = res.data.pages
        this.orderEmptyShow = this.list.length === 0 ? true : false
      })
    },
    onPullDownRefresh() {
      this.page = 1
      this.list = []
      this.getCollectionVehicle()
    },
    onReachBottom() {
      if (this.page < this.last_page) {
        this.page++
        this.getCollectionVehicle("nextPage")
      } else {
        uni.showToast({
          icon: "none",
          title: "已经到底了"
        })
      }
    },

    // GIS定位
    gisPosition() {
      console.log("定位:")
      uni.navigateTo({
        url: "./vehicle-GIS/vehicle-GIS"
      })
    },

    // 更多
    more() {
      uni.navigateTo({
        url: "./vehicle-work/vehicle-work"
      })
    },
    showPosition(item) {
      uni.navigateTo({
        url: `./vehicle-GIS/vehicle-position?info=${JSON.stringify(item)}`
      })
    },
    showVideo(item) {
      uni.navigateTo({
        url: `./vehicle-GIS/vehicle-video?info=${JSON.stringify(item)}`
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #fff;
}
#Vehicle {
  .top {
    position: fixed;
    width: 100%;
    height: 550rpx;
    z-index: 999;
    // margin-top: 40rpx;
    box-shadow: 0px -23px 0px 0px rgba(0, 0, 0, 0.06);

    .header-contener {
      background-color: #fff;
      padding: 20px;
      // box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);

      .header {
        background-image: url(@/static/vehicle/header_bg.png);
        background-repeat: round;
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        height: 170px;
        //   width: 340px;
        box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        .header-top {
          margin-left: 60rpx;
          height: 50px;
          color: #fff;
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .header-top-text {
            font-weight: 600;
            font-size: 26px;
          }
          .header-top-words {
            font-weight: 500;
            font-size: 28rpx;
            //   color: #333333;
          }
        }
        .header-left-line {
          width: 1px;
          height: 48px;
          background: #fff;
          margin: auto;
        }
        .header-bottom {
          color: #fff;
          margin: 0 30px;
          display: flex;
          justify-content: space-between;
          font-size: 28rpx;
          .header-bottom-right {
            height: 50px;
            line-height: 30px;
            //   padding: 0px 15px;
            text-align: center;
            display: flex;
            flex-flow: column;
          }
          .header-bottom-right-words {
            font-weight: 500;
            font-size: 14px;
          }

          .header-bottom-left {
            height: 50px;
            line-height: 30px;
            //   padding: 0px 15px;
            text-align: center;
            display: flex;
            flex-flow: column;
          }
          .header-bottom-right-num {
            font-size: 16px;
            //   margin-left: 10px;
            font-weight: 600;
          }
        }
      }
      .header-menu {
        display: flex;
        justify-content: space-between;
        margin: 20px 0 0;

        .inset_img {
          height: 22px;
          width: 22px;
          margin: 0px 30%;
        }
        .selected_title {
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
      }
    }
  }

  .container {
    .container-top {
      padding: 15px;
      .container-top-position {
        background-color: #fff;
        box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        background-image: url(@/static/images/collection_bg.png);
        background-repeat: round;
        .container-top-position-icon {
          width: 36rpx;
          height: 44rpx;
          vertical-align: bottom;
          margin-right: 20px;
        }
      }
    }
    .container-bottom {
      box-shadow: 0px -23px 0px 0px rgba(0, 0, 0, 0.06);
      background-color: #fff;
      top: 600rpx;
      position: absolute;
      width: 100%;
      .container-bottom-title {
        padding: 24rpx 40rpx;
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
        .container-bottom-title-right {
          color: #999999;
          font-size: 22rpx;
          font-weight: 500;
          float: right;
        }
      }
      .container-bottom-list {
        padding: 0 40rpx;
        // border-bottom: 1px solid #eee;
        .container-bottom-list-box {
          display: flex;
          // justify-content: space-between;
          align-items: center;
          margin: 0 0 40rpx 0;
          .container-bottom-list-box-left-img-box {
            width: 100px;
            height: 100px;
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.11);
            border-radius: 4px;
            margin-right: 40rpx;
            overflow: hidden;
            .container-bottom-list-box-left-img {
              width: 100px;
              height: 77px;
              position: relative;
            }
            .number-box {
              width: 100%;
              position: absolute;
              bottom: 0;
              height: 44rpx;
              font-size: 24rpx;
              background-color: #eee;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .container-bottom-list-box-right-img {
            width: 50rpx;
            height: 50rpx;
          }
          .container-bottom-list-box-info {
            font-size: 26rpx;
            display: flex;
            flex-flow: column;
            height: 100px;
            width: 360rpx;
            justify-content: space-between;
          }
          .container-bottom-list-box-field {
            font-weight: 400;
            font-size: 12px;
            color: #666666;
            margin-right: 8px;
          }
          .container-bottom-list-box-type {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 230rpx;
            display: inline-block;
            vertical-align: bottom;
          }
          .container-bottom-list-box-jump {
            height: 150rpx;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            flex-flow: column;
            font-size: 26rpx;
          }

          .container-bottom-list-box-status {
            border: 1px solid #7acb1e;
            border-radius: 2px;
            font-weight: 500;
            color: #7ccd20;
            font-size: 10px;
            width: 45px;
            height: 19px;
            text-align: center;
            text {
              line-height: 19px;
            }
          }
          .container-bottom-list-box-status-off {
            border: 1px solid #c1c1c4;
            border-radius: 2px;
            font-weight: 500;
            color: #c1c1c4;
            font-size: 10px;
            width: 45px;
            height: 19px;
            text-align: center;
            text {
              line-height: 19px;
            }
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
          background: #7dce20;
          color: #fff;
          margin: 0;
        }
        .button_list button:nth-child(2) {
          background: #f2f2f2;
          color: #69ba15;
          margin: 0 auto;
        }
        .button_list button:nth-child(3) {
          background: #f2f2f2;
          color: #69ba15;
          margin: 0;
        }
      }
    }
  }
}
</style>
