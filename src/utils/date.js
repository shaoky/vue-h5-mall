/**
 *date.js 是一个时间处理文件
 */

/**
 * 时间戳转日期
 * @param {int} time 时间戳
 */
const fmtDate = (date, fmt) => {
    var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

export const getTimeStr = (time, fmt) => {
    return fmtDate(new Date(time), fmt)
}

export const getCountdown = (time) => {
    if (time <= 0) {
        return {
            day: 0,
            hour: 0,
            minute: 0,
            second: 0
        }
    }
    let date = {}
    let day = parseInt(time / 24 / 60 / 60)
    let hour = parseInt((time - day * 24 * 60 * 60) / 60 / 60)
    let minute = parseInt((time - day * 24 * 60 * 60 - hour * 60 * 60) / 60)
    let second = time - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
    if (day < 10) {
        day = '0' + day
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    if (second < 10) {
        second = '0' + second
    }
    date = {
        day: day,
        hour: hour,
        minute: minute,
        second: second
    }
    // if (day === 0) {
    //     date = hour + ':' + minute + ':' + second
    // } else {
    //     date = day + '天' + hour + ':' + minute + ':' + second
    // }

    return date
}
