/**
 * utils.js 是一个通用处理文件
 */

/**
 * 根据地区最后一级，返回所有地区
 * 举例：传平阳县id，返回['33000000', '33030000', '33031200']
 * @param {string} val 最后一个地区
 */

const getRegionAll = (val) => {
    let regionArr = []
    regionArr.push(val.slice(0, 2) + '000000', val.slice(0, 4) + '0000', val)
    return regionArr
}

const getUrlParams = (url) => {
    var obj = {}
    if (url) {
        if (url.indexOf('?') === -1) {
            return obj
        } else {
            var index = url.indexOf('?')
            var str = url.substring(index + 1)
            if (str.indexOf('&') !== -1) {
                var arr1 = str.split('&')
                arr1.forEach(function (val, index) {
                    var arr2 = val.split('=')
                    obj[arr2[0]] = arr2[1]
                })
            } else {
                var arr3 = str.split('=')
                obj[arr3[0]] = arr3[1]
            }
            return obj
        }
    }
}

export default {
    getRegionAll,
    getUrlParams
}
