/**
 *validator.js 是一个验证表单文件
 */

/**
 * 手机号码
 * @param {int} value 需要验证的值
 * @param {int} required 是否必填
 */
const tel = (num) => {
    if (!num) {
        return '请输入手机号码'
    }
    if (!(/^1[345678]\d{9}$/.test(num))) {
        return '手机号码有误，请重填'
    }
}

/**
 * 短信
 * @param {int} value 需要验证的值
 * @param {int} required 是否必填
 */
const sms = (value) => {
    if (!value) {
        return '请输入验证码'
    }
    if (value.length < 4) {
        return '请输入正确的验证码'
    }
}

/*
** 密码
*/
const pass = (num) => {
    if (!num) {
        return '请填写密码'
    }
    if (num.length > 20 || num.length < 6) {
        return '密码长度至少要6位'
    }
}
export default {
    tel,
    sms,
    pass
}
