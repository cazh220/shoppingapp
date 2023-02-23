<!-- 成功提示页面 -->
<template>
	<view class="container">
		<view class="bg">
			<view class="img">
				<image class="bg_img" src="../../static/images/chenggong.png"></image>
			</view>
			<view class="description">
				{{message}}
			</view>
		</view>
		<view class="main">
			<view class='form_list button flex-between'>
				<button type="primary" @click="returnHomePage">{{text}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message: "修改成功!",
				url: "../home/home",
				text: "返回首页",
				redirect: ""
			}
		},
		onLoad(option) {
			// 成功页面返回提示
			this.message = option.message || "修改成功!"
			this.redirect = option.redirect || ""
			if (this.redirect == "login") {
				this.url = "../index/index"
				this.text = "返回登录"
			} else {
				this.url = option.url || "../home/home"
			}
		},
		methods: {
			// 返回首页
			returnHomePage () {
				uni.reLaunch({
					url: this.url
				})
			}
		}
	}
</script>

<style>
	.container {
		font-size: 14px;
	}

	.bg {
		padding:150rpx 50rpx;
		text-align: center;
	}

	.bg_img {
		width: 150rpx;
		height: 150rpx;
	}


	.main {
		padding: 50rpx;
	}
	
	.description {
		margin: 50rpx auto;
		font-size: 16px;
		font-weight: bold;
	}
	
	.form_list {
		padding: 50rpx 0 20rpx;
	}
	
	.button button {
		background: #67B616;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 36rpx;
		width: 100%;
	}
	

</style>
