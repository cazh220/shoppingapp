<!-- 加油记录详情 -->
<template>
	<view class="container">
		<view class="main">
			<view class="head">
				<view class="row serialno">
					<text class="label">编号：</text>{{form.refuelingNumber}}
				</view>
				<view class="row">
					<text class="label">提交时间：</text>{{form.refuelingTime}}
				</view>
			</view>
			
			<view class="content">
				<view class="title">
					<text>车辆信息</text>
				</view>
				<view class="body">
					<view class="row">
						<text class="label">车牌号：</text><text class="right-text">{{form.vehicleNumber}}</text>
					</view>
					<view class="row">
						<text class="label">车辆类型：</text><text class="right-text">{{form.vehicleType}}</text>
					</view>
					<view class="row">
						<text class="label">里程数：</text><text class="right-text">{{form.totalKm}}</text>
					</view>
					<view class="row">
						<text class="label">当前油量：</text><text class="right-text">{{form.beginOil}}</text>
					</view>
					<view class="row">
						<text class="label">司机：</text><text class="right-text">{{form.driverName}}</text>
					</view>
				</view>
				<view class="title">
					<text>加油信息</text>
				</view>
				<view class="body">
					<view class="row">
						<text class="label">油型：</text><text class="right-text">{{form.oilNumber}}</text>
					</view>
					<view class="row">
						<text class="label">单价：</text><text class="right-text">{{form.oilPrice}}</text>
					</view>
					<view class="row">
						<text class="label">加油量：</text><text class="right-text">{{form.refuelingVolume}}</text>
					</view>
					<view class="row">
						<text class="label">结算方式：</text><text class="right-text">{{form.payType}}</text>
					</view>
					<view class="row">
						<text class="label">加油卡号：</text><text class="right-text">{{form.refuelingCard}}</text>
					</view>
					<view class="row">
						<text class="label">总金额：</text><text class="right-text">{{form.shouldPay}}</text>
					</view>
					<view class="row">
						<text class="label">实付金额：</text><text class="right-text">{{form.realPay}}</text>
					</view>
					<view class="row">
						<text class="label">备注：</text><text class="right-text">{{form.remark}}</text>
					</view>
				</view>
				<view class="title">
					<text>图片信息</text>
				</view>
				<view class="body">
					<view class="image-list">
						<image class="image" :data-src="item" mode="scaleToFill" :src="item" @tap="previewImage" v-for="(item,index) in form.refuelingEvidenceUrlArr" :key="index" />
					</view>
				</view>
				<view class="title">
					<text>司机确认信息</text>
				</view>
				<view class="body">
					<view class="image-list">
						<image :data-src="form.driverSignUrl" class="image" mode="scaleToFill" :src="form.driverSignUrl" @tap="previewImage" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				form: {
					refuelingNumber: "",
					refuelingTime: "",
					vehicleNumber: "",
					vehicleType: "",
					totalKm: "",
					beginOil: "",
					driverName: "",
					oilNumber: "",
					oilPrice: "",
					refuelingVolume: "",
					payType: "",
					refuelingCard: "",
					shouldPay: "",
					realPay: "",
					remark: "-",
					refuelingEvidenceUrlArr:[],
					driverSignUrl: ""
				}
			}
		},
		onLoad(option) {
			this.id = option.id || 0
			this.oilRecordDetail()
		},
		methods: {
			// 获取详情
			oilRecordDetail() {
				let data = {
					id: this.id
				}
				this.$api.getRefuelingRecordDetail(data).then(res => {
					this.form = res.data[0]
					this.form.refuelingEvidenceUrlArr = res.data[0].refuelingEvidenceUrlArr.map(item => {
						return this.$api.getUrl(item)
					})
					this.form.driverSignUrl = this.$api.getUrl(res.data[0].driverSignUrl)
				}, fail => {})
			},
			//预览图片
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [current]
				})
			},
		}
	}
</script>

<style>
.container {
	font-size: 28rpx;
}
.main {
	margin-top: 20rpx;
}

.head {
	background-color: #FFFFFF;
	padding: 20rpx 30rpx;
}

.row {
	height: 60rpx;
	line-height: 60rpx;
}

.serialno {
	font-weight: bold;
/* 	height: 80rpx;
	line-height: 80rpx; */
}

.content {
	margin-top: 20rpx;
	background-color: #FFFFFF;
	padding: 0rpx 30rpx;
}

.title {
	color: #7BC819;
	font-weight: bold;
	border-bottom: solid 1rpx #E6E6E6;
	height: 80rpx;
	line-height: 80rpx;
}

.right-text {
	float: right;
}

.image {
	width: 120rpx;
	height: 120rpx;
	padding: 20rpx 40rpx;
}

.image-list {
	height: 150rpx;
}
</style>
