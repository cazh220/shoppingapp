<template>
	<view id="SuccessSend">
		<view class="">
			<image src="../../../static/images/chenggong.png" class="login_pic"></image>
			<view class="success_title"><text>派遣成功</text></view>
		</view>
		<view><button class="back" @click="backHome">回到首页</button></view>
	</view>
</template>

<script>
export default {
	name: 'SuccessSend',
	data() {
		return {};
	},
	methods: {
		//回到首页
		backHome() {
			console.log('回到首页')
			uni.switchTab({
				url:'../../home/home',
				success: res => {},fail: (error) => {
					console.log(error)
				},complete: () => {}
			});
		}
	}
};
</script>

<style lang="scss">
#SuccessSend {
	.login_pic {
		position: relative;
		height: 100rpx;
		width: 100rpx;
		margin: 200rpx 330rpx;
	}
	.success_title {
		position: absolute;
		top: 330rpx;
		right: 300rpx;
		font-size: 20px;
		font-weight: 600;
	}
	.back {
		margin: 20px;
		border-radius: 5px;
		height: 90rpx;
		background-color: rgba(125, 206, 32, 1);
		color: rgba(255, 255, 255, 1);
		font-size: 36rpx;
	}
}
</style>
