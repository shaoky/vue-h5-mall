const state = {
    isLoading: false
}

const mutations = {
    updateLoadingStatus (state, payload) {
        state.isLoading = payload.isLoading
    },
    getLocation (state, row) {
        // console.log(1)
    }
}

export default {
    state,
    mutations
}
