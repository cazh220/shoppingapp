<template>
	<view class="ty-picker">
		<view class="ty-picker-text" v-if="text">{{ text }}</view>
		<view class="ty-picker-text ty-picker-placeholder" v-else>{{ placeholder }}</view>
		<view class="ty-picker-right"><view class="ty-picker-right-icon"></view></view>
	</view>
</template>

<script>
export default {
	name: 'TyPicker',
	props: {
		placeholder: {
			default: '请选择',
			type: String
		},
		text: {
			default: '',
			type: String
		}
	}
}
</script>

<style lang="scss">
.ty-picker {
	// border: 1px solid #e5e5e5;
	border-radius: 5px;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	-webkit-box-orient: horizontal;
	-webkit-box-direction: normal;
	-webkit-flex-direction: row;
	flex-direction: row;
	-webkit-box-align: center;
	-webkit-align-items: center;
	align-items: center;
	-webkit-flex-wrap: nowrap;
	flex-wrap: nowrap;
	font-size: 14px;
	line-height: 38px;
	padding-right: 10px;
	overflow: hidden;
	.ty-picker-text {
		height: 38px;
		color: #333;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		overflow: hidden;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-flex-direction: row;
		flex-direction: row;
	}
	.ty-picker-placeholder {
		color: #999999;
	}
	.ty-picker-right {
		position: relative;
		width: 20px;
		margin-left: auto;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		-webkit-transform: rotate(-135deg);
		transform: rotate(-135deg);
		-webkit-transform-origin: center;
		transform-origin: center;
		.ty-picker-right-icon {
			width: 7px;
			height: 7px;
			color: #999999;
			border-left: 1px solid #999;
			border-bottom: 1px solid #999;
		}
	}
}
</style>
