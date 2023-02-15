<template>
	<view id="CollectionWorkProgress">
		<map
			id="map"
			:scale="12"
			:max-scale="14"
			:latitude="latitude"
			:enable-poi="true"
			:show-location="true"
			:longitude="longitude"
			:markers="markers"
			:polyline="polyline"
			@tap="maptap"
			@markertap="clickMarker"
		></map>

		<view class="header">
			<view class="header-steps"><ty-steps :active="steps" :options="all_points" direction="column" active-color="#89D13F"></ty-steps></view>
			<view class="header-nums">
				<view class="">{{ all_points.length - 2 }}</view>
				<view class="">收集点</view>
			</view>
		</view>

		<view class="footer" v-if="infoShow">
			<view class="">车牌号: {{ job.license_plate_number }}</view>
			<view class="">作业名称: {{ job.job_name }}</view>
			<view class="">预计开始时间: {{ job.should_start_time }}</view>
			<view class="">预计结束时间: {{ job.should_end_time }}</view>
			<view class="">作业里程: {{ job.total_length }}</view>
			<view class="">状态: {{ job.state_text }}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			steps: 0,
			latitude: 32.026465,
			longitude: 120.875942,
			job: {
				license_plate_number: '',
				job_name: '',
				should_start_time: '',
				should_end_time: '',
				total_length: '',
				state_text: ''
			}, // 工作详情
			all_points: [], // 所有收集点
			polyline: [],
			markers: [], // 所有的设施
			infoShow: false // 信息展示
		}
	},

	onLoad(options) {
		this.getCollectionProcess(options.license_plate_number)
	},

	methods: {
		getCollectionProcess(license_plate_number) {
			this.$api.getCollectionProcess({ license_plate_number }).then(res => {
				console.log('res:', res)
				// 所有需要经过的收集点
				this.all_points = res.data.all_points.map((item, index) => {
					if (item.transportation_state === 1) {
						this.steps = index + 1
					}
					item.title = item.name
					return item
				})
				const start = res.data.all_points[0].transportation_state // 起点
				const end = res.data.all_points[res.data.all_points.length - 1].transportation_state // 终点
				this.all_points.unshift({ title: '起点', transportation_state: start })
				this.all_points.push({ title: '终点', transportation_state: end })

				// 作业单详情
				this.job = res.data.job

				// 地图所有设施点
				let markers = res.data.all_facilities.filter((item, index) => {
					item.longitude = item.location.split(',')[0]
					item.latitude = item.location.split(',')[1]
					if (item.longitude || item.latitude) {
						item.id = index
						item.width = 38
						item.height = 46
						item.iconPath = '../../../static/gis/' + item.type + '.png'
						item.imgUrl = item.pic_url ? this.$api.getUrl(item.pic_url) : '../../../static/gis/no.png'
						return item
					}
				})
				if (res.data.card_info.length > 0) {
					// 视图中心点经纬度
					this.longitude = +res.data.card_info[0].lon
					this.latitude = +res.data.card_info[0].lat

					// 作业轨迹路线
					this.polyline = [
						{
							points: res.data.card_info.map(item => {
								item.latitude = +item.lat
								item.longitude = +item.lon
								return item
							}),
							color: '#89D13F',
							width: 5,
							arrowLine: true,
							borderWidth: 0
						}
					]

					// 另外加入起点和终点和车辆
					let car_lon = 0
					let car_lat = 0
					res.data.all_points.find(item => {
						if (item.transportation_state === 1) {
							car_lon = item.location.split(',')[0]
							car_lat = item.location.split(',')[1]
						}
					})
					this.markers = [
						...markers,
						{
							longitude: +res.data.card_info[0].lon,
							latitude: +res.data.card_info[0].lat,
							id: 66668888,
							width: 24,
							height: 32,
							iconPath: '../../../static/gis/start.png'
						},
						{
							longitude: +res.data.card_info[res.data.card_info.length - 1].lon,
							latitude: +res.data.card_info[res.data.card_info.length - 1].lat,
							id: 88886666,
							width: 24,
							height: 32,
							iconPath: '../../../static/gis/end.png'
						},
						{
							longitude: car_lon,
							latitude: car_lat,
							id: 99999999,
							width: 50,
							height: 25,
							iconPath: '../../../static/gis/car.png'
						}
					]
				} else {
					this.markers = markers
					uni.showToast({
						icon: 'none',
						title: '暂无轨迹'
					})
				}

				console.log('this.markers:', this.markers)
			})
		},

		// 点击了地图
		maptap() {
			console.log('点击了地图:')
			this.infoShow = false
		},

		// 点击了图标
		clickMarker(e) {
			setTimeout(() => {
				if (e.markerId === 99999999) {
					this.infoShow = true
				} else {
					this.infoShow = false
				}
			}, 100)
		}
	}
}
</script>

<style lang="scss">
page {
	height: 100%;
}
#CollectionWorkProgress {
	height: 100%;
	.uni-steps__column-text {
		border: none;
	}
	#map {
		width: 750rpx;
		height: 100%;
	}
	.header {
		position: absolute;
		top: 0;
		height: 100px;
		padding: 10px;
		background-color: #fff;
		width: 100%;
		box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.2);
		display: flex;
		.header-steps {
			width: 50%;
			height: 100px;
			overflow-y: auto;
			padding-left: 22px;
		}
		.header-nums {
			width: 40%;
			display: flex;
			justify-content: space-around;
			flex-flow: column;
			align-items: center;
			font-size: 40rpx;
			padding: 20px 0;
			color: #79ca1e;
		}
	}

	.footer {
		position: absolute;
		bottom: 0;
		height: 160px;
		padding: 10px 20px;
		background-color: #fff;
		display: flex;
		flex-flow: column;
		font-size: 14px;
		justify-content: space-between;
		width: 100%;
	}
}
</style>
