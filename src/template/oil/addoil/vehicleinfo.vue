<!-- 车辆加油 -->
<template>
	<view class="container">
		<view class="main">
			<view class="basic">
				<uni-list>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>车牌号：
						</view>
						<view slot="body">
							<input class='price flex-long' name="license_number" focus v-model="formData.license_number"
								placeholder="请输入车牌号" style="margin-top: 7rpx; margin-right: 100rpx" />
						</view>
						<template slot="footer">
							<uni-icons :type="photoSrc" size="24" color="#9ADB58" @tap="chooseImage" />
						</template>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>车辆类型：<text class="diabledText">{{vehicleTypeName}}</text>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>里程数：
						</view>
						<view slot="body">
							<input class='price flex-long' name="miles" type="digit" focus v-model="formData.miles" placeholder="请输入里程数" />
						</view>
						<template slot="footer">
							<text class="unit">KM</text>
						</template>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>当前油量：
						</view>
						<view slot="body">
							<input class='price flex-long' name="oil_quantity" type="digit" focus v-model="formData.oil_quantity" placeholder="请输入当前油量" />
						</view>
						<template slot="footer">
							<text class="unit">L</text>
						</template>
					</uni-list-item>
					<uni-list-item link @click="selectDriver">
						<view slot="header" class="slot-box">
							<text class="point">*</text>司机：<text class="diabledText">{{driverName}}</text>
							<lb-picker ref="picker" :list="drivers" v-model="driverName" @confirm="confirmDriver"
								@cancel="cancelDriverShow"></lb-picker>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
		<view class="button_next">
			<button type="primary" @click="next">下一步</button>
		</view>
	</view>
</template>

<script>
	// var sourceType = [
	// 	['camera'],
	// 	['album'],
	// 	['camera', 'album']
	// ]
	// var sizeType = [
	// 	['compressed'],
	// 	['original'],
	// 	['compressed', 'original']
	// ]
	export default {
		data() {
			return {
				license_number: "",
				photoSrc: "camera-filled",
				sourceTypeIndex: 2,
				sourceType: [
					['camera'],
					['album'],
					['camera', 'album']
				],
				// sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: [
					['compressed'],
					['original'],
					['compressed', 'original']
				],
				// sizeType: ['压缩', '原图', '压缩或原图'],
				vehicleTypeName: "根据车牌号自动获取",
				vehicleId: "",
				drivers: [],
				driverName: "根据车牌号自动获取",
				driver_id: "",
				miles: "",
				oil_quantity: "",
				oiltype: "",
				oiltype_id: "",
				price: "",
				station_id: "",
				formData: {
					license_number: "",
					vehicleId: "",
					miles: "",
					oil_quantity: "",
					driver_id: "",
					oiltype: "",
					oiltype_id: "",
					price: "",
					station_id: ""
				}
			}
		},
		watch: {
			"formData.license_number": {
				handler(val) {
					//获取车辆信息
					console.log("val", val, val.length)
					if (val.length >= 7)
					{
						this.getVehicleInfo()
					}
				}
			}
		},
		onLoad(option) {
			this.formData.station_id = option.station_id || ""
		},
		methods: {
			// 监听里程输入
			// onInputMiles(e) {
			// 	this.miles = e.detail.value
			// },
			// 监听油量输入
			// onInputOilQuantity(e) {
			// 	this.oil_quantity = e.detail.value
			// },
			// 根据车牌号获取车辆信息
			getVehicleInfo() {
				let data = {
					carNum: this.formData.license_number
				}
				// console.log("车牌",data)
				this.$api.getCarDataByCarNum(data).then(res => {
					this.formData.vehicleId = res.data.vehicleId
					this.formData.oiltype = res.data.oilType || ""
					this.formData.oiltype_id = res.data.oilTypeId || ""
					this.formData.price = res.data.price || ""
					this.vehicleTypeName = res.data.vehicleName
					this.driverName = ""
					res.data.driver.map(item => {
						this.drivers.push({
							label: item.driverName,
							value: item.driverId
						})
					})
				}, fail => {
					uni.showToast({
						icon: "none",
						title: fail
					})
				})
			},
			// 选择司机
			selectDriver() {
				this.$refs.picker.show()
			},
			// 确定选择
			confirmDriver(e) {
				this.driverName = e.item.label
				this.formData.driver_id = e.value
			},
			// 取消司机选择
			cancelDriverShow() {
				this.$refs.picker.hide()
			},
			// 下一步
			next() {
				// 判断数据是否填写完整
				if (this.formData.license_number == "") {
					uni.showToast({
						icon: "none",
						title: "请填写车牌号"
					})
					return false
				}

				if (this.formData.vehicleId == "") {
					uni.showToast({
						icon: "none",
						title: "未获取到车型信息，请检查车牌号"
					})
					return false
				}

				if (this.formData.miles == "") {
					uni.showToast({
						icon: "none",
						title: "请填写里程信息"
					})
					return false
				}

				if (this.formData.oil_quantity == "") {
					uni.showToast({
						icon: "none",
						title: "请填写当前油量"
					})
					return false
				}

				if (this.formData.driver_id == "") {
					uni.showToast({
						icon: "none",
						title: "请选择司机"
					})
					return false
				}

				uni.navigateTo({
					url: "./addoil?data="+JSON.stringify(this.formData)
				})
			},
			// 选择图片
			chooseImage: async function() {
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
				// 拍照或选择图片
				uni.chooseImage({
					sourceType: this.sourceType[this.sourceTypeIndex],
					sizeType: this.sizeType[this.sizeTypeIndex],
					count: 1,
					success: (res) => {
						// 调用图片上传接口和图片识别接口并返回车牌号
						this.uploadPic(res.tempFilePaths[0])
					},
					fail: (err) => {
						console.log("err: ", err);
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						if (err.errMsg.indexOf('cancel') !== '-1') {
							return;
						}
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res
											.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '系统需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(this.sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}

				return status;
			},
			// 上传图片
			uploadPic(tempFilePaths) {
				let that = this
				uni.uploadFile({
					url: that.$api.uploadFile(),
					filePath: tempFilePaths,
					name: 'pic',
					header: {
						'content-type': 'multipart/form-data',
						token: uni.getStorageSync('token')
					},
					timeout: 10000,
					success: uploadFileRes => {
						// 提取车牌
						let picPath = this.$api.getUrl(JSON.parse(uploadFileRes.data).data.pic_url)
						that.extractVehicleNumber(picPath)
					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '图片上传失败,请重试'
						})
					}
				})
			},
			// 从图片提取车牌号
			extractVehicleNumber(pic_url) {
				let data = {
					img_url: pic_url
				}
				this.$api.getVehicleNumber(data).then(res => {
					this.formData.license_number = res.data.number || ""
					// this.formData.license_number = "苏F77938" //模拟
				}, fail => {
					uni.showToast({
						icon: "none",
						title: fail
					})
				})
			}
		}
	}
</script>

<style>
	.main {
		margin-top: 20rpx;
	}

	.point {
		color: #9ADB58;
		margin: 0 5rpx;
	}

	.uni-list-item {
		height: 120rpx;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 30px;
		height: 30px;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
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
		background-color: #7DCE20;
	}

	.diabledText {
		color: #808080;
	}
	
	.unit {
		position: absolute;
		right: 50rpx;
		color: #808080;
	}
</style>
