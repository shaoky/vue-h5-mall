const wx = require('../assets/js/jweixin-1.4.0').wx
console.log(wx)
const plugin = {
    install (Vue) {
        Vue.prototype.$wechat = wx
        Vue.wechat = wx
    },
    $wechat: wx
}

export default plugin
export const install = plugin.install
