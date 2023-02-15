<!-- 油卡管理 -->
<template>
	<view class="container">
		<view class="main">
			<uni-card :is-shadow="true" note="true" v-for="(item, index) in cards" :key="index" :class="item.row">
				<view class="content">
					<view class="title">
						<image class="cardImg" :src="item.cardSrc"></image><text class="title-txt">{{item.title}}</text>
					</view>
					<view class="cardno">
						<uni-row class="">
							<uni-col :span="6" v-for="(items, indexs) in item.cardNoArr" :key="indexs">
								<view class="cardno-txt">{{items}}</view>
							</uni-col>
						</uni-row>
					</view>
				</view>
				<block slot="footer">
					<view class="footer-box">
						<uni-row class="menu">
							<uni-col :span="12">
								<view class="menu-txt charge" @click="charge(item.cardNo, item.id, item.type)">油卡充值
								</view>
							</uni-col>
							<uni-col :span="12">
								<view class="menu-txt" @click="chargeRecord(item.cardNo, item.id)">油卡交易记录</view>
							</uni-col>
						</uni-row>
					</view>
				</block>
			</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cards: [],
				color: "#09BB07"
			}
		},
		onLoad() {
			this.cardList()
		},
		methods: {
			cardList() {
				let data = {}
				this.$api.getAllCards(data).then(res => {
					res.data.map((item, index) => {
						if (item.type == 1) {
							// 主卡
							this.cards.push({
								id: item.id,
								cardSrc: "../../../static/images/card1.png",
								title: "主卡",
								cardNo: item.number,
								type: item.type,
								cardNoArr: this.splitStringFourArr(item.number),
								row: "odd"
							})
						} else {
							// 副卡
							this.cards.push({
								id: item.id,
								cardSrc: "../../../static/images/card2.png",
								title: "副卡",
								cardNo: item.number,
								type: item.type,
								cardNoArr: this.splitStringFourArr(item.number),
								row: "even"
							})
						}
					})

				}, fail => {})
			},
			// 充值
			charge(card_no, id, type) {
				// if (type != 1) {
				// 	uni.showToast({
				// 		icon: "none",
				// 		title: "副卡不能充值"
				// 	})
				// 	return false
				// }
				uni.navigateTo({
					url: "./charge?card_no=" + card_no + "&card_id=" + id
				})
			},
			// 充值记录
			chargeRecord(card_no, id) {
				uni.navigateTo({
					url: "./chargerecords?card_no=" + card_no + "&card_id=" + id
				})
			},
			// 分割字符串为4块
			splitStringFourArr(str) {
				let strLength = str.length
				let num = Math.ceil(strLength / 4)
				let arr = []
				for (var i = 0; i < num; i++) {
					arr.push(str.substring(i * 4, (i + 1) * 4));
				}
				return arr
			}
		},
	}
</script>

<style>
	.title {
		height: 80rpx;
		line-height: 80rpx;
	}

	.cardImg {
		width: 50rpx;
		height: 50rpx;
	}

	.title-txt {
		vertical-align: super;
		padding-left: 10rpx;
		color: #FFFFFF;
	}

	.cardno {
		height: 80rpx;
		padding-left: 60rpx;
	}

	.cardno-txt {
		color: #FFFFFF;
	}

	.odd .uni-card {
		background-image: url("https://image.jsyinghuan.com/huanweiwxsp/card-blue-bg.png");
		background-size: 100% 100%;
	}

	.even .uni-card {
		background: url("https://image.jsyinghuan.com/huanweiwxsp/card-red-bg.png");
		background-size: 100% 100%;
	}

	.odd .uni-card__footer {
		background: rgba(118, 191, 247, 0.8);
		color: #FFFFFF;
	}

	.even .uni-card__footer {
		background: rgba(253, 112, 115, 0.7);
		color: #FFFFFF;
	}

	.menu-txt {
		text-align: center;
	}

	.charge {
		border-right: solid 1rpx #FFFFFF;
	}
</style>
