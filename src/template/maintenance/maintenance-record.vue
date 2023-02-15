<template>
	<view id="MaintenanceRecord">
		<view class="header-flxed">
			<view><uni-search-bar @confirm="search" cancelButton="none" @clear="clearSearchValue" :focus="true" v-model="searchValue"></uni-search-bar></view>
			<view class="tabs"><liuyuno-tabs :tabData="statusList" :config="tabsConfig" :activeIndex="current" @tabClick="tabClick" /></view>
		</view>
		<view style="margin-top: 105px;">
			<xw-empty :isShow="orderEmptyShow" text="暂无相关订单数据" textColor="#777777"></xw-empty>
			<view class="list" v-for="(item, index) in list" :key="item.id">
				<uni-list :border="false">
					<uni-list-item :border="false" title="编号：" :rightText="item.serial_number"></uni-list-item>
					<uni-list-item :border="false" title="车牌号：" :rightText="item.license_plate_number"></uni-list-item>
					<uni-list-item :border="false" title="司机：" :rightText="item.driver_name"></uni-list-item>
					<uni-list-item :border="false" title="车辆所属部门：" :rightText="item.department_name"></uni-list-item>
					<uni-list-item :border="false" title="申请人：" :rightText="item.apply_wxsp_account_name"></uni-list-item>
					<uni-list-item :border="false" title="更新时间：" :rightText="item.update_time"></uni-list-item>
					<template slot="footer">
						<view v-if="current === 0" class="list-footer">
							<button v-if="CreatedShowDetail" size="mini" class="button-primary fr fs28r" @click="showDetail(item.id)">查看详情</button>
						</view>
						<view v-if="current === 1" class="list-footer">
							<button v-if="WaitQuotedRejectReason && item.is_reject" size="mini" class="button-primary fr ml10 fs28r" @click="showReject(item.reject_reason)">
								驳回原因
							</button>
							<button v-if="WaitQuotedOffer" size="mini" class="button-primary fr ml10 blue fs28r" @click="quoted(item.id)">报价</button>
						</view>
						<view v-if="current === 2" class="list-footer">
							<button v-if="WaitExamineSurvey && !item.survey_state" size="mini" class="button-primary fr ml10 fs28r" @click="process(item.id)">流转意见</button>
							<button v-if="WaitExamineApprove && item.process_state" size="mini" class="bu	tton-primary fr ml10 blue fs28r" @click="approve(item.id)">审批</button>
							<button v-if="WaitExamineToExamine && item.survey_state" size="mini" class="button-primary fr ml10 orange fs28r" @click="examine(item)">审核</button>
						</view>
						<view v-if="WaitRepairedUploadimgs && current === 3" class="list-footer">
							<button size="mini" class="button-primary fr ml10 fs28r" @click="repaired(item.id)">上传图片</button>
						</view>
						<view v-if="WaitConfirmedToConfirmed && current === 4" class="list-footer">
							<button size="mini" class="button-primary fr ml10 fs28r" @click="confirmed(item.id)">确认</button>
						</view>
						<view v-if="WaitFedbackToFedback && current === 5" class="list-footer">
							<button size="mini" class="button-primary fr ml10 fs28r" @click="fedback(item.id)">反馈</button>
						</view>
						<view v-if="OverShowDetail && current === 6" class="list-footer">
							<button size="mini" class="button-primary fr fs28r" @click="showDetail(item.id)">查看详情</button>
						</view>
					</template>
				</uni-list>
			</view>
		</view>
		<!-- 流转意见弹窗 -->
		<uni-popup ref="processPopup">
			<view class="process-steps"><ty-steps :options="processData" direction="column" active-color="#89D13F" :active="steps"></ty-steps></view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	name: 'MaintenanceRecord',
	data() {
		return {
			tabsConfig: {
				activeColor: '#77C81F'
			},
			orderEmptyShow: false,
			processEmptyShow: false,
			statusList: ['已创建', '待报价', '待审核', '待维修', '待确认', '待反馈', '已结束'],
			searchValue: '',
			current: 0,
			page: 1,
			last_page: 1,
			list: [],
			QSTabsWxsListHeight: 0,
			steps: 0, // 当前步骤
			state_text: '', // 审批状态
			processData: [] // 审批流列表
		}
	},

	onLoad(options) {
		// 如果是成功状态返回 需要显示到对应的标签页
		if (options.tabActive) {
			this.current = +options.tabActive
		}
		this.search()
	},

	onPullDownRefresh() {
		this.list = []
		this.page = 1
		this.search()
	},

	onReachBottom: function() {
		if (this.page < this.last_page) {
			this.page++
			this.search()
		} else {
			uni.showToast({
				icon: 'none',
				title: '已经到底了'
			})
		}
	},

	computed: {
		CreatedShowDetail() {
			return this.$com.getPermission('CreatedShowDetail')
		},
		WaitQuotedRejectReason() {
			return this.$com.getPermission('WaitQuotedRejectReason')
		},
		WaitQuotedOffer() {
			return this.$com.getPermission('WaitQuotedOffer')
		},
		WaitExamineSurvey() {
			return this.$com.getPermission('WaitExamineSurvey')
		},
		WaitExamineApprove() {
			return this.$com.getPermission('WaitExamineApprove')
		},
		WaitExamineToExamine() {
			return this.$com.getPermission('WaitExamineToExamine')
		},
		WaitRepairedUploadimgs() {
			return this.$com.getPermission('WaitRepairedUploadimgs')
		},
		WaitConfirmedToConfirmed() {
			return this.$com.getPermission('WaitConfirmedToConfirmed')
		},
		WaitFedbackToFedback() {
			return this.$com.getPermission('WaitFedbackToFedback')
		},
		OverShowDetail() {
			return this.$com.getPermission('OverShowDetail')
		}
	},

	methods: {
		// 搜索
		search() {
			this.$api.getApplyMaintenanceList({ apply_wxsp_account_name: this.searchValue, state: this.current + 1, page: this.page }).then(res => {
				this.list.push(...res.data.data)
				this.last_page = res.data.last_page
				this.orderEmptyShow = this.list.length === 0 ? true : false
			})
		},
		
		// 清空搜索
		clearSearchValue() {
			this.searchValue = ""
			this.search()
		},

		// 查看详情 流转意见
		showDetail(id) {
			uni.navigateTo({ url: `./maintenance-detail?id=${id}&open=${this.current}` })
		},

		// 选择标签
		tabClick(e) {
			this.current = e
			this.list = []
			this.search()
		},

		// 点击报价
		quoted(id) {
			uni.navigateTo({ url: `./maintenance-detail?id=${id}&open=1` })
		},

		// 查看驳回原因
		showReject(reject_reason) {
			uni.showModal({
				title: '驳回原因',
				content: reject_reason,
				showCancel: false
			})
		},

		// 点击审核
		examine(item) {
			uni.navigateTo({ url: `./maintenance-detail?id=${item.id}&survey_money=${item.survey_money}&open=2&type=examine` })
		},

		// 点击审批
		approve(id) {
			uni.navigateTo({ url: `./maintenance-detail?id=${id}&open=2.5&type=approve` })
		},

		// 流转意见
		process(id) {
			this.$api.getMaintenanceProcessList({ id }).then(res => {
				this.processData = res.data.list.map((item, index) => {
					//  赋值当前第几步骤
					if (item.state === 2) {
						this.steps = index
					}
					item.title = `${item.wxsp_account_name}（${item.state_text}）`
					item.desc = item.update_time ? `审核时间：${item.update_time}` : '暂未审批'
					item.info = item.remark ? `审核意见：${item.remark}` : ''
					return item
				})
				this.state_text = res.data.state_text
				this.$refs.processPopup.open('center')
			})
		},

		// 点击待维修--上传图片
		repaired(id) {
			uni.navigateTo({ url: `./maintenance-detail?id=${id}&open=3` })
		},

		// 点击确认
		confirmed(id) {
			uni.navigateTo({ url: `./maintenance-detail?id=${id}&open=4` })
		},

		// 点击反馈
		fedback(id) {
			uni.navigateTo({ url: `./maintenance-detail?id=${id}&open=5` })
		}
	}
}
</script>

<style lang="scss">
#MaintenanceRecord {
	.tabs {
		background-color: #fff;
	}
	.list {
		margin-bottom: 10px;
		.uni-list-item__container {
			padding: 10px 15px;
		}
		.list-footer {
			border-top: 1px solid #eee;
			overflow: auto;
			margin: 10px;
			padding: 10px 10px 0 10px;
		}
		.blue {
			color: #fff;
			background-color: #00c6ff;
		}
		.orange {
			color: #fff;
			background-color: #ff986a;
		}
	}
	.process-steps {
		background-color: #fff;
		min-height: 100px;
		padding: 20px;
		min-width: 350rpx;
	}
}
</style>
