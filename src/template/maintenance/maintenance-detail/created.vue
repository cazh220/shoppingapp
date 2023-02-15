<template>
	<!-- 已创建 -->
	<view id="Created" class="Created">
		<uni-forms ref="form" :modelValue="formData" border>
			<uni-forms-item required name="license_plate_number">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>车牌号</text>
				</view>
				<view class="lh">{{ formData.license_plate_number }}</view>
			</uni-forms-item>
			<uni-forms-item required name="vehicle_type_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>车辆类型</text>
				</view>
				<view class="lh">{{ formData.vehicle_type_name }}</view>
			</uni-forms-item>
			<uni-forms-item required name="department_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>所属部门</text>
				</view>
				<view class="lh">{{ formData.department_name }}</view>
			</uni-forms-item>
			<uni-forms-item required name="driver_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>司机</text>
				</view>
				<view class="lh">{{ formData.driver_name }}</view>
			</uni-forms-item>
			<uni-forms-item required name="driver_phone">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>联系方式</text>
				</view>
				<view class="lh">{{ formData.driver_phone }}</view>
			</uni-forms-item>
			<uni-forms-item required name="total_distance">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>总里程</text>
				</view>
				<view class="lh">{{ formData.total_distance }}</view>
			</uni-forms-item>
			<uni-forms-item required name="apply_type_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>申请类型</text>
				</view>
				<view class="lh">{{ formData.apply_type_name }}</view>
			</uni-forms-item>

			<uni-forms-item required name="apply_type_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>维修部位</text>
				</view>
				<view class="lh">{{ formData.apply_type_name }}</view>
			</uni-forms-item>
			
			<uni-forms-item required name="damage_type_name">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>损坏类型</text>
				</view>
				<view class="lh">{{ formData.damage_type_name }}</view>
			</uni-forms-item>
			<uni-forms-item required name="apply_reason">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>维修原因</text>
				</view>
				<view class="lh">{{ formData.apply_reason }}</view>
			</uni-forms-item>
			<uni-forms-item required name="img">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>上传图片</text>
				</view>
				<uni-file-picker
					readonly
					file-mediatype="image"
					v-model="formData.img"
					disable-preview
					:del-icon="false"
					mode="grid"
					:image-styles="imageStyles"
					file-extname="png,jpg"
					:limit="formData.img.length"
				/>
			</uni-forms-item>
			<uni-forms-item required name="create_time">
				<view slot="left" class="form-label">
					<text class="required-icon">*</text>
					<text>申请时间</text>
				</view>
				<view class="lh">{{ formData.create_time }}</view>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
export default {
	name: 'Created',
	props: {
		showFormData: {
			default: {},
			type: Object
		}
	},
	data() {
		return {
			formData: {},
			imageStyles: {
				width: 70,
				height: 70
			}
		}
	},

	watch: {
		showFormData: {
			handler(val) {
				this.formData = val
				this.formData.img = this.formData.apply_img.map(item => {
					return {
						name: item,
						extname: 'png',
						url: this.$api.getUrl(item)
					}
				})
			}
		}
	}
}
</script>

<style lang="scss">
.Created {
	padding: 5px 20px;
	.lh {
		float: right;
		line-height: 36px;
	}
}
</style>
