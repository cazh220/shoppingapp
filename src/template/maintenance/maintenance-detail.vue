<template>
  <view id="MaintenanceDetail">
    <uni-collapse accordion>
      <uni-collapse-item name="0" :open="open" title="维修申请信息"><Created :showFormData="data" ref="created"></Created></uni-collapse-item>
      <uni-collapse-item v-if="status >= 1" :open="open" name="1" title="维修报价信息">
        <Quoted :showFormData="data" :readOnly="status > 1" ref="quoted"></Quoted>
      </uni-collapse-item>
      <uni-collapse-item v-if="status >= 2" :open="open" name="2" title="维修审核信息">
        <Examine :showFormData="data" :readOnly="status > 2" :examineType="examineType" :orderId="id" ref="examine"></Examine>
      </uni-collapse-item>
      <uni-collapse-item v-if="status >= 3" :open="open" name="3" title="维修信息">
        <Repaired :showFormData="data" :readOnly="status > 3" ref="repaired"></Repaired>
      </uni-collapse-item>
      <uni-collapse-item v-if="status >= 4" :open="open" name="4" title="确认信息">
        <Confirmed :showFormData="data" :readOnly="status > 4" ref="confirmed"></Confirmed>
      </uni-collapse-item>
      <uni-collapse-item v-if="status >= 5" :open="open" name="5" title="反馈信息">
        <FedBack :showFormData="data" :readOnly="status > 5" ref="fedBack"></FedBack>
      </uni-collapse-item>
    </uni-collapse>
    <view v-if="status !== 6" class="bottom-button">
      <block v-if="status === 0">
        <button v-if="EditMaintenance" class="left-button fs32r" @click="editForm">修改</button>
        <button class="right-button fs32r" @click="submitForm">提交</button>
      </block>
      <button v-else class="submit-button fs32r" @click="submitForm">提交</button>
    </view>
  </view>
</template>

<script>
import Created from "./maintenance-detail/created" // 已创建
import Quoted from "./maintenance-detail/quoted" // 待报价
import Examine from "./maintenance-detail/examine" // 待审核
import Repaired from "./maintenance-detail/repaired" // 待维修
import Confirmed from "./maintenance-detail/confirmed" // 待确认
import FedBack from "./maintenance-detail/fedback" // 待反馈

