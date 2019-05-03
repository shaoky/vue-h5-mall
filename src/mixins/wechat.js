/**
 * wechat.js 是一个微信SDK文件
 */
import { getSignature } from '@/api/getData'
import { WechatPlugin } from 'vux'
import { shareUrl } from '@/config/env'

const wx = {
    methods: {
        async getSignature (callback) {
            let form = {
                url: location.href
            }
            try {
                let res = await getSignature(form)
                res = res.data
                WechatPlugin.$wechat.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.appId, // 必填，公众号的唯一标识
                    timestamp: parseInt(res.timestamp), // 必填，生成签名的时间戳
                    nonceStr: res.nonceStr, // 必填，生成签名的随机串
                    signature: res.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                })
            } catch (err) {
                console.log('签名错误', err)
            }
            WechatPlugin.$wechat.ready(() => {
                if (callback) {
                    callback()
                }
            })
        },
        /**
		 * 微信分享
		 * @param {string} title 分享标题
		 * @param {string} imgUrl 分享图片
		 * @param {string} content 分享内容
		 * @param {string} url 分享url
 		*/
        onMenuShareTimeline (option = {}) {
            // 朋友圈分享
            this.$wechat.onMenuShareTimeline({
                title: option.title || '惠民导航', // 分享标题
                link: option.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: option.imgUrl || `${shareUrl}/static/images/common/hm-logo.png`, // 分享图标
                success: function () {
                    option.success()
                }
            })
            // 好友分享
            this.$wechat.onMenuShareAppMessage({
                title: option.title || '惠民导航', // 分享标题
                desc: option.content || '惠民导航', // 分享描述
                link: option.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: option.imgUrl || `${shareUrl}/static/images/common/hm-logo.png`, // 分享图标
                success: function () {
                    option.success()
                },
                cancel: function () {
                    option.cancel()
                }
            })
        },
        /**
		 * 微信扫一扫
		 * @param {string} title 分享标题
		 * @param {string} imgUrl 分享图片
		 * @param {string} content 分享内容
		 * @param {string} url 分享url
 		*/
        scanQRCode (option = {}) {
            // 朋友圈分享
            this.$wechat.scanQRCode({
                needResult: option.needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    option.success(res)
                }
            })
        },
        /**
         * 获取地理位置接口
         */
        getLocation (option = {}) {
            this.$wechat.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    console.log('接收:', res)
                    option.success(res)
                    // var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
                    // var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
                    // var speed = res.speed // 速度，以米/每秒计
                    // var accuracy = res.accuracy // 位置精度
                },
                cancel: function (res) {
                    console.log('用户取消定位')
                    option.cancel(res)
                },
                fail: function (error) {
                    console.log(error)
                }
            })
        }

    }
}

export default wx
