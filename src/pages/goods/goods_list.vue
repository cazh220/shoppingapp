<template>
	<view class="list">
		<uni-list>
			<uni-list-item v-for="item in goods" :key="item.id" :title="item.name" :note="item.stock"
				thumb="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" thumb-size="lg"
				:rightText="item.price" clickable @click="goodsDetail(item.id)"></uni-list-item>
		</uni-list>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				goods: [],
				page: 1,
				last_page: 1
			}
		},
		onLoad(option) {},
		onShow() {
			this.getGoods()
		},
		onPullDownRefresh() {
			this.goods = []
			this.page = 1
			this.getGoods()
		},

		onReachBottom: function() {
			if (this.page < this.last_page) {
				this.page++
				this.getGoods()
			} else {
				uni.showToast({
					icon: 'none',
					title: '已经到底了'
				})
			}
		},
		methods: {
			getGoods() {
				let data = {
					page: this.page,
					name: "",
					state: 1
				}
				this.$api.getGoodsList(data).then(
					res => {
						console.log(res)
						let goods = res.data.list.map(item => {
							item.key = item.id
							item.stock = "库存：" + item.num
							item.price = "价格：￥" + item.price
							return item
						})
						this.goods.push(...goods)

						this.last_page = res.data.pages
					},
					fail => {

					})
			},
			
			goodsDetail(id) {
				uni.navigateTo({
					url: "../goods/goods_detail?id=" + id
				})
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
		font-size: 28rpx;
	}

	.list {
		margin-top: 40rpx;
	}
</style>
