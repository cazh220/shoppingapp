<template>
	<view id="NearbySanitationWorkers">
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map style="width: 100%; height: 1445rpx" :latitude="latitude" :longitude="longitude" @markertap="showPopup" :markers="covers"></map>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<!-- data.type===1 人 2 车 -->
			<view style="background: #fff">
				<uni-list :border="false" v-if="data.type === 1">
					<uni-list-item :border="false" title="姓名" :rightText="data.name"></uni-list-item>
					<uni-list-item :border="false" title="部门" :rightText="data.department_name"></uni-list-item>
					<uni-list-item :border="false" title="角色" :rightText="data.role_name"></uni-list-item>
					<uni-list-item :border="false" title="联系电话" :rightText="data.phone"></uni-list-item>
				</uni-list>
				<uni-list :border="false" v-if="data.type === 2">
					<uni-list-item :border="false" title="司机" :rightText="data.name"></uni-list-item>
					<uni-list-item :border="false" title="部门" :rightText="data.department_name"></uni-list-item>
					<uni-list-item :border="false" title="车牌号" :rightText="data.license_plate_number"></uni-list-item>
					<uni-list-item :border="false" title="联系电话" :rightText="data.phone"></uni-list-item>
				</uni-list>
				<view class="bottom-button">
					<button class="save-button" v-if="PersonorVehicleCallPhone" @click="callPhone">联系处理人</button>
					<button class="submit-button" v-if="Dispatch" @click="submitForm">派遣</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import utils from '@/utils/utils'
export default {
	name: 'NearbySanitationWorkers',
	data() {
		return {
			id: 0, // 使用 marker点击事件 需要填写id
			title: 'map',
			data: {},
			// type: 0,
			formData: {},
			latitude: '',
			longitude: '',
			covers: []
		}
	},

	onLoad(option) {
		console.log('option', option)
		this.latitude = option.lat
		this.longitude = option.lon
		console.log('this.latitude', this.latitude)
		console.log('this.longitude', this.longitude)
		console.log('this.formData22', this.formData)
		this.formData = uni.getStorageSync('form_ket')
		const data = {
			lon: this.longitude,
			lat: this.latitude
			// lon: '120.446746',
			// lat: '32.582945'
		}
		this.$api.getPersonnelorVehicle(data).then(
			res => {
				console.log('人和车111', res.data)
				if (res.data.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '附近暂无环卫人员及车辆',
						duration: 2000
					})
				}
				res.data.forEach(item => {
					this.formData.conductor_type = item.type
					this.formData.conductor_id = item.id
					this.formData.conductor_name = item.name
					this.formData.conductor_phone = item.phone

					if (item.type === 1) {
						item.latitude = item.lat
						item.longitude = item.lon
						item.iconPath = '../../../static/images/work_map_person.png'
						item.width = '100rpx'
						item.height = '100rpx'
					} else if (item.type === 2) {
						item.latitude = item.lat
						item.longitude = item.lon
						item.iconPath = '../../../static/images/work_map_car.png'
						item.width = '100rpx'
						item.height = '100rpx'
					}
					this.covers.push(item)
				})
			},

			fail => {
				uni.showToast({
					title: fail || '获取数据错误',
					icon: 'none',
					duration: 2000
				})
			}
		)
	},
	computed: {
		PersonorVehicleCallPhone() {
			return this.$com.getPermission('PersonorVehicleCallPhone')
		},
		Dispatch() {
			return this.$com.getPermission('Dispatch')
		}
	},
	methods: {
		showPopup(e) {
			this.covers.forEach(item => {
				if (item.id === e.markerId) {
					this.data = item
					// console.log(this.type, 'this.type');
				}
			})
			this.$refs.popup.open('bottom')
		},
		closePopup() {
			this.$refs.popup.close('bottom')
		},
		//联系处理人
		callPhone() {
			uni.makePhoneCall({
				phoneNumber: this.data.phone
			})
		},
		//派遣
		submitForm: utils.throttle(function() {
			console.log('派遣')
			const data = {
				type: this.formData.type || '',
				address: this.formData.address || '',
				describe: this.formData.describe || '',
				pic_url: this.formData.pic_url || '',
				event_level: this.formData.event_level || '',
				address_details: this.formData.address_details || '',
				longitude: this.formData.longitude + '' || '',
				latitude: this.formData.latitude + '' || '',
				conductor_type: this.formData.conductor_type || '',
				conductor_id: this.formData.conductor_id || '',
				conductor_name: this.formData.conductor_name || '',
				conductor_phone: this.formData.conductor_phone || ''
			}
			this.$api.inspectReport(data).then(
				res => {
					console.log('inspectReport', res)
				},
				fail => {
					uni.showToast({
						title: fail || '获取数据错误',
						icon: 'none',
						duration: 2000
					})
				}
			)
			uni.navigateTo({
				url: './success-send'
			})
		})
	}
}
</script>

<style lang="scss">
#NearbySanitationWorkers {
	position: relative;
	.bottom-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
	}
	.save-button {
		width: 48%;
		background-color: #bcbcbc;
		color: #fff;
	}
	.submit-button {
		width: 48%;
		background-color: #7dce20;
		background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
		color: #fff;
	}
}
</style>
