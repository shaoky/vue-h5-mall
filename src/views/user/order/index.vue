<template>
    <div class="user-order-index">
        <div class="tabs-container">
            <div class="tabs">
                <div class="item" v-for="(item,index) in tabs" :key="index" @click="switchTabs(index)">
                    <div :class="['label',tabsIndex===index?'active':'']">{{item.label}}</div>
                </div>
            </div>
        </div>
        <scroller v-if="isLoading"  v-model="scrollerStatus" :use-pullup="true" :pullup-config="upobj" ref="scroller" lock-x  height="100vh"   @on-pullup-loading="getMore" :bounce="false" :scroll-bottom-offset="0">
            <div class="container">.
                <div v-if="list.length>0">
                    <div class="empty"></div>
                    <div class="goods-list" v-for="(item1,index1) in list" :key="index1">
                        <div class="title">
                            <div class="left">
                                <div class="imgs">
                                    <img src="/static/images/common/icon-04.png">
                                </div>
                                <div class="cell">
                                    <div class="date">{{item1.date}}</div>
                                    <div class="time">{{item1.time}}</div>
                                    <i class="iconfont icon-more"></i>
                                </div>
                            </div>
                            <div :class="['right',(item1.orderStatus===4 || item1.orderStatus===7)?'cancel':'']">{{item1.orderStatusName}}</div>
                        </div>
                        <ul>
                            <li v-for="(item2,index2) in item1.goodsList" :key="index2">
                                <orderList :item="item2" @click.native="toInfo(item1.orderId,item1.orderStatus,item1.refundId)"></orderList>
                            </li>
                        </ul>
                        <div class="operation">
                            <div class="cell">
                                <div class="label">订单总计</div>
                                <div class="value">￥{{item1.payableMoney}}</div>
                            </div>
                            <div class="btns">
                                <!-- 待付款 -->
                                <div class="btn" v-if="item1.orderStatus===1" @click="cancelOrder(item1.orderId)">取消订单</div>
                                <div class="btn red" v-if="item1.orderStatus===1" @click="toPay(item1.orderId,item1.orderNo)">去付款</div>
                                <!-- 待发货 -->
                                <!-- <div class="btn" v-if="item1.isRefund===1" @click="apply(item1.orderId)">申请退款</div> -->
                                <!-- 待收货 -->
                                <div class="btn red" v-if="item1.orderStatus===3" @click="sureOrder(item1.orderId)">确认收货</div>
                                <!-- 已关闭 -->
                                <div class="btn" v-if="item1.orderStatus===7" @click="delOrder(item1.orderId)">删除订单</div>
                                <!-- 交易成功 -->
                                <div class="btn" v-if="item1.isRefund === 1" @click="apply(item1.orderId)">申请退款</div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="scroll-after" v-if="isComplete">暂无数据</div> -->
                </div>
                <div class="noOrder" v-if="list.length===0">
                    <img src="../../../assets/images/icon/icon-cart-null.png" class="icon">
                    <div class="text">当前没有数据</div>
                </div>
            </div>
        </scroller>

    </div>
</template>

<script>
import { getOrderList, cancelOrder, sureOrder, delOrder } from '@/api/getData'
import orderList from '@/components/order-list'
import { getTimeStr } from '@/utils/date.js'
import { Scroller } from 'vux'

