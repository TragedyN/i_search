// pages/myquestion/myquestion.js

// 获取应用实例
const app = getApp()
// 团队服务器php接口地址
const URL = app.globalData.SERVER_URL + 'api.php'
// 图片存储url
const PATH = app.globalData.SERVER_URL + 'upload/problem/'

Page({
    data: {
        problemList: [], // 提问列表
        imagePath: PATH, // 图片路径前缀
    },

    onLoad: function() {
        var that = this
        wx.request({
            url: URL + '?op=myproblem',
            method: 'POST',
            data: {
                openid: app.globalData.openid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
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

    // 右上角操作
    operate: function(e) {
        var that = this
        wx.showActionSheet({
            itemList: ['删除'],
            success(res) {
                // 删除操作
                if (res.tapIndex == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '删除后记录将不再保存，确定要删除吗？',
                        success(res) {
                            if (res.confirm) {
                                wx.request({
                                    url: URL + '?op=delmyproblem',
                                    data: {
                                        pid: e.currentTarget.dataset.pid
                                    },
                                    success(res) {
                                        wx.showToast({
                                            title: '删除成功',
                                        })
                                        that.onLoad()
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    }
})