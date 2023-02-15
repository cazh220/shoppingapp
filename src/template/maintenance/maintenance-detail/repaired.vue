<template>
	<!-- 待维修 -->
	<view id="Repaired" class="Repaired">
		<uni-forms ref="repairedform" :modelValue="formData" border :rules="rules">
			<uni-forms-item required name="img">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>图片</text>
				</view>
				<uni-file-picker
					:readonly="readOnly"
					ref="imagesUpload"
					:auto-upload="false"
					file-mediatype="image"
					v-model="formData.img"
					disable-preview
					mode="grid"
					:image-styles="imageStyles"
					file-extname="png,jpg"
					:limit="4"
					@select="selectImg"
					@delete="deleteImg"
				/>
				<text class="notes">注：请按维修前--维修中--维修后--新旧件顺序上传图片</text>
			</uni-forms-item>
			<uni-forms-item v-if="readOnly" required name="offer_reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>提交人</text>
				</view>
				<view class="lh">{{ formData.maintenance_wxsp_account_name }}</view>
			</uni-forms-item>
			<uni-forms-item v-if="readOnly" required name="offer_reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>提交时间</text>
				</view>
				<view class="lh">{{ formData.maintenance_time }}</view>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
export default {
	name: 'Repaired',
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
				img: []
			},
			imageStyles: {
				width: 70,
				height: 70
			},
			rules: {
				img: {
					rules: [
						{
							required: true,
							errorMessage: '请上传图片'
						},
						{
							minLength: 4,
							errorMessage: '请上传所有图片'
						}
					],
					validateTrigger: 'submit'
				}
			}
		}
	},

	methods: {
		// 上传图片
		selectImg(e) {
			console.log('e上传:', e)
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
					this.formData.img = this.formData.maintenance_img.map(item => {
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
.Repaired {
	min-height: 200px;
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
