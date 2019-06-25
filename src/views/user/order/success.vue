<template>
    <div class="order-success wrap">
        <div class="h5-success">
            <div class="imgs">
                <img src="/static/images/order/icon-02.png">
            </div>
            <div class="text">订单支付成功</div>
            <div class="btns">
                <div class="btn yellow" @click="$router.push({path:'/user/order/info',query:{orderId:orderId}})">查看订单详情</div>
                <div class="btn" @click="$router.push({path:'/index'})" style="color:#000">返回首页</div>
            </div>
            <div class="download" @click="showMessage">安装惠民导航</div>
        </div>
        <!-- <div class="member-success">
            <div class="imgs">
                <img src="/static/images/order/icon-02.png">
            </div>
            <div class="text">订单交易完成后 您才能成为会员</div>
            <div class="btn" @click="showMessage">下载app查看订单情况</div>
        </div> -->
    </div>
</template>

<script>
import { getOrderInfo } from '@/api/getData'

export default {
    data () {
        return {
            orderId: '',
            order: {}
        }
    },
    computed: {
        // isMember () {
        //     let value = ''
        //     if (window.sessionStorage.getItem('isMember')) {
        //         value = window.sessionStorage.getItem('isMember')
        //     }
        //     return value
        // }
    },
    mounted () {
        if (this.$route.query.orderId) {
            this.orderId = parseInt(this.$route.query.orderId)
        }
        this.getOrderInfo()
    },
    methods: {
        showMessage () {
            if (this.order.isMemberGoods === 1) {
                window.location.href = ''
            }
            if (this.order.isMemberGoods === 0) {
                window.location.href = ''
            }
        },
        async getOrderInfo () {
            let res = await getOrderInfo({orderId: this.orderId})
            this.order = res.data.info
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.order-success{
    .h5-success{
        .imgs{margin-top: @rem*96;
            img{display: flex; width: @rem*288; height: @rem*288; margin:0 auto;}
        }
        .text{font-size: @rem*32; color:#999; text-align: center; margin-top: @rem*32;}
        .btns{display: flex; margin-top: @rem*60; justify-content: center;
            .btn{width: @rem*240; height:@rem*80; line-height: @rem*80; border-radius: @rem*8; border: 1px solid #fe823f; text-align: center; font-size: @rem*30; color:#fff;}
            .yellow{background:#fe823f; margin-right: @rem*60;}
        }
        .download{width: @rem*670; height: @rem*80; line-height: @rem*80; border-radius: @rem*8; background:#fe823f; text-align: center; font-size: @rem*30; color:#fff;margin:0 auto;margin-top:@rem*80;}
    }
    .member-success{
        .imgs{margin-top: @rem*96;
            img{display: flex; width: @rem*288; height: @rem*288; margin: 0 auto;}
        }
        .text{font-size: @rem*32; color:#999; text-align: center; margin-top: @rem*32;}
        .btn{width: @rem*670; height: @rem*80; line-height: @rem*80; border-radius: @rem*8; background:#fe823f; text-align: center; font-size: @rem*30; color:#fff;margin:0 auto;margin-top:@rem*80;}
    }
}
</style>
