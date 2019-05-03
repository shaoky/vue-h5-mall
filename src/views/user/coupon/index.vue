<template>
    <div class="coupon-index">
        <div class="tabs">
            <div class="flex">
                <div :class="['tabs-item',tabsIndex===index?'active':'']" v-for="(item,index) in tabs" :key="index" @click="activeTabs(index)">
                    {{item}}
                </div>
            </div>
        </div>
        <scroller v-if="isLoading"  v-model="scrollerStatus" :use-pullup="true" ref="scroller" lock-x  height="100vh"  :pullup-config="upobj" @on-pullup-loading="getMore" :bounce="false" :scroll-bottom-offset="0">
            <div class="container">
                <div v-if="list.length>0">
                    <div class="empty"></div>
                    <div class="list">
                        <div class="item" v-for="(item,index) in list" :key="index">
                            <img src="/static/images/user/coupon/icon.png">
                            <div class="container">
                                <div class="flex">
                                    <div class="amount"><span>￥</span>{{item.couMoney}}</div>
                                    <div class="detail">
                                        <div class="left">
                                            <div class="cell">
                                                <div class="label">{{ item.couRangeKeyName }}</div>
                                                <div class="value font-limit">{{item.couName}}-{{item.couDesc}}</div>
                                            </div>
                                            <div class="spec">{{item.couText}}</div>
                                            <div class="time">{{getTimeStr(item.createTime*1000,'yyyy-MM-dd')}} - {{getTimeStr(item.overTime*1000,'yyyy-MM-dd')}}</div>
                                        </div>
                                        <div class="right" v-if="tabsIndex===1">
                                            已使用
                                        </div>
                                        <div class="right" v-if="tabsIndex===2">
                                            已过期
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- <div class="scroll-after" v-if="isComplete" >暂无数据</div> -->
                    <div class="empty1"></div>
                </div>
                <div class="noCoupon" v-if="list.length===0">
                    <img src="../../../assets/images/icon/icon-cart-null.png" class="icon">
                    <div class="text">当前没有数据</div>
                </div>
            </div>
        </scroller>

        <div class="imgs" @click="visible=true;form={}">
            兑换
            <!-- <img src="/static/images/user/coupon/icon-01.png" @click="visible=true;form={}"> -->
        </div>

        <x-dialog v-model="visible" :hide-on-blur="true" class="dialog">
            <div class="title">请输入兑换码</div>
            <div class="input">
                <input type="text" v-model.number="form.redeemCode">
            </div>
            <div class="btn" @click="getCoupon">确定</div>
        </x-dialog>
    </div>
</template>

<script>
import { XDialog, Scroller } from 'vux'
import { getMyCoupon, getCoupon } from '@/api/getData'
import { getTimeStr } from '@/utils/date.js'

export default {
    data () {
        return {
            search: {page: 0, size: 20, couStatus: 1},
            tabs: ['未使用', '已使用', '已过期'],
            list: [],
            tabsIndex: 0,
            isSelected: false,
            visible: false,
            form: {},
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
        this.getMyCoupon()
    },
    methods: {
        // 获取优惠券列表
        async getMyCoupon (n) {
            if (n === 1) {
                this.list = []
            }
            let res = await getMyCoupon(this.search)
            this.isLoading = true
            this.list.push(...res.data.list)
            if (this.list.length >= res.data.count) {
                this.hasNext = false
                this.isComplete = true
                this.$nextTick().then(() => { this.$refs.scroller.disablePullup() })
            } else {
                this.hasNext = true
                this.isComplete = false
                this.$nextTick().then(() => { this.$refs.scroller.enablePullup() })

                document.getElementsByClassName('xs-plugin-pullup-container')[0].innerHTML = '请上拉刷新数据'
            }
            console.log(res)
        },
        // 激活tabs样式
        activeTabs (index) {
            if (this.tabsIndex === index) {
                return
            }
            this.isLoading = true
            this.tabsIndex = index
            this.search.page = 0
            this.search.couStatus = index + 1
            this.getMyCoupon(1)
        },
        // 兑换码
        async getCoupon () {
            let res = await getCoupon(this.form)
            this.$vux.toast.text(res.data.message)
            this.visible = false
            this.getMyCoupon()
        },
        getTimeStr: getTimeStr,
        // 上拉触底事件
        getMore () {
            if (!this.hasNext) {
                return
            }
            if (this.hasNext) {
                this.search.page++
                this.getMyCoupon()
            }
        }
    },
    components: {
        XDialog, Scroller
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.coupon-index{
    .tabs{position:fixed;top:0;left:0;width:@rem*750;z-index:999;background:#fff;margin:0 auto;
        .flex{display:flex;
            .tabs-item{flex:1;height:@rem*100;line-height:@rem*100;text-align:center;font-size:@rem*32;color:#999;}
            .active{color:#000;position:relative;}
            .active:after{display:block;width:@rem*54;height:@rem*4;content:'';background:#000;position:absolute;left:50%;transform:translateX(-50%);}
        }
    }
    .noCoupon{display:flex;flex-direction: column;align-items:center;justify-content: center;height:100vh;
        .icon{width:@rem*288;height:@rem*288;display: block;}
        .text{margin-top:@rem*32;font-size:@rem*32;color:#999;}
    }
    .empty{height:@rem*132;}
    .list{padding:0 @rem*20;
        .item{position:relative;margin-bottom:@rem*20;
            img{box-shadow: 0 0 @rem*20 rgba(242,242,242,0.8);background:rgba(242,242,242,0.8);width:@rem*700;height:@rem*210;display:block;margin:0 auto;}
            .container{width:@rem*700;position:absolute;left:@rem*10;top:0;
                .flex{display:flex;
                    .amount{width:@rem*150;height:@rem*210;line-height:@rem*210;text-align:center;color:#ff2828;font-size:@rem*40;
                        span{font-size:@rem*28;}
                    }
                    .detail{width:@rem*550;height:@rem*210;padding:0 @rem*24;display:flex;align-items:center;
                        .left{flex:1;
                            .cell{display:flex;align-items:center;font-size:@rem*28;color:#000;
                                .label{padding:@rem*5 @rem*10;background:#fe823f;border-radius:@rem*25;margin-right:@rem*20;}
                                .value{max-width:@rem*300;}
                            }
                            .spec{font-size:@rem*28;color:#959595;margin-top:@rem*20;}
                            .time{font-size:@rem*28;color:#959595;}
                        }
                        .right{width:@rem*100;height:@rem*100;line-height:@rem*100;border-radius:50%;background:#ccc;font-size:@rem*28;color:#fff;text-align:center;}
                    }
                }

            }
        }
        .iconfont{color:#959595;font-size:@rem*36;}
    }
    .empty1{height:@rem*80;}
    .imgs{position:fixed;bottom:0;background:#fe823f;text-align:center;width:@rem*750;height:@rem*80;line-height:@rem*80;font-size:@rem*32; color: #fff;}
    .dialog{
        .title{font-size:@rem*30;text-align:center;margin-top:@rem*60;}
        .input{width:@rem*440;height:@rem*40; margin:0 auto;margin-top:@rem*60;margin-bottom:@rem*60;
            input{border:none;width:100%;height:@rem*40;line-height:@rem*40;font-size:@rem*28;color:#959595;border-bottom:1px solid #ddd;border-radius:0px;}
        }
        .btn{height:@rem*80;line-height:@rem*80;text-align:center;font-size:@rem*30;color:#fff;background:#fe823f;}
    }
}
</style>