export default {
  components: { Created, Quoted, Examine, Repaired, Confirmed, FedBack },
  data() {
    return {
      data: {},
      id: 0,
      serial_number: "", // 编号 消息管理进入需要用到
      examineType: "examine",
      status: 0,
      open: false
    }
  },
  onLoad(options) {
    this.id = +options.id || ""
    this.serial_number = options.serial_number || ""
    this.status = +options.open
    this.examineType = options.type || "examine"
    this.getDetail()
  },
  computed: {
    EditMaintenance() {
      return this.$com.getPermission("EditMaintenance")
    }
  },
  methods: {
    getDetail() {
      this.$api.getApplyMaintenanceDetail({ id: this.id, serial_number: this.serial_number }).then(res => {
        let data = res.data
        for (let key in data) {
          if (!data[key] || data[key] === null) {
            data[key] = ""
          }
        }
        data.damage_type_name = data.damage_type === 1 ? "正常损坏" : data.damage_type === 2 ? "人为损坏" : data.damage_type === 3 ? "其它" : ""
        data.offer_type_name =
          data.offer_type === 1 ? "大修" : data.offer_type === 2 ? "小修" : data.offer_type === 3 ? "保养" : data.offer_type === 4 ? "其它" : ""
        data.apply_type_name =
          data.apply_type === 1 ? "大修" : data.apply_type === 2 ? "小修" : data.apply_type === 3 ? "保养" : data.apply_type === 4 ? "其它" : ""
        data.survey_damage_type_name =
          data.survey_damage_type === 1 ? "正常损坏" : data.survey_damage_type === 2 ? "人为磨损" : data.survey_damage_type === 3 ? "其它" : ""
        this.data = data
        this.open = true
      })
    },

    // 修改
    editForm() {
      uni.redirectTo({ url: `./apply-maintenance?id=${this.id}` })
    },

    // 提交
    submitForm() {
      if (this.status === 0) {
        console.log("已创建提交:")
        let data = {
          vehicle_id: this.data.vehicle_id,
          driver_id: this.data.driver_id,
          total_distance: this.data.total_distance,
          apply_type: this.data.apply_type,
          damage_type: this.data.damage_type,
          apply_reason: this.data.apply_reason,
          state: 2,
          apply_img: this.data.apply_img.join(","),
          id: this.id,
          vehicle_img: ""
        }
        this.$api
          .editApplyMaintenance(data)
          .then(res => {
            uni.redirectTo({ url: `./success?back=detail&text=${res.msg}!&id=${this.id}&tabActive=1` })
          })
          .catch(err => {
            uni.showToast({
              icon: "none",
              duration: 2000,
              title: err || "保存失败,请重试"
            })
          })
      }

      if (this.status === 1) {
        console.log("待报价提交:", this.$refs.quoted)
        this.$refs.quoted.$refs.quotedForm.validate().then(res => {
          res.offer_img = res.img
            .map(item => {
              return item.pic_url
            })
            .join(",")
          res.id = this.id
          this.$api
            .postMaintenanceQuoted(res)
            .then(res2 => {
              uni.redirectTo({ url: `./success?back=list&text=${res2.msg}!&id=${this.id}&tabActive=2` })
            })
            .catch(err => {
              uni.showToast({
                icon: "none",
                duration: 2000,
                title: err || "报价失败,请重试"
              })
            })
        })
      }

      if (this.status === 2) {
        console.log("待审核提交:")
        this.$refs.examine.$refs.examineForm.validate().then(res => {
          res.survey_img = res.img
            .map(item => {
              return item.pic_url
            })
            .join(",")
          res.id = this.id
          this.$api
            .postMaintenanceExamine(res)
            .then(res2 => {
              uni.redirectTo({ url: `./success?back=list&text=${res2.msg}!&id=${this.id}&tabActive=2` })
            })
            .catch(err => {
              console.log("err:", err)
              uni.showToast({
                icon: "none",
                duration: 2000,
                title: err || "审核失败,请重试"
              })
            })
        })
      }

      if (this.status === 2.5) {
        console.log("待审批提交:")
        this.$refs.examine.$refs.approveForm.validate().then(res => {
          res.id = this.id
          this.$api
            .postMaintenanceProcess(res)
            .then(res2 => {
              uni.redirectTo({ url: `./success?back=list&text=${res2.msg}!&id=${this.id}&tabActive=3` })
            })
            .catch(err => {
              console.log("err:", err)
              uni.showToast({
                icon: "none",
                duration: 2000,
                title: err || "审批失败,请重试"
              })
            })
        })
      }

      if (this.status === 3) {
        console.log("待维修提交:")
        this.$refs.repaired.$refs.repairedform.validate().then(res => {
          res.maintenance_img = res.img
            .map(item => {
              return item.pic_url
            })
            .join(",")
          res.id = this.id
          this.$api
            .postMaintenanceImg(res)
            .then(res2 => {
              uni.redirectTo({ url: `./success?back=list&text=${res2.msg}!&id=${this.id}&tabActive=4` })
            })
            .catch(err => {
              uni.showToast({
                icon: "none",
                duration: 2000,
                title: err || "维修图片上传失败,请重试"
              })
            })
        })
      }

      if (this.status === 4) {
        console.log("待确认提交:")
        this.$refs.confirmed.$refs.confirmedForm.validate().then(res => {
          res.id = this.id
          this.$api
            .postMaintenanceConfirm(res)
            .then(res2 => {
              uni.redirectTo({ url: `./success?back=list&text=${res2.msg}!&id=${this.id}&tabActive=5` })
            })
            .catch(err => {
              uni.showToast({
                icon: "none",
                duration: 2000,
                title: err || "确认失败,请重试"
              })
            })
        })
      }

      if (this.status === 5) {
        console.log("待反馈提交:")
        this.$refs.fedBack.$refs.fedBackForm.validate().then(res => {
          res.id = this.id
          this.$api
            .postMaintenanceFeedback(res)
            .then(res2 => {
              uni.redirectTo({ url: `./success?back=list&text=${res2.msg}!&id=${this.id}&tabActive=6` })
            })
            .catch(err => {
              uni.showToast({
                icon: "none",
                duration: 2000,
                title: err || "反馈失败,请重试"
              })
            })
        })
      }
    }
  }
}
</script>

<style lang="scss">
#MaintenanceDetail {
  .uni-collapse-item__title {
    .uni-collapse-item__title-text {
      color: #77c81f;
    }
    .uni-icons {
      color: #77c81f !important;
    }
  }
  .bottom-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    .left-button {
      width: 48%;
      background-color: #bcbcbc;
      color: #fff;
    }
    .right-button {
      width: 48%;
      background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
      color: #fff;
    }
    .submit-button {
      width: 80%;
      background: linear-gradient(90deg, #7dce20 0%, #64b412 100%);
      color: #fff;
    }
  }
  input {
    padding-left: 0px !important;
  }
}
</style>
