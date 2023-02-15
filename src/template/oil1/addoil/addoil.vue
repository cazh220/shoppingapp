<!-- 车辆加油 -->
<template>
	<view class="container">
		<view class="main">
			<view class="basic">
				<uni-list>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>油型：<text class="diabledText">{{formData.oiltype}}</text>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>单价：
						</view>
						<view slot="body">
							<input class='price flex-long' v-model="formData.oilPrice" name="price" type="digit" focus placeholder="请输入单价" />
						</view>
						<template slot="footer">
							<text class="unit">元/L</text>
						</template>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>加油量：
						</view>
						<view slot="body">
							<input class='price flex-long' v-model="formData.refuelingVolume" name="quantity" type="digit" focus placeholder="请输入当前加油量" />
						</view>
						<template slot="footer">
							<text class="unit">L</text>
						</template>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>结算方式：
						</view>
						<view slot="body">
							<uni-data-checkbox :color="radioColor" v-model="formData.payType" checked="true" :localdata="paywaylist">
							</uni-data-checkbox>
						</view>
					</uni-list-item>
					<uni-list-item link @click="selectOilCard" v-model="formData.oilCardId" v-if="formData.payType == 1">
						<view slot="header" class="slot-box">
							<text class="point">*</text>加油卡号：<text class="diabledText">{{cardNo}}</text>
							<lb-picker ref="picker" :list="cardList" v-model="cardNo" @confirm="selectCard" @cancel="cancelCardShow"></lb-picker>
						</view>
					</uni-list-item>
					<uni-list-item v-else>
						<view slot="header" class="slot-box">
							<text class="point">*</text>发票号：
						</view>
						<view slot="body">
							<input class='price flex-long' name="invoiceNo" type="digit" focus v-model="formData.invoiceNo" placeholder="请输入发票号" />
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>总金额：
						</view>
						<view slot="body">
							<input class='price flex-long' name="shouldPay" type="digit" focus v-model="formData.shouldPay" :disabled="true" placeholder="请输入总金额" />
						</view>
						<template slot="footer">
							<text class="unit">元</text>
						</template>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>实付金额：
						</view>
						<view slot="body">
							<input class='price flex-long' name="realPay" type="digit" focus v-model="formData.realPay" placeholder="请输入实付金额" />
						</view>
						<template slot="footer">
							<text class="unit">元</text>
						</template>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>备注：
						</view>
						<view slot="body">
							<input class='price flex-long' name="remark" focus v-model="formData.remark" placeholder="请输入备注" />
						</view>
					</uni-list-item>

				</uni-list>
				<view class="upload">
					<view class="uploadcontent">
						<view class="label">
							<text class="point">*</text>上传图片：
						</view>
						<view class="uploadimgs">
							<uni-file-picker file-mediatype="image" v-model="formData.refuelingEvidenceUrlArr"
								disable-preview :del-icon="true" mode="grid" file-extname="png,jpg" :limit="3"
								@select="selectPic" @fail="imgFail" @delete="deleteImg" />
						</view>
						<text class="tip">注：最多三张图片，请上传车辆仪表盘图片、车牌号、加油终端图片</text>
					</view>
				</view>
			</view>
		</view>

		<view class="button_next">
			<button type="primary" @click="next">下一步</button>
		</view>
	</view>
</template>

