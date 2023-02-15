<template>
	<view id="Review">
		<uni-collapse accordion>
			<uni-collapse-item title="事件上报信息" :open="open" @click="openCollapse">
				<uni-list :border="false">
					<uni-list-item :border="false" title="事件编号:" :rightText="info.serial_number"></uni-list-item>
					<uni-list-item :border="false" title="上报人:" :rightText="info.report_name"></uni-list-item>
					<uni-list-item :border="false" title="上报时间:" :rightText="info.report_time"></uni-list-item>
					<uni-list-item :border="false" title="事件级别:" :rightText="info.event_level_name"></uni-list-item>
					<uni-list-item :border="false" title="事件类型:" :rightText="info.type_text"></uni-list-item>
					<uni-list-item :border="false" title="事件描述:" :rightText="info.describe"></uni-list-item>
					<uni-list-item :border="false" title="上报图片:">
						<template slot="footer">
							<image v-for="(item, index) in info.pic_url" :key="index" :src="$api.getUrl(item)" style="width: 50px;height: 50px;margin-left:5px;" alt="暂无图片" />
						</template>
					</uni-list-item>
					<uni-list-item :border="false" title="事件地址:" :rightText="info.address"></uni-list-item>
					<uni-list-item :border="false" title="处理人:" :rightText="info.conductor_name"></uni-list-item>
				</uni-list>
			</uni-collapse-item>
			<view v-for="item in dealData" :key="item.id">
				<uni-collapse-item title="事件处理信息" :open="open" @click="openCollapse">
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
				<uni-collapse-item v-if="item.assess_id" name="2" title="审查信息" :open="open" @click="openCollapse">
					<uni-list :border="false">
						<uni-list-item :border="false" title="是否合格:" :rightText="item.is_qualified_name"></uni-list-item>
						<uni-list-item :border="false" title="评价:" :rightText="item.evaluate"></uni-list-item>
						<uni-list-item :border="false" title="考核标准:" :rightText="item.assess_name"></uni-list-item>
						<!-- <uni-list-item :border="false" title="审查人:" :rightText="item.investigate_name"></uni-list-item> -->
						<!-- <uni-list-item :border="false" title="审查时间:" :rightText="item.investigate_time"></uni-list-item> -->
					</uni-list>
				</uni-collapse-item>
			</view>
			<uni-collapse-item title="审查信息" :open="true" @click="openCollapse">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" border>
					<uni-forms-item required name="is_qualified">
						<view slot="left" class="form-label">
							<text class="required-icon">*</text>
							<text>是否合格:</text>
						</view>
						<uni-data-checkbox v-model="formData.is_qualified" :localdata="damageTypeList" />
					</uni-forms-item>
					<uni-forms-item required name="application_type">
						<view slot="left" class="form-label">
							<text class="required-icon">*</text>
							<text>评价:</text>
						</view>
						<uni-rate v-model="formData.evaluate" @change="onChange" />
					</uni-forms-item>
					<uni-forms-item required name="assess_id" @click="selectAssessName">
						<view slot="left" class="form-label">
							<text class="required-icon">*</text>
							<text>考核标准:</text>
						</view>
						<view v-if="readOnly" class="lh">{{ formData.assess_name }}</view>
						<lb-picker v-else ref="driverPicker" v-model="formData.assess_id" :list="assessNameList" @confirm="selectAssessName">
							<ty-picker-frame :placeholder="'请选择考核标准'" :text="formData.assess_name"></ty-picker-frame>
						</lb-picker>
					</uni-forms-item>
				</uni-forms>
			</uni-collapse-item>
		</uni-collapse>
		<view class="bottom"><button class="submit-button" @click="submitForm">提交</button></view>
	</view>
</template>

<script>
export default {
	name: 'Review',
	data() {
		return {
			// status: 0,
			open: false,
			damageTypeList: [
				{
					text: '合格',
					value: 1
				},
				{
					text: '不合格',
					value: 2
				}
			],
			assessNameList: [], //考核标准下拉
			id: 0,
			info: {},
			dealData: [],
			formData: {
				is_qualified: 1,
				assess_id: undefined,
				evaluate: 0
			},
			rules: {
				is_qualified: {
					rules: [
						{
							required: true,
							errorMessage: '请选择是否合格'
						}
					],
					validateTrigger: 'submit'
				},
				assess_id: {
					rules: [
						{
							required: true,
							errorMessage: '请选择考核标准'
						}
					],
					validateTrigger: 'submit'
				},
				evaluate: {
					rules: [
						{
							required: true,
							errorMessage: '请选择评价'
						}
					],
					validateTrigger: 'submit'
				}
			}
		};
	},

	onLoad(option) {
		// console.log('option', option);
		this.id = option.id;
		this.open;
		this.$api.getProcessedInfo({ id: option.id }).then(res => {
			console.log('this.info', res.data);
			this.info = res.data.data;
			this.dealData = res.data.info;
		});
		this.$api.getAssessList().then(res => {
			this.assessNameList = res.data.map(item => {
				item.label = item.assess_name;
				item.value = item.id;
				return item;
			});
		});
	},
	created() {},
	methods: {
		openCollapse() {
			this.open = true;
		},
		onChange(e) {
			console.log('选择', e);
			this.formData.evaluate = e.value;
		},
		// 选择考核标准
		selectAssessName(e) {
			this.formData.assess_name = e.item.label;
		},
		submitForm() {
			this.$refs.form.validate().then(res => {
				const data = {
					id: this.id,
					is_qualified: this.formData.is_qualified,
					assess_id: this.formData.assess_id,
					evaluate: this.formData.evaluate
				};
				this.$api.postInvestigate(data).then(res => {
					console.log('this.info', res.data);
					if (this.formData.is_qualified === 1) {
						//合格 去已完成
						uni.reLaunch({
							url: './report-record?currentTab=2'
						});
					} else {
						//不合格 去待处理
						uni.reLaunch({
							url: './report-record?currentTab=0'
						});
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
#Review {
	.form-label {
		margin-left: 10px;
	}
	.uni-collapse-item__title-text.data-v-41027c34 {
		color: rgba(125, 206, 32, 1);
		font-size: initial;
		font-weight: inherit;
	}
	.bottom {
		margin: 10px;
		.submit-button {
			width: 90%;
			background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
			color: #fff;
		}
	}
}
</style>
