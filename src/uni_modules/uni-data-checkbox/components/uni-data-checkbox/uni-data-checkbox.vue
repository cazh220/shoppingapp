<template>
	<view class="uni-data-checklist">
		<template v-if="!isLocal">
			<view class="uni-data-loading">
				<uni-load-more v-if="!mixinDatacomErrorMessage" status="loading" iconType="snow" :iconSize="18" :content-text="contentText"></uni-load-more>
				<text v-else>{{mixinDatacomErrorMessage}}</text>
			</view>
		</template>
		<template v-else>
			<checkbox-group v-if="multiple" class="checklist-group" :class="{'is-list':mode==='list' || wrap}" @change="chagne">
				<label class="checklist-box" :class="['is--'+mode,item.selected?'is-checked':'',(disabled || !!item.disabled)?'is-disable':'',index!==0&&mode==='list'?'is-list-border':'']"
				 :style="item.styleBackgroud" v-for="(item,index) in dataList" :key="index">
					<checkbox class="hidden" hidden :disabled="disabled || !!item.disabled" :value="item[map.value]+''" :checked="item.selected" />
					<view v-if="(mode !=='tag' && mode !== 'list') || ( mode === 'list' && icon === 'left')" class="checkbox__inner"  :style="item.styleIcon">
						<view class="checkbox__inner-icon"></view>
					</view>
					<view class="checklist-content" :class="{'list-content':mode === 'list' && icon ==='left'}">
						<text class="checklist-text" :style="item.styleIconText">{{item[map.text]}}</text>
						<view v-if="mode === 'list' && icon === 'right'" class="checkobx__list" :style="item.styleBackgroud"></view>
					</view>
				</label>
			</checkbox-group>
			<radio-group v-else class="checklist-group" :class="{'is-list':mode==='list','is-wrap':wrap}" @change="chagne">
				<!-- -->
				<label class="checklist-box" :class="['is--'+mode,item.selected?'is-checked':'',(disabled || !!item.disabled)?'is-disable':'',index!==0&&mode==='list'?'is-list-border':'']"
				 :style="item.styleBackgroud" v-for="(item,index) in dataList" :key="index">
					<radio class="hidden" hidden :disabled="disabled || item.disabled" :value="item[map.value]+''" :checked="item.selected" />
					<view v-if="(mode !=='tag' && mode !== 'list') || ( mode === 'list' && icon === 'left')" class="radio__inner"
					 :style="item.styleBackgroud">
						<view class="radio__inner-icon" :style="item.styleIcon"></view>
					</view>
					<view class="checklist-content" :class="{'list-content':mode === 'list' && icon ==='left'}">
						<text class="checklist-text" :style="item.styleIconText">{{item[map.text]}}</text>
						<view v-if="mode === 'list' && icon === 'right'" :style="item.styleRightIcon" class="checkobx__list"></view>
					</view>
				</label>
			</radio-group>
		</template>
	</view>
</template>

