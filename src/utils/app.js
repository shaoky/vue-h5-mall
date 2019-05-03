/**
 *app.js 是一个与app交互的协议
 */

export const getIsWeixin = () => {
    let ua = navigator.userAgent.toLowerCase()
    if (ua.match('micromessenger')) {
        return true
    } else {
        return false
    }
}

export const getNavigatorType = () => {
    let type
    let ua = navigator.userAgent
    console.log(ua)
    if (ua.match('app/android')) {
        type = 2
    } else if (ua.match('app/ios')) {
        type = 3
    } else {
        type = 1
    }
    return type
}

/**
 * 订单预览页面
 */
export const orderView = (data) => {
    let type = getNavigatorType()
    if (type === 1) {

    }
    if (type === 2) {
        window.baseObj.toOrderPriview(data.goodsId, data.goodsNum)
    }
    if (type === 3) {
        try {
            // window.webkit.messageHandlers.shareUrl.postMessage(data)
            window.webkit.messageHandlers.toOrderPriview.postMessage({
                goodsId: data.goodsId,
                goodsNum: data.goodsNum
            })
        } catch (err) {
            console.log(err)
        }
    }
    return type
}

/**
 * 调用分享功能
 */
export const onShare = (data) => {
    let type = getNavigatorType()
    if (type === 1) {

    }
    if (type === 2) {
        let token = getToken()
        // alert('获取到的token是' + token)
        if (token) {
            data.isLogin = 0
        } else {
            data.isLogin = 1
        }
        // alert('调用分享成功')
        // alert(JSON.stringify(data))
        window.baseObj.shareUrl(data.title, data.content, data.icon, data.url, data.image, data.isLogin)
    }
    if (type === 3) {
        try {
            window.webkit.messageHandlers.shareUrl.postMessage(data)
        } catch (err) {
            console.log(err)
        }
    }
    return type
}

/**
 * 调用用户token
 */
export const getToken = (data) => {
    let type = getNavigatorType()
    if (type === 1) {

    }
    if (type === 2) {
        return window.baseObj.getToken()
    }
    if (type === 3) {
        try {
            // window.webkit.messageHandlers.shareUrl.postMessage(data)
            window.webkit.messageHandlers.shareUrl.postMessage({
                goodsId: data.goodsId,
                goodsNum: data.goodsNum
            })
        } catch (err) {
            console.log(err)
        }
    }
    return type
}
