<template>
    <div class="user-consumption-index">
        <div class="title" v-if="isLoading && list.length > 0">消费流水</div>
        <div class="list" v-if="isLoading && list.length > 0">
            <div class="item" v-for="item in list" :key="item.shopId">
                <div class="time">{{item.createTime | getTime}}</div>
                <div class="bottom">
                    <div class="shop-name">{{item.shopName}}</div>
                    <div class="money">{{item.payMoney}}<span>({{item.discountRate * 10}}折)</span></div>
                </div>
            </div>
        </div>

        <div class="null" v-if="isLoading && list.length == 0">
            <img src="../../../assets/images/icon/icon-consumption-null.png">
            <span>暂无消费记录</span>
        </div>
        <div class="scan" @click="onScan()">扫一扫</div>
    </div>
</template>

<script>
import { getShopOrderList } from '@/api/getData'
import wx from '@/mixins/wechat'

export default {
    mixins: [wx],
    data () {
        return {
            isLoading: false,
            list: [],
            search: {
                page: 1,
                size: 20
            },
            hasNext: true
        }
    },
    computed: {

    },
    mounted () {
        window.addEventListener('scroll', this.scroll)
        this.getShopOrderList()
    },
    methods: {
        async getShopOrderList () {
            let res = await getShopOrderList(this.search)
            // this.list = res.data.list
            if (res.data.list.length > 0) {
                this.list.push(...res.data.list)
                this.hasNext = true
                // this.isComplete = true
                // this.$refs.scroller.disablePullup()
            } else {
                this.hasNext = false
                // this.isComplete = false
                // this.$refs.scroller.enablePullup()
                // document.getElementsByClassName('xs-plugin-pullup-container')[0].innerHTML = '请上拉刷新数据'
            }
            this.isLoading = true
        },
        scroll () {
            this.scrollValue = document.documentElement.scrollTop || document.body.scrollTop
            if ((this.scrollValue + window.screen.height) > (document.body.clientHeight - 50) && this.hasNext) {
                this.hasNext = false
                this.search.page++
                this.getShopOrderList()
            }
        },
        onScan () {
            // this.$router.push({path: '/user/order/pay/shop', query: {shopId: 5}})
            this.getSignature(this.wxRegCallback)
        },
        wxRegCallback () {
            let option = {
                needResult: 1,
                scanType: ['qrCode', 'barCode'],
                success (res) {
                    console.log(res)
                    console.log(res.resultStr)
                    let data = JSON.parse(res.resultStr)
                    console.log(data)
                    window.location.href = '/user/order/pay/shop?shopId=' + data.shopId
                    // this.$router.push({path: '/user/order/pay/shop', query: {shopId: 5}})
                }
            }
            this.scanQRCode(option)
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.user-consumption-index{width:@rem*750;margin:0 auto; padding:  0 @rem*24;
    .title{font-size: @rem*32; color: #282828; font-weight: 700; height: @rem*95; line-height: @rem*95; border-bottom: 1px solid #f8f8f8;}
    .list{padding-bottom: @rem*88;
        .item{border-bottom: 1px solid #f8f8f8; padding-bottom: @rem*20;
            .time{height: @rem*70; line-height: @rem*70; font-size: @rem*28;}
            .bottom{display: flex;
                .shop-name{flex: 1; font-size: @rem*28; color: #282828;}
                .money{color: #fc2c32; font-size: @rem*28;
                    span{font-size: @rem*22;}
                }
            }
        }
    }
    .null{margin-top: @rem*100; text-align: center;
        img{width: @rem*288; display: block; margin: 0 auto;}
        span{color: #999; font-size: @rem*32; display: block; margin-top: @rem*26;}
    }
    .scan{position: fixed; bottom: 0; left: 0; height: @rem*88; line-height: @rem*88; font-size: @rem*32; color: #fff; text-align: center; background: #fe823f; width: 100%;}
}
</style>
