<template>
	<view id="CollectionGisOperation">
		<uni-forms ref="form" :modelValue="formData" :rules="rules" border>
			<uni-forms-item required name="type">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>设施类型</text>
				</view>
				<view class="license-number-box">
					<uni-data-checkbox
						selectedColor="#69B715"
						selectedTextColor="#69B715"
						mode="button"
						:disabled="pageType === 'edit'"
						v-model="formData.type"
						:localdata="$com.facilitiesList()"
						@change="typeChange"
					></uni-data-checkbox>
				</view>
			</uni-forms-item>

			<uni-forms-item required name="name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>设施名称</text>
				</view>
				<uni-easyinput :inputBorder="false" type="text" placeholderStyle="color: #999999" v-model="formData.name" placeholder="请输入设施名称" />
			</uni-forms-item>

			<uni-forms-item required name="area_id">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>所属区域</text>
				</view>
				<lb-picker
					ref="areaPicker"
					v-model="formData.area"
					:props="{ label: 'area_name', value: 'area_id', children: 'child' }"
					mode="multiSelector"
					level="3"
					:list="areaList"
					@confirm="areaConfirm"
				>
					<ty-picker-frame :placeholder="'请选择所属区域'" :text="formData.area_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="address_details">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>定位地址</text>
				</view>
				<view class="address-box" @click="clickPosition">{{ formData.address_details }}</view>
				<image src="../../../static/images/indexSite.png" class="position" @click="clickPosition"></image>
			</uni-forms-item>

			<uni-forms-item required name="collection_point_type" v-if="formData.type === 2">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>收集点类型</text>
				</view>
				<lb-picker ref="driverPicker" v-model="formData.collection_point_type" :list="$com.collectionTypeList()" @confirm="collectionTypeChange">
					<ty-picker-frame :placeholder="'请选择收集点类型'" :text="formData.collection_point_type_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="img" v-if="formData.type !== 1">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>上传图片</text>
				</view>
				<uni-file-picker
					ref="imagesUpload"
					:auto-upload="false"
					file-mediatype="image"
					v-model="formData.img"
					disable-preview
					mode="grid"
					:image-styles="{ width: 70, height: 70 }"
					file-extname="png,jpg,jpeg"
					:limit="1"
					@select="selectImg"
					@delete="deleteImg"
				/>
			</uni-forms-item>

			<uni-forms-item required name="public_toilet_type" v-if="formData.type === 7">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>公厕类型</text>
				</view>
				<lb-picker ref="driverPicker" v-model="formData.public_toilet_type" :list="$com.publicToiletTypeList()" @confirm="publicToiletTypeChange">
					<ty-picker-frame :placeholder="'请选择公厕类型'" :text="formData.public_toilet_type_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="open_day" v-if="formData.type === 7">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>开放日期</text>
				</view>
				<lb-picker ref="weekPicker" v-model="formData.open_day" mode="unlinkedSelector" :level="2" :list="$com.weekList()" @confirm="weekChange">
					<ty-picker-frame :placeholder="'请选择开放日期'" :text="formData.open_day_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="open_time" v-if="formData.type === 7">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>开放时间</text>
				</view>
				<lb-picker ref="driverPicker" v-model="formData.open_time" mode="unlinkedSelector" :level="5" :list="$com.hmRangeList()" @confirm="timeChange">
					<ty-picker-frame :placeholder="'请选择开放时间'" :text="formData.open_time_name"></ty-picker-frame>
				</lb-picker>
			</uni-forms-item>

			<uni-forms-item required name="man_squat" v-if="formData.type === 7">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>男蹲位数</text>
				</view>
				<uni-easyinput :inputBorder="false" type="digit" placeholderStyle="color: #999999" v-model="formData.man_squat" placeholder="请输入男蹲位数" />
			</uni-forms-item>

			<uni-forms-item required name="woman_squat" v-if="formData.type === 7">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>女蹲位数</text>
				</view>
				<uni-easyinput :inputBorder="false" type="digit" placeholderStyle="color: #999999" v-model="formData.woman_squat" placeholder="请输入女蹲位数" />
			</uni-forms-item>
		</uni-forms>
		<view class="bottom-button"><button class="save-button fs32r" @click="save()">保存</button></view>
	</view>
</template>

