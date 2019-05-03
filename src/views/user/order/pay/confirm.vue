<template>
    <div class="order-confirm">
        <!-- 邀请人 -->
        <div class="Invitation" v-if="userNo">
            <div class="text">邀请人：{{store.userName}}</div>
            <div class="text">ID：{{userNo}}</div>
        </div>
        <address-detail :defaultAddress="defaultAddress" :isOrder="1"></address-detail>
        <div class="bg"></div>
        <div class="goods-list">
            <div class="title">
                <div class="imgs">
                    <img src="/static/images/common/icon-03.png">
                </div>
                <div class="text">订单信息</div>
            </div>
            <ul>
                <li class="item" v-for="(item,index) in data.goodsList" :key="index">
                    <order-list :item="item"></order-list>
                </li>
            </ul>
        </div>
        <div class="order-detail">
            <div class="coupon" v-if="!app">
                <div class="title">优惠券减免</div>
                <div class="cell-coupon" @click="toPick">
                    <div class="label">优惠券</div>
                    <div class="value" >
                        <div class="text" v-if="!data.coupon">暂无可用的优惠券</div>
                        <div class="text" v-if="data.coupon">满{{data.coupon.couRuleValue}}减{{data.coupon.couMoney}}</div>
                        <i class="iconfont icon-more"></i>
                    </div>
                </div>
            </div>
            <div class="cell">
                <div class="label">配送方式</div>
                <div class="value">快递费：{{data.deliverMoney}}元</div> <!-- {{data.deliverMoney}} -->
            </div>
            <div class="cell">
                <div class="input">
                    <span>留言：</span>
                    <input type="text" placeholder="填写内容已经与商家协商确认" v-model="form.orderRemark">
                </div>
            </div>
            <div class="cell">
                <div class="label">订单总计</div>
                <div class="price">￥{{data.payMoney}}</div>
            </div>
        </div>
        <div class="bg"></div>
        <!-- 支付方式 -->
        <div class="pay">
            <div class="cell-title">
                <div class="imgs">
                    <img src="/static/images/common/icon-03.png">
                </div>
                <div class="text">选择支付方式</div>
            </div>
            <div class="cell">
                <div class="label">
                    <img src="/static/images/user/pay/alipay.png" class="icon">
                    <div class="value">支付宝支付</div>
                </div>
                <i class="iconfont icon-yuanxingweixuanzhong" v-if="!isSelected" @click="isSelected=true"></i>
                <img src="/static/images/common/seleted.png" v-if="isSelected">
            </div>
            <div class="cell">
                <div class="label">
                    <img src="/static/images/user/pay/wechat.png" class="icon">
                    <div class="value">微信支付</div>
                </div>
                <i class="iconfont icon-yuanxingweixuanzhong" v-if="isSelected" @click="isSelected=false"></i>
                <img src="/static/images/common/seleted.png" v-if="!isSelected">
            </div>
        </div>
        <!-- 底部 -->
        <div class="cell-bottom">
            <div class="flex">
                <div class="label"> 实付款：<span>￥{{data.payMoney}}</span> </div>
                <div class="btn" @click="submit">提交订单</div>
            </div>
        </div>
    </div>
</template>

<script>
import addressDetail from '@/components/address-detail'
import orderList from '@/components/order-list'
import { previewOrder, previewMemberOrder, confirmOrder, getDefaultAddress, getAddressInfo, Alipay, settlement, getStore } from '@/api/getData'

