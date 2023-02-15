<template>
  <view id="CollectionWork">
    <view class="header-flxed">
      <view>
        <uni-search-bar
          @confirm="search"
          cancelButton="none"
          placeholder="请输入车牌号"
          @clear="clearSearchValue"
          :focus="true"
          v-model="searchValue"
        >
          <image class="header-img" slot="searchIcon" src="@/static/images/sousuo.png"></image>
        </uni-search-bar>
      </view>
    </view>
    <view class="container">
      <xw-empty :isShow="orderEmptyShow" text="暂无相关订单数据" textColor="#777777"></xw-empty>
      <view class="p20 container-bottom-list" v-for="(item, index) in list" :key="index">
        <view class="container-bottom-list-box">
          <view class="pore .container-bottom-list-box-left-img-box">
            <image v-if="item.picUrl" class="container-bottom-list-box-left-img" :src="item.picUrl"></image>
            <image v-else class="container-bottom-list-box-left-img" src="@/static/gis/collection_car.png"></image>
            <view class="number-box">{{ item.licensePlateNumber }}</view>
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
          <button @click="showPosition(item)">查看定位</button>
          <button @click="showVideo(item)">查看视频</button>
        </view>
        <view class="ty-bottom-line"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "CollectionWork",
  data() {
    return {
      searchValue: "",
      page: 1,
      last_page: 1,
      orderEmptyShow: false,
      list: [],
      
    }
  },

  onLoad() {
    this.search()
  },

  onPullDownRefresh() {
    this.page = 1;
    this.list = []
    this.search()
  },

  onReachBottom: function() {
    if (this.page < this.last_page) {
      this.page++;
      this.search("nextPage");
    } else {
      uni.showToast({
        icon: "none",
        title: "已经到底了",
      });
    }
  },

  methods: {
    // 搜索
    search(type) {
      if (type !== "nextPage") this.page = 1;
      this.$api
        .getVehicleList({
          licensePlateNumber: this.searchValue,
          page: this.page,
        })
        .then((res) => {
          if (type === "nextPage") {
            // 下一页
            this.list.push(
              ...res.data.data.map((item) => {
                item.picUrl = this.$api.getUrl(item.picUrl);
                return item;
              })
            );
          } else {
            this.list = res.data.data.map((item) => {
              item.picUrl = this.$api.getUrl(item.picUrl);
              return item;
            });
          }
          this.last_page = res.data.pages;
          this.orderEmptyShow = this.list.length === 0 ? true : false;
        });
    },

    // 清空搜索
    clearSearchValue() {
      this.searchValue = ""
      this.search()
    },

    // 详情
    detail(item) {
      uni.navigateTo({
        url: "./collection-work-progress?license_plate_number=" + item.license_plate_number
      })
    },
    showOil() {
      uni.navigateTo({
        url: "../vehicle-GIS/vehicle-oil"
      })
    },
    showPosition(item) {
      uni.navigateTo({
        url: `../vehicle-GIS/vehicle-position?info=${JSON.stringify(item)}`
      })
    },
    showVideo(item) {
      uni.navigateTo({
        url: `../vehicle-GIS/vehicle-video?info=${JSON.stringify(item)}`
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background: #fff;
}
#CollectionWork {
  background-color: #fff;
  .header-flxed {
    // background-color: #f5f5f5;
    border-bottom: none;

    .header-img {
      width: 18px;
      height: 18px;
    }
  }
  .uni-searchbar__box {
    border: none;
    background: #f5f5f5;
  }
  .uni-searchbar {
    padding: 20rpx 40rpx;
  }
  .container {
    box-shadow: 0px -23px 0px 0px rgba(0, 0, 0, 0.06);
    background-color: #fff;
    top: 100rpx;
    position: absolute;
    width: 100%;
  }

  .container-bottom-list {
    padding: 0 40rpx;
    // border-bottom: 1px solid #eee;
    .container-bottom-list-box {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      margin: 40rpx 0 40rpx 0;
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
  }
}
</style>
