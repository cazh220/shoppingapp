<!-- 加油站 -->
<template>
  <view class="container">
    <view class="main">
      <view class="title">
        <text>当前加油站</text>
      </view>
      <view class="station">
        <view class="station_image">
          <image class="station_img" :src="oil_station_img" @tap="previewImage"></image>
        </view>
        <view class="context">
          <view class="station_name">
            {{ oil_station_name }}
          </view>
          <view class="address"> <uni-icons type="location-filled" color="#8f8f94" size="13" />{{ oil_station_address }} </view>
        </view>
      </view>
    </view>
    <view class="button_list">
      <uni-row class="demo-uni-row" :width="nvueWidth">
        <uni-col :span="12">
          <button @click="maintain">维护油价</button>
        </uni-col>
        <uni-col :span="12">
          <button @click="addOils">去加油</button>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      oil_station_name: "塔中加油站",
      oil_station_id: "",
      oil_station_address: "塔克拉玛干沙漠公路塔中镇",
      oil_station_img: "../../../static/images/oil-management.png",
      isConfirmPrice: false
    }
  },
  onLoad(option) {
    console.log(option, "option")
    this.oil_station_id = option.oilstationid || ""
  },
  onShow() {
    this.getOilStationAddress()
    this.confirmPrice()
  },
  methods: {
    // 确认当天油价是否已确认
    confirmPrice() {
      let data = {
        id: this.oil_station_id
      }
      this.$api.confirmPrice(data).then(
        res => {
          this.isConfirmPrice = res.data
        },
        fail => {}
      )
    },
    // 维护油价
    maintain() {
      console.log("维护油价")
      uni.navigateTo({
        url: "../oilprice/oilprice?channel=latest&station_id=" + this.oil_station_id
      })
    },
    // 去加油
    addOils() {
      if (!this.isConfirmPrice) {
        uni.showToast({
          icon: "none",
          title: "油价维护中...."
        })
        return false
      }

      uni.navigateTo({
        url: "../addoil/vehicleinfo?station_id=" + this.oil_station_id
      })
    },
    // 获取加油站信息
    getOilStationAddress() {
      let data = {
        id: this.oil_station_id
      }
      this.$api.getOilStationAddress(data).then(
        res => {
          console.log(res)
          this.oil_station_name = res.data.petrolStationName || ""
          this.oil_station_address = res.data.addressDetails || ""
          this.oil_station_img = res.data.picUrl ? this.$api.getUrl(res.data.picUrl) : ""
        },
        fail => {
          uni.showToast({
            title: "获取加油站信息错误",
            icon: "none",
            duration: 2000
          })
        }
      )
    },
    //预览图片
    previewImage: function(e) {
      uni.previewImage({
        current: this.oil_station_img,
        urls: [this.oil_station_img]
      })
    }
  }
}
</script>

<style>
page {
  font-size: 28rpx;
}
.container {
  background-color: #f5f5f5;
}

.title {
  color: #73c41b;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 32rpx;
  padding-left: 30rpx;
  border-bottom: solid 1rpx #ececec;
  font-weight: 500;
}

.main {
  background-color: #ffffff;
  margin-top: 20rpx;
}

.station {
  height: 120rpx;
  padding: 20rpx 50rpx;
}

.station_image {
  float: left;
}

.station_img {
  width: 120rpx;
  height: 120rpx;
}

.context {
  /* float: left; */
  height: 120rpx;
  margin-left: 135rpx;
}

.station_name {
  height: 60rpx;
  line-height: 60rpx;
  color: #333333;
  font-weight: bold;
}

.address {
  /* height: 60rpx;
		line-height: 60rpx; */
  color: #999999;
  font-size: 24rpx;
}

.button_list {
  position: fixed;
  left: 0;
  bottom: 40rpx;
  right: 0;
  z-index: 10;
}

.button_list button {
  width: 90%;
  background-color: #7dce20;
  color: #ffffff;
}
</style>