export default {
    data () {
        return {
            form: {},
            data: {},
            store: {},
            addressId: '',
            isSelected: false,
            defaultAddress: null,
            isWeChat: false,
            couponId: null
        }
    },
    computed: {
        payMoney () {
            let value = ''
            if (this.data.coupon) {
                value = this.data.payMoney - this.data.coupon.couMoney
            } else {
                value = this.data.payMoney
            }
            return value.toFixed(2)
        },
        app () {
            let value = ''
            if (window.sessionStorage.getItem('app')) {
                value = window.sessionStorage.getItem('app')
            }
            return value
        },
        token () {
            return this.$store.state.user.token
        },
        userNo () {
            let value = ''
            let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
            if (userInfo) {
                value = userInfo.superiorNo || userInfo.userNo
            } else if (window.sessionStorage.getItem('userNo')) {
                value = window.sessionStorage.getItem('userNo')
            }

            return value
        }
        // goodsId () {
        //     let value = ''
        //     if (window.sessionStorage.getItem('goodsId')) {
        //         value = parseInt(window.sessionStorage.getItem('goodsId'))
        //     }
        //     return value
        // }
    },
    mounted () {
        // if (this.$route.query.couponId) {
        //     this.couponId = parseInt(this.$route.query.couponId)
        // }
        if (window.sessionStorage.getItem('couponId')) {
            this.couponId = parseInt(window.sessionStorage.getItem('couponId'))
        }
        // if (this.$route.query.addressId) { // 地址列表选择完地址回来带ID
        // this.addressId = parseInt(this.$route.query.addressId)
        // this.getAddressInfo()
        if (window.sessionStorage.getItem('addressId')) {
            this.addressId = parseInt(window.sessionStorage.getItem('addressId'))
            this.getAddressInfo()
        } else { // 没有地址ID就获取默认地址
            this.getDefaultAddress()
        }
        if (this.$route.query.goodsId && this.$route.query.goodsNum) { // 商品预览
            this.getMemberOrderInfo()
        } else { // 购物车预览
            this.getOrderInfo()
        }
        this.getStore()
    },
    methods: {
        // 购物车订单预览
        async getOrderInfo () {
            let res = await previewOrder({cuId: this.couponId})
            this.data = res.data
        },
        // 商品订单预览
        async getMemberOrderInfo () {
            let res = await previewMemberOrder({goodsId: this.$route.query.goodsId, goodsNum: this.$route.query.goodsNum})
            this.data = res.data
        },
        // 获取默认地址
        async getDefaultAddress () {
            let res = await getDefaultAddress()
            // console.log(res)
            this.defaultAddress = res.data.address
            if (this.defaultAddress) {
                this.addressId = this.defaultAddress.addressId
            }
        },
        // 获取店铺信息
        async getStore () {
            let res = await getStore({userNo: this.userNo})
            // console.log(res)
            this.store = res.data.userInfo
        },
        // 获取地址详情
        async getAddressInfo () {
            let res = await getAddressInfo({addressId: this.addressId})
            // console.log(res)
            this.defaultAddress = res.data.info
        },
        async submit () {
            // 判断是否有地址
            if (!this.addressId) {
                this.$vux.toast.text('请选择地址', 'middle')
                return
            }
            if (this.isSelected) {
                this.form.payType = 1
            } else {
                this.form.payType = 2
            }
            let arr = []
            let obj = {}
            for (let item of this.data.goodsList) {
                obj.goodsId = item.goodsId
                obj.goodsNum = item.goodsNum
                obj.skuId = item.skuId
                arr.push({...obj})
            }
            if (this.userNo) {
                this.form.userNo = this.userNo
            }
            if (this.couponId && this.couponId !== -1) {
                this.form.cuId = this.couponId
            }
            if (this.data.coupon) {
                this.form.cuId = this.data.coupon.cuId
            }
            this.form.goodsList = arr
            this.form.addressId = this.addressId

            let res = await confirmOrder(this.form)
            // console.log(res)
            // console.log(res.data.orderNo)
            if (this.form.payType === 1) { // 如果是支付宝支付，则跳转到支付中间层
                this.$router.push({path: '/user/order/pay/alipay', query: { token: this.token, orderNo: res.data.orderNo, orderId: res.data.orderId }})
            }
            if (this.form.payType === 2) {
                this.clearing(res.data.orderNo, res.data.orderId)
            }
        },
        // 调起支付
        async Alipay (orderNo) {
            let res = await Alipay({orderNo: orderNo})
            const div = document.createElement('div')
            div.innerHTML = res.data
            document.body.appendChild(div)
            document.forms[0].submit()
        },
        async clearing (orderNo, orderId) {
            console.log(orderNo)
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
        },
        // 去选择优惠券页面
        toPick () {
            if (!this.data.coupon) {
                this.$router.push({path: '/user/coupon/pick'})
            } else {
                this.$router.push({path: '/user/coupon/pick', query: {couponId: this.data.coupon.cuId}})
            }
        }
    },
    components: {
        addressDetail,
        orderList
    }
}
</script>

