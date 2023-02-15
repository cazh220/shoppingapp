<template>
	<view style="position: fixed;">
		<view
			id="DragButton"
			class="drag"
			:style="'left: ' + left + 'px; top:' + top + 'px;'"
			@touchstart="touchstart"
			@touchmove.stop.prevent="touchmove"
			@touchend="touchend"
			@click.stop.prevent="click"
			:class="{ transition: !isMove }"
			:animation="animationBox"
		>
			<image class="image" :src="imgMenu" mode="aspectFill" />
		</view>

		<image
			v-if="itemMenu.length > 0"
			class="menu bt-image"
			:class="[menuCls(1)]"
			:style="{ top: top - 75 + 'px' }"
			@tap="menuItemClick(0)"
			:src="itemMenu[0]"
			mode="aspectFill"
		/>
		<image
			v-if="itemMenu.length > 1"
			class="menu bt-image"
			:class="[menuCls(2)]"
			:style="{ top: top - 52 + 'px' }"
			@tap="menuItemClick(1)"
			:src="itemMenu[1]"
			mode="aspectFill"
		/>
		<image
			v-if="itemMenu.length > 2"
			class="menu bt-image"
			:class="[menuCls(3)]"
			:style="{ top: top + 2 + 'px' }"
			@tap="menuItemClick(2)"
			:src="itemMenu[2]"
			mode="aspectFill"
		/>
		<image
			v-if="itemMenu.length > 3"
			class="menu bt-image"
			:class="[menuCls(4)]"
			:style="{ top: top + 56 + 'px' }"
			@tap="menuItemClick(3)"
			:src="itemMenu[3]"
			mode="aspectFill"
		/>
		<image
			v-if="itemMenu.length > 4"
			class="menu bt-image"
			:class="[menuCls(5)]"
			:style="{ top: top + 79 + 'px' }"
			@tap="menuItemClick(4)"
			:src="itemMenu[4]"
			mode="aspectFill"
		/>
	</view>
</template>

<script>
/**
 * 可拖拽悬浮菜单，可展开5个按钮（主按钮直径50，菜单按钮直径45）
 * 主按钮top - 菜单按钮top = 75，因此2个按钮的圆心相聚77
 * 菜单按钮的TOP和LEFT值如下：
 * 1: 	TOP  = top - 75					= top - 75
 *    	LEFT = 10 + 25 - 23 			= 10  + 2
 * 2: 	TOP  = top - (77/√2 - 25 + 23) 	= top - 52
 * 		LEFT = 10 + (77/√2 + 25 - 23) 	= 10  + 56
 * 3:	TOP  = top + 25 - 23 			= top + 2
 *    	LEFT = 10 + 77 + 25 - 23		= 10  + 79
 * 4:	TOP  = top + (77/√2 + 25 - 23)	= top + 56
 *    	LEFT = 10 + (77/√2 + 25 - 23) 	= 10  + 56
 * 5:	TOP  = top + 77 + 25 - 23		= top + 79
 *    	LEFT = 10 + 25 - 23 			= 10  + 2
 * 备注：LEFT中的10是主按钮的left值，TOP中的top是主按钮的top值
 */
