//index.js

// 常用工具函数库
var util = require('../../utils/util.js');

// 获取应用实例
const app = getApp()

Page({
    data: {
        keyword: "", // 搜索关键词
    },

    // 监听输入
    onInput: function(e) {
        this.setData({
            keyword: e.detail.value
        })
    },

    // 输入完成
    finishInput: function() {
        var that = this
        var keyword = that.data.keyword
        // 判断是单词
        if (util.isWord(keyword)) {
            // 跳转至单词翻译页面
            wx.navigateTo({
                url: '../translate/translate?result=' + keyword,
            })
        } else {
            // 跳转至搜题页面
            wx.navigateTo({
                url: '../question/question?action=input&result=' + escape(keyword),
            })
        }
    },

    // 拍照入口
    takePhoto: function() {
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 跳转至图片裁剪页面
                wx.navigateTo({
                    url: '../clip/clip?imageSrc=' + res.tempFilePaths[0],
                })
            },
        })
    }
})