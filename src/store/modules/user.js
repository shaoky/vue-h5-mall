
const state = {
    userInfo: null || JSON.parse(window.localStorage.getItem('userInfo')),
    token: null || JSON.parse(window.localStorage.getItem('token')),
    location: null || JSON.parse(window.localStorage.getItem('location')),
    userNo: null || window.sessionStorage.getItem('userNo')
}

const mutations = {
    setUserInfo (state, n) {
        state.userInfo = n
        window.localStorage.setItem('userInfo', JSON.stringify(n))
    },
    setToken (state, n) {
        state.token = n
        window.localStorage.setItem('token', JSON.stringify(n))
    },
    setLocation (state, n) {
        state.location = n
        window.localStorage.setItem('location', JSON.stringify(n))
    },
    setUserNo (state, n) {
        state.userNo = n
        window.sessionStorage.setItem('userNo', n)
    },
    delToken (state) {
        state.token = ''
        window.localStorage.removeItem('token')
    },
    delUserInfo (state) {
        state.userInfo = ''
        window.localStorage.removeItem('userInfo')
    },
    delLocation (state) {
        state.location = ''
        window.localStorage.removeItem('location')
    }

}

export default {
    state,
    mutations
}