export default {
    data () {
        return {
            search: {
                page: 0,
                size: 20
            },
            tabs: [{label: '全部', value: 0}, {label: '待付款', value: 1}, {label: '待发货', value: 2}, {label: '待收货', value: 3}, {label: '交易成功', value: 4}],
            list: [],
            tabsIndex: 0,
            isLoading: false,
            hasNext: false,
            isComplete: false,
            scrollerStatus: {
                pullupStatus: 'default'
            },
            upobj: { // 初始化数据
                content: '请上拉刷新数据',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '请上拉刷新数据',
                upContent: '请上拉刷新数据',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            }
        }
    },
    mounted () {
        let state = parseInt(window.sessionStorage.getItem('tabState'))
        if (state) {
            this.search.orderStatus = state
            this.tabsIndex = state
        }

        this.getOrderList()
    },
    methods: {
        // 获取列表
        async getOrderList (n) {
            if (n === 1) {
                this.list = []
            }
            let res = await getOrderList(this.search)
            this.isLoading = true
            console.log(res)
            let data = res.data
            for (let item of data.list) {
                let dateStr = getTimeStr(item.createTime * 1000, 'yyyy-MM-dd hh:mm:ss')
                let arr = dateStr.split(/\s/)
                this.$set(item, 'date', arr[0])
                this.$set(item, 'time', arr[1])
            }
            this.list.push(...data.list)
            if (this.list.length >= data.count) {
                this.hasNext = false
                this.isComplete = true
                this.$nextTick().then(() => { this.$refs.scroller.disablePullup() })
            } else {
                this.hasNext = true
                this.isComplete = false
                this.$nextTick().then(() => { this.$refs.scroller.enablePullup() })

                document.getElementsByClassName('xs-plugin-pullup-container')[0].innerHTML = '请上拉刷新数据'
            }
        },
        // 导航条切换
        switchTabs (index) {
            if (this.tabsIndex === index) {
                return
            }
            this.isLoading = false
            this.tabsIndex = index
            window.sessionStorage.setItem('tabState', index)
            this.search.orderStatus = index
            this.search.page = 0
            // this.list = []
            // document.getElementsByClassName('scroller-componet')[0].scrollTop = 0
            this.getOrderList(1)
            // 请求
        },
        // 去详情
        toInfo (orderId, n, refundId) {
            if (n === 5 || n === 6) {
                this.$router.push({path: '/user/after-sales/info', query: {refundId: refundId}})
            } else {
                this.$router.push({path: '/user/order/info', query: {orderId: orderId}})
            }
        },
        // 去申请退款页面
        apply (orderId) {
            this.$router.push({path: '/user/after-sales/apply', query: {orderId: orderId}})
        },
        // 取消订单
        cancelOrder (orderId) {
            var that = this
            this.$vux.confirm.show({
                title: '操作提示',
                content: '确定取消订单吗',
                async onConfirm () {
                    await cancelOrder({orderId: orderId})
                    that.$vux.toast.text('订单取消成功')
                    that.list = []
                    that.getOrderList()
                },
                onCancel () {
                    console.log(2)
                }
            })
        },
        // 去支付
        toPay (orderId, orderNo) {
            this.$router.push({path: '/user/order/pay/index', query: {orderId: orderId, orderNo: orderNo}})
        },
        // 确认收货
        sureOrder (orderId) {
            var that = this
            this.$vux.confirm.show({
                title: '操作提示',
                content: '确定收货吗',
                async onConfirm () {
                    await sureOrder({orderId: orderId})
                    that.$vux.toast.text('订单收货成功')
                    that.list = []
                    that.getOrderList()
                },
                onCancel () {
                    console.log(2)
                }
            })
        },
        // 删除订单
        delOrder (orderId) {
            var that = this
            this.$vux.confirm.show({
                title: '操作提示',
                content: '确定删除订单吗',
                async onConfirm () {
                    await delOrder({orderId: orderId})
                    that.$vux.toast.text('订单删除成功')
                    that.list = []
                    that.getOrderList()
                },
                onCancel () {
                    console.log(2)
                }
            })
        },
        // 上拉触底事件
        getMore () {
            if (!this.hasNext) {
                return
            }
            if (this.hasNext) {
                this.search.page++
                this.getOrderList()
            }
        }
    },
    components: {
        orderList,
        Scroller
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.user-order-index{width:@rem*750;margin:0 auto;
    //导航条
    .tabs-container{position:fixed;top:0;left:0;width:@rem*750;background:#fff;z-index:999;
        .tabs{display:flex;
            .item{flex:1;height:@rem*80;display:flex;justify-content: center; align-items:center;
                .label{font-size:@rem*32;color:#999;display:inline-block;height:@rem*80;line-height:@rem*80;}
                .active{color:#000;position:relative;}
                .active:after{height:@rem*3;width:100%;background:#000;content:'';position:absolute;bottom:0;left:0;}
            }
        }
    }
    .container{-webkit-overflow-scrolling: touch;}
    .noOrder{display:flex;flex-direction: column;align-items:center;justify-content: center;height:100vh;
        .icon{width:@rem*288;height:@rem*288;display: block;}
        .text{margin-top:@rem*32;font-size:@rem*32;color:#999;}
    }
    .empty{height:@rem*80;}
    .goods-list{border-top:1px solid #f5f5f5;border-bottom:1px solid #f5f5f5;
        .title{display:flex;justify-content: space-between;align-items:center;height:@rem*80;padding-left:@rem*24;
            .left{display:flex;align-items:center;
                .imgs{margin-right:@rem*12;
                    img{width:@rem*28;height:@rem*28;display:block;}
                }
                .cell{display:flex;align-items:center;
                    .date{font-size:@rem*28;color:#000;margin-right:@rem*12;}
                    .time{font-size:@rem*28;color:#999;}
                    .icon-more{font-size:@rem*32;}
                }
            }
            .right{font-size:@rem*28;color:#fff;width:@rem*120;height:@rem*48;line-height:@rem*48;background:#fe823f;text-align:center;}
            .cancel{background:#999;color:#fff;}
        }
        .operation{padding:@rem*32 @rem*24 @rem*32;
            .cell{display:flex;justify-content: space-between;
                .label{font-size:@rem*28;color:#000;}
                .value{font-size:@rem*28;color:#ff2828;}
            }
        }
        .btns{display:flex;justify-content: flex-end;margin-top:@rem*32;
            .btn{width:@rem*160;height:@rem*60;line-height:@rem*60;text-align:center;font-size:@rem*28;color:#666;border-radius:@rem*8;border:1px solid #666;margin-right:@rem*32;}
            .red{color:#ff2828;border:1px solid #ff2828;}
            div:last-child{margin-right:0;}
        }
    }
}
</style>
