<template>
	<!-- 待审核 -->
	<view id="Examine" class="Examine">
		<uni-forms ref="examineForm" :modelValue="formData" :rules="rules" border>
			<uni-forms-item required name="survey_damage_type">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>勘察认定：</text>
				</view>
				<view v-if="readOnly || examineType === 'approve'" class="lh">{{ formData.survey_damage_type_name }}</view>
				<uni-data-checkbox
					v-else
					:disabled="readOnly || examineType === 'approve'"
					v-model="formData.survey_damage_type"
					selectedColor="#7ccd1f"
					selectedTextColor="#333"
					:localdata="$com.damageTypeList()"
				/>
			</uni-forms-item>
			<uni-forms-item required name="survey_money">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>审核金额：</text>
				</view>
				<view v-if="readOnly || examineType === 'approve'" class="lh">{{ formData.survey_money }}</view>
				<uni-easyinput v-else type="digit" v-model="formData.survey_money" :inputBorder="false" placeholder="请输入审核金额" />
			</uni-forms-item>
			<uni-forms-item required name="survey_reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>勘察意见：</text>
				</view>
				<view v-if="readOnly || examineType === 'approve'" class="lh">{{ formData.survey_reason }}</view>
				<uni-easyinput v-else type="textarea" autoHeight v-model="formData.survey_reason" :inputBorder="false" placeholder="请输入勘察意见" suffixIcon="km" />
			</uni-forms-item>
			<uni-forms-item required name="img">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>上传图片：</text>
				</view>
				<uni-file-picker
					:readonly="readOnly || examineType === 'approve'"
					:auto-upload="false"
					file-mediatype="image"
					v-model="formData.img"
					disable-preview
					mode="grid"
					:image-styles="imageStyles"
					file-extname="png,jpg"
					:limit="3"
					@select="selectImg"
					@delete="deleteImg"
				/>
				<text class="notes">注：请上传报价部分图片</text>
			</uni-forms-item>
			<uni-forms-item v-if="readOnly || examineType === 'approve'" name="survey_time">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>勘察时间：</text>
				</view>
				<view class="lh">{{ formData.survey_time }}</view>
			</uni-forms-item>
			<uni-forms-item v-if="readOnly || examineType === 'approve'" name="survey_time">
				<view slot="left" class="form-label"><text>审批流：</text></view>
				<view class="lh">当前状态：{{ state_text }}</view>
			</uni-forms-item>
		</uni-forms>

		<ty-steps v-if="readOnly || examineType === 'approve'" :options="processData" direction="column" active-color="#89D13F" :active="steps"></ty-steps>
		<block v-if="examineType === 'approve'">
			<view class="approve-title mt10">审批：</view>
			<uni-forms ref="approveForm" :modelValue="approveData" :rules="approveRules" border>
				<uni-forms-item required name="state">
					<view slot="left" class="form-label">
						<text class="required-icon">*</text>
						<text>审批</text>
					</view>
					<uni-data-checkbox v-model="approveData.state" selectedColor="#7ccd1f" selectedTextColor="#333" :localdata="approveList" />
				</uni-forms-item>
				<uni-forms-item required name="survey_reason">
					<view slot="left" class="form-label">
						<text class="required-icon">*</text>
						<text>审批说明</text>
					</view>
					<uni-easyinput type="textarea" autoHeight v-model="approveData.remark" :inputBorder="false" placeholder="请输入审批说明" suffixIcon="km" />
				</uni-forms-item>
			</uni-forms>
		</block>
	</view>
</template>

<script>
export default {
	name: 'Examine',
	props: {
		readOnly: {
			type: Boolean,
			default: false
		},
		examineType: {
			type: String,
			default: 'examine' //  examine:审核状态   approve:审批状态
		},
		orderId: {
			type: String,
			default: ''
		},
		showFormData: {
			type: Object,
			default: {}
		}
	},

	data() {
		return {
			formData: {
				survey_damage_type: 1, // 损坏类型 勘察认定
				survey_money: '', // 审核金额
				survey_reason: '', // 勘察意见
				img: [] // 审核图片
			},
			approveData: {
				state: 2,
				remark: ''
			},
			approveList: [{ text: '同意', value: 2 }, { text: '驳回', value: 3 }],
			list: [],
			imageStyles: {
				width: 70,
				height: 70
			},
			steps: 0, // 当前步骤
			state_text: '', // 审批状态
			processData: [], // 审批流列表
			rules: {
				survey_damage_type: {
					rules: [
						{
							required: true,
							errorMessage: '请选择勘察认定'
						}
					],
					validateTrigger: 'submit'
				},
				survey_money: {
					rules: [
						{
							required: true,
							errorMessage: '请输入审核金额'
						}
					],
					validateTrigger: 'submit'
				},
				survey_reason: {
					rules: [
						{
							required: true,
							errorMessage: '请输入勘察意见'
						}
					],
					validateTrigger: 'submit'
				},
				img: {
					rules: [
						{
							required: true,
							errorMessage: '请上传图片'
						}
					],
					validateTrigger: 'submit'
				}
			},

			approveRules: {
				state: {
					rules: [
						{
							required: true,
							errorMessage: '请选择审批'
						}
					],
					validateTrigger: 'submit'
				},
				remark: {
					rules: [
						{
							required: true,
							errorMessage: '请输入审批说明'
						}
					],
					validateTrigger: 'submit'
				}
			}
		}
	},

	created() {
		if (this.readOnly || this.examineType === 'approve') {
			this.$api.getMaintenanceProcessList({ id: this.orderId }).then(res => {
				this.processData = res.data.list.map((item, index) => {
					//  赋值当前第几步骤
					if (item.state === 2) {
						this.steps = index
					}
					item.title = `${item.wxsp_account_name}（${item.state_text}）`
					item.desc = item.update_time ? `审核时间：${item.update_time}` : '暂未审批'
					item.info = item.remark ? `审核意见：${item.remark}` : ''
					return item
				})
				this.state_text = res.data.state_text
			})
		}
	},

	methods: {
		// 上传图片
		selectImg(e) {
			console.log('e:', e)
			uni.uploadFile({
				url: this.$api.uploadFile(),
				filePath: e.tempFilePaths[0],
				name: 'pic',
				header: { 'content-type': 'multipart/form-data', token: uni.getStorageSync('token') },
				timeout: 10000,
				success: uploadFileRes => {
					e.tempFiles[0].pic_url = JSON.parse(uploadFileRes.data).data.pic_url
					this.formData.img.push(e.tempFiles[0])
				},
				fail: () => {
					uni.showToast({
						icon: 'none',
						title: '图片上传失败,请重试'
					})
				}
			})
		},

		// 删除图片
		deleteImg(e) {
			this.formData.img = this.formData.img.filter(item => {
				if (item.path !== e.tempFilePath) {
					return item
				}
			})
		}
	},

	watch: {
		showFormData: {
			handler(val) {
				if (this.readOnly) {
					this.formData = val
					this.formData.img = this.formData.survey_img.map(item => {
						return {
							name: item,
							extname: 'png',
							url: this.$api.getUrl(item)
						}
					})
				} else {
					this.formData.survey_money = +val.offer_money
				}
			}
		}
	}
}
</script>

<style lang="scss">
.Examine {
	padding: 0 20px;
	.lh {
		float: right;
		line-height: 36px;
	}
	.notes {
		color: #8e8e8e;
		margin-top: 5px;
		font-size: 10px;
		display: inline-block;
	}
	.approve-title {
		font-size: 16px;
		margin-top: 10px;
	}
}
</style>
