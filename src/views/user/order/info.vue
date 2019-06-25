<template>
    <div class="user-order-info wrap">
        <!-- 待支付 -->
        <div class="header">
            <div class="title">{{title}}</div>
            <div class="value">{{message}}</div>
            <div class="value" v-if="data.orderStatus === 3">快递名称：{{data.courierName}}  快递单号：{{data.courierNo}}</div>
            <div class="cell">
                <div class="left">订单编号：<span id="copy">{{data.orderNo}}</span></div>
                <a href="javascript:" class="copy-btn" data-clipboard-target="#copy" data-clipboard-action="copy">复制</a>
            </div>
        </div>
        <address-detail :defaultAddress="data"></address-detail>
        <div class="bg"></div>
        <div class="detail">
            <div class="cell">
                <img src="/static/images/common/icon-04.png">
                <div class="date">{{form.date}}</div>
                <div class="time">{{form.time}}</div>
                <i class="iconfont icon-more"></i>
            </div>
            <ul>
                <li v-for="(item,index) in data.goodsList" :key="index">
                    <order-list :item="item"></order-list>
                </li>
            </ul>

            <div class="cost-detail">
                <div class="cell">
                    <div class="label">运费</div>
                    <div class="value">￥{{data.deliverMoney}}</div>
                </div>
                <div class="cell" v-if="data.couponMoney">
                    <div class="label">优惠券</div>
                    <div class="value">-￥{{data.couponMoney}}</div>
                </div>
                <div class="cell">
                    <div class="label">商品金额</div>
                    <div class="value">￥{{data.totalMoney}}</div>
                </div>
                <div class="cell" v-if="data.orderStatus === 1 || data.orderStatus === 7">
                    <div class="label">应付金额</div>
                    <div class="value red">￥{{data.payableMoney}}</div>
                </div>
                <div class="cell" v-if="data.orderStatus !== 1 && data.orderStatus !== 7">
                    <div class="label">实付金额</div>
                    <div class="value red">￥{{data.payMoney}}</div>
                </div>
            </div>
        </div>
        <!-- 待支付 订单取消 交易完成 -->
        <!-- <div class="btn-bottom" v-if="data.orderStatus===1 || data.orderStatus===4 || data.orderStatus===7">联系客服</div> -->
        <a href="tel:4008879199" class="btn-bottom" v-if="data.orderStatus===1 || data.orderStatus===4 || data.orderStatus===7">联系客服</a>
        <!-- 待发货 -->
        <div class="btns" v-if="data.orderStatus===2">
            <a href="tel:4008879199" class="btn">联系客服</a>
            <!-- <div ></div> -->
            <div class="btn yellow" @click="apply(data.orderId)">申请退货</div>
        </div>
        <!-- 待收货 -->
        <div class="btns" v-if="data.orderStatus===3">
            <a href="tel:4008879199" class="btn">联系客服</a>
            <div class="btn yellow" @click="sureOrder">确认收货</div>
        </div>
    </div>
</template>

<script>
import addressDetail from '@/components/address-detail'
import orderList from '@/components/order-list'
import { getTimeStr } from '@/utils/date.js'
import { getOrderInfo, sureOrder } from '@/api/getData'

