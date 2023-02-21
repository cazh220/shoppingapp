<template>
	<view class="list">
		<uni-list>
		 	<uni-list-item v-for="item in goods" :key="item.id" :title="item.name" :note="item.stock" thumb="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
		 	 thumb-size="lg" :rightText="item.price"></uni-list-item>
		</uni-list>
	</view>
</template>
<script>
export default {
  data() {
    return {
      goods: []

    }
  },
  onLoad(option) {},
  onShow() {
	this.getGoods()
  },
  methods: {
	getGoods() {
		let data = {page:1, name: ""}
		this.$api.getGoodsList(data).then(
		res => {
			console.log(res)
			this.goods = res.data.list.map(item => {
				item.key = item.id
				item.stock = "库存："+item.num
				item.price = "价格：￥"+ item.price
				return item
			})
		},
		fail => {
			
		})
	},

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