// pages/translate/translate.js

// MD5加密函数库
var utilMd5 = require('../../utils/md5.js');

// 获取应用实例
const app = getApp()
// 翻译API应用ID
const appKey = app.globalData.appKey
// 翻译API应用密钥
const secretKey = app.globalData.secretKey
// 获取音频上下文
const audioContext = wx.createInnerAudioContext()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showResult: true, // 是否显示结果
        keyword: '', // 搜索关键词
        result: '', // 识别结果
        uk_phonetic: '', // 英式音标
        us_phonetic: '', // 美式音标
        explains: [], // 单词释义
        otherInfo: [], // 其他信息(复数、比较级等)
        phrases: [], // 相关短语
        uk_voice: '', // 英式发音
        us_voice: '' // 美式发音
    },

    onLoad: function(option) {
        var that = this
        if (option.result) {
            that.setData({
                keyword: option.result,
                showResult: true
            })
        } else {
            that.setData({
                showResult: false
            })
        }
        var ranNum = 1
        wx.request({
            url: 'http://openapi.youdao.com/api',
            data: {
                q: that.data.keyword,
                from: "EN",
                to: "zn_CH",
                appKey: appKey,
                salt: ranNum,
                sign: utilMd5.hexMD5(appKey + that.data.keyword + ranNum + secretKey)
            },
            success: function(res) {
                var wordInfo = res.data
                if (wordInfo.errorCode != '113' && wordInfo.translation[0] != wordInfo.query) {
                    that.setData({
                        result: wordInfo.query,
                        uk_phonetic: wordInfo.basic['uk-phonetic'] ? wordInfo.basic['uk-phonetic'] : '',
                        us_phonetic: wordInfo.basic['us-phonetic'] ? wordInfo.basic['us-phonetic'] : '',
                        explains: wordInfo.basic['explains'],
                        otherInfo: wordInfo.basic['wfs'] ? wordInfo.basic['wfs'] : [],
                        uk_voice: wordInfo.basic['uk-speech'],
                        us_voice: wordInfo.basic['us-speech'],
                        showResult: true
                    })
                } else {
                    that.setData({
                        showResult: false
                    })
                }
            }
        })
    },

    // 监听输入
    onInput: function(e) {
        this.setData({
            keyword: e.detail.value
        })
    },

    // 清空输入框
    clearInput: function() {
        this.setData({
            keyword: ''
        })
    },

    // 输入完成
    finishInput: function() {
        // wx.request({
        //     url: 'http://47.106.227.33/test.php',
        //     success: function(res) {
        //         console.log(res)
        //     }
        // })
        var that = this
        var ranNum = 1
        wx.request({
            url: 'http://openapi.youdao.com/api',
            data: {
                q: that.data.keyword,
                from: "EN",
                to: "zn_CH",
                appKey: appKey,
                salt: ranNum,
                sign: utilMd5.hexMD5(appKey + that.data.keyword + ranNum + secretKey)
            },
            success: function(res) {
                console.log(res)
                var wordInfo = res.data
                if (wordInfo.errorCode != '113' && wordInfo.translation[0] != wordInfo.query) {
                    that.setData({
                        result: wordInfo.query,
                        uk_phonetic: wordInfo.basic['uk-phonetic'],
                        us_phonetic: wordInfo.basic['us-phonetic'],
                        explains: wordInfo.basic['explains'],
                        otherInfo: wordInfo.basic['wfs'] ? wordInfo.basic['wfs'] : [],
                        phrases: wordInfo.web,
                        uk_voice: wordInfo.basic['uk-speech'],
                        us_voice: wordInfo.basic['us-speech'],
                        showResult: true
                    })
                } else {
                    that.setData({
                        showResult: false
                    })
                }
            }
        })
    },

    // 播放英式发音
    playUkVoice: function() {
        var that = this
        audioContext.src = 'http://media.shanbay.com/audio/uk/' + that.data.result + '.mp3'
        audioContext.play()
    },

    // 播放英式发音
    playUsVoice: function() {
        var that = this
        audioContext.src = 'http://media.shanbay.com/audio/us/' + that.data.result + '.mp3'
        audioContext.play()
    }
})