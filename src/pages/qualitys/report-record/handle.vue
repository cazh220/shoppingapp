<template>
	<view id="Handle">
		<uni-forms ref="form" :modelValue="formData" :rules="rules" border>
			<uni-forms-item required name="img">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>处理图片:</text>
				</view>
				<uni-file-picker
					v-model="formData.img"
					fileMediatype="image"
					file-extname="png,jpg,jpeg"
					ref="files"
					:limit="3"
					:auto-upload="false"
					@select="select"
					@delete="deleteImg"
				/>
				<text class="notes">注：请上传处理问题后的图片</text>
			</uni-forms-item>
			<uni-forms-item required name="dispose_result">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>处理结果:</text>
				</view>
				<uni-easyinput type="textarea" autoHeight v-model="formData.dispose_result" placeholder="请输入反馈内容"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
		<view class="bottom-button">
			<button class="save-button" @click="cancle">取消</button>
			<button class="submit-button" @click="submitForm">确定</button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Handle',
	data() {
		return {
			formData: {
				img: [],
				dispose_result: ''
			},
			id: 0,
			rules: {
				img: {
					rules: [
						{
							required: true,
							errorMessage: '请上传处理图片'
						}
					],
					validateTrigger: 'submit'
				},
				dispose_result: {
					rules: [
						{
							required: true,
							errorMessage: '请输入反馈内容'
						}
					],
					validateTrigger: 'submit'
				}
			}
		};
	},
	onLoad(option) {
		console.log('option', option);
		this.id = option.id;
	},

	methods: {
		submitForm() {
			this.$refs.form.validate().then(res => {
				const formData = this.formData;
				console.log('submitForm', formData);
				formData.dispose_img = formData.img
					.map(item => {
						return item.pic_url;
					})
					.join(',');
				const dealData = {
					id: this.id,
					dispose_img: formData.dispose_img,
					dispose_result: this.formData.dispose_result
				};
				this.$api.postDispose(dealData).then(
					res => {
						uni.reLaunch({
							url: './report-record?currentTab=1'
						});
					},
					fail => {
						uni.showToast({
							title: fail || '获取数据错误',
							icon: 'none',
							duration: 2000
						});
					}
				);
			});
			console.log('111');
		},
		// 获取上传状态
		select(e) {
			console.log('选择文件：', e);
			// this.formData.pic_url.push(e.tempFiles[0])
			uni.uploadFile({
				url: this.$api.uploadFile(),
				filePath: e.tempFilePaths[0],
				name: 'pic',
				header: { 'content-type': 'multipart/form-data', token: uni.getStorageSync('token') },
				timeout: 10000,
				success: uploadFileRes => {
					e.tempFiles[0].pic_url = JSON.parse(uploadFileRes.data).data.pic_url;
					this.formData.img.push(e.tempFiles[0]);
				},
				fail: () => {
					uni.showToast({
						icon: 'none',
						title: '图片上传失败,请重试'
					});
				}
			});
			console.log('选择文件：22', this.formData.img);
		},

		// 删除图片
		deleteImg(e) {
			this.formData.img = this.formData.img.filter(item => {
				if (item.path !== e.tempFilePath) {
					return item;
				}
			});
		}
	}
};
</script>

<style lang="scss">
#Handle {
	.bottom-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10px;
	}

	.save-button {
		width: 48%;
		background-color: #bcbcbc;
		color: #fff;
	}

	.submit-button {
		width: 48%;
		background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
		color: #fff;
	}
	.file-picker__box-content {
		width: 160rpx;
		height: 160rpx;
		border: 1px #d6d6d6 solid !important;
	}
	.uni-easyinput.data-v-abe12412 {
		width: 95% !important;
	}
	.notes {
		color: #8e8e8e;
		margin-top: 5px;
		font-size: 10px;
		display: inline-block;
	}
}
</style>
