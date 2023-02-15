<!-- 维护油价 -->
<template>
	<view class="container">
		<view class="main">
			<view class="basic">
				<uni-list>
					<uni-list-item title="油价记录" link="redirectTo" @click="priceHistory" />
					<uni-list-item>
						<text slot="body" class="slot-box slot-text">日期：{{selectedDate}}</text>
						<!-- <template slot="footer">
							<uni-calendar ref="calendar" :insert="false" @confirm="confirmCalendar" />
							<image class="slot-image" src="../../../static/images/calendar.png" mode="widthFix"
								@click="openCalendar"></image>
						</template> -->
					</uni-list-item>
					<uni-list-item :title="'品类：'+oilTypeName" link="redirectTo" @click="selectOilType" />
				</uni-list>
			</view>

			<view class="list">
				<uni-list v-if="operation == 'list'">
					<!-- <uni-list-item title="油号(#)" rightText="价格(元/L)"/>
					<uni-list-item :title="item.title" :rightText="item.price" v-for="(item, index) in oillist"
						:key="index" /> -->
					<uni-list-item class="thead">
						<!-- <view slot="header" class="slot-box">
							油号(#)
						</view>
						<view slot="footer" class="slot-box">
							价格(元/L)
						</view> -->
						<view slot="body" class="slot-box">
							<view class="left-title">
								油号（#）
							</view>
							<view class="right-title">
								价格（元/L）
							</view>
						</view>
					</uni-list-item>
					<uni-list-item v-for="(item, index) in oillist" :key="index">
						<view slot="body" class="slot-box">
							<view class="left-title">
								{{item.number}}
							</view>
							<view class="right-content price-text">
								{{item.price}}
							</view>
						</view>
						<!-- <view slot="header" class="slot-box">
							{{item.title}}
						</view>
						<view slot="footer" class="slot-box">
							{{item.price}}
						</view> -->
					</uni-list-item>
				</uni-list>

				<uni-list v-else>
					<uni-list-item class="thead">
						<view slot="body" class="slot-box">
							<view class="left-title">
								油号（#）
							</view>
							<view class="right-title">
								价格（元/L）
							</view>
							<view class="operate-title">
								操作
							</view>
						</view>
					</uni-list-item>
					<uni-list-item v-for="(item, index) in oillist" :key="index">
						<view slot="body" class="slot-box">
							<view class="left-title">
								{{item.number}}
							</view>
							<view class="right-content">
								<input :disabled="item.disabled" class='price flex-long' :name="'price'+item.id"
									:data-key="index" type="digit" focus :value="item.price"
									@blur="onBlur" />
							</view>
							<view class="operate-content">
								<uni-icons class="icon" :type="editSrc" size="20" :color="color"
									@click="inputPrice(index, item.id)" />
								<uni-icons class="icon" :type="deleteSrc" size="20" :color="color"
									@click="delPrice(index, item.id)" />
							</view>
						</view>
						<!-- <view slot="header" class="slot-box">
							{{item.title}}
						</view>
						<view slot="body">
							<input :disabled="item.disabled" class='price flex-long' :name="'price'+item.id"
								:data-key="index" type="digit" focus :value="item.price+'(元/L)'" @input="onInput"
								@blur="onBlur" />
						</view>

						<template slot="footer">
							<uni-icons class="icon" :type="editSrc" size="20" :color="color"
								@click="inputPrice(index, item.id)" />
							<uni-icons class="icon" :type="deleteSrc" size="20" :color="color"
								@click="delPrice(index, item.id)" />
						</template> -->
					</uni-list-item>
				</uni-list>
			</view>

			<view class="addbtn" @click="addOilType" v-if="isAddBtn">
				<view class="addbtn_label">
					<uni-icons class="icon" :type="typeSrc" size="25" :color="color" />
					<view class="addtext">添加{{oilTypeName}}油价信息</view>
				</view>

			</view>
		</view>

		<view class="button_next" v-if="isShow == true">
			<button type="primary" @click="editPrice">编辑</button>
		</view>

		<view class="button_list" v-else-if="isEdit == true">
			<uni-row class="demo-uni-row" :width="nvueWidth">
				<uni-col :span="12">
					<button @click="cancel" style="background-color: #BCBCBC;">取消</button>
				</uni-col>
				<uni-col :span="12">
					<button @click="submit">确定</button>
				</uni-col>
			</uni-row>

		</view>
		
		<!-- 组件 -->
		<lb-picker ref="pickerOilType" :list="oilTypeList" v-model="oilTypeId" @confirm="confirmOilType" @cancel="cancelOilTypeShow"></lb-picker>
		<lb-picker ref="picker" :list="oilNumberList" v-model="cardNo" @confirm="confirmOilNumber" @cancel="cancelOilNumberShow"></lb-picker>
		<uni-popup ref="submitConfirm" type="dialog">
			<uni-popup-dialog type="warn" title="提示" content="每天只能编辑一次,确定要提交？" @confirm="submitDataConfirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="deleteConfirm" type="dialog">
			<uni-popup-dialog type="warn" title="提示" content="确定要删除本条数据？" @confirm="deleteInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from "../../../common/util.js"
	export default {
		data() {
			return {
				station_id: "",
				typeSrc: "plus",
				editSrc: "compose",
				deleteSrc: "trash",
				color: "#77C81F",
				isAddBtn: false,
				selectedDate: this.currentDate(),
				isShow: true,
				isEdit: false,
				operation: "list",
				oillist: [],
				allpriceList: [],
				gasoline: [], //汽油
				dieseloil: [], //柴油
				channel: "latest",
				oilNumberList: [],
				oilTypeId: 2, // 选中的油型大类id
				oilTypeName: "柴油",// 默认选中的油型名称
				oilTypeList: this.$com.oilTypeList(),
				formData: [],
				deleteIndex: ""
			}
		},
		onLoad(option) {
			this.channel = option.channel || ""  // 来源 latest 加油站进入获取最新油价;  detail 油价详情进入
			this.station_id = option.station_id || ""
			if (this.channel == "latest") {
				this.latestOilPrice()
			} else {
				// 查看详情channel:detail
				this.oilTypeId = option.type || ""
				this.selectedDate = option.priceDate || ""
				this.oilTypeName = (this.oilTypeId == 1) ? "汽油" : "柴油"
				this.isShow = false
				this.getOilDatePrice(this.selectedDate, this.oilTypeId)
			}
			this.getOilTypes()
		},
		methods: {
			// 获取最新油价
			latestOilPrice() {
				let data = {
					id: this.station_id || ""
				}
				this.$api.getLastestPrice(data).then( res => {
					this.allpriceList = res.data
					this.dieseloil = this.allpriceList["dieselOil"]
					this.gasoline =  this.allpriceList["gasoline"]
					this.oillist = (this.oilTypeId == 2) ? this.dieseloil : this.gasoline
			
					this.isShow = res.data.state == 1 ? true : false  //是否可以编辑油价 true 可以 false 否
				}, fail => {})
			},
			// 获取指定日期和油品的油价
			getOilDatePrice(date, type) {
				let data = {
					priceDate: date,
					type: type,
					id: this.station_id
				}
				this.$api.getPriceRecordDetail(data).then( res => {
					console.log(res)
					this.oillist = res.data
				}, fail => {})
			},
			// 油价记录
			priceHistory() {
				uni.navigateTo({
					url: "../pricehistory/pricehistory?station_id="+this.station_id
				})
			},
			// 打开日历插件
			openCalendar() {
				this.$refs.calendar.open();
			},
			// 选择日期
			confirmCalendar(e) {
				console.log(e)
				let date = e.fulldate
				this.selectedDate = date.substr(0, 4) + "/" + date.substr(5, 2) + "/" + date.substr(8, 2);
				console.log(this.selectedDate)
			},
			// 选择油品
			selectOilType() {
				this.$refs.pickerOilType.show()
			},
			// 选择油型大类
			confirmOilType(e) {
				this.oilTypeName = e.item.label || ""
				this.oilTypeId = e.value || ""
				// 获取对应的油号
				this.getOilTypes()
				// 如果是channel=detail切换油型调用每个品类的价格
				if (this.channel == "detail") {
					this.getOilDatePrice(this.selectedDate, this.oilTypeId)
				} else {
					// 获取油型对应的油价
					this.oillist = (this.oilTypeId == 2) ? this.dieseloil : this.gasoline
				}
				
			},
			// 取消油型选择弹窗
			cancelOilTypeShow() {
				this.$refs.pickerOilType.hide()
			},
			// 获取不同品类的油号
			getOilTypes() {
				let data = {
					type: this.oilTypeId
				}
				this.$api.getOilType(data).then( res => {
					this.oilNumberList = []
					res.data.map( item => {
						this.oilNumberList.push({
							label: item.number,
							value: item.id
						})
					})
					
				}, fail => {})
			},
			// 编辑维护油价
			editPrice() {
				this.operation = "edit"
				this.isAddBtn = true
				this.isShow = false
				this.isEdit = true
				this.getOilTypes()
			},
			// 添加新油型油价
			addOilType() {
				this.$refs.picker.show()
			},
			// 确认油号弹窗
			confirmOilNumber(e) {
				console.log("this.oillist",this.oillist)
				//判断该油品是否已添加
				let isAdd = false
				this.oillist.map((item, index) => {
					if (item.oilTypeId == e.value) {
						isAdd = true
					}
				})
				
				if (isAdd) {
					uni.showToast({
						icon: "none",
						title: e.item.label + "已存在"
					})
					return false
				}
				
				this.oillist.push({
					id: "", // 主键id
					oilTypeId: e.value, // 油品号id
					number: e.item.label,
					price: 0,
					disabled: false
				})
			},
			// 取消油号弹窗
			cancelOilNumberShow() {
				this.$refs.picker.hide()
			},
			// 输入价格操作
			inputPrice(index, id) {
				this.oillist[index]['disabled'] = false
			},
			// 删除油品价格框
			delPrice(index, id) {
				this.deleteIndex = index
				this.$refs.deleteConfirm.open()
				/*
				let that = this
				uni.showModal({
					content: '是否确认删除？',
					success: function(res) {
						if (res.confirm) {
							let i = 0
							let data = []
							that.oillist.map((item, key) => {
								if (index != key) {
									data[i] = item
									i++
								}
							})
							if (this.oilCat == "柴油") {
								that.oillist = that.dieseloil = data
							} else {
								that.oillist = that.gasoline = data
							}
							
						} else if (res.cancel) {}
					}
				});
				*/
			},
			// 删除价格输入框
			deleteInputConfirm(e) {
				let i = 0
				let data = []
				this.oillist.map((item, key) => {
					if (this.deleteIndex != key) {
						data[i] = item
						i++
					}
				})
				if (this.oilTypeId == 2) {
					this.oillist = this.dieseloil = data
				} else {
					this.oillist = this.gasoline = data
				}
			},
			// 获取修改的价格
			onBlur(e) {
				let value = e.detail.value || ""
				let key = e.currentTarget.dataset.key
				this.oillist[key]['price'] = value
				if (this.oilTypeId == 2) {
					this.dieseloil = this.oillist
				} else {
					this.gasoline = this.oillist
				}
				this.oillist[key]['disabled'] = true
			},
			// 取消
			cancel() {
				this.isAddBtn = false
				this.isShow = true
				this.isEdit = false
				this.operation = "list"
			},
			// 确定
			submit() {
				//  数据校验
				if (this.gasoline.length == 0 && this.dieseloil.length == 0) {
					uni.showToast({
						icon: "none",
						title: "至少编辑一种油品的价格"
					})
					return false
				}
				
				let data = []
				this.gasoline.map(item => {
					data.push({
						id: item.id || "",  // 油价主键id
						oilTypeId: item.oilTypeId || "",//油品型号number的id
						price: item.price
					})
				})
				
				this.dieseloil.map(item => {
					data.push({
						id: item.id || "", // 油价主键id
						oilTypeId: item.oilTypeId || "", //油品型号number的id
						price: item.price
					})
				})
				
				// 价格校验，最多两位小数
				if (this.validatePrice(this.gasoline) && this.validatePrice(this.dieseloil)) {
					// 校验成功再确认
					this.formData = data
					this.$refs.submitConfirm.open()
				}
			    
			},
			// 提交价格修改
			submitDataConfirm() {
				let formData = {
					oilStationId: this.station_id || "",
					data: this.formData
				}
				// console.log("formData", formData)
				
				this.$api.alterPrice(formData).then( res => {
					uni.showToast({
						icon: "none",
						title: "修改成功",
					})
										
					// 延时
					let that = this
					setTimeout(function() {
						uni.reLaunch({
							url: "../oilstation/oilstation?oilstationid="+that.station_id
						})
					}, 1000)
				}, fail => {
					uni.showToast({
						icon: "none",
						title: fail
					})
				})
			},
			// 油价小数位校验
			validatePrice(data = []) {
				let result = true
				data.map( item => {
					if (!util.validatePrice(item.price)) {
						uni.showToast({
							icon: "none",
							title: "'"+item.title+"'价格填写不正确"
						})
						result = false
					}
				})
				return result;
			},
			// 当天
			currentDate() {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth()+1;
				month = (month>0 && month <=9) ? "0"+month : month
				var day = now.getDate()
				day = (day>0 && day <=9) ? "0"+day : day
				var today = year+"-" + month + "-" + day;
				return today
			}
		}
	}
</script>

<style>
	.uni-list-item {
		height: 120rpx;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		width: 100%;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 30px;
		height: 30px;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}

	.list {
		margin-top: 20rpx;
	}

	.addbtn {
		margin-top: 20rpx;
		height: 90rpx;
		line-height: 90rpx;
		background-color: #FFFFFF;
		text-align: center;
		color: #77C81F;
	}

	.addtext {
		vertical-align: middle;
		height: 90rpx;
		line-height: 90rpx;
		float: left;
	}

	.icon {
		float: left;
		margin-right: 5rpx;
	}

	.addbtn_label {
		height: 40rpx;
		margin: 0 auto;
		width: 42%;
	}

	.button_next {
		position: fixed;
		left: 0;
		bottom: 40rpx;
		right: 0;
		z-index: 10;
		height: 90rpx;
		width: 90%;
		margin: 0 auto;
		font-size: 36rpx;
		border-radius: 40rpx;
		color: #fff;
		/* background: #7DCE20; */
		border-radius: 0;
		/* border-top: 1rpx solid #7DCE20; */
	}

	.button_next button {
		border-radius: 20rpx;
		background-color: #7DCE20;
	}

	.list input {
		/* padding-left: 170rpx; */
		width: 300rpx;
		color: #FF3D4A;
	}

	.list .uni-list-item__content-title {
		padding-left: 80rpx;
	}

	.list .uni-list-item__extra-text:not(:first-child) {
		color: #FF3D4A;
		font-size: 14px;
		padding-right: 40rpx;
	}

	/* .list .slot-box {
		width: 50rpx;
		padding-left: 80rpx;
	} */

	.button_list {
		position: fixed;
		left: 0;
		bottom: 40rpx;
		right: 0;
		z-index: 10;
	}

	.button_list button {
		width: 90%;
		background-color: #7DCE20;
		color: #FFFFFF;
	}
	
	.thead {
		font-weight: bold;
	}
	
	.left-title {
		width: 100%;
		text-align: center;
	}
	
	.right-title {
		width: 100%;
		text-align: center;
		border-left: solid 1rpx #E6E6E6;
	}
	
	.price-text {
		color: #FF3D4A;
	}
	
	.right-content {
		width: 100%;
		text-align: center;
	}
	
	.operate-title {
		width: 40%;
		text-align: center;
		border-left: solid 1rpx #E6E6E6;
	}
	
	.operate-content {
		width: 40%;
		text-align: center;
		padding-left: 40rpx;
	}
</style>
