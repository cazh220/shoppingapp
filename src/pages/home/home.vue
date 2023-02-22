<!-- 首页 -->
<template>
  <view class="container">
    <view class="login-bg">
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item>
					<image style=" background-color: #eeeeee;"
						mode="scaleToFill" src="https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg" ></image>
				</swiper-item>
			</swiper>
		</view>
      <!-- <view class="exchangePrj" @click="switchProject">
        <text class="exchange">&#xe601;</text>
        <text class="prjname">{{ projectName }}</text>
      </view> -->
      <!-- <view class="pichead uni-flex uni-row">
        <view class="text" style="-webkit-flex: 1; flex: 1">
        </view>
      </view> -->
    </view>

	<view class="goods">
		<view class="goods_title">
			<view class="title">商品信息</view>
			<view class="more" @click="more">更多>></view>
		</view>
		<view class="list">
			 <uni-list>
			 	<uni-list-item v-for="(item, index) in goods" :key="item.id" v-if="index < 5" :title="item.name" :note="item.stock" thumb="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
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
		background: ['color1', 'color2', 'color3'],
		indicatorDots: true,
		autoplay: true,
		interval: 2000,
		duration: 500,
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
			this.goods = res.data.list.map((item, key) => {
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

.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
	}

	.swiper {
		height: 400rpx;
	}

	.swiper-item {
		display: block;
		height: 400rpx;
		line-height: 400rpx;
		text-align: center;
	}

	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}
// .login-bg {
//   min-height: 250rpx;
//   background: #2d89fb;
//   padding: 10rpx 0rpx 79rpx 0rpx;
//   background: url("https://image.jsyinghuan.com/huanwei/login-bg.png");
//   background-size: 100% 100%;
// }

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
