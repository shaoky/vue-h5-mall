<template>
    <div class="alipay-order">
        <div class="title">{{message}}</div>
        <div class="countdown" v-if="data.orderStatus===1">请在 <span>{{countdown}}</span> 内完成付款，时间结束后商品可能被抢完。</div>
        <div class="order-detail">
            <div class="cell">
                <div class="label">订单编号：</div>
                <div class="value">{{data.orderNo}}</div>
            </div>
            <div class="cell">
                <div class="label">交易时间：</div>
                <div class="value">{{data.createTime | getTime}}</div>
            </div>
            <div class="cell">
                <div class="label">支付方式：</div>
                <div class="value">支付宝支付</div>
            </div>
            <div class="cell">
                <div class="label">支付金额：</div>
                <div class="value">{{data.realTotalMoney}}</div>
            </div>
        </div>
        <div class="btns">
            <div class="btn" v-if="!userNo" @click="$router.push({path:'/user/order/info',query:{orderId:orderId}})">查看订单</div>
            <div class="btn" v-if="userNo" @click="todown">下载app查看订单</div>
            <div class="btn yellow" @click="jump">回首页</div>
        </div>
        <div class="message">
            <div class="text">惠民导航安全提醒</div>
            <p>1.下单后，通过 <span>短信、电话、QQ、微信等方式给您发送链接、二维码办理退款或赔付的都是骗子。</span></p>
            <p>2.物流公司、商家以及平台客服不会以 <span>系统升级、订单异常、商品</span> 等问题线下联系您办理退款或赔付，所有操作均在惠民导航商城内进行，谨防诈骗。</p>
        </div>
    </div>
</template>

<script>
import { getOrderInfo } from '@/api/getData'

export default {
    data () {
        return {
            orderId: null,
            countdown: '00:00',
            data: {}
        }
    },
    computed: {
        userNo () {
            let value = ''
            if (window.sessionStorage.getItem('userNo')) {
                value = window.sessionStorage.getItem('userNo')
            }
            return value
        },
        message () {
            let value = ''
            if (this.data.orderStatus === 1 || this.data.orderStatus === 7) {
                value = '付款失败'
            } else {
                value = '付款成功'
            }
            return value
        },
        isMember () {
            let value = ''
            if (window.sessionStorage.getItem('isMember')) {
                value = window.sessionStorage.getItem('isMember')
            }
            return value
        }
    },
    mounted () {
        if (this.$route.query.orderId) {
            this.orderId = parseInt(this.$route.query.orderId)
        }
        this.getOrderInfo()
        // var ua = navigator.userAgent.toLowerCase()
        // if (ua.match(/MicroMessenger/i) == 'micromessenger') { // 微信
        //     if (this.$route.query.orderId) {
        //         this.orderId = parseInt(this.$route.query.orderId)
        //     }
        //     this.getOrderInfo()
        // } else { // 非微信
        //     var agent = navigator.userAgent
        //     var isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        //     if (isiOS) { // 苹果
        //         window.location.href = 'https://itunes.apple.com/us/app/id1440099529?ls=1&mt=8'
        //     } else { // 安卓
        //         window.location.href = 'https://fir.im/9he3'
        //     }
        // }
    },
    methods: {
        // 获取详情
        async getOrderInfo () {
            let res = await getOrderInfo({orderId: this.orderId})
            console.log(res)
            this.data = res.data.info
            let time = this.data.remainingTime - parseInt(new Date().getTime() / 1000)
            this.setCountdown(time)
        },
        // 跳应永宝下载
        todown () {
            window.location.href = ''
            // this.$vux.toast.text('请在右上角选择其他浏览器打开此网页')
        },
        // 跳转
        jump () {
            if (this.isMember === 1) {
                this.$router.push({path: '/member/index', query: {userNo: this.userNo}})
            } else {
                this.$router.push({path: '/'})
            }
        },
        // 设置定时器
        setCountdown (n) {
            if (n <= 0) {
                this.countdown = '00:00:00'
                return
            }
            let hour = parseInt(n / 60 / 60)
            let minute = parseInt((n - hour * 60 * 60) / 60)
            let second = n - hour * 60 * 60 - minute * 60
            if (hour < 10) {
                hour = '0' + hour
            }
            if (minute < 10) {
                minute = '0' + minute
            }
            if (second < 10) {
                second = '0' + second
            }
            this.countdown = hour + ':' + minute + ':' + second
            n--
            setTimeout(() => {
                this.setCountdown(n)
            }, 1000)
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../../assets/less/define.less';
.alipay-order{background:#F5F5F5;height:100vh;width:@rem*750;margin:0 auto;width:@rem*750;margin:0 auto;
    .title{height:@rem*100;line-height:@rem*100;font-size:@rem*32;color:#666;padding:0 @rem*20;border-bottom:1px solid #D9D9D9;}
    .countdown{padding:0 @rem*20;height:@rem*100;line-height:@rem*100;font-size:@rem*24;color:#000;
        span{color:#ff2828;}
    }
    .order-detail{background:#fff;padding:@rem*30 @rem*20;
        .cell{display:flex;justify-content: space-between;margin-bottom:@rem*30;
            .label,.value{font-size:@rem*28;color:#000;}
        }
        .cell:last-child{margin-bottom:0;}
    }
    .btns{height:@rem*120;display:flex;justify-content:center;align-items:center;
        .btn{margin-right:@rem*45;width:@rem*300;height:@rem*60;line-height:@rem*60;text-align:center;background:#000;color:#fff;font-size:@rem*28;}
        .yellow{background:#fe823f;margin-right:0;}
    }
    .message{padding:@rem*30 @rem*20;
        .text{font-size:@rem*28;color:#000;}
        p{font-size:@rem*24;color:#000;word-wrap: break-word;word-break: normal;margin-top:@rem*10;
            span{color:#ff2828;}
        }
    }
}
</style>
