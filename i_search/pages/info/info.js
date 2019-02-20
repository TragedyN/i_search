// pages/info/info.js

// 获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        authorized: false,
        avatar: '../../images/info/default_avatar.png',
        nickname: '点击登录'
    },

    onLoad: function(options) {
        var userInfo = app.globalData.userInfo
        if (userInfo) {
            this.setData({
                avatar: userInfo.avatarUrl,
                nickname: userInfo.nickName,
                authorized: true
            })
        } else {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    avatar: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName,
                    authorized: true
                })
            }
        }
    },

    // 跳转--->我的提问
    jumpToMyproblem: function() {
        if (app.isLogin()) {
            wx.navigateTo({
                url: '../myproblem/myproblem',
            })
        }
    },

    // 跳转--->我的收藏
    jumpToMycollection:function(){
        if (app.isLogin()) {
            wx.navigateTo({
                url: '../mycollection/mycollection',
            })
        }
    },

    // 跳转--->我的消息
    jumpToMyMessage:function(){
        if (app.isLogin()) {
            wx.navigateTo({
                url: '../mymessage/mymessage',
            })
        }
    },

    // 获取用户信息
    getUserInfo: function(e) {
        this.setData({
            avatar: e.detail.userInfo.avatarUrl,
            nickname: e.detail.userInfo.nickName,
            authorized: true
        })
        app.globalData.userInfo = e.detail.userInfo
        // 回跳
        wx.navigateTo({
            url: app.globalData.callbackUrl
        })
    }
})