<script>
	/**
	 * DataChecklist ???????????????
	 * @description ?????????????????? checkbox ??? radio
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=xxx
	 * @property {String} mode = [default| list | button | tag] ????????????
	 * @value default  	??????????????????
	 * @value list		????????????
	 * @value button	????????????
	 * @value tag 		????????????
	 * @property {Boolean} multiple = [true|false] ????????????
	 * @property {Array|String|Number} value ?????????
	 * @property {Array} localdata ???????????? ????????? [{text:'',value:''}]
	 * @property {Number|String} min ?????????????????? ???multiple???true?????????
	 * @property {Number|String} max ?????????????????? ???multiple???true?????????
	 * @property {Boolean} wrap ??????????????????
	 * @property {String} icon = [left|right]  list ???????????????icon????????????
	 * @property {Boolean} selectedColor ????????????
	 * @property {Boolean} emptyText ?????????????????????????????? ?????????????????????
	 * @property {Boolean} selectedTextColor ????????????????????????????????????????????????
	 * @property {Object} map ??????????????? ?????? map={text:'text',value:'value'}
	 * @value left ????????????
	 * @value right ????????????
	 * @event {Function} change  ????????????????????????
	 */

	// import clientdb from './clientdb.js'
	export default {
		name: 'uniDataChecklist',
		// mixins: [clientdb],
		mixins: [uniCloud.mixinDatacom || {}],
		// model: {
		// 	prop: 'modelValue',
		// 	event: 'update:modelValue'
		// },
		props: {
			mode: {
				type: String,
				default: 'default'
			},
			
			multiple: {
				type: Boolean,
				default: false
			},
			value: {
				type: [Array, String, Number],
				default () {
					return ''
				}
			},
			// TODO vue3
			modelValue: {
				type: [Array, String, Number],
				default() {
					return '';
				}
			},
			localdata: {
				type: Array,
				default () {
					return []
				}
			},
			min: {
				type: [Number, String],
				default: ''
			},
			max: {
				type: [Number, String],
				default: ''
			},
			wrap: {
				type: Boolean,
				default: false
			},
			icon: {
				type: String,
				default: 'left'
			},
			selectedColor: {
				type: String,
				default: ''
			},
			selectedTextColor: {
				type: String,
				default: ''
			},
			emptyText:{
				type: String,
				default: '????????????'
			},
			disabled:{
				type: Boolean,
				default: false
			},
			map:{
				type: Object,
				default(){
					return {
						text:'text',
						value:'value'
					}
				}
			}
		},
		watch: {
			localdata: {
				handler(newVal) {
					this.range = newVal
					this.dataList = this.getDataList(this.getSelectedValue(newVal))
				},
				deep: true
			},
			mixinDatacomResData(newVal) {
				this.range = newVal
				this.dataList = this.getDataList(this.getSelectedValue(newVal))
			},
			value(newVal) {
				this.dataList = this.getDataList(newVal)
				this.formItem && this.formItem.setValue(newVal)
			},
			modelValue(newVal) {
				this.dataList = this.getDataList(newVal);
				this.formItem && this.formItem.setValue(newVal);
			}
		},
		data() {
			return {
				dataList: [],
				range: [],
				contentText: {
					contentdown: '????????????',
					contentrefresh: '?????????',
					contentnomore: '????????????'
				},
				isLocal:true,
				styles: {
					selectedColor: '#007aff',
					selectedTextColor: '#333',
				}
			};
		},
		computed:{
			dataValue(){
				return this.value || this.modelValue
			}
		},
		created() {
			this.form = this.getForm('uniForms')
			this.formItem = this.getForm('uniFormsItem')
			// this.formItem && this.formItem.setValue(this.value)

			if (this.formItem) {
				if (this.formItem.name) {
					this.rename = this.formItem.name
					this.form.inputChildrens.push(this)
				}
			}

			if (this.localdata && this.localdata.length !== 0) {
				this.isLocal = true
				this.range = this.localdata
				this.dataList = this.getDataList(this.getSelectedValue(this.range))
			} else {
				if (this.collection) {
					this.isLocal = false
					this.loadData()
				}
			}
		},
		methods: {
			loadData() {
				this.mixinDatacomGet().then(res=>{
					this.mixinDatacomResData = res.result.data
					if(this.mixinDatacomResData.length === 0){
						this.isLocal = false
						this.mixinDatacomErrorMessage = this.emptyText
					}else{
						this.isLocal = true
					}
				}).catch(err=>{
					this.mixinDatacomErrorMessage = err.message
				})
			},
			/**
			 * ?????????????????????
			 */
			getForm(name = 'uniForms') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false
					parentName = parent.$options.name;
				}
				return parent;
			},
			chagne(e) {
				const values = e.detail.value

				let detail = {
					value: [],
					data: []
				}

				if (this.multiple) {
					this.range.forEach(item => {
						
						if (values.includes(item[this.map.value] + '')) {
							detail.value.push(item[this.map.value])
							detail.data.push(item)
						}
					})
				} else {
					const range = this.range.find(item => (item[this.map.value] + '') === values)
					if (range) {
						detail = {
							value: range[this.map.value],
							data: range
						}
					}
				}
				this.formItem && this.formItem.setValue(detail.value)
				// TODO ?????? vue2
				this.$emit('input', detail.value);
				// // TOTO ?????? vue3
				this.$emit('update:modelValue', detail.value);
				this.$emit('change', {
					detail
				})
				if (this.multiple) {
					// ?????? v-model ???????????? ?????????????????????
					// if (this.value.length === 0) {
					this.dataList = this.getDataList(detail.value, true)
					// }
				} else {
					this.dataList = this.getDataList(detail.value)
				}
			},

			/**
			 * ????????????????????????
			 * @param {Object} value ????????????
			 */
			getDataList(value) {
				// ??????????????????????????????????????????????????????????????????
				let dataList = JSON.parse(JSON.stringify(this.range))
				let list = []
				if (this.multiple) {
					if (!Array.isArray(value)) {
						value = []
					}
				}
				dataList.forEach((item, index) => {
					item.disabled = item.disable || item.disabled || false
					if (this.multiple) {
						if (value.length > 0) {
							let have = value.find(val => val === item[this.map.value])
							item.selected = have !== undefined
						} else {
							item.selected = false
						}
					} else {
						item.selected = value === item[this.map.value]
					}

					list.push(item)
				})
				return this.setRange(list)
			},
			/**
			 * ?????????????????????
			 * @param {Object} list
			 */
			setRange(list) {
				let selectList = list.filter(item => item.selected)
				let min = Number(this.min) || 0
				let max = Number(this.max) || ''
				list.forEach((item, index) => {
					if (this.multiple) {
						if (selectList.length <= min) {
							let have = selectList.find(val => val[this.map.value] === item[this.map.value])
							if (have !== undefined) {
								item.disabled = true
							}
						}

						if (selectList.length >= max && max !== '') {
							let have = selectList.find(val => val[this.map.value] === item[this.map.value])
							if (have === undefined) {
								item.disabled = true
							}
						}
					}
					this.setStyles(item, index)  
					list[index] = item
				})
				return list
			},
			/**
			 * ?????? class
			 * @param {Object} item
			 * @param {Object} index
			 */
			setStyles(item, index) {
				//  ?????????????????????
				item.styleBackgroud = this.setStyleBackgroud(item)
				item.styleIcon = this.setStyleIcon(item)
				item.styleIconText = this.setStyleIconText(item)
				item.styleRightIcon = this.setStyleRightIcon(item)
			},

			/**
			 * ???????????????
			 * @param {Object} range
			 */
			getSelectedValue(range) {
				if (!this.multiple) return this.dataValue
				let selectedArr = []
				range.forEach((item) => {
					if (item.selected) {
						selectedArr.push(item[this.map.value])
					}
				})
				return this.dataValue.length > 0 ? this.dataValue : selectedArr
			},

			/**
			 * ??????????????????
			 */
			setStyleBackgroud(item) {
				let styles = {}
				let selectedColor = this.selectedColor?this.selectedColor:'#007aff'
				if (this.mode !== 'list') {
					styles['border-color'] = item.selected?selectedColor:'#DCDFE6'
				}
				if (this.mode === 'tag') {
					styles['background-color'] = item.selected? selectedColor:'#f5f5f5'
				}
				let classles = ''
				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}
				return classles
			},
			setStyleIcon(item) {
				let styles = {}
				let classles = ''
				let selectedColor = this.selectedColor?this.selectedColor:'#007aff' 
				styles['background-color'] = item.selected?selectedColor:'#fff'
				styles['border-color'] = item.selected?selectedColor:'#DCDFE6'

				if(!item.selected && item.disabled){
					styles['background-color'] = '#F2F6FC'
					styles['border-color'] = item.selected?selectedColor:'#DCDFE6'
				}

				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}
				return classles
			},
			setStyleIconText(item) {
				let styles = {}
				let classles = ''
				let selectedColor = this.selectedColor?this.selectedColor:'#007aff'
				if (this.mode === 'tag') {
					styles.color = item.selected?(this.selectedTextColor?this.selectedTextColor:'#fff'):'#333'
				} else {
					styles.color = item.selected?(this.selectedTextColor?this.selectedTextColor:selectedColor):'#333'
				}
				if(!item.selected && item.disabled){
					styles.color = '#999'
				}
				
				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}
				return classles
			},
			setStyleRightIcon(item) {
				let styles = {}
				let classles = ''
				if (this.mode === 'list') {
					styles['border-color'] = item.selected?this.styles.selectedColor:'#DCDFE6'
				}
				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}

				return classles
			}
		}
	}
