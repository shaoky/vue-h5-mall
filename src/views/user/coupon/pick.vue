<template>
    <div class="coupon-pick">
        <div class="cell" @click="cancelCoupon">
            <div class="label">不使用优惠券</div>
            <i class="iconfont icon-yuanxingweixuanzhong" v-if="!cancelSelect" ></i>
            <img class="icon" src="/static/images/common/seleted.png" v-if="cancelSelect" >
        </div>
        <div class="list">
            <div class="item" v-for="(item,index) in list" :key="index" @click="toConfirm(index)">
                <img src="/static/images/user/coupon/icon.png">
                <div class="container-canUse" v-if="item.isUse">
                    <div class="flex">
                        <div class="amount"><span>￥</span>{{item.couMoney}}</div>
                        <div class="detail">
                            <div class="left">
                                <div class="cell-detail">
                                    <div class="label">{{ item.couRangeKey | getRange }}</div>
                                    <div class="value font-limit">{{item.couName}}-{{item.couDesc}}</div>
                                </div>
                                <div class="spec">满{{item.couRuleValue}}元使用</div>
                                <div class="time">{{getTimeStr(item.couStartTime*1000,'yyyy-MM-dd')}} - {{getTimeStr(item.couStopTime*1000,'yyyy-MM-dd')}}</div>
                            </div>
                            <div class="right" >
                                <i class="iconfont icon-yuanxingweixuanzhong" v-if="!item.isSelected" @click="item.isSelected=true"></i>
                                <img src="/static/images/common/seleted.png" v-if="item.isSelected" @click="item.isSelected=false">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-unUse" v-if="!item.isUse">
                    <div class="flex">
                        <div class="amount"><span>￥</span>{{item.couMoney}}</div>
                        <div class="detail">
                            <div class="left">
                                <div class="cell-detail">
                                    <div class="label">{{ item.couRangeKey | getRange }}</div>
                                    <div class="value font-limit">{{item.couName}}-{{item.couDesc}}</div>
                                </div>
                                <div class="spec">满{{item.couRuleValue}}元使用</div>
                                <div class="time">{{getTimeStr(item.couStartTime*1000,'yyyy-MM-dd')}} - {{getTimeStr(item.couStopTime*1000,'yyyy-MM-dd')}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCanUserCoupon } from '@/api/getData'
import { getTimeStr } from '@/utils/date.js'

export default {
    data () {
        return {
            cancelSelect: false,
            isAllSelected: false,
            list: [],
            index: null, // 记录选中的优惠券的位置
            couponId: null
        }
    },
    filters: {
        getRange (value) {
            let text = ''
            if (value === 1) {
                text = '全场'
            } else if (value === 2) {
                text = '分类'
            } else if (value === 3) {
                text = '单品'
            } else if (value === 4) {
                text = '品牌'
            }
            return text
        }
    },
    mounted () {
        if (this.$route.query.couponId) {
            this.couponId = parseInt(this.$route.query.couponId)
        }

        this.getCanUserCoupon()
    },
    methods: {
        // 获取可用优惠券
        async getCanUserCoupon () {
            let res = await getCanUserCoupon()
            console.log(res)
            this.list = res.data.list
            for (let [index, item] of this.list.entries()) {
                if (this.couponId && this.couponId === item.cuId) {
                    this.$set(item, 'isSelected', true)
                    this.index = index
                } else {
                    this.$set(item, 'isSelected', false)
                }
            }
        },
        // 不使用优惠券
        cancelCoupon () {
            if (this.index) {
                this.list[this.index].isSelected = false
            }

            this.cancelSelect = true
            window.sessionStorage.setItem('couponId', -1)
            this.$router.go(-1)

            // this.$router.push({path: '/user/order/pay/confirm', query: {couponId: -1}})
        },
        toConfirm (index) {
            let item = this.list[index]
            if (!item.isUse) {
                return
            }
            item.isSelected = true
            window.sessionStorage.setItem('couponId', item.cuId)
            this.$router.go(-1)
            // this.$router.push({path: '/user/order/pay/confirm', query: {couponId: item.cuId}})
        },
        getTimeStr: getTimeStr
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.coupon-pick{width:@rem*750;margin:0 auto;
    .cell{display:flex;height:@rem*100;align-items:center;padding:0 @rem*24;border-bottom:1px solid #f5f5f5;
        .label{font-size:@rem*28;color:#000;flex:1;}
        .iconfont{color:#959595;font-size:@rem*36;}
        img.icon{width:@rem*36;height:@rem*36;display:block;}
    }
    .list{padding:0 @rem*20;margin-top:@rem*28;
        .item{position:relative;margin-bottom:@rem*20;
            img{box-shadow: 0 0 @rem*40 rgba(242,242,242,0.8);background:rgba(242,242,242,0.8);width:@rem*700;height:@rem*210;display:block;margin:0 auto;}
            .container-canUse{width:@rem*700;position:absolute;left:@rem*10;top:0;
                .flex{display:flex;
                    .amount{width:@rem*150;height:@rem*210;line-height:@rem*210;text-align:center;color:#ff2828;font-size:@rem*40;
                        span{font-size:@rem*28;}
                    }
                    .detail{width:@rem*550;height:@rem*210;padding:0 @rem*24;display:flex;align-items:center;
                        .left{flex:1;
                            .cell-detail{display:flex;align-items:center;font-size:@rem*28;color:#000;
                                .label{padding:@rem*5 @rem*10;background:#fe823f;border-radius:@rem*25;margin-right:@rem*20;text-align:center;}
                                .value{max-width:@rem*300;}
                            }
                            .spec{font-size:@rem*28;color:#959595;margin-top:@rem*20;}
                            .time{font-size:@rem*28;color:#959595;}
                        }
                        .right{width:@rem*100;display:flex;justify-content: center;
                            img{width:@rem*36;height:@rem*36;display:block;}
                        }
                    }
                }
            }
            .container-unUse{width:@rem*700;position:absolute;left:@rem*10;top:0;
                .flex{display:flex;
                    .amount{width:@rem*150;height:@rem*210;line-height:@rem*210;text-align:center;color:#959595;font-size:@rem*40;
                        span{font-size:@rem*28;}
                    }
                    .detail{width:@rem*550;height:@rem*210;padding:0 @rem*24;display:flex;align-items:center;
                        .left{flex:1;
                            .cell-detail{display:flex;align-items:center;font-size:@rem*28;color:#959595;
                                .label{padding:@rem*5 @rem*10;background:#959595;border-radius:@rem*25;margin-right:@rem*20;text-align:center;color:#fff;}
                                .value{max-width:@rem*300;}
                            }
                            .spec{font-size:@rem*28;color:#959595;margin-top:@rem*20;}
                            .time{font-size:@rem*28;color:#959595;}
                        }
                    }
                }
            }
        }
        .iconfont{color:#959595;font-size:@rem*36;}
    }
}
</style>
