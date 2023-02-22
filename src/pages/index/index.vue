<!-- 登陆/小程序入口 -->
<template>
  <view class="container">
    <view class="login-bg">
      <view class="title">
        <view class="head_title">购物小程序</view>
      </view>
    </view>

    <view class="login">
      <view class="login-form">
        <form class="form" @submit="formSubmit">
          <view class="list user flex-between">
            <image class="flex-auto icon" src="../../static/images/shouji.png" mode="aspectFit" />
            <input
              class="flex-long"
              name="username"
              :value="formData.username"
              type="number"
              maxlength="11"
              placeholder-class="placeholder-style"
              placeholder="请输入手机号"
            />
            <image class="flex-auto showpwd" mode="aspectFit" />
          </view>
          <view class="list pwd flex-between">
            <image class="flex-auto icon" src="../../static/images/password-green.png" mode="aspectFit" />
            <input
              class="flex-long"
              name="userpwd"
              :password="isShowPwd"
              :value="formData.userpwd"
              placeholder-class="placeholder-style"
              placeholder="请输入密码"
            />
            <image class="flex-auto showpwd" :src="pwdUrl" @click="pwdBtn" mode="aspectFit" />
          </view>
          <view class="login_list button flex-between"><button type="primary" form-type="submit">登录</button></view>
          <view class="fogetpwd_list fogetpwd flex-between"><navigator :url="forgetpwdUrl" hover-class="navigator-hover">没有账号？请注册</navigator></view>
        </form>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isShowPwd: true,
      pwdUrl: "../../static/images/offpwd.png",
      forgetpwdUrl: "../password/forgetpwd",
      formData: {
        username: "",
        userpwd: ""
      }
    }
  },
  onLoad() {
    // 默认填充最后一次登陆的账号
    let account = uni.getStorageSync("account") || ""
    this.formData.username = account
  },
  methods: {
    formSubmit(e) {
      this.formData = e.detail.value
      // 登录验证
      let data = {
        phone: this.formData.username || "",
        password: this.formData.userpwd || ""
      }
	  
	  console.log('data', data)
      this.$api.login(data).then(
        res => {
		  uni.setStorageSync("userInfo", res.data)
          // uni.setStorageSync("token", res.data.token)
          // uni.setStorageSync("login_user", res.data)
          // uni.setStorageSync("account", res.data.account)
          // let permissionList = []
          // res.data.menus.forEach(item => {
          //   item.children.forEach(sitem => {
          //     sitem.children.forEach(ssitem => {
          //       ssitem.children.forEach(sssitem => {
          //         if (sssitem.key) permissionList.push(sssitem.key)
          //       })
          //     })
          //   })
          // })
          // uni.setStorageSync("permissionList", permissionList)
		 //  this.$api.userDetail({phone: this.formData.username}).then(
			
		 //  )
		  
          uni.switchTab({
            url: "../home/home"
          })
          console.log("登录成功", uni)
        },
        fail => {
          uni.showToast({
            title: "账号或密码错误2",
            icon: "none",
            duration: 2000
          })
        }
      )
    },
    /**
     * 密码显示隐藏切换
     */
    pwdBtn() {
      if (this.isShowPwd) {
        this.isShowPwd = false
        this.pwdUrl = "../../static/images/onpwd.png"
      } else {
        this.isShowPwd = true
        this.pwdUrl = "../../static/images/offpwd.png"
      }
    }
  }
}
</script>

<style>
page {
  font-size: 28rpx;
}

.title {
  color: #ffffff;
  font-size: 48rpx;
  padding: 150rpx 30rpx;
  width: 100%;
}

.head_title {
  line-height: 70rpx;
}

.login-bg {
  min-height: 352rpx;
  background: #2d89fb;
  padding: 30rpx 30rpx 79rpx 40rpx;
  border-bottom-left-radius: 80rpx;
  border-bottom-right-radius: 80rpx;
  background: url("https://image.jsyinghuan.com/huanwei/login-bg.png");
  background-size: 100% 100%;
}

.login {
  padding: 0 30rpx;
  position: relative;
  top: -100rpx;
  height: 100rpx;
  /* background-color: #FFFFFF; */
}

.login-form {
  padding: 0 40rpx;
  box-shadow: 1px 1px 15px #c0c0c0;
  background-color: #ffffff;
  border-radius: 30rpx;
}

.list {
  border-bottom: 1rpx solid #dadada;
  padding: 60rpx 0 20rpx;
}

.list input {
  padding-left: 50rpx;
}

.login_list {
  padding: 100rpx 0 20rpx;
}

.fogetpwd_list {
  padding: 50rpx 0 50rpx;
}

.form .list .icon {
  width: 36rpx;
  height: 52rpx;
  display: inline-block;
}

.form .list .showpwd {
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
}

.button button {
  background: linear-gradient(90deg, #7dce20 0%, #67b616 100%);
  border-radius: 100rpx;
  color: #fff;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  width: 100%;
}

.fogetpwd {
  margin: 0 auto;
  width: 160px;
  color: #999999;
}
</style>
