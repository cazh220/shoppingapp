<template>
	<view id="CreateReport">
		<!-- <view class="container"> -->
		<uni-forms ref="form" :modelValue="formData" :rules="rules" border>
			<uni-forms-item required name="pic">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text class="font_title">上报图片:</text>
				</view>
				<uni-file-picker
					v-model="formData.pic"
					fileMediatype="image"
					file-extname="png,jpg"
					ref="files"
					:limit="3"
					:auto-upload="false"
					@select="select"
					@delete="deleteImg"
				/>
			</uni-forms-item>
			<uni-forms-item required name="type">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text class="font_title">事件类型:</text>
				</view>
				<view>
					<uni-tag
						:class="{ active: active === item.name }"
						style="height: 70rpx;line-height: 70rpx;margin: 7rpx;"
						:text="item.name"
						v-for="item in tags"
						:key="item.value"
						@click="selectTag(item)"
					></uni-tag>
				</view>
			</uni-forms-item>
			<uni-forms-item required name="describe">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text class="font_title">事件级别:</text>
				</view>
				<lb-picker ref="driverPicker" v-model="formData.event_level" :list="eventLevelList" @confirm="eventLevelChange">
					<ty-picker-frame placeholder="请选择事件级别" :text="formData.event_level_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="describe">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text class="font_title">事件描述:</text>
				</view>
				<uni-easyinput type="textarea" autoHeight v-model="formData.describe" placeholder="请输入内容"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item required name="address">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text class="font_title">事件地址:</text>
				</view>
				<view class="content flex-between" @click="getCenterLocation">
					<text v-if="formData.address">{{ formData.address }}</text>
					<text v-else style="color: #797777">请选择事件地址</text>
					<image class="mapTopIcon" src="../../../static/images/indexSite.png" alt=""></image>
				</view>
				<!-- <view class="mapTopIcon" @click="getCenterLocation"><image src="../../../static/images/indexSite.png" alt=""></image></view> -->
			</uni-forms-item>
			<uni-forms-item name="address_details">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text class="font_title">详细地址:</text>
				</view>
				<uni-easyinput type="text" v-model="formData.address_details" placeholder="请输入" />
			</uni-forms-item>
			<uni-forms-item required name="conductor_type">
				<view slot="left" class="form-label1">
					<text class="required-icon">*</text>
					<text class="font_title">事件处理人:</text>
				</view>
				<view class="list"><uni-data-checkbox selectedColor="#7ccd1f" selectedTextColor="#7ccd1f" v-model="formData.conductor_type" :localdata="eventTypeList" /></view>
			</uni-forms-item>
		</uni-forms>
		<!-- </view>  @click="submitForm" -->
		<view class="bottom"><button class="submit-button" @click="submitForm">下一步</button></view>
	</view>
</template>

