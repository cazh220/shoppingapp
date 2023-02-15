<template>
  <view id="ReportRecord">
    <view class="header-flxed">
      <view class="top">
        <view><text style="margin: 0 20px 0 10px">事件类型:</text></view>
        <lb-picker ref="driverPicker" v-model="eventId" :list="eventTypes" style="display: inline-block" @confirm="selectAssessName">
          <ty-picker-frame placeholder="请选择事件类型" :text="eventName"></ty-picker-frame>
        </lb-picker>
        <!-- <icon type="clear" v-if="eventId"  /> -->
        <view v-if="eventId" @click="clear" style="margin-top: 5px"><icon type="clear"/></view>
      </view>
      <view class="tabs"><liuyuno-tabs :config="tabsConfig" :tabData="statusList" :activeIndex="currentTab" @tabClick="tabClick"/></view>
    </view>
    <view style="margin-top: 90px;">
      <xw-empty :isShow="orderEmptyShow" text="暂无相关数据" textColor="#777777"></xw-empty>
      <view class="list" v-for="item in list" :key="item.id">
        <uni-list :border="false">
          <template slot="top">
            <view class="box-one">
              <view>
                <text>事件编号：</text>
                <text>{{ item.serial_number }}</text>
              </view>
              <view v-if="item.is_qualified === 2"><text style="color: #fd5555">不合格</text></view>
              <view v-if="item.is_qualified === 1"><text style="color: rgba(22, 125, 243, 1)">合格</text></view>
            </view>
          </template>
          <uni-list-item :border="false" title="上报人:" :rightText="item.report_name"></uni-list-item>
          <uni-list-item :border="false" title="上报时间:" :rightText="item.report_time"></uni-list-item>
          <uni-list-item :border="false" title="事件类型:" :rightText="item.type_text"></uni-list-item>
          <uni-list-item :border="false" title="事件描述:" :rightText="item.describe"></uni-list-item>
          <uni-list-item :border="false" title="上报图片:">
            <template slot="footer">
              <image
                v-for="(iitem, index) in item.pic_url"
                :key="index"
                :src="$api.getUrl(iitem)"
                style="width: 50px; height: 50px; margin-left: 5px"
                alt="暂无图片"
              />
            </template>
          </uni-list-item>
          <uni-list-item :border="false" title="事件地址:" :rightText="item.address"></uni-list-item>
          <uni-list-item :border="false" title="处理人:" :rightText="item.conductor_name"></uni-list-item>
          <template slot="footer">
            <view v-if="currentTab === 0 && ReportRecordHandle" class="list-footer">
              <button size="mini" class="button-primary fr ml10 red" @click="viewHandle(item.id)">处理</button>
            </view>
            <view v-if="currentTab === 1 && ReportRecordReview" class="list-footer">
              <button size="mini" class="button-primary fr ml10 orange" @click="review(item.id)">审查</button>
            </view>
            <view v-if="currentTab === 2 && ReportRecordDetail" class="list-footer">
              <button size="mini" class="button-primary fr" @click="viewDetail(item.id)">查看详情</button>
            </view>
          </template>
        </uni-list>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ReportRecord",
  data() {
    return {
      // Handle:"",
      tabsConfig: {
        activeColor: "#77C81F"
      },
      eventId: 0,
      eventName: "",
      orderEmptyShow: false,
      eventTypes: [
        { value: 1, label: "道路清扫保洁" },
        { value: 2, label: "道路洒水清洗" },
        { value: 3, label: "果皮箱清掏维护" },
        { value: 4, label: "垃圾转运" },
        { value: 5, label: "消杀" },
        { value: 6, label: "清除牛皮癣" },
        { value: 7, label: "其他" }
      ],

      currentTab: 0, //预设当前项的值
      statusList: ["待处理", "已处理", "已完成"],
      page: 1,
      list: []
    }
  },
  onLoad(option) {
    if (option.currentTab) {
      this.currentTab = +option.currentTab
    }
    this.search()
    this.eventTypes.map(item => {
      // item.label = item.name;
      // item.value = item.value;
      return item
    })
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
        icon: "none",
        title: "已经到底了"
      })
    }
  },

  computed: {
    ReportRecordHandle() {
      return this.$com.getPermission("ReportRecordHandle")
    },
    ReportRecordReview() {
      return this.$com.getPermission("ReportRecordReview")
    },
    ReportRecordDetail() {
      return this.$com.getPermission("ReportRecordDetail")
    }
  },
  methods: {
    // 选择考核标准
    selectAssessName(e) {
      console.log(e, "e")
      this.eventId = e.item.value
      this.eventName = e.item.label
      this.search()
    },
    // 搜索
    search() {
      const data = {
        type: this.eventId,
        page: this.page
      }
      ;(this.currentTab === 0 ? this.$api.getPending(data) : this.currentTab === 1 ? this.$api.getProcessed(data) : this.$api.getFinished(data)).then(
        res => {
          this.list = res.data.data
          this.orderEmptyShow = this.list.length === 0 ? true : false
          this.last_page = res.data.last_page
        },
        fail => {
          this.list = []
          uni.showToast({
            title: fail || "获取数据错误",
            icon: "none",
            duration: 2000
          })
        }
      )
    },
    // 选择标签
    tabClick(e) {
      this.currentTab = e
      console.log("e:", e)
      this.search()
    },

    // 清除
    clear() {
      console.log("清除:")
      this.eventName = ""
      this.eventId = 0
      this.search()
    },
    //处理
    viewHandle(id) {
      console.log("处理")
      uni.navigateTo({
        url: "./handle?id=" + id
      })
    },
    //审查
    review(id) {
      uni.navigateTo({
        url: "./review?id=" + id
      })
    },
    //查看详情
    viewDetail(id) {
      console.log("查看详情")
      uni.navigateTo({
        url: "./event-detail?id=" + id
      })
    }
  }
}
</script>

<style lang="scss">
#ReportRecord {
  .top {
    // margin: 10px 10px 0 10px;
    display: flex;
    flex-flow: row;
    line-height: 40px;
    width: 100%;
  }
  .tabs {
    background-color: #fff;
    // margin-top: 50px;
  }
  .ty-picker {
    width: 480rpx;
  }
  .ty-picker .ty-picker-right {
    margin-left: 200rpx;
  }

  .list {
    margin-bottom: 10px;
    // margin-top: 200rpx;

    .box-one {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      margin: 10px 16px;
    }

    .uni-list-item__content {
      min-width: 60px;
    }

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
      background-color: #00c6ff;
    }

    .orange {
      background-color: #ff986a;
    }

    .red {
      background-color: #fd5555;
    }
  }
}
</style>
