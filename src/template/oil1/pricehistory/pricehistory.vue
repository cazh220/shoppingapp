<!-- 油价历史纪录 -->
<template>
	<view class="container">
		<view class="list" v-if="list.length > 0">
			<uni-list>
				<uni-list-item showArrow :title="item.oil" :note="item.priceDate" rightText="价格"
					v-for="(item,index) in list" :key="index" clickable @click="viewPrice(item)"/>
			</uni-list>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		<view class="list" v-else>
			<xw-empty :isShow="true" text="暂无相关数据" textColor="#777777"></xw-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				station_id: "",
				list: [],
				page: 1,
				count: 0,
				total: 0,
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		onLoad(option) {
			this.station_id = option.station_id || ""
			this.priceList()
		},
		onUnload() {
			this.count = 0,
			this.list = [],
			this.loadMoreText = "加载更多",
			this.showLoadMore = false;
		},
		methods: {
			// 油价记录 
			priceList() {
				this.count += 15;
				let data = {
					id: this.station_id || "",
					pageSize: 15,
					pageNum: this.page
				}
				this.$api.getPriceRecord(data).then(res => {
					const list = res.data.data.map(item => {
						item.oil = (item.type == 1) ? "汽油" : "柴油"
						return item
					})
					this.total = res.data.total
					this.list = this.list.concat(list);
				}, fail => {})
			},
			// 下拉刷新
			onPullDownRefresh() {
				let that = this
				setTimeout(function() {
					that.count = 0
					that.page = 1
					that.list = []
					that.loadMoreText = "",
					that.priceList()
					uni.stopPullDownRefresh();
				}, 1000);
			},
			onReachBottom() {
				console.log("onReachBottom");
				if (this.count > this.total) {
					this.loadMoreText = "没有更多数据了!"
					return;
				}
				this.showLoadMore = true;
				setTimeout(() => {
					this.page++;
					this.priceList();
				}, 300);
			},
			// 查看油价
			viewPrice(data) {
				uni.reLaunch({
					url: "../oilprice/oilprice?channel=detail&type="+data.type+"&priceDate="+data.priceDate+"&station_id="+this.station_id
				})
			}
		}
	}
</script>

<style>

</style>