export default {
    data () {
        return {
            orderId: null,
            data: {},
            form: {
                date: '',
                time: ''
            },
            countdown: ''
        }
    },
    computed: {
        title () {
            let text = ''
            if (this.data.orderStatus === 1) {
                text = '等待支付费用'
            } else if (this.data.orderStatus === 2) {
                text = '待发货'
            } else if (this.data.orderStatus === 3) {
                text = '待收货'
            } else if (this.data.orderStatus === 4) {
                text = '交易完成'
            } else if (this.data.orderStatus === 7) {
                text = '订单取消'
            }
            return text
        },
        message () {
            let text = ''
            if (this.data.orderStatus === 1) {
                text = '请在 ' + this.countdown + ' 内付款,时间结束后订单将会被取消'
            } else if (this.data.orderStatus === 2) {
                text = '支付成功，货物尽快安排配送中'
            } else if (this.data.orderStatus === 3) {
                text = '订单将 ' + this.countdown + ' 后自动确认收货'
            } else if (this.data.orderStatus === 4) {
                text = '交易成功，卖家将收到您的货款'
            } else if (this.data.orderStatus === 7) {
                text = '取消成功，等待您下次的购买'
            }
            return text
        }
    },
    mounted () {
        if (this.$route.query.orderId) {
            this.orderId = parseInt(this.$route.query.orderId)
        }
        this.getOrderInfo()
        var clipboard = new ClipboardJS('.copy-btn').on('success', (e) => {
            var e = e || window.event
            this.$vux.toast.text('复制成功', 'middle')
        }).on('error', function (e) {})
    },
    methods: {
        // 获取订单详情
        async getOrderInfo () {
            let res = await getOrderInfo({orderId: this.orderId})
            console.log(res)
            let data = res.data.info
            // 日期
            let dateStr = getTimeStr(data.createTime * 1000, 'yyyy-MM-dd hh:mm:ss')
            let arr = dateStr.split(/\s/)
            this.form.date = arr[0]
            this.form.time = arr[1]
            // 待支付定时器
            if (data.orderStatus === 1) {
                let time = data.remainingTime - parseInt(new Date().getTime() / 1000)
                this.setCountdown(time)
            }
            // 待收货定时器
            if (data.orderStatus === 3) {
                let time = data.confirmTime - parseInt(new Date().getTime() / 1000)
                this.setCountdown(time)
            }
            this.data = data
        },
        // 设置定时器
        setCountdown (n) {
            if (n <= 0) {
                return
            }
            let day = parseInt(n / 24 / 60 / 60)
            let hour = parseInt((n - day * 24 * 60 * 60) / 60 / 60)
            let minute = parseInt((n - day * 24 * 60 * 60 - hour * 60 * 60) / 60)
            let second = n - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
            if (hour < 10) {
                hour = '0' + hour
            }
            if (minute < 10) {
                minute = '0' + minute
            }
            if (second < 10) {
                second = '0' + second
            }
            if (day === 0) {
                this.countdown = hour + ':' + minute + ':' + second
            } else {
                this.countdown = day + '天' + hour + ':' + minute + ':' + second
            }
            n--
            setTimeout(() => {
                this.setCountdown(n)
            }, 1000)
        },
        apply (orderId) {
            this.$router.push({path: '/user/after-sales/apply', query: {orderId: orderId}})
        },
        // 确认收货
        sureOrder (orderId) {
            var that = this
            this.$vux.confirm.show({
                title: '操作提示',
                content: '确定收货吗',
                async onConfirm () {
                    await sureOrder({orderId: this.data.orderId})
                    that.$vux.toast.text('订单收货成功')
                    that.list = []
                    that.getOrderList()
                },
                onCancel () {
                    console.log(2)
                }
            })
        }
    },
    components: {
        addressDetail, orderList
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.user-order-info{
    .header{padding: @rem*32 @rem*24; border-top: 1px solid #f5f5f5; border-bottom: 1px solid #f5f5f5;
        .title{font-size: @rem*40; color:#000;}
        .value{font-size: @rem*26; color:#333; margin-top: @rem*12;}
        .cell{display: flex;justify-content:  space-between;margin-top: @rem*32;align-items: center;
            .left{font-size: @rem*32;color: #333;}
            .copy-btn{width: @rem*82;height: @rem*40;line-height: @rem*40;border: 1px solid #000;color: #333;text-align: center;border-radius: @rem*8;font-size: @rem*26;}
        }
    }
    .bg{height: @rem*20;background: #f5f5f5;}
    .detail{margin-bottom:  @rem*120;
        .cell{display: flex; align-items: center; padding: @rem*30 @rem*24 0;
            img{width: @rem*28;height: @rem*28; display: block;}
            .date{font-size: @rem*28; color: #000; margin-right: @rem*12; margin-left: @rem*12;}
            .time{font-size: @rem*28; color: #999;}
            .icon-more{font-size: @rem*32;}
        }
        .cost-detail{padding: @rem*32 @rem*24 0;
            .cell{display: flex; justify-content: space-between; margin-bottom: @rem*32; padding: 0;
                .label{font-size: @rem*28; color: #333;}
                .value{font-size: @rem*28; color: #333;}
                .red{color: #ff2828;}
            }
        }
    }
    .btn-bottom{width: @rem*750; height: @rem*88; line-height: @rem*88; background: #fe823f; font-size: @rem*32; color: #fff; text-align: center; position: fixed; bottom: 0;left: 0;}
    .btns{width: @rem*750; border: 1px solid #fe823f; position: fixed; bottom: 0; left: 0;
        .btn{width: 50%; height: @rem*88; line-height: @rem*88; text-align: center; font-size: @rem*32; color: #000; float: left; background: #fff;}
        .yellow{background: #fe823f; color:  #fff;}
    }
}
</style>
