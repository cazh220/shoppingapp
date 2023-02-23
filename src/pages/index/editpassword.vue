<!-- 修改密码 -->
<template>
	<view class="container">
		<view class="main">
			<view class="form_title">
				{{title}}
			</view>
			<form class="form" @submit="formSubmit">
				<view class='list user flex-between'>
					<image class='flex-auto icon' src='../../static/images/password-black.png' mode="aspectFit" />
					<input class='flex-long' name="password" :value="password" password="true" maxlength="11"
						placeholder-class="placeholder-style" placeholder='请输入新的密码'/>
				</view>
				<view class='list pwd flex-between'>
					<image class='flex-auto icon' src='../../static/images/password-black.png' mode="aspectFit" />
					<input class='flex-long' name="confirm_password" :value="confirm_password" password="true"
						placeholder-class="placeholder-style" placeholder='请再次输入新密码'/>
				</view>
				<view class='form_list button flex-between'>
					<button type="primary" form-type="submit">提交</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "修改密码",
				password: "",
				confirm_password: "",
				phone: ""
			}
		},
		onLoad(option) {
			this.phone = option.phone || ""
		},
		methods: {
			// 提交密码修改
			formSubmit(e) {
				// 校验密码是否一致且位数大于等于6位
				this.password = e.detail.value.password || ""
				this.confirm_password = e.detail.value.confirm_password || ""
				if (this.password.length < 6 || this.confirm_password.length < 6) {
					uni.showToast({
						title: "新密码至少6位",
						icon: "none",
						duration: 2000
					});
					return false
				}
				
				if (this.confirm_password != this.password) {
					uni.showToast({
						title: "确认密码不一致",
						icon: "none",
						duration: 2000
					});
					return false
				}
				
				let data = {
					phone: this.phone,
					password: this.password,
					confirm_password: this.confirm_password
				}
				this.$api.editPassword(data).then(res => {
					uni.navigateTo({
						url: "../success/success"
					})
				}, fail => {
					uni.showToast({
						title: "修改失败！",
						icon: "none",
						duration: 2000
					});
				})
				
			}
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
		font-size: 28rpx;
	}

	.bg {
		padding: 50rpx;
		text-align: center;
	}

	.bg_img {
		width: 150rpx;
		height: 150rpx;
	}

	.title {
		text-align: center;
		margin: 10rpx auto;
	}

	.main {
		padding: 50rpx;
	}
	
	.form .list .icon {
		width: 36rpx;
		height: 52rpx;
		display: inline-block;
	}

	.form_title {
		font-size: 40rpx;
		margin: 20rpx 0;
		font-weight: bold;
	}
	
	.list {
		border-bottom: 1rpx solid #DADADA;
		padding: 40rpx 0 20rpx;
	}
	
	.form_list {
		padding: 100rpx 0 20rpx;
	}
	
	.button button {
		background: #67B616;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 32rpx;
		width: 100%;
	}
	
	.main input {
		width: 100%;
		padding-left: 50rpx;
	}

</style>
