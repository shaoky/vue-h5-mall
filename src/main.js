// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { ToastPlugin, ConfirmPlugin, AlertPlugin, Group, WechatPlugin } from 'vux'
// import { getSignature, getShareInfo } from './api/getData'
// import { getParams } from '@/utils/getParams.js'
import { getTimeStr } from './utils/date.js'
import { shareUrl, loginUrl } from './config/env.js'

import '../static/js/swiper.min.css'
import './assets/less/main.less'
import http from './config/http'
// import VueAMap from 'vue-amap'

Vue.prototype.$axios = http
Vue.config.productionTip = false

Vue.component('group', Group)

Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(WechatPlugin)
// Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
// key: '91efa5e84e8f3a7a1fcf5d17090fb08c',
// plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
// 默认高德 sdk 版本为 1.4.4
// v: '1.4.4'
// })

Vue.filter('getTime', (value) => {
    if (!value) return ''
    return getTimeStr(value * 1000, 'yyyy-MM-dd hh:mm')
})

router.beforeEach((to, from, next) => {
    if (to.meta.isLoading) {
        store.commit('updateLoadingStatus', {isLoading: true})
    }

    /* 路由发生变化修改页面title */

    // 微信配置分享
    // let form = {
    //     url: shareUrl + to.fullPath
    // }
    // let getConfig = async function () {
    //     try {
    //         let res = await getSignature(form)
    //         res = res.data
    //         WechatPlugin.$wechat.config({
    //             debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //             appId: res.appId, // 必填，公众号的唯一标识
    //             timestamp: parseInt(res.timestamp), // 必填，生成签名的时间戳
    //             nonceStr: res.nonceStr, // 必填，生成签名的随机串
    //             signature: res.signature, // 必填，签名，见附录1
    //             jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //         })
    //     } catch (err) {}
    // }
    // getConfig()
    // 获取分享内容
    // let shareInfo = {}
    // let config
    // getShareInfo({userNo: window.sessionStorage.getItem('userNo')}).then((res) => {
    //     shareInfo = res.data.info
    //     // 判断是不是会员招募，如果是，分享页面为 会员招募首页
    //     let isMember = parseInt(window.sessionStorage.getItem('isMember'))
    //     if (isMember === 1) {
    //         config = {
    //             title: 'shareInfo.title',
    //             desc: 'shareInfo.content',
    //             link: shareUrl + '/index?userNo=' + window.sessionStorage.getItem('userNo'), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //             imgUrl: '/static/common/logo.png',
    //             success: function () {
    //             },
    //             cancel: function () {
    //             }
    //         }
    //     } else {
    //         if (window.sessionStorage.getItem('userNo')) {
    //             config = {
    //                 title: shareInfo.title,
    //                 desc: shareInfo.content,
    //                 link: shareUrl + to.path + '?userNo=' + window.sessionStorage.getItem('userNo'), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //                 imgUrl: '/static/common/logo.png',
    //                 success: function () {
    //                 },
    //                 cancel: function () {
    //                 }
    //             }
    //         } else {
    //             config = {
    //                 title: shareInfo.title,
    //                 desc: shareInfo.content,
    //                 link: shareUrl + to.fullPath, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //                 imgUrl: '/static/common/logo.png',
    //                 success: function () {
    //                 },
    //                 cancel: function () {
    //                 }
    //             }
    //         }
    //     }

    //     WechatPlugin.$wechat.ready(() => {
    //         WechatPlugin.$wechat.onMenuShareAppMessage(config)
    //         WechatPlugin.$wechat.onMenuShareTimeline(config)
    //     })
    // })

    if (to.meta.title) {
        document.title = `${to.meta.title}`
    } else {
        document.title = ''
    }
    // ios端重载页面
    const agent = navigator.userAgent
    const isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (to.meta.requireAuth) { // 判断是否需要授权登录
        if (store.state.user.token) { // 判断是否有token
            if (isiOS && (to.path !== location.pathname)) { // 判断是否在ios端
                location.assign(to.fullPath)
            } else {
                next()
            }
        } else {
            // router.push({path: '/login/bind-phone'})
            window.sessionStorage.setItem('returnUrl', window.location.href)
            // store.commit('delUserInfo')
            // window.location.href = loginUrl
            next()
        }
    } else {
        if (isiOS && (to.path !== location.pathname)) {
            location.assign(to.fullPath)
        } else {
            next()
        }
    }
})

/* eslint-disable no-new */
let vm = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
export default vm
