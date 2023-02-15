<!-- 加油管理 -->
<template>
	<view class="container">
		<view class="main">
			<view class="head">
				<view class="uni-flex uni-row">
					<view class="text" style="-webkit-flex: 1;flex: 1;">
						<uni-card isShadow @click="addOilRecords">
							<view class="menu_card"><image class="icon_menu" src="../../../static/images/oil-record.png"></image></view>
							<view class="menu_txt"><text class="content-box-text">加油记录</text></view>
						</uni-card>
					</view>
					<view class="text" style="-webkit-flex: 1;flex: 1;">
						<uni-card isShadow @click="oilManagement">
							<view class="menu_card"><image class="icon_menu" src="../../../static/images/oil-card.png"></image></view>
							<view class="menu_txt"><text class="content-box-text">油卡管理</text></view>
						</uni-card>
					</view>
				</view>
			</view>

			<view class="content">
				<view class="content_title">
					<view class="content_title_label"></view>
					<text class="content_title_text">选择加油站去加油</text>
				</view>
				<view class="content_search">
					<uni-search-bar radius="5" placeholder="请输入搜索加油站" clearButton="auto" cancelButton="none" @confirm="searchOilStation" @input="inputOilStation" />
				</view>
				<view class="stationList">
					<radio-group class="uni-list" @change="selectOilStation">
						<view v-for="(item, index) in oilstations" :key="index" class="uni-list-item">
							<view class="uni-list-item__container">
								<view class="uni-list-item__content">
									<text class="uni-list-item__content-title">{{ item.petrolStationName }}</text>
								</view>
								<view class="uni-list-item__extra"><radio :value="item.id" /></view>
							</view>
						</view>
					</radio-group>
				</view>
			</view>
		</view>
		<view class="button_next"><button type="primary" @click="next">下一步</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			oilstations: [],
			oilStationName: '',
			oilStationId: ''
		}
	},
	onShow() {
		// 获取加油站列表
		this.getOilStations()
	},
	methods: {
		// 加油记录
		addOilRecords() {
			if (this.$com.getPermission('OilRecords')) {
				uni.navigateTo({
					url: '../addoilrecords/addoilrecords'
				})
			} else {
				uni.showToast({
					title: '暂无权限,请联系管理员',
					icon: 'none',
					duration: 2000
				})
			}
		},
		// 油卡管理
		oilManagement() {
			if (this.$com.getPermission('OilManagement')) {
				uni.navigateTo({
					url: '../card/card'
				})
			} else {
				uni.showToast({
					title: '暂无权限,请联系管理员',
					icon: 'none',
					duration: 2000
				})
			}
		},
		// 搜索加油站
		searchOilStation(e) {
			this.oilStationName = e.value
			this.getOilStations()
		},
		// 输入搜索加油站
		inputOilStation(value) {
			this.oilStationName = value
			this.getOilStations()
		},
		// 选择加油站
		selectOilStation(e) {
			this.oilStationId = e.detail.value || ''
		},
		// 获取加油站
		getOilStations() {
			let data = {
				station: this.oilStationName
			}
			// 获取加油站
			this.$api.getOilStations(data).then(
				res => {
					this.oilstations = res.data
				},
				fail => {
					uni.showToast({
						title: fail || '获取数据错误',
						icon: 'none',
						duration: 2000
					})
				}
			)
		},
		// 下一步
		next() {
			if (this.oilStationId == '') {
				uni.showToast({
					icon: 'none',
					title: '请选择加油站'
				})
				return false
			}
			uni.navigateTo({
				url: '../oilstation/oilstation?oilstationid=' + this.oilStationId
			})
		}
	}
}
</script>

<style>
page {
	background: #ffffff;
	font-size: 28rpx;
}

.container {
	/* background-color: #F5F5F5; */
}

.main {
	/* background-color: #FFFFFF; */
	margin-top: 20rpx;
}

.content {
	padding: 20rpx 30rpx;
}

.content_title_label {
	background-color: #73c41b;
	height: 42rpx;
	width: 15rpx;
	float: left;
	margin-right: 21rpx;
	border-radius: 8rpx;
}

.content_title_text {
	height: 40rpx;
	line-height: 40rpx;
	font-weight: bold;
}

.content_search .uni-searchbar {
	padding-left: 0 !important;
	width: 100%;
}

.head {
	text-align: center;
}

.content-box-text {
	height: 40rpx;
	line-height: 40rpx;
	font-size: 28rpx;
}

.icon_menu {
	width: 96rpx;
	height: 96rpx;
	margin: 8rpx 24rpx;
}

.bg-card {
	background-color: #09bb07;
}

.stationList {
	/* margin-bottom: 90rpx; */
	height: auto;
	max-height: 820rpx;
	overflow: scroll;
}

.uni-list {
	flex: 1;
}

.uni-list-item {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	background-color: #ffffff;
}

.uni-list-item__container {
	padding: 12px 15px;
	width: 100%;
	flex: 1;
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-bottom-color: #e5e5e5;
}

.uni-list-item__content-title {
	font-size: 14px;
}

.button_next {
	position: fixed;
	left: 0;
	bottom: 40rpx;
	right: 0;
	z-index: 99;
	height: 90rpx;
	width: 90%;
	margin: 0 auto;
	color: #fff;
	border-radius: 0;
}

.button_next button {
	font-size: 32rpx;
	border-radius: 20rpx;
	background: linear-gradient(90deg, #7dce20 0%, #58a40b 100%);
}
</style>
