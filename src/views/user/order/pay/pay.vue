<template>
    <div class="user-pay-index">
        <div class="header">
            <div class="title">支付剩余时间</div>
            <div class="cell">
                <span>{{time.minute}}</span>：<span>{{time.second}}</span>
            </div>
            <div class="value">订单应付金额</div>
            <div class="value">￥{{data.payableMoney}}</div>
        </div>
        <div class="pay">
            <div class="cell-title">
                <div class="text">选择支付方式</div>
            </div>
            <div class="cell">
                <img class="icon" src="/static/images/user/pay/alipay.png">
                <div class="label">支付宝支付</div>
                <i class="iconfont icon-yuanxingweixuanzhong" v-if="!isSelected" @click="isSelected=true"></i>
                <img class="seleted" src="/static/images/common/seleted.png" v-if="isSelected">
            </div>
            <div class="cell">
                <img class="icon" src="/static/images/user/pay/wechat.png">
                <div class="label">微信支付</div>
                <i class="iconfont icon-yuanxingweixuanzhong" v-if="isSelected" @click="isSelected=false"></i>
                <img class="seleted" src="/static/images/common/seleted.png" v-if="!isSelected">
            </div>
        </div>
        <div class="btn" @click="pay">去支付</div>
    </div>
</template>

<script>
import { getOrderInfo, settlement } from '@/api/getData'

export default {
    data () {
        return {
            form: {},
            isSelected: true,
            data: {},
            time: {
                minute: '00',
                second: '00'
            }
        }
    },
    computed: {
        token () {
            return this.$store.state.user.token
        }
    },
    mounted () {
        this.form.orderId = this.$route.query.orderId
        this.form.orderNo = this.$route.query.orderNo
        console.log(this.form.orderNo)
        this.getOrderInfo()
    },
    methods: {
        // 获取订单详情
        async getOrderInfo () {
            let res = await getOrderInfo({orderId: this.form.orderId})
            console.log(res)
            let data = res.data.info
            if (data.payType === 1) {
                this.isSelected = true
            } else {
                this.isSelected = false
            }
            this.data = data
            let time = data.remainingTime - parseInt(new Date().getTime() / 1000)
            this.setCountdown(time)
        },
        // 支付
        async pay () {
            if (this.isSelected) { // 支付宝支付 跳中间层
                this.$router.push({path: '/user/order/pay/alipay', query: { token: this.token, orderNo: this.form.orderNo, orderId: this.form.orderNo }})
            } else { // 微信支付
                this.clearing(this.form.orderNo, this.form.orderId)
            }
        },
        setCountdown (n) {
            if (n <= 0) {
                return
            }
            let minute = parseInt(n / 60)
            let second = n - minute * 60
            if (minute < 10) {
                minute = '0' + minute
            }
            if (second < 10) {
                second = '0' + second
            }
            this.time.minute = minute
            this.time.second = second
            n--
            setTimeout(() => {
                this.setCountdown(n)
            }, 1000)
        },
        // 维系能支付
        async clearing (orderNo, orderId) {
            var that = this
            let form = {
                orderNo: orderNo
            }
            let res = await settlement(form)
            let data = res.data.info
            // let WeixinJSBridge
            // console.log(WeixinJSBridge)
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    'appId': data.appId, // 公众号名称，由商户传入
                    'nonceStr': data.nonceStr, // 随机串
                    'package': data.package,
                    'signType': data.signType, // 微信签名方式
                    'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
                    'paySign': data.paySign // 微信签名
                },
                function (res) {
                    console.log('调用支付返回', res)
                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
                        that.$router.push({path: '/user/order/success', query: {orderId: orderId}})
                    } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                }
            )
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../../assets/less/define.less';
.user-pay-index{width:@rem*750;margin:0 auto;
    .header{padding:@rem*30 0;border-bottom:1px solid #f5f5f5;
        .title{font-size:@rem*28;color:#000;text-align:center;}
        .cell{margin-top:@rem*20;display:flex;justify-content: center;font-size:@rem*28;
            span{display:inline-block;width:@rem*44;height:@rem*44;line-height:@rem*44;text-align:center;background:#fe823f;border-radius:4px;}
        }
        .value{font-size:@rem*32;color:#000;text-align:center;margin-top:@rem*32;}
    }
    .pay{padding:@rem*32 @rem*24;margin-bottom:@rem*105;
        .cell-title{display:flex;align-items:center;
            .text{font-size:@rem*28;color:#000;}
        }
        .cell{display:flex;align-items:center;margin-top:@rem*32;
            .icon{width:@rem*40;height:@rem*40;display:block;margin-right:@rem*12;}
            .label{font-size:@rem*28;color:#000;flex:1;}
            .icon-yuanxingweixuanzhong{font-size:@rem*32;}
            .seleted{width:@rem*36;height:@rem*36;}
        }
    }
    .btn{width:@rem*670;margin:0 auto;height:@rem*88;line-height:@rem*88;text-align:center;font-size:@rem*32;color:#fff;background:#fe823f;border-radius:@rem*8;}
}
</style>
