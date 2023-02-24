<template>
	<view class="detail">
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item v-for="(item ,index) in pics" :key="index">
					<view class="image-content">
						<image style="background-color: #eeeeee; width: 100%;" mode="scaleToFill"
							:src="item.src"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="main">
			<view class="title">{{goods.name}}</view>
			<view class="subtitle price">￥{{goods.price}}</view>
			<view class="subtitle">还剩余库存：{{goods.num}}</view>
		</view>
		<view class="" style="height: 20rpx;border-bottom: dashed 1px #aaa;">
			
		</view>
		<view class="content">
			{{goods.desc}}
		</view>



		<view class="goods-carts">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>


		<uni-popup ref="popup" type="bottom" safeArea backgroundColor="#fff">
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
						<button type="primary"
							style="background-color: #ffa200; border-radius: 10rpx; font-size: 28rpx; height: 80rpx;"
							@click="confirmOrder">确定</button>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="cart" type="bottom" safeArea backgroundColor="#fff">
			<view class="confirm">
				<view class="buy_num">
					<uni-section class="mb-10" title="购物车商品" titleColor="red" sub-title="" type="line">购物车商品
					</uni-section>

					<uni-row class="" :width="nvueWidth" v-for="item in carts">
						<uni-col :span="10">
							<view class="goods_list">{{item.goods_name}}</view>
						</uni-col>
						<uni-col :span="14">
							<view class="goods_list">
								<view class="" style="float: left;">
									数量：
								</view>
								<view class="">
									<uni-number-box v-model="item.num" @change="changeNum" />
								</view>

							</view>
						</uni-col>
					</uni-row>
					<view class="confirm_order">
						<uni-row class="demo-uni-row" :width="nvueWidth">
							<uni-col :span="12">
								<button type="primary"
									style="background-color: #ffa200; border-radius: 10rpx; height: 80rpx; font-size: 28rpx; margin-bottom: 20rpx;"
									@click="clear">清空</button>
							</uni-col>
							<uni-col :span="12">
								<button type="primary"
									style="background-color: #ffa200; border-radius: 10rpx; height: 80rpx; font-size: 28rpx; margin-bottom: 20rpx;"
									@click="cartOrder">下单</button>
							</uni-col>
						</uni-row>


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
				pics: [
					{
						src: 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
					},
					{
						src: 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
					}
				],
				// background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				options: [{
					icon: 'cart',
					text: '购物车',
					info: 0
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
				buy_num: 1,
				carts: [
				],
				user_id: 0
			}
		},
		onLoad(option) {
			console.log('option', option)
			let userInfo = uni.getStorageSync("userInfo")
			this.user_id = userInfo.id || 0
			this.goodsDetail(option)
			this.cartsInfo()
		},
		methods: {
			// 获取购物车信息
			cartsInfo() {
				// let userInfo = uni.getStorageSync("userInfo")
				this.$api.getCart({user_id: this.user_id}).then(
				res => {
					console.log(res)
					res.data.list.map(item => {
						this.carts.push({
							goods_id: item.goods_id,
							goods_name: item.goods_name,
							num: item.num,
						})
					})
					this.options[0].info = this.carts.length
				},
				fail => {
					
				})
			},
			onClick(e) {
				console.log("onClick", e)
				
				// let userInfo = uni.getStorageSync("userInfo")
				this.$api.getCart({user_id: this.user_id}).then(
				res => {
					this.carts = []
					res.data.list.map(item => {
						this.carts.push({
							goods_id: item.goods_id,
							goods_name: item.goods_name,
							num: item.num,
						})
					})
					this.$refs.cart.open('bottom')
					this.options[0].info = this.carts.length
				},
				fail => {
					
				})
				// uni.showToast({
				// 	title: `点击${e.content.text}`,
				// 	icon: 'none'
				// })
			},
			// 加入购物车或立即购买
			buttonClick(e) {
				console.log("buttonClick", e)

				if (e.content.text == '立即购买') {
					this.$refs.popup.open('bottom')
				} else {
					// 判断购物车中是否存在此商品
					// 如存在,则不增加
					
					
					let ids = []
					this.carts.map(item => {
						ids.push(item.goods_id)
					})

					if (ids.indexOf(this.goods.id) != -1) {
						uni.showToast({
							title: `购物车中已存在`,
							icon: 'none'
						})
					} else {
						// 插入购物车
						this.carts.push({
							goods_id: this.goods.id,
							goods_name: "",
							num: 1
						})
						// let userInfo = uni.getStorageSync("userInfo")
						console.log("this.goods", this.goods)
						let data = {
							user_id: this.user_id,
							goods_id: this.goods.id,
							goods_name: this.goods.name,
							num: 1
						}
						this.$api.addCart(data).then(
						res => {
							uni.showToast({
								title: `已加入购物车`,
								icon: 'none'
							})
							this.options[0].info++
						},
						fail => {
							
						})						
					}


				}

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
			// 更改数量
			changeNum(e) {
				this.buy_num = e
				console.log(e)
			},
			// 立即购买
			confirmOrder(e) {
				let that = this
				console.log(this.goods, this.buy_num)
				// let userInfo = uni.getStorageSync("userInfo")
				let goods = []
				goods.push({
					goods_id: this.goods.id,
					num: this.buy_num
				})
				let data = {
					goods: goods,
					user_id: this.user_id
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


			},
			clear(mess) {
				//
				this.$api.clearCart({user_id: this.user_id}).then(res => {
					if (mess != 1) {
						uni.showToast({
							title: `清空购物车成功`,
							icon: 'none'
						})
					}
					
				}, fail=>{})
				this.carts = []
				this.options[0].info = 0
			},
			cartOrder() {
				let goods = []
				this.carts.map(item => {
					goods.push({
						goods_id: item.goods_id,
						num: item.num
					})
				})
				
				let data = {
					user_id: this.user_id,
					goods: goods	
				}
				
				this.$api.createOrder(data).then(res =>{
					uni.showToast({
						title: `下单成功`,
						// icon: 'none'
					})
					this.clear(1)
					this.$refs.cart.close()
				},
				fail => {
					uni.showToast({
						title: `下单失败`,
						icon: 'none'
					})
				})
				console.log(this.carts)
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

	.goods_list {
		font-size: 28rpx;
		padding: 10rpx auto;
	}
</style>
