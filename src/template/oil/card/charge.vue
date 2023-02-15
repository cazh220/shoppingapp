<!-- 油卡充值 -->
<template>
	<view class="container">
		<view class="main">
			<view class="card-no">
				<uni-list>

					<uni-list-item>
						<view slot="body">
							<text class="point">*</text>当前卡号：{{format_card_no}}
						</view>
					</uni-list-item>
				</uni-list>
			</view>

			<view class="charge">
				<uni-list>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>充值金额：
						</view>
						<view slot="body">
							<input class='price flex-long' name="real_amount" focus v-model="formData.real_amount"
								placeholder="请输入实际金额" type="digit" style="margin-top: 0rpx;" />
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">
							<text class="point">*</text>其它金额：
						</view>
						<view slot="body">
							<input class='price flex-long' name="other_amount" focus v-model="formData.other_amount"
								type="digit" placeholder="请输入其它优惠或退回金额" style="margin-top: 0rpx; width: 120%;" />
						</view>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
		<view class="button_next">
			<button type="primary" @click="save">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				format_card_no: "",
				formData: {
					card_id: "",
					card_no: "",
					real_amount: "",
					other_amount: "",
				}
			}
		},
		onLoad(option) {
			this.formData.card_no = option.card_no || ""
			this.formData.card_id = option.card_id || ""
			// 检查是否获取到卡号，否则提示报错
			if (this.formData.card_no == "") {
				uni.showToast({
					icon: "none",
					title: "卡号获取异常"
				})
				return false
			}
			this.format_card_no = this.formData.card_no.substr(0, 4) + " " + this.formData.card_no.substr(4, 4) + " " +
				this.formData.card_no.substr(
					8, 4) + " " + this.formData.card_no.substr(12, 4)
		},
		methods: {
			// 保存
			save() {
				// 校验金额
				if (this.formData.card_id == "") {
					uni.showToast({
						icon: "none",
						title: "没有获取到卡号信息"
					})
				}
				
				if (this.formData.real_amount == "" || this.formData.real_amount <= 0) {
					uni.showToast({
						icon: "none",
						title: "请输入正确的充值金额"
					})
				}
				
				if (this.formData.other_amount == "" || this.formData.other_amount <= 0) {
					uni.showToast({
						icon: "none",
						title: "请输入正确的其它金额"
					})
				}
				console.log(this.formData)
				let data = {
					id: this.formData.card_id,
					realPay: this.formData.real_amount || "",
					otherPay: this.formData.other_amount || ""
				}
				
				this.$api.rechargeCard(data).then( res => {
					console.log(res)
					
					uni.navigateTo({
						url: "../../../pages/success/success?message=充值成功"
					})
				}, fail => {})

				
			}
		}
	}
</script>

<style>
	.charge {
		margin-top: 20rpx;
	}

	.uni-list-item {
		height: 120rpx;
	}

	.point {
		color: #9ADB58;
		margin: 0 5rpx;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
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
		background: linear-gradient(to right, #7DCE20, #58A40B) !important;
	}
</style>
