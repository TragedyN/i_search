// 获取应用实例
const app = getApp()
// 团队服务器php接口地址
const URL = app.globalData.SERVER_URL + 'api.php'
// 图片存储url
const PATH = app.globalData.SERVER_URL + 'upload/problem/'

Page({
    data: {
        winHeight: "", // 窗口高度
        currentTab: 0, // 预设当前项的值
        scrollLeft: 0, // tab标题的滚动条位置
        collection_q_list: [], // 搜题收藏列表
        collection_p_list: [], // 问答收藏列表
        imagePath: PATH, // 答案图片路径前缀
    },
    // 滚动切换标签样式
    switchTab: function(e) {
        this.setData({
            currentTab: e.detail.current
        });
        this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function() {
        if (this.data.currentTab > 4) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    onLoad: function() {
        var that = this;
        //  高度自适应
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                that.setData({
                    winHeight: calc
                });
            }
        });
    },
    footerTap: app.footerTap,

    onShow: function() {
        var that = this
        // 获取搜题收藏列表
        wx.request({
            url: URL + '?op=collection_q_list',
            method: 'POST',
            data: {
                openid: app.globalData.openid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res)
                that.setData({
                    collection_q_list: res.data.collectionList
                })
            }
        })
        // 获取问答收藏列表
        wx.request({
            url: URL + '?op=collection_p_list',
            method: 'POST',
            data: {
                openid: app.globalData.openid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    collection_p_list: res.data.collectionList
                })
            }
        })
    },

    /**
     * 操作
     * @function operate_q(e) [搜题]选项卡"更多"操作
     * @function operate_p(e) [问答]选项卡"更多"操作
     */
    operate_q: function(e) {
        var that = this
        wx.showActionSheet({
            itemList: ['取消收藏'],
            success(res) {
                // 删除操作
                if (res.tapIndex == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '取消收藏后记录将不再保存，确定要删除吗？',
                        success(res) {
                            if (res.confirm) {
                                wx.request({
                                    url: URL + '?op=delcollection_q',
                                    method: 'POST',
                                    data: {
                                        openid: app.globalData.openid,
                                        qid: e.currentTarget.dataset.qid
                                    },
                                    header: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    success: function(res) {
                                        wx.showToast({
                                            title: '取消收藏',
                                            duration: 1000,
                                        })
                                        that.onShow()
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    operate_p: function (e) {
        console.log(e)
        var that = this
        wx.showActionSheet({
            itemList: ['取消收藏'],
            success(res) {
                // 删除操作
                if (res.tapIndex == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '取消收藏后记录将不再保存，确定要删除吗？',
                        success(res) {
                            if (res.confirm) {
                                wx.request({
                                    url: URL + '?op=delcollection_p',
                                    method: 'POST',
                                    data: {
                                        openid: app.globalData.openid,
                                        pid: e.currentTarget.dataset.pid
                                    },
                                    header: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    success: function (res) {
                                        wx.showToast({
                                            title: '取消收藏',
                                            duration: 1000,
                                        })
                                        that.onShow()
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    // 预览图片
    preview: function (e) {
        var src = e.currentTarget.dataset.src
        wx.previewImage({
            urls: [src],
            current: src
        })
    },

    // 跳转至详情
    jumpToDetail: function(e) {
        var url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url,
        })
    }
})