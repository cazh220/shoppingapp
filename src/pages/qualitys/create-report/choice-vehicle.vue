<template>
	<view id="ChoiceVehicle">
		<view class="container">
			<view class="top">
				<text class="required-icon">*</text>
				<text>选择环卫车派遣事件</text>
			</view>
			<view class="top-search"><uni-search-bar v-model="name" @confirm="search" cancelButton="none" placeholder="请输入搜索名字"></uni-search-bar></view>
			<view class="list">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="item in dataList" :key="item.id">
						<view><radio :value="item.id" color="#7ccd1f" :checked="index === current" /></view>
						<view class="carNo">{{ item.license_plate_number }}</view>
						<view>{{ item.name }}</view>
						<view>{{ item.department_name }}</view>
					</label>
				</radio-group>
				<!-- <checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="item in dataList" :key="item.id">
						<view><checkbox :value="item.id" :checked="item.id" /></view>
						<view class="carNo">{{ item.license_plate_number }}</view>
						<view>{{ item.name }}</view>
						<view>{{ item.department_name }}</view>
					</label>
				</checkbox-group> -->
			</view>
		</view>

		<view class="bottom-button">
			<button class="save-button" :disabled="noVehicle" v-if="VehicleCallPhone" @click="callPhone">联系处理人</button>
			<button class="submit-button" :disabled="noVehicle" v-if="Dispatch" @click="submitForm">派遣</button>
		</view>
	</view>
</template>

<script>
import utils from '@/utils/utils'
export default {
	name: 'ChoiceVehicle',
	data() {
		return {
			name: '',
			current: 0,
			dataList: [],
			car: { width: '' },
			noVehicle: false
		}
	},
	onLoad(option) {
		this.formData = uni.getStorageSync('form_ket')
	},
	mounted() {
		this.search()
	},
	computed: {
		VehicleCallPhone() {
			return this.$com.getPermission('VehicleCallPhone')
		},
		Dispatch() {
			return this.$com.getPermission('Dispatch')
		}
	},
	methods: {
		search() {
			this.$api.getVehicle({ name: this.name }).then(res => {
				console.log('环卫车', res)
				if (res.data.length === 0) {
					this.noVehicle = true
					uni.showToast({
						icon: 'none',
						title: '附近暂无环卫车',
						duration: 2000
					})
				} else {
					this.noVehicle = false
					this.dataList = res.data
				}
			})
		},
		radioChange(e) {
			console.log(e, 'eee')
			for (let i = 0; i < this.dataList.length; i++) {
				if (this.dataList[i].id === +e.detail.value) {
					this.current = this.dataList[i].id
					break
				}
			}
		},
		handleMouseEnter() {
			this.car.width = auto
		},
		//联系处理人
		callPhone() {
			if (this.current) {
				this.dataList.forEach(item => {
					if (this.current === item.id) {
						this.formData.conductor_phone = item.phone
					}
				})
				uni.makePhoneCall({
					phoneNumber: this.formData.conductor_phone
				})
			} else {
				uni.showToast({
					icon: 'none',
					title: '请选择环卫车',
					duration: 2000
				})
			}
		},
		submitForm: utils.throttle(function() {
			if (this.current) {
				this.dataList.forEach(item => {
					if (this.current === item.id) {
						this.formData.conductor_id = item.id
						this.formData.conductor_name = item.name
						this.formData.conductor_phone = item.phone
					}
				})
				const data = {
					type: 2,
					address: this.formData.address || '',
					describe: this.formData.describe || '',
					pic_url: this.formData.pic_url || '',
					address_details: this.formData.address_details || '',
					event_level: this.formData.event_level || '',
					longitude: this.formData.longitude + '' || '',
					latitude: this.formData.latitude + '' || '',
					conductor_type: this.formData.conductor_type || '',
					conductor_id: this.formData.conductor_id || '',
					conductor_name: this.formData.conductor_name || '',
					conductor_phone: this.formData.conductor_phone || ''
				}
				this.$api
					.inspectReport(data)
					.then(res => {
						console.log('111', res.data)
						uni.navigateTo({
							url: './success-send'
						})
					})
					.catch(err => {
						console.log('inspectReport', err)
						uni.showToast({
							icon: 'none',
							title: err || '获取数据错误',
							duration: 2000
						})
					})
			} else {
				uni.showToast({
					icon: 'none',
					title: '请选择环卫车',
					duration: 2000
				})
			}
		})
	}
}
</script>

<style lang="scss">
#ChoiceVehicle {
	width: 100%;
	.container {
		margin: 20px 0;
		padding: 10px;
		background-color: rgba(255, 255, 255, 1);
	}
	.point {
		border-radius: 50%;
		height: 10px;
		background-color: rgba(233, 233, 233, 1);
		width: 10px;
		position: absolute;
		top: 5px;
		left: -20px;
	}
	.top {
		background-color: rgba(255, 255, 255, 1);
		margin-top: 10px;
		height: 50px;
		line-height: 50px;
	}
	.list {
		background-color: rgba(255, 255, 255, 1);
	}
	.list-item {
		margin: 20px 10px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
	}
	.left {
		display: flex;
		width: 80px;
		height: 21px;
		flex-flow: row;
		justify-content: space-around;
		position: relative;
	}
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
	.carNo {
		width: 160rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.submit-button {
		width: 48%;
		background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
		color: #fff;
	}
}
</style>
