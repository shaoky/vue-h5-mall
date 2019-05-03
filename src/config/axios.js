import axios from '../config/http'
import { baseUrl, mockUrl } from '../config/env'

export default async (url = '', data = {}) => {
    return new Promise((resolve, reject) => {
        // console.log(url, data.data)
        let domain

        // 判断是否是模拟数据
        const isMock = url.includes('mock')
        if (isMock) {
            domain = mockUrl
        } else {
            domain = baseUrl
        }
        axios.post(domain + url, data.data)
            .then(res => {
                // res = res.data
                if (res.data.code === 200) {
                    resolve(res.data)
                } else {
                    reject(res.data)
                }
            })
            .catch(err => {
                reject(err.response)
            })
    })
}
