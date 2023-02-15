<!-- 车辆维修 -->
<template>
  <view class="container">
    <view class="main">
      <view class="head">
        <view class="uni-flex uni-row">
          <view class="text" style="-webkit-flex: 1;flex: 1;">
            <uni-card isShadow @click="applyMaintenance">
              <view class="menu_card"><image class="icon_menu" src="@/static/images/weixiuguanli.png"></image></view>
              <view class="menu_txt"><text class="content-box-text">维修申请</text></view>
            </uni-card>
          </view>
          <view class="text" style="-webkit-flex: 1;flex: 1;">
            <uni-card isShadow @click="maintenanceRecord">
              <view class="menu_card"><image class="icon_menu" src="@/static/images/oil-card.png"></image></view>
              <view class="menu_txt"><text class="content-box-text">维修记录</text></view>
            </uni-card>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  onShow() {},
  methods: {
    // 维修申请
    applyMaintenance() {
      if (this.$com.getPermission("MaintenanceApply")) {
        uni.navigateTo({
          url: "./apply-maintenance"
        })
      } else {
        uni.showToast({
          title: "暂无权限,请联系管理员",
          icon: "none",
          duration: 2000
        })
      }
    },
    // 维修记录
    maintenanceRecord() {
      if (this.$com.getPermission("MaintenanceRecord")) {
        uni.navigateTo({
          url: "./maintenance-record"
        })
      } else {
        uni.showToast({
          title: "暂无权限,请联系管理员",
          icon: "none",
          duration: 2000
        })
      }
    }
  }
}
</script>

<style>
page {
  background: #ffffff;
  font-size: 28rpx;
}

.container {
  /* background-color: #F5F5F5; */
}

.main {
  /* background-color: #FFFFFF; */
  margin-top: 20rpx;
}

.content {
  padding: 20rpx 30rpx;
}

.content_title_label {
  background-color: #73c41b;
  height: 42rpx;
  width: 15rpx;
  float: left;
  margin-right: 21rpx;
  border-radius: 8rpx;
}

.content_title_text {
  height: 40rpx;
  line-height: 40rpx;
  font-weight: bold;
}

.content_search .uni-searchbar {
  padding-left: 0 !important;
  width: 100%;
}

.head {
  text-align: center;
}

.content-box-text {
  height: 40rpx;
  line-height: 40rpx;
  font-size: 28rpx;
}

.icon_menu {
  width: 96rpx;
  height: 96rpx;
  margin: 8rpx 24rpx;
}



</style>
