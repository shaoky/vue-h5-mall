import Vue from 'vue'
import Vuex from 'vuex'
// import * as types from './types.js'
import common from './modules/common'
import user from './modules/user'
import tabs from './modules/tabs'
// import http from '../config/http'

Vue.use(Vuex)

// const state = {
//     // title: 'admin-ui', // 标题
//     userInfo: {} // 当前登录用户的信息
// }

// const mutations = {
//     // setUserInfo
//     [types.MSetUserInfo] (state, obj) {
//         state.userInfo = obj
//     }
// }

// const actions = {
//     [types.AGetUserInfo] ({commit}) {
//         http.get('admins/current').then(resp => {
//             commit(types.MSetUserInfo, resp.data)
//         })
//     }
// }

export default new Vuex.Store({
    strict: false,
    // state,
    // mutations,
    // actions,
    modules: {
        common,
        user,
        tabs
    }
})
