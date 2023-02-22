<template>
	<view class="detail">
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item>
					<view class="swiper-item uni-bg-red">A</view>
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
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>


		<!-- <uni-popup ref="popup" type="bottom" background-color="#fff">底部弹出 Popup</uni-popup> -->
		<uni-popup ref="popup" type="share" safeArea backgroundColor="#fff">
			<view class="confirm">
				<view class="buy_num">
					<uni-row class="demo-uni-row" :width="nvueWidth">
						<uni-col :span="9">
							<view class="demo-uni-col dark">选择购买数量：</view>
						</uni-col>
						<uni-col :span="15">
							<view class="demo-uni-col light">
								<uni-number-box v-model="buy_num" @change="changeNum" />
							</view>
						</uni-col>
					</uni-row>
					<view class="confirm_order">
						<button type="primary" style="background-color: #ffa200; border-radius: 10rpx;" @click="confirmOrder">确定</button>
					</view>
				</view>
			</view>
		</uni-popup>
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
					info: 2
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				],
				goods: null,
				buy_num: 1
			}
		},
		onLoad(option) {
			console.log('option', option)
			this.goodsDetail(option)
		},
		methods: {
			onClick(e) {
				console.log("onClick", e)
				uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				})
			},
			buttonClick(e) {
				console.log("buttonClick", e)
				this.options[0].info++

				this.$refs.popup.open('bottom')
			},
			goodsDetail(data) {
				this.$api.getGoodsDetail(data).then(
					res => {
						console.log("res", res)
						this.goods = res.data
					},
					fail => {}
				)
			},
			changeNum(e) {
				this.buy_num = e
				console.log(e)
			},
			confirmOrder(e) {
				let that = this
				console.log(this.goods, this.buy_num)
				let userInfo = uni.getStorageSync("userInfo")
				let goods = []
				goods.push({goods_id: this.goods.id, num: this.buy_num})
				let data = {
					goods: goods,
					user_id: userInfo.id
				}
				this.$api.createOrder(data).then(
					res => {
						uni.showToast({
							title: `下单成功`,
							// icon: 'none'
						})
						that.$refs.popup.close()
					},
					fail => {
						uni.showToast({
							title: `下单失败`,
							icon: 'none'
						})
					}
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
		line-height: 46rpx;
	}

	.subtitle {
		font-size: 30rpx;
		color: #aaa;
		line-height: 40rpx;
	}

	.price {
		color: red;
	}

	.content {
		padding: 20rpx 40rpx;
	}

	.confirm {
		height: 100px;
		padding: 40rpx;
	}
	
	.buy_num {
		height: 60rpx;
		line-height: 60rpx;
	}
	
	.confirm_order {
		margin-top: 30rpx;
	}
</style>
