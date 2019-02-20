// pages/online_detail/online_detail.js

// 获取应用实例
const app = getApp()
// 团队服务器php接口地址
const URL = app.globalData.SERVER_URL + 'api.php'
// 图片存储url
const PATH = app.globalData.SERVER_URL + 'upload/'
// 常用工具函数库
var util = require('../../utils/util.js');

Page({
    data: {
        user: null, // 提问者信息
        imagePath: PATH, // 图片路径前缀
        responseList: [], // 回答列表
        collected: false, // 是否已收藏
    },

    onLoad: function(options) {
        var that = this
        that.setData({
            user: JSON.parse(options.user)
        })
        // 获取回答列表
        wx.request({
            url: URL + '?op=responselist',
            data: {
                pid: that.data.user.id
            },
            success(res) {
                console.log(res)
                that.setData({
                    responseList: res.data.response_list
                })
            }
        })
        // 判断是否已收藏
        wx.request({
            url: URL + '?op=iscollected_p',
            data: {
                openid: app.globalData.openid,
                pid: that.data.user.id
            },
            success(res) {
                that.setData({
                    collected: res.data.collected
                })
            }
        })
    },

    onShow: function() {
        var that = this
        // 获取回答列表
        wx.request({
            url: URL + '?op=responselist',
            data: {
                pid: that.data.user.id
            },
            success(res) {
                console.log(res)
                that.setData({
                    responseList: res.data.response_list
                })
            }
        })
    },

    // 回答问题
    answer: function() {
        wx.navigateTo({
            url: '../response/response?op=answerproblem&user=' + JSON.stringify(this.data.user)
        })
    },

    // 自定义分享内容
    onShareAppMessage: function(res) {
        var userInfo = JSON.stringify(this.data.user)
        return {
            title: '我在XXX搜到了这道题的答案，快来看看吧',
            path: '/pages/online_detail/online_detail?user=' + userInfo
        }
    },

    // 收藏
    collect: function() {
        var that = this
        var currentUrl = util.getCurrentPageUrlWithArgs()
        // 是否登录
        if (!app.isLogin()) {
            var userInfo = JSON.stringify(this.data.user)
            // 设置全局回跳url
            app.globalData.callbackUrl = '/pages/online_detail/online_detail?user=' + userInfo
        }
        // 发起请求
        if (!that.data.collected) { // 收藏
            wx.request({
                url: URL + '?op=addcollection_p',
                method: 'POST',
                data: {
                    openid: app.globalData.openid,
                    pid: that.data.user.id,
                    url: currentUrl
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                    console.log(res)
                    wx.showToast({
                        title: '收藏成功',
                        duration: 1000,
                    })
                    that.setData({
                        collected: true
                    })
                }
            })
        } else { // 取消收藏
            wx.request({
                url: URL + '?op=delcollection_p',
                method: 'POST',
                data: {
                    openid: app.globalData.openid,
                    pid: that.data.user.id
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                    wx.showToast({
                        title: '取消收藏',
                        duration: 1000,
                    })
                    that.setData({
                        collected: false
                    })
                }
            })
        }
    }
})