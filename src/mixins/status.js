import { getTimeStr } from '@/utils/date.js'

var status = {
    data () {
        return {
        }
    },
    filters: {
        getDate (value) {
            // console.log(value.length())
            if (!value) return ''
            if (value.toString().length === 10) {
                value = value * 1000
            }
            return getTimeStr(value, 'yyyy-MM-dd')
        },
        // 订单
        orderStatusName (value) {
            let text = ''
            if (value === 1) {
                text = '待付款'
            } else if (value === 2) {
                text = '待发货'
            } else if (value === 3) {
                text = '已发货'
            } else if (value === 4) {
                text = '已完成'
            } else if (value === 5) {
                text = '申请退货'
            } else if (value === 6) {
                text = '已退货'
            } else if (value === 7) {
                text = '待接单'
            } else if (value === 8) {
                text = '已取消'
            } else if (value === 9) {
                text = '已拒绝'
            }
            return text
        },
        orderFromName (value) {
            let text = ''
            if (value === 1) {
                text = '小程序'
            } else if (value === 2) {
                text = '代客下单'
            }
            return text
        },
        payTypeName (value) {
            let text = ''
            if (value === 1) {
                text = '货到付款'
            }
            return text
        },
        driverstatusName (value) {
            let text = ''
            if (value === 1) {
                text = '待装车'
            } else if (value === 2) {
                text = '已装车'
            } else if (value === 3) {
                text = '已发货'
            } else if (value === 4) {
                text = '已送达'
            } else if (value === 5) {
                text = '已送达'
            }
            return text
        },
        quoteunitName (value) {
            let text = ''
            if (value === 1) {
                text = '瓶'
            } else if (value === 2) {
                text = '箱'
            }
            return text
        },
        changeMoneyToChinese (money) {
            var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] // 汉字的数字
            var cnIntRadice = ['', '拾', '佰', '仟'] // 基本单位
            var cnIntUnits = ['', '万', '亿', '兆'] // 对应整数部分扩展单位
            var cnDecUnits = ['角', '分', '毫', '厘'] // 对应小数部分单位
            var cnInteger = '整' // 整数金额时后面跟的字符
            var cnIntLast = '元' // 整型完以后的单位
            var maxNum = 999999999999999.9999 // 最大处理的数字

            var IntegerNum // 金额整数部分
            var DecimalNum // 金额小数部分
            var ChineseStr = '' // 输出的中文金额字符串
            var parts // 分离金额后用的数组，预定义

            if (money === '') {
                return ''
            }

            money = parseFloat(money)
            // alert(money);
            if (money >= maxNum) {
                // $.alert('超出最大处理数字')
                return ''
            }
            if (money === 0) {
                ChineseStr = cnNums[0] + cnIntLast + cnInteger
                // document.getElementById("show").value=ChineseStr;
                return ChineseStr
            }
            money = money.toString() // 转换为字符串
            if (money.indexOf('.') === -1) {
                IntegerNum = money
                DecimalNum = ''
            } else {
                parts = money.split('.')
                IntegerNum = parts[0]
                DecimalNum = parts[1].substr(0, 4)
            }
            if (parseInt(IntegerNum, 10) > 0) { // 获取整型部分转换
                let zeroCount = 0
                let IntLen = IntegerNum.length
                for (let i = 0; i < IntLen; i++) {
                    let n = IntegerNum.substr(i, 1)
                    let p = IntLen - i - 1
                    let q = p / 4
                    let m = p % 4
                    if (n === '0') {
                        zeroCount++
                    } else {
                        if (zeroCount > 0) {
                            ChineseStr += cnNums[0]
                        }
                        zeroCount = 0 // 归零
                        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
                    }
                    if (m == 0 && zeroCount < 4) {
                        ChineseStr += cnIntUnits[q]
                    }
                }
                ChineseStr += cnIntLast
                // 整型部分处理完毕
            }
            if (DecimalNum !== '') { // 小数部分
                let decLen = DecimalNum.length
                for (let i = 0; i < decLen; i++) {
                    let n = DecimalNum.substr(i, 1)
                    if (n !== '0') {
                        ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
                    }
                }
            }
            if (ChineseStr === '') {
                ChineseStr += cnNums[0] + cnIntLast + cnInteger
            } else if (DecimalNum === '') {
                ChineseStr += cnInteger
            }
            return ChineseStr
        }
    }
}

export default status
