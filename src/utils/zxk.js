class Zhou {
    // 深拷贝，如果是数组，c传[]
    deepCopy (p, c = {}) {
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {}
                this.deepCopy(p[i], c[i])
            } else {
                c[i] = p[i]
            }
        }

        return c
    }
    // 截图url参数
    getRequest (url) {
        let obj = {}
        if (!url.includes('?')) {
            return obj
        }
        url.includes('?')
        let index = url.indexOf('?')
        let str = url.substring(index + 1)
        if (str.includes('&')) {
            let arr1 = str.split('&')
            for (let item of arr1) {
                let arr2 = item.split('=')
                obj[arr2[0]] = arr2[1]
            }
        } else {
            let arr3 = str.split('=')
            obj[arr3[0]] = arr3[1]
        }
        return obj
    }
    // 时间转换
    // 定时器
    // 号码验证
}
let zxk = new Zhou()
export default zxk
