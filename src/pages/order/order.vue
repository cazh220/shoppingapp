<template>
	<view id="ReportRecord">
		<view class="header-flxed">
			<view class="tabs">
				<liuyuno-tabs :config="tabsConfig" :tabData="statusList" :activeIndex="currentTab"
					@tabClick="tabClick" />
			</view>
		</view>
		<view style="margin-top: 60px;">
			<xw-empty :isShow="orderEmptyShow" text="暂无相关数据" textColor="#777777"></xw-empty>

			<list ref="list" class="list" :offset-accuracy="5" :bounce="true" isSwiperList="true">
				<cell v-for="(item, index) in orders" :key="item.id" :ref="'item'+index" @click="onclick">
					<view class="list-item">
						<uni-row class="" :gutter="gutter" :width="nvueWidth">
							<uni-col :span="20">
								<view class="head_title">订单号：{{item.order_no}}</view>
							</uni-col>
							<uni-col :span="4" :offset="0">
								<view class="head_title" v-if="item.state == 1" style="color: #77C81F;">
									{{item.state_txt}}</view>
								<view class="head_title" v-else-if="item.state == 0" style="color: red;">
									{{item.state_txt}}</view>
								<view class="head_title" v-else>{{item.state_txt}}</view>
							</uni-col>
						</uni-row>
						<view class="details" v-for="(items, indexs) in item.goods" :key="items.id">
							<uni-row class="" :gutter="gutter" :width="nvueWidth">
								<uni-col :span="3" :offset="0">
									<view class="">
										<image style="width: 40px; height: 40px; background-color: #eeeeee;"
											mode="scaleToFill" :src="src" @error="imageError"></image>
									</view>
								</uni-col>
								<uni-col :span="8" :offset="5">
									<view class="subdesc">{{items.goods_name}} ￥{{items.price}}</view>
									<view class="subdesc">x {{items.num}}</view>
								</uni-col>
							</uni-row>
						</view>
						<view class="divider">
						</view>
						<view class="action">
							<uni-row class="" :gutter="gutter" :width="nvueWidth">
								<uni-col :span="18">
									<view class="card_title">订单金额：￥{{item.amount}}</view>
								</uni-col>
								<uni-col :span="6" :offset="0">
									<view class="button" v-if="item.state == 0">
										<button class="mini-btn" type="default" style="border-radius: 10rpx;"
											size="mini" @click="cancleOrder(item.id)">取消</button>
									</view>
								</uni-col>
							</uni-row>
						</view>

					</view>
				</cell>
				<cell class="loading"></cell>
			</list>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ReportRecord",
		data() {
			return {
				// Handle:"",
				tabsConfig: {
					activeColor: "#77C81F"
				},
				scrollable: true,
				orders: [],
				src: "https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg",
				currentTab: 0, //预设当前项的值
				statusList: ["全部", "待发货", "已发货", "已取消"],
				page: 1,
				last_page: 1,
				list: [],
				user_id: "",
				state: -2
			}
		},
		onLoad(option) {
			if (option.currentTab) {
				this.currentTab = +option.currentTab
				if (this.currentTab == 0) {
					this.state = -2
				} else if (this.currentTab == 1) {
					this.state = 0
				} else if (this.currentTab == 2) {
					this.state = 1
				} else {
					this.state = -1
				}
			}
			let user = uni.getStorageSync('userInfo') || ""
			this.user_id = user.id || ""
			this.orderList()
			
		},
		onPullDownRefresh() {
			this.list = []
			this.page = 1
			this.orderList()
		},
		onReachBottom: function() {
			if (this.page < this.last_page) {
				this.page++
				this.orderList()
			} else {
				uni.showToast({
					icon: "none",
					title: "已经到底了"
				})
			}
		},
		methods: {
			// 选择标签
			tabClick(e) {
				this.currentTab = e
				// console.log("e:", e)
				if (this.currentTab == 0) {
					this.state = -2
				} else if (this.currentTab == 1) {
					this.state = 0
				} else if (this.currentTab == 2) {
					this.state = 1
				} else {
					this.state = -1
				}
				this.orders = []
				this.page = 1
				this.orderList()
			},
			imageError: function(e) {
				console.error('image发生error事件，携带值为' + e.detail.errMsg)
			},
			// 我的订单
			orderList() {
				let that = this
				this.$api.listOrder({
					page: this.page,
					order_no: "",
					user_id: this.user_id,
					state: this.state
				}).then(
					res => {
						this.last_page = res.data.pages
						console.log(res)
						let orders = res.data.list.map(item => {
							item.key = item.id
							if (item.state == 1) {
								item.state_txt = "已发货"
							} else if (item.state == -1) {
								item.state_txt = "已取消"
							} else {
								item.state_txt = "待发货"
							}
							return item
						})
						
						that.orders.push(...orders)
					},
					fail => {}
				)
			},
			// 取消订单
			cancleOrder(id) {
				console.log(id)
				this.$api.stateOrder({id: id, state: -1}).then(
				res => {
					uni.showToast({
						icon: "none",
						title: "取消成功"
					})
					this.page = 1
					this.orders = []
					this.orderList()
				},
				fail => {
					uni.showToast({
						icon: "none",
						title: "取消失败"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	#ReportRecord {
		.top {
			// margin: 10px 10px 0 10px;
			display: flex;
			flex-flow: row;
			line-height: 40px;
			width: 100%;
		}

		.tabs {
			background-color: #fff;
			// margin-top: 50px;
		}

		.list {
			flex: 1;
			background-color: #ebebeb;
		}
		
		.head_title {
			font-size: 28rpx;
		}
		
		.list-item {
			margin-left: 12px;
			margin-right: 12px;
			margin-top: 12px;
			padding: 20px;
			background-color: #fff;
			border-radius: 5px;
		}
		
		.loading {
			height: 20px;
		}
		
		.details {
			height: 100rpx;
			padding-top: 20rpx;
			/* padding-bottom: 20rpx; */
			/* background-color: aquamarine; */
		}
		
		.subdesc {
			color: #888;
			font-size: 28rpx;
		}
		
		.divider {
			height: 20rpx;
			border-bottom: dashed 1px #aaa;
		}
		
		.action {
			height: 80rpx;
			line-height: 80rpx;
			padding-top: 20rpx;
			/* background-color: aquamarine; */
		}
		
		.card_title {
			font-size: 28rpx;
		}
		
		.mini-btn {
			width: 150rpx;
			height: 50rpx;
			line-height: 50rpx;
			margin-top: 15rpx;
		}
	}
</style>
