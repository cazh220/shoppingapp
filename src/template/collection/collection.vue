<template>
  <view id="Collection">
    <view class="header">
      <view class="header-box">
        <view class="header-left">
          <text class="header-left-text">{{ count }}</text>
          <text>收运点总数</text>
        </view>
        <view class="header-right">
          <view class="header-right-top">
            <text>已收运点位</text>
            <text class="header-right-num">{{ complete_count }}</text>
          </view>
          <view class="header-right-bottom">
            <text>未收运点位</text>
            <text class="header-right-num">{{ not_complete_count }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="container">
      <!-- <view class="container-top">
				<view class="container-top-position" @click="gisPosition">
					<view>
						<image class="container-top-position-icon" src="../../static/images/collection_position.png"></image>
						<text>设施GIS定位</text>
					</view>
					<uni-icons type="arrowright" size="40r"></uni-icons>
				</view>
			</view> -->
      <view class="container-bottom">
        <view class="container-bottom-title">
          <text>当日作业车辆</text>
          <view class="container-bottom-title-right">
            <text @click="more">更多</text>
            <uni-icons type="arrowright" size="28r"></uni-icons>
          </view>
        </view>
        <xw-empty :isShow="orderEmptyShow" text="暂无相关订单数据" textColor="#777777"></xw-empty>
        <view class="p20 container-bottom-list" v-for="(item, index) in list" :key="index">
          <view class="container-bottom-list-box" @click="detail(item)">
            <view class="pore container-bottom-list-box-left-img-box">
              <image v-if="item.pic_url" class="container-bottom-list-box-left-img" :src="item.pic_url"></image>
              <image v-else class="container-bottom-list-box-left-img" src="@/static/gis/collection_car.png"></image>
              <view class="number-box text-out">{{ item.license_plate_number }}</view>
            </view>
            <view class="container-bottom-list-box-info">
              <view class="">
                <text class="container-bottom-list-box-field">车辆类型:</text>
                <text class="container-bottom-list-box-type">{{ item.vehicle_name }}</text>
              </view>
              <view class="">
                <text class="container-bottom-list-box-field">司机:</text>
                <text>{{ item.driver_name }}</text>
              </view>
              <view class="">
                <text class="container-bottom-list-box-field">今日已收运点位:</text>
                <text>{{ item.clear_trash_num }}</text>
              </view>
            </view>
            <view class="container-bottom-list-box-jump">
              <image class="container-bottom-list-box-right-img" src="../../static/images/collection_jump.png"></image>
              <text>收运进度</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Collection",
  data() {
    return {
      orderEmptyShow: false,
      complete_count: 31,
      count: 51,
      not_complete_count: 20,
      list: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
  },
  created() {
    this.getCollectionNumber()
    this.getCollectionVehicle()
  },
  methods: {
    // 获取收运点数
    getCollectionNumber() {
      this.$api.getCollectionNumber().then(res => {
        this.complete_count = res.data.complete_count || 0
        this.count = res.data.count || 0
        this.not_complete_count = res.data.not_complete_count || 0
      })
    },

    // 获取收运车辆作业
    getCollectionVehicle() {
      this.$api.getCollectionVehicle().then(res => {
        this.list = res.data.map(item => {
          item.pic_url = this.$api.getUrl(item.pic_url)
          return item
        })
        this.orderEmptyShow = this.list.length === 0 ? true : false
      })
    },

    // GIS定位
    gisPosition() {
      console.log("定位:")
      uni.navigateTo({
        url: "./collection-gis/collection-gis"
      })
    },

    // 更多
    more() {
      uni.navigateTo({
        url: "./collection-work/collection-work"
      })
    },

    // 详情
    detail(item) {
      uni.navigateTo({
        url: "./collection-work/collection-work-progress?license_plate_number=" + item.license_plate_number + "&vehicleId=" + item.id
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background: #fff;
}
#Collection {
  .header {
    height: 140px;
    .header-box {
      box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
      display: flex;
      margin: 20px;
      height: 118px;
      background: #ffffff;
      border-radius: 8px;
    }

    .header-left {
      width: 300rpx;
      border-right: 1px solid #dadada;
      display: flex;
      align-items: center;
      height: 100%;
      flex-flow: column;
      justify-content: space-around;
      .header-left-text {
        font-weight: 700;
        font-size: 36rpx;
      }
    }
    .header-right {
      width: 340rpx;
      margin-left: 15px;
      display: flex;
      flex-flow: column;
      justify-content: space-evenly;
      font-size: 28rpx;
      .header-right-top {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #dadada;
        color: #7aca1f;
        padding: 0px 15px;
        text-align: center;
      }
      .header-right-bottom {
        height: 50px;
        line-height: 50px;
        color: #fa3b3b;
        padding: 0px 15px;
        text-align: center;
      }
      .header-right-num {
        font-size: 36rpx;
        margin-left: 10px;
        font-weight: 700;
      }
    }
  }
  .container {
    box-shadow: 0px -23px 0px 0px rgba(0, 0, 0, 0.06);
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
      background-color: #fff;
      margin-top: 40rpx;
      .container-bottom-title {
        height: 40px;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;
        font-size: 30rpx;
        .container-bottom-title-right {
          color: #333333;
          font-size: 26rpx;
        }
      }
      .container-bottom-list {
        padding: 15px;
        border-bottom: 1px solid #eee;
        .container-bottom-list-box {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .container-bottom-list-box-left-img-box {
            border-radius: 12px;
            overflow: hidden;
            .container-bottom-list-box-left-img {
              width: 150rpx;
              height: 150rpx;
              position: relative;
            }
            .number-box {
              width: 150rpx;
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
            height: 150rpx;
            width: 360rpx;
            justify-content: space-around;
          }
          .container-bottom-list-box-field {
            color: #666666;
            margin-right: 8px;
          }
          .container-bottom-list-box-type {
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
        }
      }
    }
  }
}
</style>
