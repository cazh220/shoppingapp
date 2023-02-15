<template>
	<view id="CollectionGisList">
		<view class="header-flxed">
			<view class="tabs"><liuyuno-tabs :tabData="statusList" :config="tabsConfig" :activeIndex="current" @tabClick="tabClick" /></view>
		</view>

		<view class="list">
			<xw-empty :isShow="orderEmptyShow" text="暂无相关环卫设施" textColor="#777777"></xw-empty>
			<view class="list-item" v-for="(item, index) in list" :key="index">
				<image :src="item.imgUrl" class="list-item-left"></image>
				<view class="list-item-right">
					<view class="fs30r list-item-right-type">
						<text>环卫设施: {{ item.type_name }}</text>
						<text class="list-item-right-edit-button" @click="edit(item)">编辑设施</text>
					</view>
					<text class="fs30r">设施名称: {{ item.name }}</text>
					<view class="fs30r list-item-right-position" @click="navigation(item)">
						<view>
							<image class="list-item-right-icon" src="../../../static/gis/position.png"></image>
							<text class="list-item-right-text">{{ item.area }}</text>
						</view>
						<uni-icons type="arrowright" color="#767676" class="vab" size="28r"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<!-- 悬浮按钮 -->
		<drag-button :itemMenu="CollectionGISAdd ? [listBut, addBut] : [listBut]" @menuClick="menuClick"></drag-button>
	</view>
</template>

<script>
export default {
	name: 'CollectionGisList',
	data() {
		return {
			tabsConfig: { activeColor: '#77C81F' },
			current: 0,
			statusList: ['全部', '河道', '垃圾收集点', '垃圾中转站', '作业所', '加水站', '垃圾处置场', '公厕', '维修厂', '加油站'],
			page: 1,
			last_page: 1,
			orderEmptyShow: false,
			list: [],
			addBut: require('@/static/gis/add.png'),
			listBut: require('@/static/gis/map.png'),
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
		this.getCollectionGISList()
	},

	onPullDownRefresh() {
		this.list = []
		this.page = 1
		this.getCollectionGISList()
	},

	onReachBottom: function() {
		if (this.page < this.last_page) {
			this.page++
			this.getCollectionGISList()
		} else {
			uni.showToast({
				icon: 'none',
				title: '已经到底了'
			})
		}
	},
	methods: {
		// 获取GIS数据
		getCollectionGISList() {
			let data = { type: this.current, page: this.page }
			this.$api.getCollectionGISList(data).then(res => {
				console.log('res:', res)
				this.list.push(
					...res.data.data.map(item => {
						item.imgUrl = item.pic_url ? this.$api.getUrl(item.pic_url) : '../../../static/gis/no.png'
						return item
					})
				)
				this.last_page = res.data.last_page
				this.orderEmptyShow = this.list.length === 0 ? true : false
			})
		},

		// 选择标签
		tabClick(e) {
			this.current = e
			this.list = []
			this.page = 1
			this.getCollectionGISList()
		},

		// 点击了悬浮按钮子按钮
		menuClick(index) {
			if (index === 0) {
				uni.redirectTo({ url: './collection-gis' })
			}
			if (index === 1) {
				uni.redirectTo({ url: './collection-gis-operation?pageType=add' })
			}
		},

		// 编辑点位
		edit(e) {
			uni.redirectTo({ url: './collection-gis-operation?pageType=edit&serial_number=' + e.serial_number + '&type=' + e.type })
		},

		// 导航
		navigation(item) {
			console.log('item:', item)
			item.longitude = item.location.split(',')[0]
			item.latitude = item.location.split(',')[1]
			if (item.longitude || item.latitude) {
				uni.openLocation({
					longitude: +item.longitude,
					latitude: +item.latitude,
					name: item.name,
					address: item.area
				})
			} else {
				uni.showToast({
					icon: 'none',
					title: '当前设施暂无定位'
				})
			}
		}
	}
}
</script>

<style lang="scss">
page {
	height: 100%;
	background-color: #fff;
}
#CollectionGisList {
	.header-flxed {
		border: none;
		.tabs {
			box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.1);
		}
	}
	.list {
		padding: 50px 20px 20px 20px;
		.list-item {
			padding: 15px 0;
			border-bottom: 1px solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.list-item-left {
				width: 160rpx;
				height: 160rpx;
			}
			.list-item-right {
				width: 480rpx;
				height: 160rpx;
				display: flex;
				flex-flow: column;
				justify-content: space-between;
				.list-item-right-type {
					display: flex;
					justify-content: space-between;
					.list-item-right-edit-button {
						border: 1px solid #7bcc1f;
						padding: 1px 10px;
						border-radius: 12px;
						font-size: 26rpx;
						color: #7bcc1f;
					}
				}
				.list-item-right-position {
					color: #767676;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.list-item-right-icon {
						width: 26rpx;
						height: 34rpx;
						vertical-align: middle;
						margin-right: 5px;
					}
					.list-item-right-text {
						vertical-align: middle;
						font-size: 28rpx;
						max-width: 400rpx;
						max-height: 20px;
						display: inline-block;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
}
</style>
