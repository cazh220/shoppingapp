<template>
  <view id="CollectionGis">
    <map
      id="map"
      :scale="12"
      :max-scale="14"
      :latitude="latitude"
      :enable-poi="true"
      :show-location="true"
      :longitude="longitude"
      :markers="markers"
      @markertap="markertap"
      @tap="maptap"
    ></map>

    <!-- 下方详情  v-if="detail.type_name !== ''"-->
    <cover-view class="action">
      <cover-view class="action-top">
        <view class="container-bottom-title">
          <view class="green-line"></view>
          <view class="container-bottom-title_text">车辆信息</view>
        </view>

        <cover-view class="">
          <cover-view class="">
            <cover-view class="action-top-field dib">车牌号:</cover-view>
            <cover-view class="action-top-value dib">{{
              detail.type_name
            }}</cover-view>
          </cover-view>
          <cover-view class="">
            <cover-view class="action-top-field dib">司机:</cover-view>
            <cover-view class="action-top-value dib">{{
              detail.area
            }}</cover-view>
          </cover-view>
        </cover-view>

        <cover-view class="">
          <cover-view class="">
            <cover-view class="action-top-field dib">状态:</cover-view>
            <cover-view class="action-top-value dib">{{
              detail.type_name
            }}</cover-view>
          </cover-view>
          <cover-view class="">
            <cover-view class="action-top-field dib">定位时间:</cover-view>
            <cover-view class="action-top-value dib">{{
              detail.name
            }}</cover-view>
          </cover-view>
          <cover-view class="">
            <cover-view class="action-top-field dib">定位地址:</cover-view>
            <cover-view class="action-top-value dib">{{
              detail.name
            }}</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="button_list">
        <button @click="showHistoryRoute">查看历史轨迹</button>
      </cover-view>
    </cover-view>
  </view>
</template>

<script>
export default {
  name: "CollectionGis",
  data() {
    return {
      departmentTypeList: this.$com.oilTypeList(),
      departmentId: undefined,
      carNumTypeList: this.$com.oilTypeList(),
      CarNumTypeId: undefined,
      // id: 0, // 使用 marker点击事件 需要填写id
      latitude: 32.026465,
      longitude: 120.875942,
      markers: [],
      addBut: require("@/static/gis/add.png"),
      listBut: require("@/static/gis/list.png"),
      detail: {
        type_name: "",
        name: "",
        area: "",
        imgUrl: "",
      },
    };
  },
  computed: {
    CollectionGISAdd() {
      return this.$com.getPermission("CollectionGISAdd");
    },
  },
  created() {
    this.getCollectionGISData();
  },

  methods: {
    // 获取GIS数据
    getCollectionGISData() {
      this.$api.getCollectionGISData().then((res) => {
        this.longitude = res.data[0].location.split(",")[0];
        this.latitude = res.data[0].location.split(",")[1];
        this.markers = res.data.filter((item, index) => {
          item.longitude = item.location.split(",")[0];
          item.latitude = item.location.split(",")[1];
          if (item.longitude || item.latitude) {
            item.id = index;
            item.width = 38;
            item.height = 46;
            item.iconPath = "../../../static/gis/" + item.type + ".png";
            item.imgUrl = item.pic_url
              ? this.$api.getUrl(item.pic_url)
              : "../../../static/gis/no.png";
            return item;
          }
        });
      });
    },

    // 点击了点标记
    markertap(e) {
      setTimeout(() => {
        this.markers.forEach((item) => {
          if (item.id === e.markerId) {
            this.detail = item;
          }
        });
      }, 100);
    },

    // 点击了地图
    maptap() {
      this.detail = {
        type_name: "",
        name: "",
        area: "",
        imgUrl: "",
      };
    },

    showHistoryRoute() {
      uni.navigateTo({
        url: "./history-route",
      });
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
}
#CollectionGis {
  height: 100%;

  #map {
    width: 750rpx;
    height: 100%;
  }
  .action {
    padding: 40rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    height: 450rpx;
    width: 90%;
    display: flex;
    flex-flow: column;
    .action-top {
      margin-bottom: 20rpx;

      .container-bottom-title {
        padding: 0rpx 0 20rpx 0;
        align-items: center;
        font-size: 30rpx;
        .container-bottom-title_text {
          display: inline-block;
          vertical-align: middle;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
        }
      }
      .action-top-left-img {
        width: 150rpx;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333333;
        border-radius: 10px;
      }
      .action-top-info {
        display: flex;
        justify-content: space-between;
      }
      .action-top-field {
        margin-right: 10rpx;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .action-top-value {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .action-top-info_third {
        display: flex;
        justify-content: space-between;
      }
      .action-top-box-right {
        margin-bottom: 10rpx;
        display: flex;
        justify-content: flex-start;
      }
      .action-top-box-left {
        margin-bottom: 10rpx;
        display: flex;
        justify-content: flex-end;
      }
    }

    .button_list button {
      width: 184px;
      height: 40px;
      background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
      border-radius: 4px;

      //   width: 96px;
      //   height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 40px;
    }
  }
}
</style>