</script>

<style lang="scss">
	$checked-color: #007aff;
	$border-color: #DCDFE6;
	$disable:0.4;

	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
	}

	.uni-data-loading {
		@include flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 36px;
		padding-left: 10px;
		color: #999;
	}

	.uni-data-checklist {
		position: relative;
		z-index: 0;

		// ????????????
		.checklist-group {
			@include flex;
			flex-direction: row;
			flex-wrap: wrap;

			&.is-list {
				flex-direction: column;
			}

			.checklist-box {
				@include flex;
				flex-direction: row;
				align-items: center;
				position: relative;
				margin: 5px 0;
				margin-right: 25px;

				.hidden {
					position: absolute;
					opacity: 0;
				}

				// ????????????
				.checklist-content {
					@include flex;
					flex: 1;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.checklist-text {
						font-size: 14px;
						color: #333;
						margin-left: 5px;
						line-height: 14px;
					}

					.checkobx__list {
						border-right-width: 1px;
						border-right-color: #007aff;
						border-right-style: solid;
						border-bottom-width:1px;
						border-bottom-color: #007aff; 
						border-bottom-style: solid;
						height: 12px; 
						width: 6px;
						left: -5px;
						transform-origin: center;
						transform: rotate(45deg);
						opacity: 0;
					}
				}

				// ????????????
				.checkbox__inner {
					/* #ifndef APP-NVUE */
					flex-shrink: 0;
					box-sizing: border-box;
					/* #endif */
					position: relative;
					width: 16px;
					height: 16px;
					border: 1px solid $border-color;
					border-radius: 2px;
					background-color: #fff;
					z-index: 1;
					.checkbox__inner-icon {
						position: absolute;
						/* #ifdef APP-NVUE */
						top: 2px;
						/* #endif */
						/* #ifndef APP-NVUE */
						top: 1px;
						/* #endif */
						left: 5px;
						height: 8px;
						width: 4px;
						border-right-width: 1px;
						border-right-color: #fff;
						border-right-style: solid;
						border-bottom-width:1px ;
						border-bottom-color: #fff;
						border-bottom-style: solid;
						opacity: 0;
						transform-origin: center;
						transform: rotate(40deg);
					}
				}

				// ????????????
				.radio__inner {
					@include flex;
					/* #ifndef APP-NVUE */
					flex-shrink: 0;
					box-sizing: border-box;
					/* #endif */
					justify-content: center;
					align-items: center;
					position: relative;
					width: 16px;
					height: 16px;
					border: 1px solid $border-color;
					border-radius: 16px;
					background-color: #fff;
					z-index: 1;

					.radio__inner-icon {
						width: 8px;
						height: 8px;
						border-radius: 10px;
						opacity: 0;
					}
				}

				// ????????????
				&.is--default {

					// ??????
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;
						/* #endif */
						.checkbox__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}

						.radio__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
						}
						.checklist-text {
							color: #999;
						}
					}

					// ??????
					&.is-checked {
						.checkbox__inner {
							border-color: $checked-color;
							background-color: $checked-color;

							.checkbox__inner-icon {
								opacity: 1;
								transform: rotate(45deg);
							}
						}
						.radio__inner {
							border-color: $checked-color;
							.radio__inner-icon {
								opacity: 1;
								background-color: $checked-color;
							}
						}
						.checklist-text {
							color: $checked-color;
						}
						// ????????????
						&.is-disable { 
							.checkbox__inner {
								opacity: $disable;
							}

							.checklist-text {
								opacity: $disable;
							}
							.radio__inner {
								opacity: $disable;
							}
						}
					}
				}

				// ????????????
				&.is--button {
					margin-right: 10px;
					padding: 5px 15px;
					border: 1px $border-color solid;
					border-radius: 3px;
					transition: border-color 0.2s;

					// ??????
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;
						/* #endif */
						border: 1px #eee solid;
						opacity: $disable;
						.checkbox__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}
						.radio__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}
						.checklist-text {
							color: #999;
						}
					}

					&.is-checked {
						border-color: $checked-color;
						.checkbox__inner {
							border-color: $checked-color;
							background-color: $checked-color;
							.checkbox__inner-icon {
								opacity: 1;
								transform: rotate(45deg);
							}
						}

						.radio__inner {
							border-color: $checked-color;

							.radio__inner-icon {
								opacity: 1;
								background-color: $checked-color;
							}
						}

						.checklist-text {
							color: $checked-color;
						}

						// ????????????
						&.is-disable {
							opacity: $disable;
						}
					}
				}

				// ????????????
				&.is--tag {
					margin-right: 10px;
					padding: 5px 10px;
					border: 1px $border-color solid;
					border-radius: 3px;
					background-color: #f5f5f5;

					.checklist-text {
						margin: 0;
						color: #333;
					}

					// ??????
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;
						/* #endif */
						opacity: $disable;
					}

					&.is-checked {
						background-color: $checked-color;
						border-color: $checked-color;

						.checklist-text {
							color: #fff;
						}
					}
				}
				// ????????????
				&.is--list {
					/* #ifndef APP-NVUE */
					display: flex;
					/* #endif */
					padding: 10px 15px;
					padding-left: 0;
					margin: 0;

					&.is-list-border {
						border-top: 1px #eee solid;
					}

					// ??????
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;
						/* #endif */
						.checkbox__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}
						.checklist-text {
							color: #999;
						}
					}

					&.is-checked {
						.checkbox__inner {
							border-color: $checked-color;
							background-color: $checked-color;

							.checkbox__inner-icon {
								opacity: 1;
								transform: rotate(45deg);
							}
						}

						.checklist-text {
							color: $checked-color;
						}

						.checklist-content {
							.checkobx__list {
								opacity: 1;
								border-color: $checked-color;
							}
						}

						// ????????????
						&.is-disable {
							.checkbox__inner {
								opacity: $disable;
							}

							.checklist-text {
								opacity: $disable;
							}
						}
					}
				}
			}
		}
	}
</style>
