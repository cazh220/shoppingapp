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
    <view style="margin-top: 100px">
      <xw-empty :isShow="orderEmptyShow" text="暂无相关订单数据" textColor="#777777"></xw-empty>
      <view class=" container-bottom-list" v-for="(item, index) in list" :key="index">
        <view class="container-bottom-list-box">
          <view class="pore .container-bottom-list-box-left-img-box">
            <image v-if="item.pic_url" class="container-bottom-list-box-left-img" :src="item.pic_url"></image>
            <image v-else class="container-bottom-list-box-left-img" src="@/static/gis/collection_car.png"></image>
            <view class="number-box">{{ item.license_plate_number }}</view>
          </view>

          <view class="container-bottom-list-box-info">
            <view class="">
              <text class="container-bottom-list-box-field">车辆类型:</text>
              <text>{{ item.vehicle_name }}</text>
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
          <view class="container-bottom-list-box-jump" @click="detail(item)">
            <image class="container-bottom-list-box-right-img" src="../../../static/images/collection_jump.png"></image>
            <text>收运进度</text>
          </view>
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
      list: []
    }
  },

  onLoad() {
    this.search()
  },

  onPullDownRefresh() {
    this.list = []
    this.page = 1
    this.search()
  },

  onReachBottom: function() {
    if (this.page < this.last_page) {
      this.page++
      this.search("nextPage")
    } else {
      uni.showToast({
        icon: "none",
        title: "已经到底了"
      })
    }
  },

  methods: {
    // 搜索
    search(type) {
      if (type !== "nextPage") this.page = 1
      this.$api
        .getCollectionVehicleList({
          license_plate_number: this.searchValue,
          page: this.page
        })
        .then(res => {
          if (type === "nextPage") {
            // 下一页
            this.list.push(
              ...res.data.data.map(item => {
                item.pic_url = this.$api.getUrl(item.pic_url)
                return item
              })
            )
          } else {
            this.list = res.data.data.map(item => {
              item.pic_url = this.$api.getUrl(item.pic_url)
              return item
            })
          }
          this.last_page = res.data.last_page
          this.orderEmptyShow = this.list.length === 0 ? true : false
        })
    },

    // 清空搜索
    clearSearchValue() {
      this.searchValue = ""
      this.search()
    },

    // 详情
    detail(item) {
      console.log(item, "详情iiiii")
      uni.navigateTo({
        url: "./collection-work-progress?license_plate_number=" + item.license_plate_number + "&vehicleId=" + item.id
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
    background-color: #f5f5f5;
    border-bottom: none;
    .header-img {
      width: 18px;
      height: 18px;
    }
  }
  .uni-searchbar__box {
    border: none;
    background-color: #fff !important;
  }
  .uni-searchbar {
    padding: 40rpx 40rpx;
  }

  .container-bottom-list {
    padding: 0 15px;
    // border-bottom: 1px solid #eee;
    .container-bottom-list-box {
      display: flex;
      // justify-content: space-around;
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
        height: 150rpx;
        width: 345rpx;
        justify-content: space-around;
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
    }
  }
}
</style>
