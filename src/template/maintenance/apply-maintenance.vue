<template>
  <view id="ApplyMaintenance">
    <uni-forms ref="form" :modelValue="formData" :rules="rules" border>
      <uni-forms-item required name="license_number">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>车牌号：</text>
        </view>
        <view class="license-number-box">
          <uni-easyinput
            :inputBorder="false"
            type="text"
            autoHeight
            placeholderStyle="color: #999999"
            v-model="formData.license_number"
            @blur="licenseNumberConfirm"
            @confirm="licenseNumberConfirm"
            placeholder="请输入车牌号"
          />
        </view>
        <uni-icons
          class="camera"
          type="camera"
          color="#fff"
          size="20"
          @click="clickCamera"
        ></uni-icons>
      </uni-forms-item>
      <uni-forms-item required name="vehicle_name">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>车辆类型：</text>
        </view>
        <view class="text-center" v-if="formData.vehicle_name">{{
          formData.vehicle_name
        }}</view>
        <view class="text-center text-placeholder" v-else>请输入车辆类型</view>
      </uni-forms-item>
      <uni-forms-item required name="department_name">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>所属部门：</text>
        </view>
        <view class="text-center" v-if="formData.department_name">{{
          formData.department_name
        }}</view>
        <view class="text-center text-placeholder" v-else>请输入所属部门</view>
      </uni-forms-item>
      <uni-forms-item required name="driver_id">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>司机：</text>
        </view>
        <lb-picker
          ref="driverPicker"
          v-model="formData.driver_id"
          :list="driverList"
          @confirm="driverChange"
        >
          <ty-picker-frame
            :placeholder="'请选择司机'"
            :text="formData.driver_name"
          ></ty-picker-frame>
        </lb-picker>
      </uni-forms-item>
      <uni-forms-item required name="phone">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>联系方式：</text>
        </view>
        <view class="text-center" v-if="formData.phone">{{
          formData.phone
        }}</view>
        <view class="text-center text-placeholder" v-else>请输入联系方式</view>
      </uni-forms-item>
      <uni-forms-item required name="total_distance">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>总里程：</text>
        </view>
        <uni-easyinput
          :inputBorder="false"
          type="digit"
          placeholderStyle="color: #999999"
          v-model="formData.total_distance"
          placeholder="请输入总里程(km)"
        />
      </uni-forms-item>
      <uni-forms-item required name="apply_type">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>申请类型：</text>
        </view>
        <lb-picker
          ref="driverPicker"
          v-model="formData.apply_type"
          :list="$com.applicationTypeList()"
          @confirm="applyTypeChange"
        >
          <ty-picker-frame
            :placeholder="'请选择申请类型'"
            :text="formData.apply_type_name"
          ></ty-picker-frame>
        </lb-picker>
      </uni-forms-item>

      <!-- <uni-forms-item required name="apply_type">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>维修部位：</text>
        </view>
        <lb-picker
          ref="driverPicker"
          v-model="formData.apply_type"
          :list="$com.applicationTypeList()"
          @confirm="applyTypeChange"
        >
          <ty-picker-frame
            :placeholder="'请选择申请类型'"
            :text="formData.apply_type_name"
          ></ty-picker-frame>
        </lb-picker>
      </uni-forms-item> -->
      <uni-forms-item required name="damage_type">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>损坏类型：</text>
        </view>
        <uni-data-checkbox
          v-model="formData.damage_type"
          selectedColor="#7ccd1f"
          selectedTextColor="#333"
          :localdata="$com.damageTypeList()"
        />
      </uni-forms-item>
      <uni-forms-item required name="apply_reason">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>维修原因：</text>
        </view>
        <uni-easyinput
          placeholderStyle="color: #999999"
          type="textarea"
          autoHeight
          :border="true"
          v-model="formData.apply_reason"
          placeholder="请输入维修原因"
        />
      </uni-forms-item>
      <uni-forms-item required name="img">
        <view slot="left" class="form-label">
          <text class="required-icon">*</text>
          <text>上传图片：</text>
        </view>
        <uni-file-picker
          ref="imagesUpload"
          :auto-upload="false"
          file-mediatype="image"
          v-model="formData.img"
          disable-preview
          mode="grid"
          :image-styles="imageStyles"
          file-extname="png,jpg,jpeg"
          :limit="3"
          @select="selectImg"
          @delete="deleteImg"
        />
        <text class="notes">注：请上传损坏部分图片</text>
      </uni-forms-item>
    </uni-forms>
    <view class="bottom-button">
      <button class="save-button" @click="submit('save')">保存</button>
      <button class="submit-button" @click="submit('submit')">提交</button>
    </view>
  </view>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "ApplyMaintenance",
  data() {
    return {
      error: true,
      formData: {
        license_number: "", // 车牌号
        vehicle_id: "", // 车辆id
        vehicle_name: "", // 车辆类型
        department_name: "", // 部门
        driver_id: "", // 司机
        driver_name: "", // 司机名称
        phone: "", // 联系方式
        total_distance: "", // 总里程
        apply_type: "", // 申请类型
        apply_type_name: "", // 申请类型名称
        damage_type: 1, // 损坏类型
        apply_reason: "", // 维修原因
        img: [], // 图片
      },
      imageStyles: {
        width: 70,
        height: 70,
      },
      rules: {
        license_number: {
          rules: [
            {
              required: true,
              errorMessage: "请输入车牌号",
            },
          ],
          validateTrigger: "submit",
        },
        driver_id: {
          rules: [
            {
              required: true,
              errorMessage: "请选择司机",
            },
          ],
          validateTrigger: "submit",
        },
        total_distance: {
          rules: [
            {
              required: true,
              errorMessage: "请输入总里程",
            },
          ],
          validateTrigger: "submit",
        },
        apply_type: {
          rules: [
            {
              required: true,
              errorMessage: "请选择申请类型",
            },
          ],
          validateTrigger: "submit",
        },
        damage_type: {
          rules: [
            {
              required: true,
              errorMessage: "请选择损坏类型",
            },
          ],
          validateTrigger: "submit",
        },
        apply_reason: {
          rules: [
            {
              required: true,
              errorMessage: "请输入维修原因",
            },
          ],
          validateTrigger: "submit",
        },
        img: {
          rules: [
            {
              required: true,
              errorMessage: "请上传图片",
            },
          ],
          validateTrigger: "submit",
        },
      },
      driverList: [],
    };
  },
  onLoad(options) {
    console.log("getCurrentPages():", getCurrentPages());
    if (options.id) {
      // 修改申请单
      this.$api
        .getApplyMaintenanceDetail({ id: options.id })
        .then((res) => {
          let data = res.data;
          this.formData = {
            id: options.id,
            license_number: data.license_plate_number, // 车牌号
            vehicle_id: data.vehicle_id, // 车辆id
            vehicle_name: data.vehicle_type_name, // 车辆类型
            department_name: data.department_name, // 部门
            driver_id: data.license_plate_number, // 司机
            driver_name: data.driver_id, // 司机名称
            phone: data.license_plate_number, // 联系方式
            total_distance: data.total_distance, // 总里程
            apply_type: data.apply_type, // 申请类型
            apply_type_name:
              data.apply_type === 1
                ? "大修"
                : data.apply_type === 2
                ? "小修"
                : data.apply_type === 3
                ? "保养"
                : "其它", // 申请类型名称
            damage_type: data.damage_type, // 损坏类型
            apply_reason: data.apply_reason, // 维修原因
            img: data.apply_img.map((item) => {
              return {
                name: item,
                extname: "png",
                url: this.$api.getUrl(item),
                pic_url: item,
              };
            }),
          };
          this.licenseNumberConfirm({
            detail: { value: data.license_plate_number },
          });
        })
        .catch(() => {
          uni.showToast({
            icon: "error",
            title: "获取详情失败,请尝试重新进入",
          });
        });
    }
  },

  created() {},
  mounted() {},
  methods: {
    // 输入车牌号
    licenseNumberConfirm(e) {
      console.log("e:", e);
      this.formData.license_number = e.detail.value;
      this.$api
        .getVehicleInfo({ license_plate_number: e.detail.value })
        .then((res) => {
          if (res.data === "") {
            uni.showToast({
              icon: "none",
              title: "没有对应车辆,请重新输入",
            });
          } else {
            this.formData.vehicle_id = res.data.vehicle_id;
            this.formData.vehicle_name = res.data.vehicle_name;
            this.formData.department_name = res.data.department_name;
            this.formData.driver_id = res.data.vehicle_driver[0].driver_id;
            this.formData.vehicle_id = res.data.vehicle_driver[0].vehicle_id;
            this.formData.driver_name = res.data.vehicle_driver[0].driver_name;
            this.formData.phone = res.data.vehicle_driver[0].phone;
            this.driverList = res.data.vehicle_driver.map((item) => {
              item.label = item.driver_name;
              item.value = item.driver_id;
              return item;
            });
            console.log(this.formData, "formData");
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },

    // 点击拍照车牌号
    clickCamera() {
      let that = this;
      uni.chooseImage({
        count: 1,
        success: (res) => {
          uni.uploadFile({
            url: this.$api.uploadFile(),
            filePath: res.tempFilePaths[0],
            name: "pic",
            header: {
              "content-type": "multipart/form-data",
              token: uni.getStorageSync("token"),
            },
            timeout: 10000,
            success: (uploadFileRes) => {
              const img_url = this.$api.getUrl(
                JSON.parse(uploadFileRes.data).data.pic_url
              );
              this.$api.getVehicleNumber({ img_url }).then((res2) => {
                const number = res2.data.number;
                this.licenseNumberConfirm({ detail: { value: number } });
              });
            },
            fail: () => {
              uni.showToast({
                icon: "none",
                title: "图片上传失败,请重试",
              });
            },
          });
        },
        fail: (err) => {
          uni.showToast({
            icon: "none",
            title: "图片选择失败,请重试",
          });
        },
      });
    },

    // 选择了司机
    driverChange(e) {
      this.formData.driver_name = e.item.driver_name;
    },

    // 选择了申请类型
    applyTypeChange(e) {
      this.formData.apply_type_name = e.item.label;
    },

    // 上传图片
    selectImg(e) {
      console.log("选择文件：22", e);
      uni.uploadFile({
        url: this.$api.uploadFile(),
        filePath: e.tempFilePaths[0],
        name: "pic",
        header: {
          "content-type": "multipart/form-data",
          token: uni.getStorageSync("token"),
        },
        timeout: 10000,
        success: (uploadFileRes) => {
          e.tempFiles[0].pic_url = JSON.parse(uploadFileRes.data).data.pic_url;
          this.formData.img.push(e.tempFiles[0]);
        },
        fail: () => {
          uni.showToast({
            icon: "none",
            title: "图片上传失败,请重试",
          });
        },
      });
      console.log("选择文件：22", this.formData.pic_url);
    },

    // 删除图片
    deleteImg(e) {
      this.formData.img = this.formData.img.filter((item) => {
        if (item.path !== e.tempFilePath) {
          return item;
        }
      });
    },

    // 提交
    submit: utils.throttle(function (type) {
      this.$refs.form.validate().then((res) => {
        const formData = this.formData;
        formData.vehicle_img = "";
        formData.apply_img = formData.img
          .map((item) => {
            return item.pic_url;
          })
          .join(",");
        if (type === "save") {
          formData.state = 1;
          (formData.id
            ? this.$api.editApplyMaintenance(formData)
            : this.$api.postApplyMaintenance(formData)
          )
            .then((res) => {
              uni.navigateTo({
                url: `./success?back=detail&text=维修申请保存成功!&id=${res.data.id}&tabActive=0`,
              });
            })
            .catch((err) => {
              uni.showToast({
                icon: "error",
                title: err || "保存失败,请重试",
              });
            });
        }
        if (type === "submit") {
          formData.state = 2;
          this.$api;
          (formData.id
            ? this.$api.editApplyMaintenance(formData)
            : this.$api.postApplyMaintenance(formData)
          )
            .then((res) => {
              uni.navigateTo({
                url: `./success?back=detail&text=维修申请提交成功!&id=${res.data.id}&tabActive=1`,
              });
            })
            .catch((err) => {
              uni.showToast({
                icon: "error",
                title: err || "提交失败,请重试",
              });
            });
        }
      });
    }),
  },
};
</script>

<style lang="scss">
#ApplyMaintenance {
  padding: 10px;
  background-color: #fff;
  .license-number-box {
    width: 70%;
    display: inline-block;
    vertical-align: middle;
  }
  .camera {
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
    right: 5px;
    top: 2px;
    background: #77c81f;
    border-radius: 50%;
    padding: 7px 8px;
  }
  .bottom-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
  }

  .save-button {
    width: 48%;
    background-color: #bcbcbc;
    color: #fff;
  }

  .submit-button {
    width: 48%;
    background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
    color: #fff;
  }

  .notes {
    color: #8e8e8e;
    margin-top: 5px;
    font-size: 10px;
    display: inline-block;
  }
  .text-center {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .text-placeholder {
    color: #999999;
  }
  input {
    padding-left: 0px !important;
  }
}
</style>