<script>
import utils from '@/utils/utils'
export default {
	name: 'CollectionGisOperation',
	data() {
		return {
			pageType: 'add',
			areaList: [], // 省市区列表
			formData: {
				type: '', // 设施类型
				name: '',
				area: [], // 省市区id
				area_id: null, // 区id
				area_name: '', // 省市区显示的名称
				address_details: '', // 地址
				location: '', // 经纬度
				collection_point_type: null, // 收集点类型
				collection_point_type_name: '', // 收集
				img: [],
				public_toilet_type: '', // 公厕类型
				public_toilet_type_name: '', // 公厕类型名称
				open_day: [], // 公厕开放日
				open_day_name: '', // 公厕开放日名称
				open_time_start_week: '', // 开始周
				open_time_end_week: '', // 结束周
				open_time: [], // 公厕开放时间
				open_time_name: '', // 公厕开放时间名称
				open_time_start_hour: '', // 开始时分
				open_time_end_hour: '', // 结束时分
				man_squat: '', // 男蹲位数
				woman_squat: '' // 女蹲位数
			},
			rules: {
				type: { rules: [{ required: true, errorMessage: '请选择设施类型' }], validateTrigger: 'submit' },
				name: { rules: [{ required: true, errorMessage: '请输入设施名称' }], validateTrigger: 'submit' },
				area_id: { rules: [{ required: true, errorMessage: '请选择省市区' }], validateTrigger: 'submit' },
				address_details: { rules: [{ required: true, errorMessage: '请选择定位地址' }], validateTrigger: 'submit' },
				img: { rules: [{ required: true, errorMessage: '请选择图片' }], validateTrigger: 'submit' },
				collection_point_type: { rules: [{ required: true, errorMessage: '请选择收集点类型' }], validateTrigger: 'submit' },
				public_toilet_type: { rules: [{ required: true, errorMessage: '请选择公厕类型' }], validateTrigger: 'submit' },
				open_day: { rules: [{ required: true, errorMessage: '请选择开放时间' }], validateTrigger: 'submit' },
				open_time: { rules: [{ required: true, errorMessage: '请选择开放时间' }], validateTrigger: 'submit' },
				man_squat: { rules: [{ required: true, errorMessage: '请输入男蹲位数' }], validateTrigger: 'submit' },
				woman_squat: { rules: [{ required: true, errorMessage: '请输入女蹲位数' }], validateTrigger: 'submit' }
			}
		}
	},
	onLoad(options) {
		console.log('optioins:', options)
		if (options) {
			this.pageType = options.pageType
			// 获取省市区列表
			this.$api.getCollectionAreaList().then(res => {
				this.areaList = res.data
				if (options.pageType === 'edit') {
					uni.setNavigationBarTitle({ title: '编辑设施' })
					this.$api.getFacilitiesDetail({ type: options.type, serial_number: options.serial_number }).then(res => {
						if (res.code === 200) {
							let d = res.data[0]
							this.formData.serial_number = d.serial_number
							this.formData.type = d.type
							this.formData.name = d.name
							this.formData.area = [d.province_id, d.city_id, d.area_id]
							this.formData.area_id = d.area_id
							this.formData.area_name = d.province_name + d.city_name + d.area_name
							this.formData.location = d.location
							this.formData.address_details = d.address_details
							if (d.type !== 1 && d.pic_url !== '') {
								this.formData.img = [{ name: d.pic_url, extname: 'png', url: this.$api.getUrl(d.pic_url), pic_url: d.pic_url }]
								this.formData.pic_url = d.pic_url
							}
							if (d.type === 2) {
								this.formData.collection_point_type = d.collection_point_type
								this.$com.collectionTypeList().forEach(item => {
									if (item.value === d.collection_point_type) {
										this.formData.collection_point_type_name = item.label
									}
								})
							}
							if (d.type === 7) {
								this.formData.public_toilet_type = d.public_toilet_type
								this.formData.public_toilet_type_name = d.public_toilet_type === 1 ? '一类' : '二类'
								this.formData.open_day = [d.open_time_start_week, d.open_time_end_week]
								this.formData.open_time_start_week = d.open_time_start_week
								this.formData.open_time_end_week = d.open_time_end_week
								this.$com.weekList()[0].forEach(item => {
									if (item.value === d.open_time_start_week) {
										this.formData.open_day_name = item.label + ' - '
									}
									if (item.value === d.open_time_end_week) {
										this.formData.open_day_name = this.formData.open_day_name + item.label
									}
								})
								this.formData.open_time = [d.open_time_start_hour, d.open_time_end_hour]
								this.formData.open_time_start_hour = d.open_time_start_hour
								this.formData.open_time_end_hour = d.open_time_end_hour
								this.formData.open_time_name = d.open_time_start_hour + ' - ' + d.open_time_end_hour
								this.formData.man_squat = d.man_squat
								this.formData.woman_squat = d.woman_squat
							}
							console.log('formData:', this.formData)
						}
					})
				} else {
					uni.setNavigationBarTitle({ title: '新增设施' })
				}
			})
		}
	},

	methods: {
		// 类型选择
		typeChange(e) {
			// 重置值
			this.formData.collection_point_type = null
			this.formData.collection_point_type_name = ''
			this.formData.public_toilet_type = ''
			this.formData.public_toilet_type_name = ''
			this.formData.open_day = []
			// this.formData.img = []
			// this.formData.pic_url = []
			this.formData.open_day_name = ''
			this.formData.open_time_start_week = ''
			this.formData.open_time_end_week = ''
			this.formData.open_time = []
			this.formData.open_time_name = ''
			this.formData.open_time_start_hour = ''
			this.formData.open_time_end_hour = ''
			this.formData.man_squat = ''
			this.formData.woman_squat = ''
		},

		// 省市区选择器确定
		areaConfirm({ item, value }) {
			this.formData.area_id = value[2]
			this.formData.area_name = ''
			item.forEach(sitem => {
				this.formData.area_name = (this.formData.area_name || '') + sitem.area_name
			})
		},

		// 点击定位
		clickPosition() {
			let params = {
				success: e => {
					this.formData.address_details = e.address
					this.formData.location = e.longitude + ',' + e.latitude
				}
			}
			if (this.formData.location !== '') {
				this.formData.location
				params.latitude = this.formData.location.split(',')[1]
				params.longitude = this.formData.location.split(',')[0]
			}
			console.log('params:', params)
			uni.chooseLocation(params)
		},

		// 选择了收集点类型
		collectionTypeChange(e) {
			this.formData.collection_point_type_name = e.item.label
		},

		// 上传图片
		selectImg(e) {
			uni.uploadFile({
				url: this.$api.uploadFile(),
				filePath: e.tempFilePaths[0],
				name: 'pic',
				header: { 'content-type': 'multipart/form-data', token: uni.getStorageSync('token') },
				timeout: 10000,
				success: uploadFileRes => {
					e.tempFiles[0].pic_url = JSON.parse(uploadFileRes.data).data.pic_url
					this.formData.img.push(e.tempFiles[0])
					this.formData.pic_url = e.tempFiles[0].pic_url
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
			this.formData.pic_url = ''
		},

		// 公厕类型
		publicToiletTypeChange(e) {
			this.formData.public_toilet_type_name = e.item.label
		},

		// 公厕开放时间  周几
		weekChange(e) {
			if (e.value[0] > e.value[1]) {
				uni.showToast({
					icon: 'none',
					title: '结束时间必须大于开始时间'
				})
				this.formData.open_day = []
				this.formData.open_day_name = ''
				this.formData.open_time_start_week = ''
				this.formData.open_time_end_week = ''
			} else {
				this.formData.open_day_name = e.item[0].label + ' - ' + e.item[1].label
				this.formData.open_time_start_week = e.value[0]
				this.formData.open_time_end_week = e.value[1]
			}
		},

		// 公厕开放时间 小时分钟
		timeChange(e) {
			console.log('e:', e)
			if (+e.value[0] > +e.value[3]) {
				uni.showToast({
					icon: 'none',
					title: '结束时间必须大于开始时间'
				})
				this.formData.open_time = []
				this.formData.open_time_name = ''
				this.formData.open_time_start_hour = ''
				this.formData.open_time_end_hour = ''
			} else {
				this.formData.open_time_name = `${e.value[0]}:${e.value[1]} - ${e.value[3]}:${e.value[4]}`
				this.formData.open_time_start_hour = e.value[0] + ':' + e.value[1]
				this.formData.open_time_end_hour = e.value[3] + ':' + e.value[4]
			}
		},

		// 保存
		save: utils.throttle(function() {
			this.$refs.form.validate().then(() => {
				this.$api[this.pageType === 'add' ? 'addFacilities' : 'editFacilities'](this.formData)
					.then(res => {
						uni.showToast({
							icon: 'success',
							title: '提交成功'
						})
						setTimeout(function() {
							uni.redirectTo({ url: `./collection-gis` })
						}, 1000)
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err
						})
					})
			})
		})
	}
}
</script>

<style lang="scss">
#CollectionGisOperation {
	input {
		padding-left: 0px !important;
	}
	padding: 10px;
	background-color: #fff;
	.radio__inner {
		display: none;
	}
	.checklist-text {
		margin-left: 0px;
	}
	.bottom-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10px;
		.save-button {
			width: 80%;
			background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
			color: #fff;
		}
	}

	.position {
		width: 20px;
		height: 28px;
		right: 5px;
		top: 5px;
		position: absolute;
	}

	.address-box {
		width: 460rpx;
		display: inline-block;
		height: 36px;
		line-height: 36px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.icon-add {
		width: 30px;
		height: 3px;
	}
}
</style>
