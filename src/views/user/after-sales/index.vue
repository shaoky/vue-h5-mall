<template>
    <div class="after-sales-index">
        <scroller  v-model="scrollerStatus" :use-pullup="true" ref="scroller" lock-x  height="100vh"  :pullup-config="upobj" @on-pullup-loading="getMore" :bounce="false" :scroll-bottom-offset="0">
            <div class="container">
                <div v-if="list.length>0">
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
                        </div>
                        <ul>
                            <li v-for="(item2,index2) in item1.goodsList" :key="index2">
                                <orderList :item="item2" @click.native="toInfo(item1.refundId)"></orderList>
                            </li>
                        </ul>
                        <div class="order-info">
                            <div class="cell">
                                <div class="label">退款金额</div>
                                <div class="value">￥{{item1.refundMoney}}</div>
                            </div>
                            <div class="status">
                                <div :class="['type',item1.refundStatus===1?'red':'']">{{'['+item1.refundTypeName+']'}}</div>
                                <div :class="['state',item1.refundStatus===1?'red':'']">{{item1.refundStatusName}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="scroll-after" v-if="isComplete">暂无数据</div> -->
                </div>
                <div class="noCoupon" v-if="list.length===0">
                    <img src="../../../assets/images/icon/icon-cart-null.png" class="icon">
                    <div class="text">当前没有数据</div>
                </div>
            </div>
        </scroller>

    </div>
</template>

<script>
import { getApplyList } from '@/api/getData'
import orderList from '@/components/order-list'
import { getTimeStr } from '@/utils/date.js'
import { Scroller } from 'vux'

export default {
    data () {
        return {
            search: {page: 0, size: 20},
            list: [],
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
        this.getApplyList()
    },
    methods: {
        // 获取退款申请列表
        async getApplyList () {
            let res = await getApplyList(this.search)
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
                this.$refs.scroller.disablePullup()
            } else {
                this.hasNext = true
                this.isComplete = false
                this.$refs.scroller.enablePullup()
                document.getElementsByClassName('xs-plugin-pullup-container')[0].innerHTML = '请上拉刷新数据'
            }
        },
        // 去申请退款详情
        toInfo (refundId) {
            this.$router.push({path: '/user/after-sales/info', query: {refundId: refundId}})
        },
        // 上拉触底事件
        getMore () {
            if (!this.hasNext) {
                return
            }
            if (this.hasNext) {
                this.search.page++
                this.getApplyList()
            }
        }
    },
    components: {
        orderList, Scroller
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.after-sales-index{width:@rem*750;margin:0 auto;
    .noCoupon{display:flex;flex-direction: column;align-items:center;justify-content: center;height:100vh;
        .icon{width:@rem*288;height:@rem*288;display: block;}
        .text{margin-top:@rem*32;font-size:@rem*32;color:#999;}
    }
    .goods-list{border-bottom:1px solid #f5f5f5;
        .title{display:flex;justify-content: space-between;align-items:center;height:@rem*80;padding:0 @rem*24;
            .left{display:flex;align-items:center;flex:1;
                .imgs{margin-right:@rem*12;
                    img{width:@rem*28;height:@rem*28;display:block;}
                }
                .cell{display:flex;align-items:center;flex:1;
                    .date{font-size:@rem*28;color:#000;margin-right:@rem*12;}
                    .time{font-size:@rem*28;color:#999;flex:1;}
                    .icon-more{font-size:@rem*32;}
                }
            }
            // .right{font-size:@rem*28;color:#000;width:@rem*120;height:@rem*48;line-height:@rem*48;background:#fe823f;text-align:center;}
            // .cancel{background:#999;color:#fff;}
        }
        .order-info{padding:@rem*28 @rem*24;
            .cell{display:flex;justify-content: space-between;
                .label{font-size:@rem*28;color:#000;}
                .value{font-size:@rem*28;color:#000;}
            }
            .status{display:flex;justify-content:flex-end;margin-top:@rem*32;
                .type{font-size:@rem*28;color:#666;margin-right:@rem*20;}
                .state{font-size:@rem*28;color:#666;}
                .red{color:#ff2828;}
            }
        }
    }
}
</style>
