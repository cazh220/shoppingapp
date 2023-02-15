<template>
  <view id="VehicleVideo">
    <view class="search-box">
      <uni-forms ref="form" :modelValue="formData" border>
        <uni-forms-item name="vehicle_name">
          <view slot="left" class="form-label">
            <text>当前车辆：</text>
          </view>
          <view class="text-center">{{ vehicleInfo.licensePlateNumber }}</view>
        </uni-forms-item>
        <uni-forms-item required name="channelNo">
          <view slot="left" class="form-label">
            <text>当前通道：</text>
          </view>

          <lb-picker
            ref="areaPicker"
            v-model="formData.value"
            :props="{ label: 'label', value: 'value', children: 'children' }"
            mode="multiSelector"
            level="3"
            :list="channelList"
            @confirm="areaConfirm"
          >
            <ty-picker-frame :placeholder="'请选择通道'" :text="formData.label"></ty-picker-frame>
          </lb-picker>
        </uni-forms-item>
      </uni-forms>
    </view>

    <view class="vehicle-video-box">
      <view class="container-bottom-title">
        <view class="green-line"></view>
        <view class="container-bottom-title_text">车辆视频</view>
      </view>
      <view style="width:200px;height:300px;" v-if="formData.value">
        <uni-flv style="width:200px;height:300px;" :path="path"></uni-flv>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "VehicleVideo",
  data() {
    return {
      path: "",
      vehicleInfo: {},
      channelList: [],
      danmuList: [],
      formData: {
        value: null,
        label: ""
      },

      vedioUrl: ""
    }
  },
  onLoad(options) {
    this.vehicleInfo = JSON.parse(options.info)
    this.$api.getChannelListByVehicleId({ vehicleId: this.vehicleInfo.vehicleId }).then(res => {
      this.channelList = res.data
    })
  },
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    // 确定
    areaConfirm({ item, value }) {
      console.log(item, value, "areaConfirm")
      let sim = value[0]
      this.formData.value = value[1]
      this.formData.label = ""
      item.forEach(sitem => {
        this.formData.label = sitem.label
      })

      let env = process.env.NODE_ENV == "development" ? "hwtest.jsyinghuan.com" : "hw.jsyinghuan.com"
      this.path = `https://hw.jsyinghuan.com/tstrtvs.html?sim=${sim}&channelNo=${this.formData.value}&env=${env}`
    }
  }
}
</script>

<style lang="scss">
page {
  background: #fff;
}
#VehicleVideo {
  background: #fff;
  height: 100%;
  .search-box {
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
    .form-label {
      width: 90px;
      margin-left: 40rpx;
    }
    .text-center {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .text-placeholder {
      color: #999999;
    }
  }
  .vehicle-video-box {
    background: #fff;
    padding: 40rpx;
    margin-top: 40rpx;
    box-shadow: 0px -23px 0px 0px rgba(0, 0, 0, 0.06);

    .container-bottom-title {
      margin-bottom: 40rpx;
      display: flex;
      //   padding: 24rpx 40rpx;
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
    }
    video {
      width: 100%;
    }
    // }
  }
}
</style>
