<!-- 加油记录 -->
<template>
	<view class="container">
		<view class="main">
			<view class="head">
				<uni-list>
					<uni-list-item :border="false">
						<view slot="body" class="slot-box">
							<uni-calendar ref="calendar" :date="searchDate" :insert="false" @confirm="confirmDate" />
							<view class="selected-date" @click="openCalendar">
								</image><text class="date">{{selectedDate}}</text>
								<uni-icons type="arrowdown" size="20" />
							</view>

						</view>
					</uni-list-item>
				</uni-list>
			</view>
			<view class="list" v-if="records.length > 0">
				<uni-card :is-shadow="true" note="true" @click="detailCard(item.id)" v-for="(item, index) in records"
					:key="index">
					<uni-list :border="false">
						<uni-list-item :border="false">
							<view slot="body" class="slot-box">
								<view class="title">编号：</view>
								<view class="content">{{item.refuelingNumber}}</view>
							</view>
						</uni-list-item>
						<uni-list-item :border="false">
							<view slot="body" class="slot-box">
								<view class="title">加油站：</view>
								<view class="content">{{item.oilStation}}</view>
							</view>
						</uni-list-item>
						<uni-list-item :border="false">
							<view slot="body" class="slot-box">
								<view class="title">车牌号：</view>
								<view class="content">{{item.vehicleNumber}}</view>
							</view>
						</uni-list-item>
						<uni-list-item :border="false">
							<view slot="body" class="slot-box">
								<view class="title">司机：</view>
								<view class="content">{{item.driverName}}</view>
							</view>
						</uni-list-item>
						<uni-list-item :border="false">
							<view slot="body" class="slot-box">
								<view class="title">加油量：</view>
								<view class="content">{{item.refuelingVolume}}</view>
							</view>
						</uni-list-item>
						<uni-list-item :border="false">
							<view slot="body" class="slot-box">
								<view class="title">油型：</view>
								<view class="content">{{item.oilNumber}}</view>
							</view>
						</uni-list-item>
					</uni-list>
					<block slot="footer">
						<view class="footer-box">
							<view class=""><text class="footer-box__item payType">{{item.payType}}</text></view>
							<view class=""><text class="footer-box__item">总金额：<text
										class="shouldPay">{{item.shouldPay}}</text></text></view>
							<view class=""><text class="footer-box__item">实付金额：<text
										class="realPay">{{item.realPay}}</text></text></view>
						</view>
					</block>
				</uni-card>
			</view>
			<view class="list" v-else>
				<xw-empty :isShow="isShowEmpty" text="暂无相关数据" textColor="#777777"></xw-empty>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				records: [],
				selectedDate: "",
				searchDate: "",
				isShowEmpty: false
			}
		},
		onLoad() {
			// 默认当天日期
			this.currentDate()
		},
		methods: {
			// 加油记录
			addOilRecords() {
				let data = {
					time: this.searchDate
				}
				this.$api.getRefuelingRecord(data).then(res => {
					this.records = res.data
					this.isShowEmpty = true
				}, fail => {})
			},
			// 打开日历
			openCalendar() {
				this.$refs.calendar.open()
			},
			// 选择确认
			confirmDate(e) {
				let date = e.fulldate.substr(0, 4) + "年" + e.fulldate.substr(5, 2) + "月" + e.fulldate
					.substr(8, 2) + "日"
				this.selectedDate = date
				this.searchDate = e.fulldate.substr(0, 4) + "-" + e.fulldate.substr(5, 2) + "-" + e.fulldate.substr(8, 2)
				this.addOilRecords()
			},
			// 当前日期
			currentDate() {
				var date = new Date();
				this.selectedDate = date.getFullYear() + "年" + this.getFormatDate(date.getMonth() + 1) + "月" + this.getFormatDate(date.getDate()) + "日"
				this.searchDate = date.getFullYear() + "-" + this.getFormatDate(date.getMonth() + 1) + "-" + this.getFormatDate(date.getDate())
				this.addOilRecords()
			},
			// 格式化日期补0
			getFormatDate(date) {
				if (date < 10) {
					return "0"+date
				} else {
					return date
				}
			},
			// 查看详情
			detailCard(id) {
				uni.navigateTo({
					url: "./addoildetail?id="+id
				})
			}
		}
	}
</script>

<style>	
	.uni-card.data-v-19622063 {
		margin: 12px 0 !important;
	}

	.footer-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
		flex-direction: row;
	}

	.footer-box__item {
		align-items: center;
		padding: 2px 0;
		font-size: 12px;
		color: #666;
	}

	.uni-list:after,
	.uni-list:before,
	.uni-list--border-bottom,
	.uni-list--border-top {
		height: 0 !important;
	}

	.uni-list-item__container {
		padding: 12rpx 20rpx !important;
	}

	.title {
		float: left;
		color: #666666;
		font-size: 28rpx;
	}

	.content {
		float: right;
		font-size: 28rpx;
	}

	.slot-box {
		width: 100%
	}

	.footer-box__item {
		font-size: 28rpx;
	}

	.shouldPay {
		color: #77C81F;
	}

	.realPay {
		color: #FE625C;
	}

	.uni-date-editor--logo {
		color: #77C81F !important;
	}

	.date {
		height: 48rpx;
		line-height: 48rpx;
		margin-right: 5rpx;
	}

	.selected-date {
		padding-left: 24rpx;
		font-size: 28rpx;
	}

	.list {
		margin-top: 70rpx;
		height: auto;
		/* max-height: 1350rpx; */
		overflow: scroll;
	}

	.head {
		position: fixed;
		top: 0;
		display: flex;
		white-space: nowrap;
		background-color: white;
		width: 100%;
		z-index: 999;
	}
	
	.payType {
		font-weight: bold;
	}
</style>
