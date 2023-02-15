<template>
	<view class="container">
		<view class="main">
			<view class="card">
				<uni-card :is-shadow="true" note="true" class="chargeSum">
					<view class="content">
						<view class="title">
							<text class="title-txt">余额（元）</text>
						</view>
						<view class="amount">
							￥{{amount}}
						</view>
					</view>
					<block slot="footer">
						<view class="footer-box">
							<uni-row class="menu">
								<uni-col :span="12">
									<view class="menu-txt">总充值（元）：{{chargeAmount}}</view>
								</uni-col>
								<uni-col :span="12">
									<view class="menu-txt">总支出（元）：{{expensesAmount}}</view>
								</uni-col>
							</uni-row>
						</view>
					</block>
				</uni-card>
			</view>

			<view class="list">
				<uni-list>
					<uni-list-item class="thead">
						<view slot="body" class="slot-box">
							<view class="left-title">
								记账时间
							</view>
							<view class="right-title">
								记账金额（元）
							</view>
							<view class="operate-title">
								记账结余（元）
							</view>
						</view>
					</uni-list-item>

					<uni-list-item v-for="(item, index) in list" :key="index">
						<view slot="body" class="slot-box">
							<view class="left-title">
								{{item.date}}
							</view>
							<view class="right-title">
								<text v-if="item.realPay < 0" class="greentxt">{{item.realPay}}</text>
								<text v-else class="redtxt">{{item.recordedAmount}}</text>
							</view>
							<view class="operate-title">
								{{item.endAccount}}
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				card_id: "",
				amount: 0,
				chargeAmount: 0,
				expensesAmount: 0,
				pageSize: 15,
				pageNum: 1,
				list: [],
				count: 0,
				total: 0,
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		onLoad(option) {
			this.card_id = option.card_id || ""

			this.balanceRecordSummary()
			this.balanceRecordDetail()
		},
		methods: {
			// 交易汇总
			balanceRecordSummary() {
				let data = {
					id: this.card_id
				}
				this.$api.balanceRecord(data).then(res => {
					this.amount = res.data.endAccount || 0
					this.chargeAmount = res.data.sumRecordedAmount || 0
					this.expensesAmount = res.data.sumRealPay || 0
				}, fail => {})
			},
			// 交易明细
			balanceRecordDetail() {
				this.count += this.pageSize;
				let data = {
					id: this.card_id,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				this.$api.balanceRecordDetail(data).then(res => {
					console.log(data)
					// this.list = res.data.data
					this.total = res.data.total
					this.list = this.list.concat(res.data.data);
				}, fail => {})
			},
			// 下拉刷新
			onPullDownRefresh() {
				console.log('refresh');
				let that = this
				setTimeout(function() {
					that.count = 0
					that.pageNum = 1
					that.list = []
					that.loadMoreText = "",
					that.balanceRecordDetail()
					uni.stopPullDownRefresh();
				}, 1000);
			},
			// 上滑
			onReachBottom() {
				console.log("onReachBottom");
				if (this.count > this.total) {
					this.loadMoreText = "没有更多数据了!"
					return;
				}
				this.showLoadMore = true;
				setTimeout(() => {
					this.pageNum++;
					this.balanceRecordDetail();
				}, 300);
			},
		}
	}
</script>

<style>
	page {
		background: #F5F5F5;
	}
	
	.main {
		background: #FFFFFF;
	}
	
	.chargeSum .uni-card {
		background: #77C81F !important;
	}

	.title {
		height: 60rpx;
	}

	.title-txt {
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.amount {
		height: 80rpx;
		font-size: 48rpx;
		color: #FFFFFF;
	}

	.menu-txt {
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.thead {
		font-weight: bold;
	}

	.left-title {
		width: 100%;
		text-align: center;
		font-size: 24rpx;
	}

	.right-title {
		width: 80%;
		text-align: center;
		font-size: 24rpx;
	}

	.operate-title {
		width: 80%;
		text-align: center;
		font-size: 24rpx;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		width: 100%;
	}

	.list {
		padding: 0rpx 30rpx;
		margin-top: 300rpx;
		height: auto;
		overflow: scroll;
	}

	.card {
		position: fixed;
		top: 0;
		white-space: nowrap;
		width: 100%;
		z-index: 999;
		background: #FFFFFF;
	}

	.greentxt {
		color: #23C81C;
	}

	.redtxt {
		color: #F90808;
	}
</style>
