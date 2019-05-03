export const getParams = (url) => {
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
