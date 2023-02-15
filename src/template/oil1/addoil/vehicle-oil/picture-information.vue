<template>
  <!-- 已创建 -->
  <view id="PictureInformation" class="PictureInformation">
    <view class="main">
      <view class="basic">
        <uni-list> </uni-list>
        <view class="upload">
          <view class="uploadcontent">
            <view class="label"> <text class="point">*</text>上传图片： </view>
            <view class="uploadimgs">
              <uni-file-picker
                file-mediatype="image"
                v-model="formData.refuelingEvidenceUrlArr"
                disable-preview
                :del-icon="true"
                mode="grid"
                file-extname="png,jpg"
                :limit="3"
                @select="selectPic"
                @fail="imgFail"
                @delete="deleteImg"
              />
            </view>
            <text class="tip"
              >注：最多三张图片，请上传车辆仪表盘图片、车牌号、加油终端图片</text
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "PictureInformation",
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
.PictureInformation {
  padding: 0px 20px;
  .lh {
    float: right;
    line-height: 36px;
  }
  .main {
    // margin-top: 20rpx;
    background-color: #ffffff;
  }

  .point {
    color: #9adb58;
    margin: 0 5rpx;
  }

  .upload {
    height: 280rpx;
  }

  .label {
    float: left;
  }

  .uploadcontent {
    padding: 24rpx 30rpx;
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
    /* position: fixed;
		left: 0;
		bottom: 40rpx;
		right: 0; */
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
    margin-bottom: 40rpx;
  }

  .tip {
    color: #666666;
    font-size: 24rpx;
    margin-top: 5rpx;
  }

  .uni-data-checklist {
    top: 4rpx !important;
  }

  .diabledText {
    color: #808080;
  }

  .radio__inner {
    border-color: #7dce20 !important;
  }

  .radio__inner-icon {
    border-color: #7dce20 !important;
    background-color: #7dce20 !important;
  }

  .checklist-box.is--default.is-checked .checklist-text {
    color: #7dce20 !important;
  }

  .unit {
    position: absolute;
    right: 50rpx;
    color: #808080;
  }
}
</style>
