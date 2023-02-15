<template>
	<view id="EventDetail">
		<uni-collapse accordion>
			<uni-collapse-item name="0" title="事件上报信息" :open="open" @click="openCollapse">
				<uni-list :border="false">
					<uni-list-item :border="false" title="事件编号:" :rightText="data.serial_number"></uni-list-item>
					<uni-list-item :border="false" title="上报人:" :rightText="data.report_name"></uni-list-item>
					<uni-list-item :border="false" title="上报时间:" :rightText="data.report_name"></uni-list-item>
					<uni-list-item :border="false" title="事件级别:" :rightText="data.event_level_name"></uni-list-item>
					<uni-list-item :border="false" title="事件类型:" :rightText="data.type_text"></uni-list-item>
					<uni-list-item :border="false" title="事件描述:" :rightText="data.describe"></uni-list-item>
					<uni-list-item :border="false" title="上报图片:">
						<template slot="footer">
							<image v-for="(item, index) in data.pic_url" :key="index" :src="$api.getUrl(item)" style="width: 50px;height: 50px;margin-left:5px;" alt="暂无图片" />
						</template>
					</uni-list-item>
					<uni-list-item :border="false" title="时间地址:" :rightText="data.address"></uni-list-item>
					<uni-list-item :border="false" title="处理人:" :rightText="data.conductor_name"></uni-list-item>
				</uni-list>
			</uni-collapse-item>
			<view v-for="(item, index) in infoData" :key="item.id">
				<uni-collapse-item name="1" title="事件处理信息" :open="open" @click="openCollapse">
					<uni-list :border="false">
						<uni-list-item :border="false" title="处理时间:" :rightText="item.dispose_time"></uni-list-item>
						<uni-list-item :border="false" title="处理图片:" :rightText="item.dispose_img">
							<template slot="footer">
								<image
									v-for="(iitem, index) in item.dispose_img"
									:key="index"
									:src="$api.getUrl(iitem)"
									style="width: 50px;height: 50px;margin-left:5px;"
									alt="暂无图片"
								/>
							</template>
						</uni-list-item>
					</uni-list>
				</uni-collapse-item>
				<uni-collapse-item name="2" title="审查信息" :open="infoData.length === index + 1" @click="openCollapse">
					<uni-list :border="false">
						<uni-list-item :border="false" title="是否合格:" :rightText="item.is_qualified_name"></uni-list-item>
						<uni-list-item :border="false" title="评价:">
							<template slot="footer">
								<uni-rate :value="item.evaluate"  />
							</template>
						</uni-list-item>
						<uni-list-item :border="false" title="考核标准:" :rightText="item.assess_name"></uni-list-item>
						<uni-list-item :border="false" title="审查人:" :rightText="item.investigate_name"></uni-list-item>
						<uni-list-item :border="false" title="审查时间:" :rightText="item.investigate_time"></uni-list-item>
					</uni-list>
				</uni-collapse-item>
			</view>
		</uni-collapse>
	</view>
</template>

<script>
export default {
	name: 'EventDetail',
	data() {
		return {
			status: 0,
			open: false,
			id: 0,
			data: {},
			infoData: [],
			// evaluate: 1
		};
	},
	onLoad(option) {
		// console.log('option', option);
		this.id = option.id;
		this.$api.getProcessedInfo({ id: this.id }).then(res => {
			console.log('this.info', res.data);
			this.data = res.data.data;
			this.infoData = res.data.info;
			this.infoData.forEach(item => {
				console.log(item.evaluate,"evaluate")
				// if (this.evaluate === item.evaluate) {
				// }
			});
		});
	},
	methods: {
		openCollapse() {
			this.open = true;
		},
	}
};
</script>

<style lang="scss">
#EventDetail {
	.uni-collapse-item__title-text.data-v-41027c34 {
		color: rgba(125, 206, 32, 1);
		font-size: initial;
		font-weight: inherit;
	}
}
</style>
