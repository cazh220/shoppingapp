<template>
  <view id="Vehicle">
    <view class="header-contener">
      <view class="header">
        <view class="header-top">
          <text class="header-top-words">人员总数</text>
          <text class="header-top-text">{{ countObj.totalNum || 0 }}</text>
        </view>
        <view class="header-bottom">
          <view class="header-bottom-right">
            <text class="header-bottom-right-words">在线</text>
            <text class="header-bottom-right-num">{{ countObj.onlineNum || 0 }}</text>
          </view>
          <view class="header-left-line"></view>
          <view class="header-bottom-left">
            <text class="header-bottom-left-words">离线</text>
            <text class="header-bottom-left-num">{{ countObj.offlineNum || 0 }}</text>
          </view>
        </view>
      </view>
      <view class="personal-gis" @click="gisPosition">
        <view class="">
          <uni-icons type="location-filled" size="25" color="#999"></uni-icons>
          <text>人员GIS</text>
        </view>
        <uni-icons type="arrowright" size="22" color="#999" style="float:right"></uni-icons>
      </view>
    </view>
    <view class="container">
      <view class="container-bottom">
        <view class="container-bottom-title">
          <view class="">
            <view class="green-line"></view>
            <view class="container-bottom-title_text">人员列表</view>
          </view>
          <view class="container-bottom-title-right">
            <text @click="more">更多</text>
            <uni-icons type="arrowright" size="22r" color="#999"></uni-icons>
          </view>
        </view>
        <view class="container-bottom-list" v-for="(item, index) in list" :key="index">
          <view class="container-bottom-list-box">
            <view class="pore container-bottom-list-box-left-img-box">
              <image class="container-bottom-list-box-left-img" src="@/static/personal/person.png"></image>
            </view>
            <view class="container-bottom-list-box-info" style="flex:1">
              <view class="" style="display: flex;justify-content: space-between;">
                <view class="">
                  <text class="container-bottom-list-box-field">姓名：</text>
                  <text class="container-bottom-list-box-type">{{ item.personnelName }}</text>
                </view>
                <view class="item-state" :class="[item.state == 1 ? 'online-info' : 'offline-info']">{{ item.state == 1 ? "在线" : "离线" }}</view>
              </view>
              <view class="">
                <text class="container-bottom-list-box-field">部门：</text>
                <text>{{ item.departmentName }}</text>
              </view>
              <view class="">
                <text class="container-bottom-list-box-field">角色：</text>
                <text>{{ item.roleName }}</text>
              </view>
            </view>
          </view>
          <view class="button_list">
            <button @click="showPosition(item)" :disabled="item.state != 1" :style="{ backgroundColor: item.state != 1 ? '#ccc' : '#7dce20' }">
              查看定位
            </button>
            <button @click="showTrack(item)">历史轨迹</button>
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
      countObj: {},
      list: []
    }
  },
  created() {
    this.getPersonCount()
    this.getPersonList()
  },
  methods: {
    // 获取收运点数
    getPersonCount() {
      this.$api.getDataCount().then(res => {
        this.countObj = res.data
      })
    },

    // 获取收运人员作业
    getPersonList() {
      this.$api.getPersonList({ pageNum: 1, pageSize: 5 }).then(res => {
        this.list = res.data.data
      })
    },

    // GIS定位
    gisPosition() {
      console.log("定位:")
      uni.navigateTo({
        url: "./personal-GIS/personal-GIS"
      })
    },

    // 更多
    more() {
      uni.navigateTo({
        url: "./personal-work/personal-work"
      })
    },

    showPosition(item) {
      let data = JSON.stringify(item)
      uni.navigateTo({
        url: "./personal-work/personal-work-position?data=" + data
      })
    },

    showTrack(item) {
      let data = JSON.stringify(item)
      uni.navigateTo({
        url: "./history-route?info=" + data
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
  .header-contener {
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);

    .header {
      // background-image: url(../../static/vehicle/header_bg.png);
      background-repeat: round;
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      height: 170px;
      //   width: 340px;
      background-image: linear-gradient(#ff6459, #ffa290);
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
    .personal-gis {
      margin-top: 40px;
      height: 80px;
      line-height: 80px;
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
      background-image: url(../../static/personal/map.png);
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
        background-image: url(../../static/images/collection_bg.png);
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
      margin-top: 40rpx;
      .container-bottom-title {
        display: flex;
        justify-content: space-between;
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
            height: 77px;
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
            height: 77px;
            width: 360rpx;
            justify-content: space-between;
            .item-state {
              padding: 5rpx 16rpx;
              border-radius: 10rpx;
            }
            .online-info {
              border: 1rpx solid #7dce20;
              color: #7dce20;
            }
            .offline-info {
              border: 1rpx solid #ccc;
              color: #ccc;
            }
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
        }
        .button_list {
          display: flex;
          justify-content: space-between;
        }
        .button_list button {
          width: 104px;
          height: 34px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
        }
        .button_list button:nth-child(2) {
          background: #f2f2f2;
          color: #69ba15;
        }
        .button_list button:nth-child(1) {
          background: #7dce20;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
