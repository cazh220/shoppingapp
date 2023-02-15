<!-- 电子签名 -->
<template>
	<view class="container">
		<view class="main">
			<view class="title">
				<text class="point">*</text>
				电子签名：
			</view>
			<view class="signature">
				<canvas
					class="handWriting"
					disable-scroll="true"
					@touchstart="uploadScaleStart"
					@touchmove="uploadScaleMove"
					@touchend="uploadScaleEnd"
					@tap="mouseDown"
					canvas-id="handWriting"
				></canvas>
			</view>
		</view>
		<view class="button_next"><button type="primary" @click="submit">提交</button></view>
	</view>
</template>

<script>
import utils from '@/utils/utils'
import Handwriting from '../../../static/js/signature.js'
export default {
	data() {
		return {
			formData: []
		}
	},
	onLoad(option) {
		this.formData = JSON.parse(decodeURIComponent(option.data))
		this.handwriting = new Handwriting({
			lineColor: 'blue',
			slideValue: 50,
			canvasName: 'handWriting'
		})
	},
	methods: {
		uploadScaleStart(event) {
			this.handwriting.uploadScaleStart(event)
		},
		uploadScaleMove(event) {
			this.handwriting.uploadScaleMove(event)
		},
		uploadScaleEnd(event) {
			this.handwriting.uploadScaleEnd(event)
		},
		// 提交签名
		submit: utils.throttle(function() {
			uni.showLoading({
				title: '正在提交中',
				mask: true
			})
			this.handwriting
				.saveCanvas()
				.then(res => {
					// this.showimg = res;
					uni.uploadFile({
						url: this.$api.uploadFile(),
						filePath: res,
						name: 'pic',
						header: {
							'content-type': 'multipart/form-data',
							token: uni.getStorageSync('token')
						},
						timeout: 10000,
						success: uploadFileRes => {
							this.formData.driverSignUrl = JSON.parse(uploadFileRes.data).data.pic_url
							this.formData.refuelingEvidenceUrlArr = this.formData.picList
							delete this.formData.picList

							console.log('提交数据', this.formData)
							this.$api.refueling(this.formData).then(
								res => {
									uni.hideLoading()
									uni.showToast({
										icon: 'none',
										title: '提交成功'
									})

									setTimeout(function() {
										uni.reLaunch({
											url: '../../../pages/success/success?message=加油录入成功'
										})
									}, 1000)
								},
								fail => {
									uni.hideLoading()
									uni.showToast({
										icon: 'none',
										title: fail
									})
								}
							)
						},
						fail: res => {
							uni.showToast({
								icon: 'none',
								title: '签名错误'
							})
						}
					})
				})
				.catch(err => {
					console.log(err)
				})
		})
	}
}
</script>

<style>
.main {
	margin-top: 20rpx;
	background-color: #ffffff;
	padding: 24rpx 30rpx;
}

.title {
	margin-top: 30rpx;
}

.point {
	color: #9adb58;
	margin: 0 5rpx;
}

.signature {
	margin-top: 20rpx;
	box-shadow: 0 0 16rpx 6rpx #eaeaea;
}

.handWriting {
	background: #fff;
	width: 100%;
	height: 350upx;
}

.button_next {
	position: fixed;
	left: 0;
	bottom: 40rpx;
	right: 0;
	z-index: 10;
	height: 90rpx;
	width: 90%;
	margin: 0 auto;
	font-size: 36rpx;
	border-radius: 40rpx;
	color: #fff;
	/* background: #7DCE20; */
	border-radius: 0;
	/* border-top: 1rpx solid #7DCE20; */
}

.button_next button {
	border-radius: 20rpx;
	background-color: #7dce20;
}
</style>
