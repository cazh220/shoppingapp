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

	<view class="goods">
		<view class="goods_title">
			<view class="title">商品信息</view>
			<view class="more" @click="more">更多>></view>
		</view>
		<view class="list">
			 <uni-list>
			 	<uni-list-item v-for="item in goods" :key="item.id" :title="item.name" :note="item.stock" thumb="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
			 	 thumb-size="lg" :rightText="item.price" clickable @click="goodsDetail(item.id)"></uni-list-item>
			</uni-list>

		</view>
	</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      goods: []

    }
  },
  onShow() {
	this.getGoods()
  },
  methods: {
	//更多
	more() {
		uni.navigateTo({
		  url: "../goods/goods_list"
		})
	},
	getGoods() {
		let data = {page:1, name: ""}
		this.$api.getGoodsList(data).then(
		res => {
			console.log(res)
			this.goods = res.data.list.map(item => {
				item.key = item.id
				item.stock = "库存："+item.num
				item.price = "价格：￥"+ item.price
				return item
			})
		},
		fail => {
			
		})
	},
	
	goodsDetail(id) {
		uni.navigateTo({
			url: "../goods/goods_detail?id="+id
		})
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

.list {
	margin-top: 40rpx;
}
</style>
