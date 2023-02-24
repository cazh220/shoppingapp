<!-- 首页 -->
<template>
	<view class="container">
		<view class="login-bg">
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
					:interval="interval" :duration="duration">
					<swiper-item v-for="(item ,index) in pics" :key="index">
						<image style=" background-color: #eeeeee; width: 100%;" mode="scaleToFill"
							:src="item.src"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<view class="goods">
			<view class="goods_title">
				<uni-section class="mb-10" title="竖线装饰" sub-title="" type="line">
					<view class="title">商品信息</view>
					<view class="more" @click="more">更多>></view>
				</uni-section>
				
			</view>
			<view class="list">
				<uni-list>
					<uni-list-item v-for="(item, index) in goods" :key="item.id" v-if="index < 5" :title="item.name"
						:note="item.stock" :thumb="item.thumb"
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
				pics: [
					{
						src: '../../static/ad1.jpg',
					},
					{
						src: '../../static/ad2.jpg',
					}
				],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				goods: []

			}
		},
		onShow() {
			let user = uni.getStorageSync('userInfo') || ""
			if (!user) {
				// 没有获取到登录态信息，跳转到登录界面
				uni.redirectTo({
					url: '../index/index'
				})
			}
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
				let data = {
					page: 1,
					name: "",
					state: 1
				}
				this.$api.getGoodsList(data).then(
					res => {
						console.log(res)
						this.goods = res.data.list.map((item, key) => {
							item.key = item.id
							item.stock = "库存：" + item.num
							item.price = "价格：￥" + item.price
							item.thumb = "http://localhost:8080/"+item.pic
							return item
						})
					},
					fail => {

					})
			},

			goodsDetail(id) {
				uni.navigateTo({
					url: "../goods/goods_detail?id=" + id
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
