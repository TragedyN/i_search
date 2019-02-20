// pages/response/response.js

// 获取应用实例
const app = getApp()
// 团队服务器php接口地址
const URL = app.globalData.SERVER_URL + 'api.php'

// 一页两用：提问题or回答问题
Page({
    data: {
        op: '', // 提问or回答
        placeholder: '', // 输入框提示
        inputContent: '', // 输入框内容
        showImage: false, // 显示图片
        imageSrc: '', // 图片路径
        ratio: 0.0, // 图片宽高比
        showLabel: false, // 是否显示标签
        label: '', // 标签
        labelList: ['高数', '英语', '大物', '其他'], // 标签列表
        sendPhoto: false, // 是否附带图片
    },

    onLoad: function(options) {
        console.log(options)
        this.setData({
            op: options.op
        })
        if (options.op == 'addproblem') {
            if (options.content) {
                this.setData({
                    inputContent: unescape(options.content)
                })
            } else {
                this.setData({
                    placeholder: '请输入简短的问题描述(不超过140字)...'
                })
            }
        } else if (options.op == 'answerproblem') {
            var user = JSON.parse(options.user)
            this.setData({
                placeholder: '回复@' + user.nickname + '：',
                user: user,
                showThatLabel: true,
                showLabel: true,
                thatLabel: user.label ? user.label : '无'
            })
        }
    },

    // 监听输入
    onInput: function(e) {
        this.setData({
            inputContent: e.detail.value
        })
    },

    // 从相册选择或拍照
    choosePhoto: function() {
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                that.setData({
                    imageSrc: res.tempFilePaths[0],
                    showImage: true,
                    sendPhoto: true
                })
                wx.getImageInfo({
                    src: res.tempFilePaths[0],
                    success: function(res) {
                        that.setData({
                            ratio: res.width / res.height
                        })
                    }
                })
            },
        })
    },

    addLabel: function() {
        var that = this
        var list = that.data.labelList
        wx.showActionSheet({
            itemList: list,
            success(res) {
                that.setData({
                    label: list[res.tapIndex],
                    showLabel: true
                })
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    send: function() {
        var that = this
        var op = that.data.op
        var userInfo = app.globalData.userInfo
        // 是否登录
        if (!app.isLogin()) {
            // 设置全局回跳url
            app.globalData.callbackUrl = '/pages/response/response?op=' + op + '&user=' + JSON.stringify(that.data.user)
        } else {
            // 提交是否为空
            if (that.data.inputContent == '') {
                wx.showModal({
                    title: '提示',
                    content: '问题描述不能为空哦',
                    success(res) {

                    }
                })
                return
            }
        }
        /**
         * @ 判断动作
         * 1、提问题
         * 2、回答问题
         */
        if (op == 'addproblem') { // 提问题
            if (that.data.sendPhoto) { // 附带图片
                wx.uploadFile({
                    url: URL + '?op=addproblem',
                    filePath: that.data.imageSrc,
                    name: 'picture',
                    formData: {
                        openid: app.globalData.openid,
                        ratio: that.data.ratio,
                        avatar: userInfo.avatarUrl,
                        nickname: userInfo.nickName,
                        title: that.data.inputContent,
                        label: that.data.label,
                    },
                    success(res) {
                        wx.switchTab({
                            url: '../online/online',
                        })
                    }
                })
            } else { // 不附带图片
                wx.request({
                    url: URL + '?op=addproblem',
                    method: 'POST',
                    data: {
                        openid: app.globalData.openid,
                        ratio: that.data.ratio,
                        avatar: userInfo.avatarUrl,
                        nickname: userInfo.nickName,
                        title: that.data.inputContent,
                        label: that.data.label
                    },
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function(res) {
                        wx.switchTab({
                            url: '../online/online',
                        })
                    }
                })
            }
        } else if (op == 'answerproblem') { // 回答问题
            if (that.data.sendPhoto) { // 附带图片
                wx.uploadFile({
                    url: URL + '?op=addresponse',
                    filePath: that.data.imageSrc,
                    name: 'picture',
                    formData: {
                        openid: app.globalData.openid,
                        pid: that.data.user.id,
                        ratio: that.data.ratio,
                        avatar: userInfo.avatarUrl,
                        nickname: userInfo.nickName,
                        title: that.data.inputContent
                    },
                    success(res) {
                        wx.navigateTo({
                            url: '../online_detail/online_detail?user=' + JSON.stringify(that.data.user),
                        })
                    }
                })
            } else { // 不附带图片
                wx.request({
                    url: URL + '?op=addresponse',
                    method: 'POST',
                    data: {
                        openid: app.globalData.openid,
                        pid: that.data.user.id,
                        ratio: that.data.ratio,
                        avatar: userInfo.avatarUrl,
                        nickname: userInfo.nickName,
                        title: that.data.inputContent
                    },
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function(res) {
                        wx.navigateTo({
                            url: '../online_detail/online_detail?user=' + JSON.stringify(that.data.user),
                        })
                    }
                })
            }
        }
    }
})