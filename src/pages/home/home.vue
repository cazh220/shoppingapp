<!-- 首页 -->
<template>
  <view class="container">
    <view class="login-bg">
      <!-- <view class="exchangePrj" @click="switchProject">
        <text class="exchange">&#xe601;</text>
        <text class="prjname">{{ projectName }}</text>
      </view> -->
      <view class="pichead uni-flex uni-row">
        <view class="text" style="-webkit-flex: 1; flex: 1">
          <!-- <view>
            <image src="../../static/images/logo.png" class="login_pic"></image>
          </view>
          <view class="logo_title">
            <view class="main_title">城市的守护者</view>
            <view class="sub_title">10月26清洁工日 致敬环卫工人</view>
          </view> -->
        </view>
        <!-- <view class="text" style="-webkit-flex: 1; flex: 1">
          <image src="../../static/images/banner.png" class="picture"></image>
        </view> -->
      </view>
    </view>

    <!-- <view class="menu">
      <view :class="item.class + ' menu-card'" v-for="(item, index) in permissionMenu" :key="index" @click="onClickMenu(item)">
        <view class="menu-card-title">{{ item.title }}</view>
        <image class="menu-card-icon" :src="item.icon"></image>
      </view>
    </view> -->

    <!-- <view>
      <uni-popup ref="popup" type="bottom">
        <button @click="showCreate" class="popup_button">创建上报</button>
        <button @click="showRecord" class="popup_button">上报记录</button>
        <button @click="closePopup" style="margin: 10px 10px">取消</button>
      </uni-popup>
      <uni-popup ref="maintenancePopup" type="bottom">
        <button @click="showMaintenance" class="popup_button">维修申请</button>
        <button @click="showMaintenanceList" class="popup_button">
          维修记录
        </button>
        <button @click="closemaintenancePopup" style="margin: 10px 10px">
          取消
        </button>
      </uni-popup>
    </view> -->
	<view class="goods">
		<view class="goods_title">
			<view class="title">商品信息</view>
			<view class="more" @click="more">更多>></view>
		</view>
	</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      projectId: 0,
      projectName: "",
      menu: [
        {
          title: "人员管理",
          icon: "../../static/home/renyuan.png",
          class: "personal",
          type: "link",
          link: "../../template/personal/personal",
          permission: "PersonManagementModuleShow",
        },
        {
          title: "设施管理",
          icon: "../../static/home/sheshi.png",
          class: "facilitie",
          type: "link",
          link: "../../template/collection/collection-gis/collection-gis",
          permission: "FacilitieModuleShow"
        },
        {
          title: "质量管理",
          icon: "../../static/home/zhiliang.png",
          class: "quanlity",
          type: "event",
          link: "../qualitys/index/index",
          permission: "QuanlityModuleShow"
        },
        {
          title: "车辆管理",
          icon: "../../static/home/cheliang.png",
          class: "vehicle",
          type: "link",
          link: "../../template/vehicle/vehicle",
          permission: "VehicleModuleShow"
        }
      ]
    }
  },
  computed: {
    permissionMenu() {
      console.log(this.menu, "this.menu")
      // return this.menu.filter(item => {
      //   if (this.$com.getPermission(item.permission)) return item
      // })
    }
  },
  onLoad(option) {},
  onShow() {
    // this.projectId = uni.getStorageSync("projectId")
    // // 获取登录态基础信息
    // let login_user = uni.getStorageSync("login_user")
    // if (!login_user) {
      // 没有登录信息，跳转到登录界面
      // uni.redirectTo({
      //   url: "../index/index"
      // })
    // } else {
    //   this.projectId = login_user.project_id || 0
    //   this.projectName = login_user.project_name || ""
    // }
  },
  methods: {
	//更多
	more() {
		console.log("更多")
		uni.navigateTo({
		  url: "../goods/goods_list"
		})
	},
	  
	  
	  
	  
	  
	  
	  
	  
    // 切换项目
    switchProject() {
      uni.navigateTo({
        url: "../project/project?project_id=" + this.projectId
      })
    },
    // 点击菜单
    onClickMenu(item) {
      switch (item.class) {
        case "addoil":
          // 加油管理
          uni.navigateTo({
            url: item.link
          })
          break
        case "repaire":
          // 维修
          this.$refs.maintenancePopup.open("bottom")
          break
        case "quanlity":
          // 质量
          this.$refs.popup.open("bottom")
          break
        case "collection":
          // 收运
          uni.navigateTo({
            url: item.link
          })
          break
        case "vehicle":
          // 车辆
          uni.navigateTo({
            url: item.link
          })
          break
        case "facilitie":
          // 设施
          uni.navigateTo({
            url: item.link
          })
          break

        case "personal":
          // 人员
          uni.navigateTo({
            url: item.link
          })
          break
        default:
          uni.navigateTo({
            url: "#"
          })
      }
    },
    closePopup() {
      this.$refs.popup.close()
    },
    showCreate() {
      console.log("创建上报")
      this.$refs.popup.close()
      uni.navigateTo({
        url: "../qualitys/create-report/create-report"
      })
    },
    showRecord() {
      this.$refs.popup.close()
      uni.navigateTo({
        url: "../qualitys/report-record/report-record"
      })
    },
    // 维修申请
    showMaintenance() {
      uni.navigateTo({
        url: "../maintenance/apply-maintenance"
      })
    },

    // 维修记录
    showMaintenanceList() {
      uni.navigateTo({
        url: "../maintenance/maintenance-record"
      })
    },

    // 取消维修管理
    closemaintenancePopup() {
      this.$refs.maintenancePopup.close()
    }
  }
}
</script>

<style lang="scss">
page {
  background: #ffffff;
  font-size: 28rpx;
}

.login-bg {
  min-height: 452rpx;
  background: #2d89fb;
  padding: 10rpx 0rpx 79rpx 0rpx;
  background: url("https://image.jsyinghuan.com/huanwei/login-bg.png");
  background-size: 100% 100%;
}

.pichead {
  padding-top: 150rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.goods_title {
	padding: 20rpx 30rpx;
	font-size: 30rpx;
	font-weight: bold;
}

.title {
	float: left;
}

.more {
	float: right;
}
</style>
