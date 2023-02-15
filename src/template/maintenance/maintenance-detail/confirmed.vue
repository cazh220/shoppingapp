<template>
	<!-- 待确认 -->
	<view id="Confirmed" class="Confirmed">
		<uni-forms ref="confirmedForm" :modelValue="formData" border>
			<uni-forms-item required name="reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>确认信息</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.reason }}</view>
				<uni-easyinput v-else type="textarea" autoHeight v-model="formData.reason" placeholder="请输入确认信息" suffixIcon="km" />
			</uni-forms-item>
			<uni-forms-item v-if="readOnly" required name="confirm_wxsp_account_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>确认人</text>
				</view>
				<view class="lh">{{ formData.confirm_wxsp_account_name }}</view>
			</uni-forms-item>
			<uni-forms-item v-if="readOnly" required name="confirm_time">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>确认时间</text>
				</view>
				<view class="lh">{{ formData.confirm_time }}</view>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
export default {
	name: 'Confirmed',
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
							errorMessage: '请输入确认信息'
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
					this.formData.confirm_wxsp_account_name = val.confirm_wxsp_account_name
					this.formData.confirm_time = val.confirm_time
					this.formData.reason = val.confirm_reason
				}
			}
		}
	}
}
</script>

<style lang="scss">
.Confirmed {
	padding: 0 20px;
	.lh {
		float: right;
		line-height: 36px;
	}
}
</style>