<script>
export default {
	name: 'CreateReport',
	data() {
		return {
			formData: {
				type: '',
				event_level: '',
				event_level_name: '',
				describe: '',
				address: '',
				longitude: '',
				latitude: '',
				address_details: '',
				pic: [],
				conductor_type: 3,
				conductor_id: '',
				conductor_name: '',
				conductor_phone: ''
			},
			eventTypeList: [{ value: 3, text: '查找附近环卫工或环卫车' }, { value: 1, text: '选择环卫工' }, { value: 2, text: '选择环卫车辆' }],
			eventLevelList: [{ label: '一级事件', value: 1 }, { label: '二级事件', value: 2 }, { label: '三级事件', value: 3 }, { label: '四级事件', value: 4 }],
			text: 0,
			tags: [
				{ value: 1, name: '道路清扫保洁' },
				{ value: 2, name: '道路洒水清洗' },
				{ value: 3, name: '果皮箱清掏维护' },
				{ value: 4, name: '垃圾转运' },
				{ value: 5, name: '消杀' },
				{ value: 6, name: '清除牛皮癣' },
				{ value: 7, name: '其他' }
			],
			active: '',
			address: '', //定位地址
			rules: {
				pic: {
					rules: [
						{
							required: true,
							errorMessage: '请上传上报图片'
						}
					],
					validateTrigger: 'submit'
				},
				type: {
					rules: [
						{
							required: true,
							errorMessage: '请选择事件类型'
						}
					],
					validateTrigger: 'submit'
				},
				event_level: {
					rules: [
						{
							required: true,
							errorMessage: '请选择事件级别'
						}
					],
					validateTrigger: 'submit'
				},
				address: {
					rules: [
						{
							required: true,
							errorMessage: '请获取事件地址'
						}
					],
					validateTrigger: 'submit'
				},
				address_details: {
					rules: [
						{
							required: true,
							errorMessage: '请输入详细地址'
						}
					],
					validateTrigger: 'submit'
				},

				describe: {
					rules: [
						{
							required: true,
							errorMessage: '请输入事件描述'
						}
					],
					validateTrigger: 'submit'
				},
				conductor_type: {
					rules: [
						{
							required: true,
							errorMessage: '请选择事件处理人'
						}
					],
					validateTrigger: 'submit'
				}
			}
		}
	},
	onLoad() {},
	methods: {
		//获取地址
		getCenterLocation() {
			let that = this
			uni.chooseLocation({
				success: function(res) {
					that.formData.address = res.address
					that.formData.address_details = res.name
					that.formData.longitude = res.longitude
					that.formData.latitude = res.latitude
					// latitude, longitude;
				}
			})
		},
		selectTag(item) {
			this.formData.type = item.value
			this.active = item.name
		},

		// 选择事件级别
		eventLevelChange(e) {
			this.formData.event_level_name = e.item.label
		},

		// 获取上传状态
		select(e) {
			console.log('选择文件：', e)
			// this.formData.pic_url.push(e.tempFiles[0])
			uni.uploadFile({
				url: this.$api.uploadFile(),
				filePath: e.tempFilePaths[0],
				name: 'pic',
				header: { 'content-type': 'multipart/form-data', token: uni.getStorageSync('token') },
				timeout: 10000,
				success: uploadFileRes => {
					e.tempFiles[0].pic_url = JSON.parse(uploadFileRes.data).data.pic_url
					this.formData.pic.push(e.tempFiles[0])
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
			this.formData.pic = this.formData.pic.filter(item => {
				if (item.path !== e.tempFilePath) {
					return item
				}
			})
		},

		//下一步
		submitForm() {
			this.$refs.form.validate().then(res => {
				const formData = this.formData
				// console.log('submitForm', formData);
				formData.pic_url = formData.pic
					.map(item => {
						return item.pic_url
					})
					.join(',')

				uni.setStorageSync('form_ket', formData)
				if (this.formData.conductor_type === 3) {
					uni.navigateTo({
						url: './nearby-sanitation-workers?lon=' + formData.longitude + '&lat=' + formData.latitude
					})
				} else if (this.formData.conductor_type === 1) {
					uni.navigateTo({
						url: './choice-worker'
					})
				} else if (this.formData.conductor_type === 2) {
					uni.navigateTo({
						url: './choice-vehicle'
					})
				}
			})
		}
	}
}
</script>

<style lang="scss">
#CreateReport {
	padding: 10px;
	background-color: #fff;
	// .container {
	// 	padding: 0 10px;
	// 	background-color: rgba(255, 255, 255, 1);
	.form-label {
		width: 85px;
		// margin-left: 20px;
	}
	.form-label1 {
		width: 100px;
		// margin-left: 20px; 
	}
	.font_title {
		font-size: 15px;
		font-weight: 600;
	}
	.list {
		margin-left: 20px;
	}
	.uni-data-checklist .checklist-group .checklist-box {
		margin: 10px 10px !important;
	}
	.file-picker__box-content {
		border: 1px #d6d6d6 solid !important;
	}
	.tag-item {
		height: 70rpx;
		line-height: 70rpx;
		margin: 7rpx;
	}
	.active text {
		border: 1px solid rgba(105, 183, 21, 1);
		color: rgba(105, 183, 21, 1);
	}
	.content {
		// width: 500rpx;
		height: 37px;
	}
	.mapTopIcon {
		width: 18px;
		height: 25px;
	}
	.uni-data-checklist .checklist-group {
		flex-direction: column;
	}

	.bottom {
		width: 100%;
		bottom: 10px;
	}
	.submit-button {
		width: 95%;
		background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
		color: #fff;
	}
}
</style>
