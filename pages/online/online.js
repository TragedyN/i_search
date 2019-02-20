// pages/online/online.js

// 获取应用实例
const app = getApp()
// 团队服务器php接口地址
const URL = app.globalData.SERVER_URL + 'api.php'
// 图片存储url
const PATH = app.globalData.SERVER_URL + 'upload/problem/'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        problemList: [], // 问题列表
        imagePath: PATH, // 图片路径前缀
    },

    onLoad: function() {
        var that = this
        wx.request({
            url: URL + '?op=problemlist',
            success(res) {
                that.setData({
                    problemList: res.data.problem_list
                })
            }
        })
    },

    onShow: function() {
        var that = this
        wx.request({
            url: URL + '?op=problemlist',
            success(res) {
                that.setData({
                    problemList: res.data.problem_list
                })
            }
        })
    },

    // 查看详情
    detail: function(e) {
        var user = e.currentTarget.dataset.user
        console.log(user)
        wx.navigateTo({
            url: '../online_detail/online_detail?user=' + JSON.stringify(user)
        })
    },

    // 预览图片
    preview: function(e) {
        var src = e.currentTarget.dataset.src
        wx.previewImage({
            urls: [src],
            current: src
        })
    },

    // 回答问题
    answer: function(e) {
        var user = e.currentTarget.dataset.user
        wx.navigateTo({
            url: '../response/response?op=answerproblem&user='+JSON.stringify(user)
        })
    }
})