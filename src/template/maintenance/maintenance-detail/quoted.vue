<template>
	<!-- 待报价 -->
	<view id="Quoted" class="Quoted">
		<uni-forms ref="quotedForm" :modelValue="formData" :rules="rules" border>
			<uni-forms-item required name="maintenance_shop_id">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>定点维修厂</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.maintenance_shop_name }}</view>
				<lb-picker v-else ref="driverPicker" v-model="formData.maintenance_shop_id" :list="maintenanceShopList" @confirm="maintenanceShopChange">
					<ty-picker-frame :placeholder="'请选择定点维修厂'" :text="formData.maintenance_shop_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="offer_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>责任人</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.offer_name }}</view>
				<uni-easyinput v-else type="text" v-model="formData.offer_name" :inputBorder="false" placeholder="请输入责任人" />
			</uni-forms-item>

			<uni-forms-item required name="offer_money">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>报价金额</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.offer_money }}</view>
				<uni-easyinput v-else type="digit" v-model="formData.offer_money" :inputBorder="false" placeholder="请输入报价金额" />
			</uni-forms-item>

			<uni-forms-item required name="offer_type">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>维修类型</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.offer_type_name }}</view>
				<lb-picker v-else ref="driverPicker" v-model="formData.offer_type" :list="$com.applicationTypeList()" @confirm="applyTypeChange">
					<ty-picker-frame :placeholder="'请选择维修类型'" :text="formData.offer_type_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="offer_reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>报价详情</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.offer_reason }}</view>
				<uni-easyinput v-else type="textarea" autoHeight v-model="formData.offer_reason" :inputBorder="false" placeholder="请输入报价详情" suffixIcon="km" />
			</uni-forms-item>

			<!-- <uni-forms-item required name="offer_reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>维修配件名</text>
				</view>
				<view v-if="readOnly" class="lh">{{ formData.offer_reason }}</view>
				<uni-easyinput v-else type="textarea" autoHeight v-model="formData.offer_reason" :inputBorder="false" placeholder="请输入报价详情" suffixIcon="km" />
			</uni-forms-item> -->

			<uni-forms-item required name="img">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>上传图片</text>
				</view>
				<uni-file-picker
					:readonly="readOnly"
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
		</uni-forms>
	</view>
</template>

<script>
export default {
	name: 'Quoted',
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
			formData: {
				maintenance_shop_name: '', // 维修厂名称
				maintenance_shop_id: '', // 维修厂id
				offer_name: '', // 责任人
				offer_money: '', // 报价金额
				offer_type_name: '', // 维修类型名称
				offer_type: '', // 维修类型id
				offer_reason: '', // 报价详情
				img: [] // 图片,
			},
			imageStyles: {
				width: 70,
				height: 70
			},
			maintenanceShopList: [], // 维修厂列表
			rules: {
				maintenance_shop_id: {
					rules: [
						{
							required: true,
							errorMessage: '请选择定点维修厂'
						}
					],
					validateTrigger: 'submit'
				},
				offer_name: {
					rules: [
						{
							required: true,
							errorMessage: '请输入责任人'
						}
					],
					validateTrigger: 'submit'
				},
				offer_money: {
					rules: [
						{
							required: true,
							errorMessage: '请输入报价金额'
						}
					],
					validateTrigger: 'submit'
				},
				offer_type: {
					rules: [
						{
							required: true,
							errorMessage: '请选择维修类型'
						}
					],
					validateTrigger: 'submit'
				},
				offer_reason: {
					rules: [
						{
							required: true,
							errorMessage: '请输入报价详情'
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
			}
		}
	},

	mounted() {
		if (!this.readOnly) {
			// 获取维修厂列表
			this.$api.getMaintenanceShopList().then(res => {
				this.maintenanceShopList = res.data.map(item => {
					item.label = item.maintenance_shop_name
					item.value = item.id
					return item
				})
			})
		}
	},

	methods: {
		// 选择了定点维修厂
		maintenanceShopChange(e) {
			this.formData.maintenance_shop_name = e.item.label
			console.log('this.formData:', this.formData);
		},

		// 选择了维修类型
		applyTypeChange(e) {
			this.formData.offer_type_name = e.item.label
		},

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
					this.formData.img = this.formData.offer_img.map(item => {
						return {
							name: item,
							extname: 'png',
							url: this.$api.getUrl(item)
						}
					})
				}
			}
		}
	}
}
</script>

<style lang="scss">
.Quoted {
	padding: 0 20px 20px 20px;
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
}
</style>
