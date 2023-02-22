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
							<view class="mobile">{{ phone }}</view>
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
					<!-- <uni-list-item
						v-if="MessagesModuleShow"
						class="ulist"
						:border="true"
						thumb="https://image.jsyinghuan.com/huanweiwxsp/message.png"
						thumb-size="sm"
						:show-badge="badge"
						:badge-text="msgNums"
						showArrow
						title="消息列表"
						clickable
						badgeType="error"
						@click="viewMessages"
					/> -->
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
			// resetPwdIcon: {
			// 	color: '#4cd964',
			// 	size: '24',
			// 	type: 'locked-filled'
			// },
			// infoIcon: {
			// 	color: '#4cd964',
			// 	size: '24',
			// 	type: 'chat-filled'
			// },
			username: '火苗',
			phone: '13000000000',
			userimg: '../../static/images/avatar.png',
			msgNums: 0, // 消息数量
			badge: true
		}
	},
	computed: {
		MessagesModuleShow() {
			return this.$com.getPermission('MessagesModuleShow')
		}
	},
	onLoad() {
		let user = uni.getStorageSync('login_user') || {}
		this.username = user.name || ''
		this.phone = user.account || ''
		if (!user) {
			// 没有获取到登录态信息，跳转到登录界面
			uni.redirectTo({
				url: '../index/index'
			})
		}
	},
	onShow() {
		this.$api.getUnreadMessage().then(res => {
			this.msgNums = res.data || 0
		})
	},
	methods: {
		// 重置密码
		resetPassword(e) {
			uni.navigateTo({
				url: '../password/editpwd?phone=' + this.phone
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
				url: '../order/order_list/order_list'
			})
		},
		// 退出
		logout() {
			// 销毁登录态storage
			uni.removeStorageSync('token')
			uni.removeStorageSync('login_user')
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
