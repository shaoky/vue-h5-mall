<template>
    <div class="user-pay-shop wrap">
        <div class="box">
            <div class="name">商家名称：{{data.info.shopName}}</div>
            <div class="title">订单金额：</div>
            <div class="price">
                <label for="">￥</label>
                <input type="number" v-model="price" @keydown="handleInput" maxlength="6" class="v-input">
            </div>
            <div class="border"></div>
            <div class="discount">
                <div class="left">惠</div>
                <div class="text">{{data.info.discountRate * 10}}折(会员折扣)</div>
                <div class="money">-￥{{discountPrice}}</div>
            </div>
            <div class="title2" style="color: #959595;">支付方式：</div>
            <div class="pay-type">
                <div class="item">
                    <i class="iconfont icon-weixinzhifu"></i>
                    <div class="text">微信支付</div>
                    <i class="iconfont icon-xuanzhong"></i>
                </div>
            </div>
            <div class="submit" @click="pay">{{payMoney}}元 确认付款</div>
        </div>
    </div>
</template>

<script>
import { getShopInfo, settlement, shopConfirmOrder } from '@/api/getData'

export default {
    data () {
        return {
            discountPrice: 0,
            payMoney: 0,
            price: '',
            data: {
                info: {}
            }
        }
    },
    computed: {
        shopId () {
            let shopId = this.$route.query.shopId
            return shopId
        }
    },
    watch: {
        price: function (val) {
            this.discountPrice = (val * (1 - this.data.info.discountRate)).toFixed(2)
            this.payMoney = parseInt((this.price - this.discountPrice) * 100) / 100
        }
    },
    mounted () {
        this.getShopInfo()
    },
    methods: {
        // 获取订单详情
        async getShopInfo () {
            let res = await getShopInfo({shopId: this.shopId})
            this.data = res.data
        },
        // 支付
        async pay () {
            let res = await shopConfirmOrder({shopId: this.shopId, totalMoney: this.price, payType: 2})
            this.clearing(res.data.orderNo)
        },
        // 支付
        async clearing (orderNo) {
            var that = this
            let form = {
                orderNo: orderNo
                // totalMoney: this.price,
                // payType: 2
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
                        that.$router.push({path: '/user/consumption/index'})
                    } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                }
            )
        },
        handleInput (e) {
            // 通过正则过滤小数点后两位
            e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../../assets/less/define.less';
.user-pay-shop{background: #f2f2f2; height: 100vh; padding: @rem*60 @rem*55 0;
    .box{background: #fff; padding-bottom: @rem*90;
        .name{height: @rem*120; line-height: @rem*120; padding-left: @rem*25; font-size: @rem*30; background: #fbfbfb; border-bottom: 1px solid #f2f2f2;}
        .title{font-size: @rem*30; margin: @rem*35 0 @rem*45 0; padding-left: @rem*25;}
        .price{padding-left: @rem*20; display: flex;
            label{font-size: @rem*56; color: #282828;}
            input{height: @rem*80; flex: 1; font-size: @rem*40; padding-left: @rem*15;}
        }
        .border{height: 1px; background: #f2f2f2; margin: 0 @rem*45; margin-top: @rem*35;}
        .discount{display: flex; align-items: center; margin: @rem*40 @rem*46 0 @rem*30;
            .left{font-size: @rem*21; color: #fff; width: @rem*32; height: @rem*32; line-height: @rem*32; text-align: center; background: #fe823f; border-radius: 2px;}
            .text{margin-left: @rem*10; font-size: @rem*26; flex: 1;}
            .money{font-size: @rem*28; color: #282828;}
        }
        .title2{font-size: @rem*30; margin: @rem*35 0 @rem*35 0;margin-top: @rem*75;  padding-left: @rem*25;}
        .pay-type{padding: 0 @rem*25;
            .item{display: flex; height: @rem*80; align-items: center;
                .icon-weixinzhifu{color: #5cb551; font-size: @rem*30;}
                .text{flex: 1; font-size: @rem*28; margin-left: @rem*10;}
                .icon-xuanzhong{color: #fe823f; font-size: @rem*32;}
            }
        }
        .submit{width: @rem*524; margin: @rem*95 auto 0; height: @rem*80; line-height: @rem*80; text-align: center; font-size: @rem*28;background: #fe823f; color: #fff; border-radius: 8px;}
    }
}
</style>
