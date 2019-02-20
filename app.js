//app.js
App({
    onLaunch: function() {
        var that = this
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url:
                    success: function(res) {
                        that.globalData.openid = res.data.openid
                        that.globalData.session_key = res.data.session_key
                    }
                })
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({

                        success: res => {

                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },

    // 全局变量
    globalData: {
        // 用户信息
        userInfo: null,
        // 用户唯一标识
        openid: '',
        // 会话密钥
        session_key: '',
        // 翻译API应用ID
        appKey: "",
        // 翻译API应用密钥
        secretKey: "",
        // 团队服务器地址
        SERVER_URL: "",
        // 页面回跳url
        callbackUrl: ''
    },

    /**
     * 检验用户是否登录
     * @return {boolean} user is logged or not
     */
    isLogin: function() {
        var userInfo = this.globalData.userInfo
        if (!userInfo) {
            wx.showModal({
                title: '提示',
                content: '请先进行登录哦',
                success(res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '../info/info',
                        })
                    }
                }
            })
            return false
        }
        return true
    }
})