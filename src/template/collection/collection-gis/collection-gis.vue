<template>
	<view id="CollectionGis">
		<map
			id="map"
			:scale="12"
			:max-scale="14"
			:latitude="latitude"
			:enable-poi="true"
			:show-location="true"
			:longitude="longitude"
			:markers="markers"
			@markertap="markertap"
			@tap="maptap"
		></map>

		<!-- 下方详情 -->
		<cover-view v-if="detail.type_name !== ''" class="action">
			<cover-view class="action-top">
				<cover-image class="action-top-left-img" :src="detail.imgUrl"></cover-image>
				<cover-view class="action-top-info">
					<cover-view class="">
						<cover-view class="action-top-field dib">设施类型:</cover-view>
						<cover-view class="action-top-value dib">{{ detail.type_name }}</cover-view>
					</cover-view>
					<cover-view class="">
						<cover-view class="action-top-field dib">设施名称:</cover-view>
						<cover-view class="action-top-value dib">{{ detail.name }}</cover-view>
					</cover-view>
					<cover-view class="">
						<cover-view class="action-top-field dib">设施地址:</cover-view>
						<cover-view class="action-top-value dib">{{ detail.area }}</cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
			<cover-view class="action-bottom">
				<button class="button-primary button ml10 fs32r" @click="edit">编辑点位</button>
				<button class="button-primary button ml10 fs32r" @click="navigation">导航</button>
			</cover-view>
		</cover-view>

		<!-- 悬浮按钮 -->
		<drag-button :itemMenu="CollectionGISAdd ? [listBut, addBut] : [listBut]" @menuClick="menuClick"></drag-button>
	</view>
</template>

<script>
export default {
	name: 'CollectionGis',
	data() {
		return {
			// id: 0, // 使用 marker点击事件 需要填写id
			latitude: 32.026465,
			longitude: 120.875942,
			markers: [],
			addBut: require('@/static/gis/add.png'),
			listBut: require('@/static/gis/list.png'),
			detail: {
				type_name: '',
				name: '',
				area: '',
				imgUrl: ''
			}
		}
	},
	computed: {
		CollectionGISAdd() {
			return this.$com.getPermission('CollectionGISAdd')
		}
	},
	created() {
		this.getCollectionGISData()
	},

	methods: {
		// 获取GIS数据
		getCollectionGISData() {
			this.$api.getCollectionGISData().then(res => {
				this.longitude = res.data[0].location.split(',')[0]
				this.latitude = res.data[0].location.split(',')[1]
				this.markers = res.data.filter((item, index) => {
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
			})
		},

		// 点击了点标记
		markertap(e) {
			setTimeout(() => {
				this.markers.forEach(item => {
					if (item.id === e.markerId) {
						this.detail = item
					}
				})
			}, 100)
		},

		// 点击了悬浮按钮子按钮
		menuClick(index) {
			if (index === 0) {
				uni.redirectTo({ url: './collection-gis-list' })
			}
			if (index === 1) {
				uni.redirectTo({ url: './collection-gis-operation?pageType=add' })
			}
		},

		// 点击了地图
		maptap() {
			this.detail = {
				type_name: '',
				name: '',
				area: '',
				imgUrl: ''
			}
		},

		// 编辑点位
		edit() {
			uni.redirectTo({ url: './collection-gis-operation?pageType=edit&serial_number=' + this.detail.serial_number + '&type=' + this.detail.type })
		},

		// 导航
		navigation() {
			uni.openLocation({
				longitude: +this.detail.longitude,
				latitude: +this.detail.latitude,
				name: this.detail.name,
				address: this.detail.area
			})
		}
	}
}
</script>

<style lang="scss">
page {
	height: 100%;
}
#CollectionGis {
	height: 100%;
	#map {
		width: 750rpx;
		height: 100%;
	}
	.action {
		position: absolute;
		bottom: 0;
		background-color: #fff;
		height: 180px;
		width: 750rpx;
		display: flex;
		flex-flow: column;
		.action-top {
			height: 120px;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.action-top-left-img {
				width: 150rpx;
				height: 150rpx;
				border-radius: 10px;
			}
			.action-top-info {
				font-size: 26rpx;
				display: flex;
				flex-flow: column;
				height: 150rpx;
				width: 500rpx;
				justify-content: space-around;
			}
			.action-top-field {
				color: #666666;
				margin-right: 8px;
			}
		}
		.action-bottom {
			padding: 0 20rpx;
			.button {
				width: 46%;
				display: inline-block;
			}
		}
	}
}
</style>