<script>
	import util from "../../../common/util.js"
	export default {
		data() {
			return {
				cardNo: "请选择加油卡号",
				formData: {
					oilStationId: "",
					vehicleNumber: "",
					vehicleTypeId: "",
					totalKm: "",
					beginOil: "",
					driverId: "",
					oilTypeId: "",
					oilPrice: "",
					refuelingVolume: "",
					payType: "1",
					oilCardId: "",
					invoiceNo: "",
					shouldPay: "",
					realPay: "",
					remark: "",
					refuelingEvidenceUrlArr: [],
					driverSignUrl: ""
				},
				paywaylist: [
					{
						text: '油卡',
						value: '1'
					},
					{
						text: '现金',
						value: '2',
					},
				],
				cardList: [],
				radioColor: "#7DCE20",
			}
		},
		computed: {
			//  计算应付金额
			"formData.shouldPay": function() {
				this.formData.shouldPay = (this.formData.oilPrice*this.formData.refuelingVolume).toFixed(2)
				return this.formData.shouldPay
			}
		},
		onLoad(option) {
			let data = option.data ? JSON.parse(decodeURIComponent(option.data)) : {}
			this.formData.oiltype = data.oiltype || ""
			this.formData.vehicleNumber = data.license_number || ""
			this.formData.vehicleTypeId = data.vehicleId || ""
			this.formData.totalKm = data.miles || ""
			this.formData.beginOil = data.oil_quantity || ""
			this.formData.driverId = data.driver_id || ""
			this.formData.oilTypeId = data.oiltype_id || ""
			this.formData.oilPrice = data.price || ""
			this.formData.oilStationId = data.station_id || ""
		},
		methods: {
			// 选择上传图片
			selectPic(e) {
				uni.uploadFile({
					url: this.$api.uploadFile(),
					filePath: e.tempFilePaths[0],
					name: 'pic',
					header: {
						'content-type': 'multipart/form-data',
						token: uni.getStorageSync('token')
					},
					timeout: 10000,
					success: uploadFileRes => {
						e.tempFiles[0].pic_url = JSON.parse(uploadFileRes.data).data.pic_url
						this.formData.refuelingEvidenceUrlArr.push(e.tempFiles[0])
					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '图片上传失败,请重试'
						})
					}
				})
			},
			// 上传失败
			imgFail(e) {
				console.log('上传失败：', e)
			},
			// 删除图片
			deleteImg(e) {
				this.formData.refuelingEvidenceUrlArr = this.formData.refuelingEvidenceUrlArr.filter(item => {
					if (item.path !== e.tempFilePath) {
						return item
					}
				})
			},
			// 获取当天油价
			getTodayOilPrice() {
				this.$api.getPriceRecord()
			},
			// 获取油卡
			selectOilCard() {
				this.$refs.picker.show()
				this.$api.getMasterCard().then( res => {
					// that.cardList = res.data
					this.cardList = []
					res.data.map( item => {
						this.cardList.push({
							label: item.number,
							value: item.id
						})
					})
				}, fail => {})
			},
			// 选择油卡
			selectCard(e) {
				this.cardNo = e.item.label
				this.formData.oilCardId = e.value
			},
			// 取消油卡弹框
			cancelCardShow() {
				this.$refs.picker.hide()
			},
			// 下一步
			next() {
				console.log("submit", this.formData)
				if (!util.validatePrice(this.formData.oilPrice)) 
				{
					uni.showToast({
						icon: "none",
						title: "请填写正确的油价"
					})
					return false
				}
				
				if (this.formData.refuelingVolume == "") {
					uni.showToast({
						icon: "none",
						title: "加油量不为空"
					})
					return false
				}
				
				if (this.formData.payWay == 1 && this.formData.oilCardId == "") {
					uni.showToast({
						icon: "none",
						title: "加油卡号不为空"
					})
					return false
				}
				
				if (this.formData.payWay == 2 && this.formData.invoiceNo == "") {
					uni.showToast({
						icon: "none",
						title: "发票号不为空"
					})
					return false
				}
				
				if (!util.validatePrice(this.formData.shouldPay)) {
					uni.showToast({
						icon: "none",
						title: "总金额错误"
					})
					return false
				}
				
				if (!util.validatePrice(this.formData.realPay)) {
					uni.showToast({
						icon: "none",
						title: "实付金额错误"
					})
					return false
				}
				
				let imgs = []
				this.formData.refuelingEvidenceUrlArr.map( item => {
					imgs.push(item.pic_url)
				})
				
				if (imgs.length < 3) {
					uni.showToast({
						icon: "none",
						title: "请上传三张图片"
					})
					return false
				}
				
				this.formData.picList = imgs
				uni.navigateTo({
					url: "./electronic_signature?data="+JSON.stringify(this.formData)
				})
			}

		}
	}
</script>

<style>
	.main {
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.point {
		color: #9ADB58;
		margin: 0 5rpx;
	}

	.upload {
		height: 280rpx;
	}

	.label {
		float: left;
	}

	.uploadcontent {
		padding: 24rpx 30rpx;
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
		/* position: fixed;
		left: 0;
		bottom: 40rpx;
		right: 0; */
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
		margin-bottom: 40rpx;
	}

	.tip {
		color: #666666;
		font-size: 24rpx;
		margin-top: 5rpx;
	}

	.uni-data-checklist {
		top: 4rpx !important;
	}

	.diabledText {
		color: #808080;
	}
	
	.radio__inner {
		border-color: #7DCE20 !important;
	}
	
	.radio__inner-icon {
		border-color: #7DCE20 !important;
		background-color: #7DCE20 !important;
	}
	
	.checklist-box.is--default.is-checked .checklist-text {
		color: #7DCE20 !important;
	}
	
	.unit {
		position: absolute;
		right: 50rpx;
		color: #808080;
	}
</style>
