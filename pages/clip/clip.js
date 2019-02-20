// pages/clip/clip.js

// 裁剪全局变量开始---------------------------------------------------
// 手机的宽度
var windowWRPX = 750
// 手机的像素比
var pixelRatio = wx.getSystemInfoSync().pixelRatio
// 手机的高度
var windowHRPX = wx.getSystemInfoSync().windowHeight * 2
// 拖动时候的 pageX
var pageX = 0
// 拖动时候的 pageY
var pageY = 0
// 调整大小时候的 pageX
var sizeConfPageX = 0
// 调整大小时候的 pageY
var sizeConfPageY = 0

var initDragCutW = 0
var initDragCutL = 0
var initDragCutH = 0
var initDragCutT = 0

// 移动时 手势位移与 实际元素位移的比
var dragScaleP = 2

var count = 1
// 裁剪全局变量结束------------------------------------------------------

// 常用工具函数库
var util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 裁剪相关变量--------------------------------------
        // 初始化的宽高
        cropperInitW: windowWRPX,
        cropperInitH: windowWRPX,
        // 动态的宽高
        cropperW: windowWRPX,
        cropperH: windowWRPX,
        // 动态的left top值
        cropperL: 0,
        cropperT: 0,
        // 图片缩放值
        scaleP: 0,
        imageW: 0,
        imageH: 0,
        // 裁剪框 宽高
        cutW: 400,
        cutH: 400,
        cutL: 0,
        cutT: 0,
        // 裁剪浮层
        imageFixed: false,
        // 是否展示图片
        isShowImg: false,
        // 要裁剪的图片
        imageSrc: "",
        savedFilePath: "",
        // 底部操作区域的高度
        footerH: windowHRPX - windowWRPX - 100,
        // 底部操作区域距离顶部的距离
        footerTop: windowWRPX + 100
    },

    onLoad: function(option) {
        console.log(windowHRPX / 2)
        var that = this
        that.setData({
            imageSrc: option.imageSrc
        })
        // start
        wx.getImageInfo({
            src: that.data.imageSrc,
            success: function success(res) {
                var innerAspectRadio = res.width / res.height;
                // 根据图片的宽高显示不同的效果   保证图片可以正常显示
                if (innerAspectRadio > 1) {
                    that.setData({
                        cropperW: windowWRPX,
                        cropperH: windowWRPX / innerAspectRadio,
                        // 初始化left right
                        cropperL: Math.ceil((windowWRPX - windowWRPX) / 2),
                        cropperT: Math.ceil((windowWRPX - windowWRPX / innerAspectRadio) / 2),
                        // 裁剪框  宽高 
                        // cutW: windowWRPX - 200,
                        // cutH: windowWRPX / innerAspectRadio - 200,
                        cutL: Math.ceil((windowWRPX - windowWRPX + 340) / 2),
                        cutT: Math.ceil((windowWRPX / innerAspectRadio - (windowWRPX / innerAspectRadio - 20)) / 2),
                        // 图片缩放值
                        scaleP: res.width * pixelRatio / windowWRPX,
                        // 图片原始宽度 rpx
                        imageW: res.width * pixelRatio,
                        imageH: res.height * pixelRatio
                    })
                } else {
                    that.setData({
                        cropperW: windowWRPX * innerAspectRadio,
                        cropperH: windowWRPX,
                        // 初始化left right
                        cropperL: Math.ceil((windowWRPX - windowWRPX * innerAspectRadio) / 2),
                        cropperT: Math.ceil((windowWRPX - windowWRPX) / 2),
                        // 裁剪框的宽高
                        // cutW: windowWRPX * innerAspectRadio - 66,
                        // cutH: 400,
                        cutL: Math.ceil((windowWRPX * innerAspectRadio - (windowWRPX * innerAspectRadio - 20)) / 2),
                        cutT: Math.ceil((windowWRPX - 340) / 2),
                        // 图片缩放值
                        scaleP: res.width * pixelRatio / windowWRPX,
                        // 图片原始宽度 rpx
                        imageW: res.width * pixelRatio,
                        imageH: res.height * pixelRatio
                    })
                }
                that.setData({
                    cutW: 400,
                    cutH: 400,
                    isShowImg: true
                })
                wx.hideLoading()
            }
        })
    },

    // 获取图片
    getImageInfo() {
        var _this = this
        console.log('shengcheng:' + _this.data.imageSrc)
        wx.showLoading({
            title: '文字识别中...',
        })
        // 将图片写入画布             
        const ctx = wx.createCanvasContext('myCanvas')

        ctx.drawImage(_this.data.imageSrc)

        ctx.draw(true, function() {
            // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
            var canvasW = (_this.data.cutW / _this.data.cropperW) * (_this.data.imageW / pixelRatio)
            var canvasH = (_this.data.cutH / _this.data.cropperH) * (_this.data.imageH / pixelRatio)
            var canvasL = (_this.data.cutL / _this.data.cropperW) * (_this.data.imageW / pixelRatio)
            var canvasT = (_this.data.cutT / _this.data.cropperH) * (_this.data.imageH / pixelRatio)
            // console.log(`canvasW:${canvasW} --- canvasH: ${canvasH} --- canvasL: ${canvasL} --- canvasT: ${canvasT} -------- _this.data.imageW: ${_this.data.imageW}  ------- _this.data.imageH: ${_this.data.imageH} ---- pixelRatio ${pixelRatio}`)
            wx.canvasToTempFilePath({
                x: canvasL,
                y: canvasT,
                width: canvasW,
                height: canvasH,
                destWidth: canvasW,
                destHeight: canvasH,
                canvasId: 'myCanvas',
                success: function(res) {
                    var tmpFilePath = res.tempFilePath
                    // 上传图片到python服务器
                    wx.uploadFile({
                        url: '',
                        filePath: res.tempFilePath,
                        name: 'photo',
                        success: function(res) {
                            _this.setData({
                                savedFilePath: res.data,
                            });
                            // 向服务器发起文字识别请求
                            wx.request({
                                url: '',
                                data: {

                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'POST',
                                dataType: 'json',
                                success: function(res) {
                                    wx.hideLoading()
                                    // 识别结果
                                    var result = res.data
                                    if (util.isWord(result)) {
                                        // 跳转至单词翻译页面
                                        wx.navigateTo({
                                            url: '../translate/translate?result=' + result,
                                        })
                                    } else {
                                        // 跳转至搜题页面
                                        // console.log()
                                        wx.navigateTo({
                                            url: '../question/question?action=photo&result=' + escape(result) + '&tmpFilePath=' + tmpFilePath,
                                        })
                                    }
                                }
                            });
                        }
                    });
                }
            })
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

    /**
     * 裁剪相关函数
     * @function contentStartMove(e)
     * @function contentMoveing(e)
     * @function dragStart(e)
     * @function dragMove(e)
     */

    // 拖动时候触发的touchStart事件
    contentStartMove(e) {
        pageX = e.touches[0].pageX
        pageY = e.touches[0].pageY
    },

    // 拖动时候触发的touchMove事件
    contentMoveing(e) {
        var _this = this
        // _this.data.cutL + (e.touches[0].pageX - pageX)
        // console.log(e.touches[0].pageX)
        // console.log(e.touches[0].pageX - pageX)
        var dragLengthX = (pageX - e.touches[0].pageX) * dragScaleP
        var dragLengthY = (pageY - e.touches[0].pageY) * dragScaleP
        var minX = Math.max(_this.data.cutL - (dragLengthX), 0)
        var minY = Math.max(_this.data.cutT - (dragLengthY), 0)
        var maxX = _this.data.cropperW - _this.data.cutW
        var maxY = _this.data.cropperH - _this.data.cutH
        this.setData({
            cutL: Math.min(maxX, minX),
            cutT: Math.min(maxY, minY),
        })
        // console.log(`${maxX} ----- ${minX}`)
        pageX = e.touches[0].pageX
        pageY = e.touches[0].pageY
    },

    // 设置大小的时候触发的touchStart事件
    dragStart(e) {
        var _this = this
        sizeConfPageX = e.touches[0].pageX
        sizeConfPageY = e.touches[0].pageY
        initDragCutW = _this.data.cutW
        initDragCutL = _this.data.cutL
        initDragCutT = _this.data.cutT
        initDragCutH = _this.data.cutH
    },

    // 设置大小的时候触发的touchMove事件
    dragMove(e) {
        var _this = this
        var dragType = e.target.dataset.drag
        switch (dragType) {
            case 'right':
                var dragLength = (sizeConfPageX - e.touches[0].pageX) * dragScaleP
                if (initDragCutW >= dragLength) {
                    // 如果 移动小于0 说明是在往下啦  放大裁剪的高度  这样一来 图片的高度  最大 等于 图片的top值加 当前图片的高度  否则就说明超出界限
                    if (dragLength < 0 && _this.data.cropperW > initDragCutL + _this.data.cutW) {
                        this.setData({
                            cutW: initDragCutW - dragLength
                        })
                    }
                    // 如果是移动 大于0  说明在缩小  只需要缩小的距离小于原本裁剪的高度就ok
                    if (dragLength > 0) {
                        this.setData({
                            cutW: initDragCutW - dragLength
                        })
                    } else {
                        return
                    }
                } else {
                    return
                }
                break;
            case 'left':
                var dragLength = (dragLength = sizeConfPageX - e.touches[0].pageX) * dragScaleP
                // console.log(dragLength)
                if (initDragCutW >= dragLength && initDragCutL > dragLength) {
                    if (dragLength < 0 && Math.abs(dragLength) >= initDragCutW) return
                    this.setData({
                        cutL: initDragCutL - dragLength,
                        cutW: initDragCutW + dragLength
                    })
                } else {
                    return;
                }
                break;
            case 'top':
                var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP
                if (initDragCutH >= dragLength && initDragCutT > dragLength) {
                    if (dragLength < 0 && Math.abs(dragLength) >= initDragCutH) return
                    this.setData({
                        cutT: initDragCutT - dragLength,
                        cutH: initDragCutH + dragLength
                    })
                } else {
                    return;
                }
                break;
            case 'bottom':
                var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP
                // console.log(_this.data.cropperH > _this.data.cutT + _this.data.cutH)
                // console.log(dragLength)
                // console.log(initDragCutH >= dragLength)
                // console.log(_this.data.cropperH > initDragCutT + _this.data.cutH)
                // 必须是 dragLength 向上缩小的时候必须小于原本的高度
                if (initDragCutH >= dragLength) {
                    // 如果 移动小于0 说明是在往下啦  放大裁剪的高度  这样一来 图片的高度  最大 等于 图片的top值加 当前图片的高度  否则就说明超出界限
                    if (dragLength < 0 && _this.data.cropperH > initDragCutT + _this.data.cutH) {
                        this.setData({
                            cutH: initDragCutH - dragLength
                        })
                    }
                    // 如果是移动 大于0  说明在缩小  只需要缩小的距离小于原本裁剪的高度就ok
                    if (dragLength > 0) {
                        this.setData({
                            cutH: initDragCutH - dragLength
                        })
                    } else {
                        return
                    }
                } else {
                    return
                }
                break;
            case 'rightBottom':
                var dragLengthX = (sizeConfPageX - e.touches[0].pageX) * dragScaleP
                var dragLengthY = (sizeConfPageY - e.touches[0].pageY) * dragScaleP
                if (initDragCutH >= dragLengthY && initDragCutW >= dragLengthX) {
                    // bottom 方向的变化
                    if ((dragLengthY < 0 && _this.data.cropperH > initDragCutT + _this.data.cutH) || (dragLengthY > 0)) {
                        this.setData({
                            cutH: initDragCutH - dragLengthY
                        })
                    }

                    // right 方向的变化
                    if ((dragLengthX < 0 && _this.data.cropperW > initDragCutL + _this.data.cutW) || (dragLengthX > 0)) {
                        this.setData({
                            cutW: initDragCutW - dragLengthX
                        })
                    } else {
                        return
                    }
                } else {
                    return
                }
                break;
            default:
                break;
        }
    }
})