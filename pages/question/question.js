// pages/question/question.js

// 获取应用实例
const app = getApp()
// 团队服务器php接口地址
const URL = app.globalData.SERVER_URL + 'api.php'
// 图片存储url
const PATH = app.globalData.SERVER_URL + 'upload/question/'
// 常用工具函数库
var util = require('../../utils/util.js');

Page({
    data: {
        action: '', // 动作:搜索or拍照
        result: null, // 搜题结果
        showImage: true, // 是否显示图片
        imageSrc: '', // 题目图片路径
        imagePath: PATH, // 答案图片路径前缀
        q_ratio: 0.0, // 题目图片宽高比
        a_ratio: 0.0, // 答案图片宽高比
        collected: false, // 是否已收藏
    },

    onLoad: function(options) {
        console.log(unescape(options.result))
        var that = this
        // 如果是手动搜索，则不显示图片
        if (options.action == 'input') {
            that.setData({
                action: 'input',
                query: options.result,
                showImage: false
            })
        } else if (options.action == 'photo') {
            that.setData({
                action: 'photo',
                query: options.result,
                imageSrc: options.tmpFilePath
            })
        }
        // 题目发送至团队服务器，返回相似度最高的答案解析
        wx.request({
            url: URL + '?op=searchquestion',
            data: {
                wd: options.result.replace(/=/, escape('='))
            },
            success(res) {
                console.log(res)
                that.setData({
                    result: res.data.result
                })
                // 获取题目图片宽高比
                wx.getImageInfo({
                    src: options.tmpFilePath,
                    success: function(res) {
                        that.setData({
                            q_ratio: res.height / res.width
                        })
                    }
                })
                // 获取答案图片宽高比
                wx.getImageInfo({
                    src: that.data.imagePath + res.data.result.answer,
                    success: function(res) {
                        that.setData({
                            a_ratio: res.height / res.width
                        })
                    }
                })
                // 判断是否已收藏
                wx.request({
                    url: URL + '?op=iscollected_q',
                    data: {
                        openid: app.globalData.openid,
                        qid: that.data.result.id
                    },
                    success(res) {
                        that.setData({
                            collected: res.data.collected
                        })
                    }
                })
            }
        })
    },

    // 在线求问
    jumpOnline: function() {
        var that = this
        wx.navigateTo({
            url: '../response/response?op=addproblem&content=' + that.data.query,
        })
    },

    // 拍照入口
    takePhoto: function () {
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 跳转至图片裁剪页面
                wx.navigateTo({
                    url: '../clip/clip?imageSrc=' + res.tempFilePaths[0],
                })
            },
        })
    },

    // 自定义分享内容
    onShareAppMessage: function(res) {
        var action = this.data.action
        var result = this.data.result
        var tmpFilePath = this.data.imageSrc
        return {
            title: '我在i搜题搜到了这道题的答案，快来看看吧',
            path: '/pages/question/question?action=' + action + '&result=' + escape(result) + '&tmpFilePath=' + tmpFilePath
        }
    },

    // 收藏
    collect: function() {
        var that = this
        var currentUrl = util.getCurrentPageUrlWithArgs()
        // 是否登录
        if (!app.isLogin()) {
            // 设置全局回跳url
            app.globalData.callbackUrl = currentUrl
        }
        // 发起请求
        if (!that.data.collected) { // 收藏
            wx.request({
                url: URL + '?op=addcollection_q',
                method: 'POST',
                data: {
                    openid: app.globalData.openid,
                    qid: that.data.result.id,
                    url: currentUrl
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
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
                url: URL + '?op=delcollection_q',
                method: 'POST',
                data: {
                    openid: app.globalData.openid,
                    qid: that.data.result.id
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