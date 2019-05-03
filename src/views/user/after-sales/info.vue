<template>
    <div class="after-sales-info">
        <div class="apply-info">
            <div class="title">退款申请</div>
            <div class="value">退款原因：{{data.refundReason}}</div>
            <div class="value">申请时间：{{data.createTime | getTime}}</div>
            <div class="cell">
                <div class="left">订单编号：<span id="copy">{{data.orderNo}}</span></div>
                <a href="javascript:" class="copy-btn" data-clipboard-target="#copy" data-clipboard-action="copy">复制</a>
            </div>
        </div>
        <div class="bg"></div>
        <div class="goods-list" >
            <div class="title">
                <div class="left">
                    <div class="imgs">
                        <img src="/static/images/common/icon-04.png">
                    </div>
                    <div class="cell">
                        退款信息
                    </div>
                </div>

            </div>
            <ul>
                <li v-for="(item2,index2) in data.goodsList" :key="index2">
                    <orderList :item="item2"></orderList>
                </li>
            </ul>
            <div class="apply-info">
                <div class="cell">
                    <div class="label">运费</div>
                    <div class="value">￥0.00</div>
                </div>
                <div class="cell">
                    <div class="label">退款金额</div>
                    <div class="value red">￥{{data.refundMoney}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getApplyInfo } from '@/api/getData'
import orderList from '@/components/order-list'
export default {
    data () {
        return {
            refundId: '',
            data: {}
        }
    },
    mounted () {
        if (this.$route.query.refundId) {
            this.refundId = parseInt(this.$route.query.refundId)
        }
        this.getInfo()
        var clipboard = new ClipboardJS('.copy-btn').on('success', (e) => {
            // var e = e || window.event
            this.$vux.toast.text('复制成功', 'middle')
        }).on('error', function (e) {})
    },
    methods: {
        // 获取详情
        async getInfo () {
            let res = await getApplyInfo({refundId: this.refundId})
            console.log(res)
            this.data = res.data.info
        }
    },
    components: {
        orderList
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.after-sales-info{width:@rem*750;margin:0 auto;
    .apply-info{padding:@rem*24 @rem*32;
        .title{font-size:@rem*40;color:#000;}
        .value{font-size:@rem*28;color:#333;margin-top:@rem*24;word-wrap:break-word;word-break:normal;}
        .cell{display:flex;justify-content: space-between;margin-top:@rem*32;align-items:center;
            .left{font-size:@rem*28;color:#333;}
            .copy-btn{width:@rem*82;height:@rem*40;line-height:@rem*40;border:1px solid #000;color:#333;text-align:center;border-radius:@rem*8;font-size:@rem*26;}
        }
    }
    .bg{height:@rem*20;background:#f5f5f5;}
    .goods-list{
        .title{display:flex;justify-content: space-between;align-items:center;height:@rem*80;padding-left:@rem*24;
            .left{display:flex;align-items:center;
                .imgs{margin-right:@rem*12;
                    img{width:@rem*28;height:@rem*28;display:block;}
                }
                .cell{display:flex;align-items:center;font-size:@rem*28;color:#000;
                }
            }
        }
        .apply-info{padding:0 @rem*20;
            .cell{display:flex;justify-content: space-between;margin-top:@rem*20;
                .label,.value{font-size:@rem*28;color:#000;}
                .red{color:#ff2828;}
            }
        }
    }
}
</style>
