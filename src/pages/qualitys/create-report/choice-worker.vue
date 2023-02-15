<template>
	<view id="ChoiceWorker">
		<view class="container">
			<view class="top">
				<text class="required-icon">*</text>
				<text>选择环卫工派遣事件</text>
			</view>
			<view class="top-search">
				<uni-search-bar v-model="name" @confirm="search" placeholder="请输入搜索环卫工" @input="input" class="box-search">
					<!-- <view slot="clearIcon" style="color: #999999" >X</view> -->
				</uni-search-bar>
			</view>
			<view class="list">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="item in dataList" :key="item.id">
						<view><radio :value="item.id" color="#7ccd1f" :checked="item.id === current" /></view>
						<view>{{ item.name }}</view>
						<view>{{ item.phone }}</view>
						<view>{{ item.department_name }}</view>
					</label>
				</radio-group>
				<!-- <uni-data-checkbox mode="list" selectedColor="#7ccd1f" selectedTextColor="#7ccd1f" v-model="conductor_id" :localdata="dataList" /> -->
				<!-- <checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="item in dataList" :key="item.id">
						<view><checkbox :value="item.id" :checked="item.id" /></view>
						<view>{{ item.name }}</view>
						<view>{{ item.phone }}</view>
						<view>{{ item.department_name }}</view>
					</label>
				</checkbox-group> -->
				<!-- </view> -->
			</view>
		</view>

		<view class="bottom-button">
			<button class="save-button" :disabled="noPersonnel" v-if="PersonCallPhone" @click="callPhone">联系处理人</button>
			<button class="submit-button" :disabled="noPersonnel" v-if="Dispatch" @click="submitForm">派遣</button>
		</view>
	</view>
</template>

<script>
import utils from '@/utils/utils'
export default {
	name: 'ChoiceWorker',
	data() {
		return {
			name: '',
			current: 0,
			dataList: [],
			noPersonnel: false
		}
	},
	onLoad(option) {
		this.formData = uni.getStorageSync('form_ket')
	},
	mounted() {
		this.search()
	},
	computed: {
		PersonCallPhone() {
			return this.$com.getPermission('PersonCallPhone')
		},
		Dispatch() {
			return this.$com.getPermission('Dispatch')
		}
	},
	methods: {
		search() {
			this.$api.getPersonnel({ name: this.name }).then(
				res => {
					console.log('环卫车工', res)
					if (res.data.length === 0) {
						this.noPersonnel = true
						uni.showToast({
							icon: 'none',
							title: '附近暂无环卫工',
							duration: 2000
						})
					} else {
						this.noPersonnel = false
						this.dataList = res.data.map(item => {
							// item.text = item.name + "  " + item.phone + "  " + item.department_name
							return item
						})
					}
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
		radioChange(e) {
			console.log(e, 'eee')
			for (let i = 0; i < this.dataList.length; i++) {
				if (this.dataList[i].id === +e.detail.value) {
					this.current = this.dataList[i].id
					break
				}
			}
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
					title: '请选择环卫工',
					duration: 2000
				})
			}
		},

		submitForm: utils.throttle(function() {
			//派遣
			console.log('派遣1',this.formData)
			if (this.current) {
				this.dataList.forEach(item => {
					if (this.current === item.id) {
						this.formData.conductor_id = item.id
						this.formData.conductor_name = item.name
						this.formData.conductor_phone = item.phone
					}
				})
				const data = {
					type: this.formData.type,
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
				this.$api
					.inspectReport(data)
					.then(
						res => {
							uni.navigateTo({
								url: './success-send'
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
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 2000
						})
					})
			} else {
				uni.showToast({
					icon: 'none',
					title: '请选择环卫工',
					duration: 2000
				})
			}
		})
	}
}
</script>

<style lang="scss">
#ChoiceWorker {
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
		left: 2px;
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
	.submit-button {
		width: 48%;
		background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
		color: #fff;
	}
}
</style>