export default {
	name: 'drag-button',
	props: {
		// 主按钮图片路径
		imgMenu: {
			type: String,
			default: require('@/static/gis/menu.png')
		},
		// 图片路径数组,传入几个就会渲染几个按钮,最多5个
		itemMenu: {
			type: Array,
			default: [require('@/static/gis/add.png')]
		}
	},
	data() {
		return {
			top: 200,
			left: 50,
			width: 0,
			height: 0,
			offsetWidth: 0,
			offsetHeight: 0,
			windowWidth: 0,
			windowHeight: 0,
			edge: 10,
			isMove: false,
			animationBox: '', // 主菜单动画
			isLeft: false, // 主菜单是否在左边，true-左边，false-右边
			isShow: false // 是否显示菜单按钮，true-显示，false-隐藏
		}
	},
	mounted() {
		const sys = uni.getSystemInfoSync()

		this.windowWidth = sys.windowWidth
		this.windowHeight = sys.windowHeight

		if (sys.windowTop) {
			this.windowHeight += sys.windowTop
		}
		const query = uni.createSelectorQuery().in(this)
		query
			.select('#DragButton')
			.boundingClientRect(data => {
				this.width = data.width
				this.height = data.height
				this.offsetWidth = data.width / 2
				this.offsetHeight = data.height / 2
				this.left = this.windowWidth - this.left - this.edge
				this.top = this.windowHeight - this.top - this.edge
			})
			.exec()
	},
	methods: {
		// 点击主按钮
		click() {
			let animation = uni.createAnimation({ duration: 200, timingFunction: 'ease' })
			this.isShow = !this.isShow
			let rotate = this.isShow ? 180 : 0
			animation.rotate(rotate).step()
			this.animationBox = animation.export()
			this.$emit('btnClick')
		},

		// 点击了子按钮
		menuItemClick(index) {
			this.$emit('menuClick', index)
		},

		// 开始触摸
		touchstart(e) { 
			this.$emit('btnTouchstart')
		},

		// 触摸移动
		touchmove(e) {
			if (this.isShow) return
			// 单指触摸
			if (e.touches.length !== 1) {
				return false
			}
			this.isMove = true
			this.left = e.touches[0].clientX - this.offsetWidth
			let clientY = e.touches[0].clientY - this.offsetHeight
			let edgeBottom = this.windowHeight - this.height - this.edge
			// 上下触及边界
			if (clientY < this.edge) {
				this.top = this.edge
			} else if (clientY > edgeBottom) {
				this.top = edgeBottom
			} else {
				this.top = clientY
			}

			// 左右触及边界
			if (this.left < this.edge) {
				this.left = this.edge
			} else if (this.left > this.windowWidth - this.width - this.edge) {
				this.left = this.windowWidth - this.width - this.edge
			}
		},

		// 触摸结束
		touchend(e) {
			if (this.isShow) return
			let edgeRigth = this.windowWidth - this.width - this.edge

			if (this.left < this.windowWidth / 2 - this.offsetWidth) {
				this.left = this.edge
			} else {
				this.left = edgeRigth
			}
			this.isMove = false
			let ww = uni.getSystemInfoSync().windowWidth,
				px = e.changedTouches[0].clientX
			this.isLeft = px <= ww * 0.5
			this.$emit('btnTouchend')
		},

		// 计算类名
		menuCls(number) {
			let num = this.isShow ? number : 0
			let pos = this.isLeft ? 'L' : 'R'
			return 'menu' + num + pos
		}
	}
}
</script>

<style lang="scss">
.drag {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 50px;
	height: 50px;
	position: fixed;
	z-index: 999999;
	&.transition {
		transition: left 0.3s ease, top 0.3s ease;
	}
}

.menu {
	justify-content: center;
	align-items: center;
	display: flex;
	position: fixed;
	width: 45px;
	height: 45px;
	border-radius: 50%;
	color: white;
}

.image {
	width: 50px;
	height: 50px;
}

.bt-image {
	width: 45px;
	height: 45px;
}
.menu0L {
	left: 12px;
	opacity: 0;
	transition: top 0.2s, left 0.2s, opacity 0.2s;
}

.menu1L {
	left: 12px;
	transition: top 0.2s, left 0.2s, opacity 0.2s;
}

.menu2L {
	left: 66px;
	transition: top 0.2s, left 0.2s, opacity 0.2s;
}

.menu3L {
	left: 89px;
	transition: top 0.2s, left 0.2s, opacity 0.2s;
}

.menu4L {
	left: 66px;
	transition: top 0.2s, left 0.2s, opacity 0.2s;
}

.menu5L {
	left: 12px;
	transition: top 0.2s, left 0.2s, opacity 0.2s;
}

.menu0R {
	right: 12px;
	opacity: 0;
	transition: top 0.2s, right 0.2s, opacity 0.2s;
}

.menu1R {
	right: 12px;
	transition: top 0.2s, right 0.2s, opacity 0.2s;
}

.menu2R {
	right: 66px;
	transition: top 0.2s, right 0.2s, opacity 0.2s;
}

.menu3R {
	right: 89px;
	transition: top 0.2s, right 0.2s, opacity 0.2s;
}

.menu4R {
	right: 66px;
	transition: top 0.2s, right 0.2s, opacity 0.2s;
}

.menu5R {
	right: 12px;
	transition: top 0.2s, right 0.2s, opacity 0.2s;
}
</style>
