<template>
	<view>
		<view class="compos">
			<view class="base-btn" @tap="show = !show" :style="btnStyle">
				<slot></slot>
			</view>

			<view class="modal" 
				:style="{ 
					height: show ? btnList.length * 7 + 'vw' : 0, 
					overflow: show ? '' : 'hidden', 
					width: modalWidth,
					top: modalTopPos,
					left: modalLeftPos,
					opacity: modalOpacity
				}"
			>
				<view class="modal-ang" v-if="dotShow && btnList.length > 0" :style="direction !== 'left' ? 'left: 10px': 'right: 10px'"></view>
				<view class="modal-item" v-for="(item, index) in btnList" :index="index" :key="index" @tap="callRes(index)">
					{{item}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * :btnList				按钮列表
	 * :btnStyle			外部按钮样式
	 * :modalWidth			弹出层宽度
	 * :modalLeftPos		弹出层左定位
	 * :modalTopPos			弹出层顶定位
	 * :modalOpacity		弹出层透明度
	 * :direction			弹出层箭头位置 left right
	 * :active				默认激活状态
	 * @select				选中列表触发事件
	 * */
	
	
export default {
	data() {
		return {
			show: this.active,
			dotShow: this.active
		};
	},
	watch: {
		show() {
			setTimeout(() => {
				this.dotShow = this.show;
			}, 50);
		},
		active() {
			this.show = this.active
		}
	},
	props: {
		btnList: {
			type: Object,
			default: () => {
				return [];
			}
		},
		btnStyle: {
			type: Object,
			default: () => {
				return {};
			}
		},
		modalWidth: {
			type: String,
			default: '15vw'
		},
		modalLeftPos: {
			type: String,
			default: '5vw'
		},
		modalTopPos: {
			type: String,
			default: '6vw'
		},
		modalOpacity: {
			type: String,
			default: '0.7'
		},
		direction: {
			type: String,
			default: 'left'
		},
		active: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		callRes(e) {
			this.$emit('select', e);
			this.show=false;
			this.dotShow=false;
		}
	}
};
</script>

<style lang="scss">
.compos {
	position: relative;
	
	.modal {
		background-color: #333333;
		position: absolute;
		border-radius: 1vw;
		transition: height ease-out 100ms;
		z-index: 999;

		.modal-item {
			z-index: 99;
			height: 7vw;
			line-height: 7vw;
			color: #fff;
			text-align: center;
			border-bottom: 1px solid #fff;
			margin-left: 2px;
			margin-right: 2px;
		}

		.modal-item:last-child {
			border-bottom: none;
		}

		.modal-ang {
			background-color: #333333;
			position: absolute;
			width: 9px;
			height: 9px;
			transform: rotate(45deg);
			top: -3px;
			border-radius: 3px;
		}
	}
}

.base-btn {
	position: relative;
	border: 0upx;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
</style>
