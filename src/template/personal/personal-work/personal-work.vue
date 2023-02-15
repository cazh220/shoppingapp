<template>
  <view id="CollectionWork">
    <view class="header-flxed">
      <view>
        <uni-search-bar
          @confirm="search"
          cancelButton="none"
          placeholder="请输入人员姓名"
          @clear="clearSearchValue"
          :focus="true"
          v-model="searchValue"
        >
          <image class="header-img" slot="searchIcon" src="@/static/images/sousuo.png"></image>
        </uni-search-bar>
      </view>
    </view>
    <view style="padding-top: 100rpx;">
      <xw-empty :isShow="orderEmptyShow" text="暂无相关人员数据" textColor="#777777"></xw-empty>
      <view class="p20 container-bottom-list" v-for="(item, index) in list" :key="index">
        <view class="container-bottom-list-box">
          <view class="pore .container-bottom-list-box-left-img-box">
            <image class="container-bottom-list-box-left-img" src="@/static/personal/person.png"></image>
            <!-- <view class="number-box">{{ item.license_plate_number }}</view> -->
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
      const opt = {
        pageNum: this.page,
        pageSize: 15
      }
      this.searchValue && (opt.personnelName = this.searchValue)
      this.$api.getPersonList(opt).then(res => {
        this.list = [...this.list, ...res.data.data]
        this.last_page = res.data.last_page
        this.orderEmptyShow = this.list.length === 0 ? true : false
      })
    },

    // 清空搜索
    clearSearchValue() {
      this.searchValue = ""
      this.search()
    },

    showPosition(item) {
      let data = JSON.stringify(item)
      uni.navigateTo({
        url: "./../personal-work/personal-work-position?data=" + data
      })
    },

    showTrack(item) {
      let data = JSON.stringify(item)
      uni.navigateTo({
        url: "./../history-route?info=" + data
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
</style>
