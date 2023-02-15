<template>
	<!-- 待反馈 -->
	<view id="FedBack" class="FedBack">
		<uni-forms ref="fedBackForm" :modelValue="formData" border>
			<uni-forms-item required name="reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>反馈信息</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.reason }}</view>
				<uni-easyinput v-else type="textarea" autoHeight v-model="formData.reason" placeholder="请输入反馈信息" suffixIcon="km" />
			</uni-forms-item>
			<uni-forms-item v-if="readOnly" required name="confirm_wxsp_account_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>反馈人</text>
				</view>
				<view class="lh">{{ formData.feedback_wxsp_account_name }}</view>
			</uni-forms-item>
			<uni-forms-item v-if="readOnly" required name="confirm_time">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>反馈时间</text>
				</view>
				<view class="lh">{{ formData.feedback_time }}</view>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
export default {
	name: 'FedBack',
	props: {
		readOnly: {
			type: Boolean,
			default: false
		},
		showFormData: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			list: [],
			formData: {
				reason: ''
			},
			rules: {
				reason: {
					rules: [
						{
							required: true,
							errorMessage: '请输入反馈信息'
						}
					],
					validateTrigger: 'submit'
				}
			}
		}
	},
	watch: {
		showFormData: {
			handler(val) {
				if (this.readOnly) {
					this.formData.reason = val.feedback_reason
					this.formData.feedback_wxsp_account_name = val.feedback_wxsp_account_name
					this.formData.feedback_time = val.feedback_time
					
				}
			}
		}
	}
}
</script>
<style lang="scss">
.FedBack {
	padding: 0 20px;
	.lh {
		float: right;
		line-height: 36px;
	}
}
</style>
