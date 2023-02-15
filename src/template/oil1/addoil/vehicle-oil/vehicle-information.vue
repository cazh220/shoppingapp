<template>
  <!-- 已创建 -->
  <view id="VehicleInformation" class="VehicleInformation">
    <view class="main">
      <view class="basic">
        <uni-list>
          <uni-list-item>
            <view slot="header" class="slot-box">
              <text class="point">*</text>车牌号：
            </view>
            <view slot="body">
              <input
                class="price flex-long"
                name="license_number"
                focus
                v-model="formData.license_number"
                placeholder="请输入车牌号"
                style="margin-top: 7rpx; margin-right: 100rpx"
              />
            </view>
            <template slot="footer">
              <uni-icons
                :type="photoSrc"
                size="24"
                color="#9ADB58"
                @tap="chooseImage"
              />
            </template>
          </uni-list-item>
          <uni-list-item>
            <view slot="header" class="slot-box">
              <text class="point">*</text>车辆类型：<text class="diabledText">{{
                vehicleTypeName
              }}</text>
            </view>
          </uni-list-item>
          <uni-list-item>
            <view slot="header" class="slot-box">
              <text class="point">*</text>里程数：
            </view>
            <view slot="body">
              <input
                class="price flex-long"
                name="miles"
                type="digit"
                focus
                v-model="formData.miles"
                placeholder="请输入里程数"
              />
            </view>
            <template slot="footer">
              <text class="unit">KM</text>
            </template>
          </uni-list-item>
          <uni-list-item>
            <view slot="header" class="slot-box">
              <text class="point">*</text>当前油量：
            </view>
            <view slot="body">
              <input
                class="price flex-long"
                name="oil_quantity"
                type="digit"
                focus
                v-model="formData.oil_quantity"
                placeholder="请输入当前油量"
              />
            </view>
            <template slot="footer">
              <text class="unit">L</text>
            </template>
          </uni-list-item>
          <uni-list-item link @click="selectDriver">
            <view slot="header" class="slot-box">
              <text class="point">*</text>司机：<text class="diabledText">{{
                driverName
              }}</text>
              <lb-picker
                ref="picker"
                :list="drivers"
                v-model="driverName"
                @confirm="confirmDriver"
                @cancel="cancelDriverShow"
              ></lb-picker>
            </view>
          </uni-list-item>
        </uni-list>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "VehicleInformation",
  props: {
    showFormData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      formData: {},
      imageStyles: {
        width: 70,
        height: 70,
      },
    };
  },

  watch: {
    showFormData: {
      handler(val) {
        this.formData = val;
        this.formData.img = this.formData.apply_img.map((item) => {
          return {
            name: item,
            extname: "png",
            url: this.$api.getUrl(item),
          };
        });
      },
    },
  },
};
</script>

<style lang="scss">
.VehicleInformation {
  padding: 0px 20px;
  .lh {
    float: right;
    line-height: 36px;
  }
  .main {
    // margin-top: 20rpx;
  }

  .point {
    color: #9adb58;
    margin: 0 5rpx;
  }

  .uni-list-item {
    height: 120rpx;
  }

  .slot-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    align-items: center;
  }

  .slot-image {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    margin-right: 10px;
    width: 30px;
    height: 30px;
  }

  .slot-text {
    flex: 1;
    font-size: 14px;
    margin-right: 10px;
  }

  .button_next {
    position: fixed;
    left: 0;
    bottom: 40rpx;
    right: 0;
    z-index: 10;
    height: 90rpx;
    width: 90%;
    margin: 0 auto;
    font-size: 36rpx;
    border-radius: 40rpx;
    color: #fff;
    /* background: #7DCE20; */
    border-radius: 0;
    /* border-top: 1rpx solid #7DCE20; */
  }

  .button_next button {
    border-radius: 20rpx;
    background-color: #7dce20;
  }

  .diabledText {
    color: #808080;
  }

  .unit {
    position: absolute;
    right: 50rpx;
    color: #808080;
  }
}
</style>
