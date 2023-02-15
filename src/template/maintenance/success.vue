<template>
	<view id="success">
		<view><image class="success-img" src="../../static/images/chenggong.png"></image></view>
		<text class="text">{{ text }}</text>
		<view class="buttons">
			<button v-if="back === 'list'" class="button-primary ml10 fs32r" @click="backList">返回列表</button>
			<button v-if="back === 'detail'" class="button-primary button ml10 fs32r" @click="backList">返回列表</button>
			<button v-if="back === 'detail'" class="button-primary button ml10 fs32r" @click="showDetail">查看详情</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			back: '',
			text: '维修申请保存成功!',
			id: 0,
			tabActive: 0,
			status: 0
		}
	},
	onLoad(options) {
		this.id = options.id
		this.back = options.back
		this.text = options.text
		this.tabActive = +options.tabActive
	},

	methods: {
		// 返回列表
		backList() {
			uni.reLaunch({ url: `./maintenance-record?tabActive=${this.tabActive}` })
		},

		// 查看详情
		showDetail() {
			uni.reLaunch({ url: `./maintenance-detail?id=${this.id}&open=${this.tabActive}` })
		}
	}
}
</script>

<style lang="scss">
#success {
	padding: 200rpx 0;
	text-align: center;
	.success-img {
		height: 60px;
		width: 60px;
	}
	.text {
		margin-top: 40rpx;
		display: inline-block;
		margin-bottom: 200rpx;
	}
	.buttons {
		padding: 100rpx 20rpx;
		.button {
			width: 46%;
			display: inline-block;
		}
	}
}
</style>
