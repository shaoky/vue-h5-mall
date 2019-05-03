/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: api域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
// 192.168.3.197:8082
let baseUrl
let shareUrl
// let baseUrl = 'http://192.168.3.197:8082/'
let mockUrl = '/'
// let baseUrl = 'https://api.ggzlive.com'
let routerMode = 'history'
let imgBaseUrl
let loginUrl
let isLocaltion = false

if (process.env.NODE_ENV === 'development') {
    window.vConsole = new window.VConsole()
    loginUrl = 'https://tapi.mall.shaoky.com/h5/wechat/oauth'
    shareUrl = 'https://shaoky.mynatapp.cc'
    baseUrl = 'http://lapi.mall.shaoky.com/'
    // baseUrl = 'http://192.168.3.58:82/'
    imgBaseUrl = 'https://tapi.mall.shaoky.com/admin/upload/public'
    isLocaltion = true
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = 'http://api.mall.shaoky.com/'
    imgBaseUrl = 'http://api.mall.shaoky.com/common/image/add'
} else if (process.env.NODE_ENV === 'testing') {
    window.vConsole = new window.VConsole()
    loginUrl = 'http://api.mall.shaoky.com//h5/wechat/oauth'
    shareUrl = 'http://api.mall.shaoky.com'
    baseUrl = 'http://api.mall.shaoky.com/'
    imgBaseUrl = 'http://api.mall.shaoky.com/common/image/add'
}

export {
    baseUrl,
    mockUrl,
    routerMode,
    imgBaseUrl,
    shareUrl,
    loginUrl,
    isLocaltion
}
