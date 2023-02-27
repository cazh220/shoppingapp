<!-- 我的 -->
<template>
	<view class="container">
		<view class="bg">
			<view class="userinfo">
				<uni-row class="demo-uni-row" :width="nvueWidth">
					<uni-col :span="8">
						<view class="photos"><image class="image" mode="widthFix" :src="userimg" /></view>
					</uni-col>
					<uni-col :span="1"></uni-col>
					<uni-col :span="15">
						<view class="userdetail">
							<view class="name">{{ username }}</view>
							<view class="mobile">余额：￥{{ amount }}</view>
						</view>
					</uni-col>
				</uni-row>
			</view>
		</view>

		<view class="main">
			<view class="list">
				<uni-list :border="false">
					<uni-list-item thumb="https://image.jsyinghuan.com/huanweiwxsp/editpwdicon.png" thumb-size="sm" showArrow title="重置密码" clickable @click="resetPassword" />
					<uni-list-item thumb="https://image.jsyinghuan.com/huanweiwxsp/message.png" thumb-size="sm" showArrow title="我的订单" clickable @click="mineOrder" />
				</uni-list>
			</view>

			<view class="logout flex-between"><button @click="logout">退出登录</button></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			username: '火苗',
			amount: 0,
			phone: '',
			userimg: '../../static/images/avatar.png',
		}
	},
	onLoad() {
		let user = uni.getStorageSync('userInfo') || ""
		this.username = user.name || ''
		this.amount = user.amount || 0
		this.phone = user.phone || ''
		if (!user) {
			// 没有获取到登录态信息，跳转到登录界面
			uni.redirectTo({
				url: '../index/index'
			})
		}
		this.userDetail()
	},
	onShow() {
	},
	methods: {
		// 查询用户信息
		userDetail() {
			let that = this
			this.$api.userDetail({phone: this.phone}).then(
			res => {
				that.amount = res.data.money
			},
			fail => {
				
			})
		},
		// 重置密码
		resetPassword(e) {
			uni.navigateTo({
				url: '../index/editpassword?phone=' + this.phone
			})
		},
		// 查看消息
		// viewMessages(e) {
		// 	console.log('查看消息', e)
		// 	uni.navigateTo({
		// 		url: '../message/message'
		// 	})
		// },
		// 我的订单
		mineOrder() {
			uni.navigateTo({
				url: '../order/order'
				// url: '../order/order_list/order_list'
			})
		},
		// 退出
		logout() {
			// 销毁登录态storage
			uni.removeStorageSync('userInfo')
			uni.redirectTo({
				url: '../index/index'
			})
		}
	}
}
</script>

<style>
page {
	font-size: 28rpx;
	background: #ffffff;
}
.uni-badge {
	padding: 0;
}
.image {
	height: 120rpx;
	width: 120rpx;
}

.photos {
	height: 120rpx;
	width: 120rpx;
	border-radius: 60rpx;
	overflow: hidden;
}

.userdetail {
	text-align: right;
}

.name {
	font-size: 44rpx;
}

.mobile {
	font-size: 32rpx;
}

.main {
	padding: 0;
	position: relative;
	top: -140rpx;
	border-radius: 40rpx;
	height: 100%;
	z-index: 9999;
	background-color: #fff;
}

.list .uni-list-item {
	height: 120rpx;
}

.list {
	padding: 0 30rpx;
}

.userinfo {
	color: #ffffff;
	font-size: 48rpx;
	padding: 150rpx 30rpx;
	width: 100%;
}

.bg {
	min-height: 352rpx;
	background: #2d89fb;
	padding: 30rpx 30rpx 79rpx 40rpx;
	border-bottom-left-radius: 80rpx;
	border-bottom-right-radius: 80rpx;
	background: url('https://image.jsyinghuan.com/huanwei/login-bg.png');
	background-size: 100% 100%;
}

.logout {
	margin-top: 400rpx;
	/* width: 100%; */
}

button {
	border-radius: 45rpx;
	font-size: 32rpx;
	width: 90%;
	background-color: #ffffff;
	color: #666666;
	border: solid 1rpx #999999;
}

button::after {
	border: none;
}
</style>
