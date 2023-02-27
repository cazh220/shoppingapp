// components/popup.js
import util from '../../utils/util'
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '标题'
    },
    cancel: {
      type: String,
      value: '取消'
    },
    confirm: {
      type: String,
      value: '确认'
    } 
  },
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false
  },
  methods: {
    //隐藏弹框
    hidePopup: function () {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    // //展示弹框
    showPopup: util.debounce(function(e){      
      let that = this
        that.setData({
        isShow: !this.data.isShow
      })
      that.triggerEvent('confirm' ,1)
    })
    // showPopup () {
    //   let that = this
    //   console.log(666666666);
      
    //   util.throttle(function(e){
    //     console.log(77777);
        
    //     that.setData({
    //       isShow: !this.data.isShow
    //     })
    //     that.triggerEvent('confirm' ,1)
    //   })
    // }
  }
})