<style scoped lang="less">
@import '../../../../assets/less/define.less';
.order-confirm{position:relative;width:@rem*750;margin:0 auto;
    .Invitation{display:flex;justify-content: space-between;padding:@rem*28 @rem*24;border-bottom:1px solid #f5f5f5;
        .text{font-size:@rem*32;color:#000;}
    }
    .bg{height:@rem*20;background:#f5f5f5;}
    .goods-list{
        .title{display:flex;padding:@rem*20 @rem*24 0;align-items:center;
            .imgs{width:@rem*26;height:@rem*26;margin-right:@rem*10;
                img{width:100%;height:100%;display:block;}
            }
            .text{font-size:@rem*28;color:#000;}
        }
    }
    .order-detail{padding:@rem*32 @rem*24;
        .coupon{border-bottom:1px solid #f5f5f5;padding-bottom:@rem*32;
            .title{font-size:@rem*28;color:#000;margin-bottom:@rem*32;}
            .cell-coupon{display:flex;
                .label{flex:1;font-size:@rem*28;color:#000;}
                .value{display:flex;align-items:center;
                    .text{font-size:@rem*28;color:#000;}
                    .icon-more{font-size:@rem*32;}
                }
            }
        }
        .cell{display:flex;font-size:@rem*28;color:#000;margin-top:@rem*32;
            .value{text-align:right;flex:1;}
            .price{text-align:right;flex:1;color:#ff2828;}
            .input{flex:1;display:flex;
                span{display:inline-block;white-space:nowrap;}
                input{border:none;width:100%;color: #959595;font-size: @rem*28;}
                input::-webkit-input-placeholder {color: #959595;font-size: @rem*28;}
            }
        }
        .cell:first-child{margin-top:0;}
    }
    //支付方式
    .pay{padding:@rem*32 @rem*24;margin-bottom:@rem*105;
        .cell-title{display:flex;align-items:center;padding-bottom:@rem*32;border-bottom:1px solid #f5f5f5;
            .imgs{height:@rem*32;width:@rem*34;margin-right:@rem*12;
                img{height:100%;width:100%;display:block;}
            }
            .text{font-size:@rem*28;color:#000;}
        }
        .cell{display:flex;justify-content: space-between;align-items:center;margin-top:@rem*28;
            .label{flex:1;display:flex;align-items:center;
                .icon{width:@rem*40;height:@rem*40;margin-right:@rem*12;}
                .value{font-size:@rem*28;color:#000;}
            }
            .icon-yuanxingweixuanzhong{font-size:@rem*32;}
            img{width:@rem*36;height:@rem*36;}
        }
    }
    .cell-bottom{border-top:1px solid #f5f5f5;position:fixed;bottom:0;background:#fff;width:@rem*750;
        .flex{display:flex;
            .label{flex:1;height:@rem*104;line-height:@rem*104;font-size:@rem*30;color:#000;padding-left:@rem*24;
                span{color:#ff2828;}
            }
            .btn{width:@rem*268;height:@rem*104;line-height:@rem*104;text-align:center;font-size:@rem*32;color:#fff;background:#fe823f;}
        }
    }
}
</style>
