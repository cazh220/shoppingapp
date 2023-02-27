//app.js
App({
    onLaunch: function () {
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.systemInfo = res
            }
        })

        // 获取版本变量  develop(开发版) trial(体验版)  release(正式版)
        const accountInfo = wx.getAccountInfoSync()
        this.globalData.env = accountInfo.miniProgram.envVersion
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate((res) => {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(() => {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success(res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(() => {
                        wx.showModal({
                            title: '提示',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
            })
        }

    },
    onShow() {
        // 构建userInfo
        const userInfo = wx.getStorageSync('userInfo') || '';
        this.globalData.userInfo = userInfo
    },
    // 隐藏原生tabbar
    hideTabBar() {
        wx.hideTabBar({
            fail: function () {
                setTimeout(function () {
                    // 做了个延时重试一次，作为保底。
                    wx.hideTabBar()
                }, 500)
            },
        })
    },
    editTabbar: function () {
        let tabbar = this.globalData.tabBar
        let currentPages = getCurrentPages()
        let _this = currentPages[currentPages.length - 1]
        let pagePath = _this.route
        pagePath.indexOf("/") != 0 && (pagePath = "/" + pagePath)
        for (let i in tabbar.list) {
            tabbar.list[i].selected = false
            tabbar.list[i].pagePath == pagePath && (tabbar.list[i].selected = true)
        }
        _this.setData({
            tabbar: tabbar,
        })
    },
    methods: {
        selectPop() {
            console.log("selectPopselectPopselectPop")
        }
    },
    globalData: {
        env: "",
        systemInfo: null,
        userInfo: null,
        plot: null,
        token: null,
        expiredTime: 0,
        tabBar: {
            backgroundColor: "#ffffff",
            color: "#979795",
            selectedColor: "#1c1c1b",
            list: [{
                    pagePath: "/pages/index/index",
                    iconPath: "icon/home.png",
                    selectedIconPath: "icon/home@selected.png",
                    text: "首页",
                },
                {
                    pagePath: "/pages/scan/scan",
                    iconPath: "icon/code.png",
                    selectedIconPath: "icon/code.png",
                    text: "",
                    isSpecial: true
                },
                {
                    pagePath: "/pages/mine/mine",
                    iconPath: "icon/my.png",
                    selectedIconPath: "icon/my@selected.png",
                    text: "我的",
                },
            ],
        },
    }
})