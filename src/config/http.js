/**
 * http配置
 */

import axios from 'axios'
import store from '../store'
import { loginUrl, isLocaltion } from './env.js'
// import router from '../router'
import vm from '../main.js'
// import { science } from '@/config/env.js'

// let loadingInstance

// axios 配置
const http = axios.create({
    // baseURL: baseUrl,
    timeout: 1000 * 1000, // 1 秒
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json'
    }
})
// axios.defaults.headers.phoneType = 5
// axios.defaults.headers.storeToken = '5abb0a4abffbd39eb88fae12'
// axios.defaults.headers.token = 'TVRBd01ERTFOakV3NDEyMjkzN2UyMTg5NGY2OGJkMDExZjJiNWZkZmVmYWY='

// http request 拦截器
http.interceptors.request.use(
    config => {
        config.headers['from'] = 1
        config.headers['app'] = 2
        config.headers['location'] = ''
        if (isLocaltion) {
            store.state.user.token = '228706b2b2ec6ebc89bce15e9fa2702f'
        }
        store.state.user.token = '228706b2b2ec6ebc89bce15e9fa2702f'
        if (store.state.user.token) {
            const token = '' || store.state.user.token
            config.headers['Authorization'] = token
        }
        if (store.state.user.location) {
            let location = store.state.user.location
            config.headers['location'] = location['longitude'] + ',' + location['latitude']
        }

        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// http response 拦截器
http.interceptors.response.use(
    response => {
        if (response.data.code === 500) {
            vm.$vux.toast.text(response.data.error)
        }

        if (response.data.code === 401) {
            store.commit('delToken')
            store.commit('delUserInfo')
            window.sessionStorage.setItem('returnUrl', window.location.href)
            // this.$router.push({path: '/login/bind-phone'})
            // window.location.href = loginUrl
            // window.location.href = 'http://tapi.mall.shaoky.com/h5/wechat/oauth'
        }
        return response
    },
    error => {
        if (error.response.status === 401) {
            console.log(1)
            // store.commit('delToken')
            // store.commit('delUserInfo')
            // router.push({'path': '/'})
            // vm.$vux.toast.text('登录超时,请重新登录')
            // window.location.href = loginUrl
            this.$router.push({path: '/login/bind-phone'})
        } else {
            vm.$vux.toast.text(error.response.data.error)
        }

        return Promise.reject(error)
    }
)

export default http
