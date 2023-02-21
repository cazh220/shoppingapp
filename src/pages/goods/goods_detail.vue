<template>
	<view class="detail">
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item>
					<view class="swiper-item uni-bg-red">A</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-green">B</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-blue">C</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="main">
			<view class="title">{{goods.name}}</view>
			<view class="subtitle price">￥{{goods.price}}</view>
			<view class="subtitle">还剩余：{{goods.num}}</view>
		</view>
		<view class="content">
			xxcxcxcxcxcxcxdsdssdsddsdsdssdsddsdssd
		</view>
		
		<view class="goods-carts">
			<uni-goods-nav :options="options" :fill="true" @click="onClick" />
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
				options: [{
					icon: 'cart',
					text: '购物车',
				}],
				goods:null
			}
		},
		onLoad(option) {
			console.log('option',option)
			this.goodsDetail(option)
		},
		methods: {
			onClick(e) {
				uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				})
			},
			buttonClick(e) {
				console.log(e)
				this.options[2].info++
			},
			goodsDetail(data) {
				this.$api.getGoodsDetail(data).then(
					res => {
						console.log("res", res)
						this.goods = res.data
					},
					fail => {}
				)
			}
		}
	}
</script>

<style lang="scss">
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

	.example-body {
		padding: 0;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}
	
	.main {
		padding: 20rpx 40rpx;
	}
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
	}
	
	.subtitle {
		font-size: 30rpx;
		color: #aaa
	}
	
	.price {
		color: red;
	}
	
	.content {
		padding: 20rpx 40rpx;
	}
</style>
