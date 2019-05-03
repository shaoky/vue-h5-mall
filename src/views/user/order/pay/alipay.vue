<template>
    <div class="alipay-index">
        <img class="icon" src="/static/images/pay/icon-01.png" @click="toInfo">
    </div>
</template>

<script>
import { Alipay } from '@/api/getData'
import { getParams } from '@/utils/getParams'

export default {
    data () {
        return {
            isWeChat: false,
            orderId: null
        }
    },
    mounted () {
        if (this.$route.query.orderId) {
            this.orderId = parseInt(this.$route.query.orderId)
        }
        var ua = navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('微信')
            this.isWeChat = true
        } else {
            console.log('非微信')
            var url = window.location.href
            var params = getParams(url)
            console.log(params)
            window.localStorage.setItem('token', JSON.stringify(params.token))
            this.Alipay(params.orderNo)
        }
    },
    methods: {
        async Alipay (orderNo) {
            let res = await Alipay({orderNo: orderNo})
            const div = document.createElement('div')
            div.innerHTML = res.data
            document.body.appendChild(div)
            document.forms[0].submit()
        },
        toInfo () {
            var ua = navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                this.$router.push({path: '/user/order/pay/alipay-order', query: {orderId: this.orderId}})
            } else {
                this.$vux.toast.text('请在微信端查看')
            }
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../../assets/less/define.less';
.alipay-index{width:@rem*750;height:100vh;background:url(/static/images/pay/icon-02.png);background-size:100%;position:relative;width:@rem*750;margin:0 auto;
    .icon{width:@rem*460;height:@rem*80;position:absolute;left:50%;bottom:@rem*100;transform:translateX(-50%);}
}
</style>
