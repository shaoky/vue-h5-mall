<template>
    <div class="cart-index wrap">
        <!-- 空购物车 -->
        <div class="empty" v-if="list.length===0 && isLoading">
            <div class="img">
                <img src="../../assets/images/icon/icon-cart-null.png">
            </div>
            <div class="text">你的购物车空空如也~</div>
            <div class="btn" @click="$router.push({path:'/'})">去逛逛</div>
        </div>

        <!-- 非空购物车 -->
        <div class="unEmpty" v-if="list.length>0 && isLoading">
            <swipeout>
                <swipeout-item v-for="(item,index) in list" :key="index" >
                    <div  slot="right-menu">
                        <swipeout-button :width="126"> <img src="/static/images/buy-cart/del.png" style="width:100%;height:100%;" @click="del(item.cartId)"> </swipeout-button>
                    </div>
                    <div class="item" slot="content">
                        <!-- 图标 -->
                        <div class="imgs">
                            <i class="iconfont icon-yuanxingweixuanzhong" v-if="item.isSelected===0" @click="update(item,2)"></i>
                            <img src="/static/images/common/seleted.png" v-if="item.isSelected===1" @click="update(item,1)">
                        </div>
                        <div class="goods-detail">
                            <img :src="item.goodsImage">
                            <div class="goods-info">
                                <div class="title font-limit-2">{{item.goodsName}}</div>
                                <div class="spec">{{item.skuSpec}}</div>
                                <div class="bottom">
                                    <div class="flex">
                                        <div class="price">￥{{item.goodsPrice}}</div>
                                        <div class="selector">
                                            <div class="reduce">
                                                <img src="/static/images/buy-cart/reduce.png" @click="numOperation(1,index)">
                                            </div>
                                            <div class="num">{{item.goodsNum}}</div>
                                            <div class="add">
                                                <img src="/static/images/buy-cart/add.png" @click="numOperation(2,index)">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </swipeout-item>
            </swipeout>

            <!-- 结算 -->
            <div class="cell" >
                <div class="flex">
                    <div class="cell-left">
                        <i class="iconfont icon-yuanxingweixuanzhong" v-if="!allSelected" @click="handleSeleted(1)"></i>
                        <img src="/static/images/common/seleted.png" v-if="allSelected" @click="handleSeleted(2)">
                        <div class="value">全选</div>
                    </div>
                    <div class="cell-right">
                        <div class="value">合计：<span>￥{{totalPrice}}</span></div>
                        <div class="btn" @click="validate">去结算</div>
                    </div>
                </div>
            </div>
        </div>
        <footers :index="2"></footers>
    </div>
</template>

<script>
import footers from '@/components/footers'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { getCartList, updateCart, validateCart, delCart } from '@/api/getData'
export default {
    data () {
        return {
            isLoading: false,
            search: {
                page: 0, size: 20
            },
            list: [],
            message: 100,
            isSelected: false,
            len: false
        }
    },
    computed: {
        totalPrice () {
            let value = 0
            let list = this.list
            if (list.length > 0) {
                for (let item of list) {
                    if (item.isSelected === 1) {
                        value = value + item.goodsNum * item.goodsPrice
                    }
                }
            }
            value = value.toFixed(2)
            return value
        },
        // 全选
        allSelected () {
            let isAllSelected = false
            let list = this.list
            if (list.length > 0) {
                isAllSelected = list.every((value) => {
                    return value.isSelected === 1
                })
            }
            return isAllSelected
        }
    },
    mounted () {
        this.getCartList()
    },
    methods: {
        // 获取购物车列表
        async getCartList () {
            let res = await getCartList(this.search)
            console.log(res)
            this.isLoading = true
            this.list = res.data.list
        },
        // 选中更新购物车
        async update (item, n) {
            if (n) {
                item.isSelected = n - 1
            }
            let data = {
                cartId: item.cartId,
                goodsNum: item.goodsNum,
                isSelected: item.isSelected,
                skuId: item.skuId
            }
            await updateCart(data)
        },
        // 删除
        async del (cartId) {
            await delCart({cartId: cartId})
            this.$vux.toast.text('删除成功', 'middle')
            this.getCartList()
        },
        // 全选
        async handleSeleted (n) {
            // n=1全选
            if (n === 1) {
                for (let item of this.list) {
                    item.isSelected = 1
                    this.update(item)
                }
            } else {
                for (let item of this.list) {
                    item.isSelected = 0
                    this.update(item)
                }
            }
        },
        // 商品数量操作
        async numOperation (n, index) {
            let item = this.list[index]
            // n为1是减，2为加
            if (n === 1) {
                if (item.goodsNum === 1) {
                    return
                }
                item.goodsNum--
                // 是否为
            } else {
                if (item.goodsStock === item.goodsNum) {
                    this.$vux.toast.text('库存不足')
                    return
                }
                item.goodsNum++
            }
            if (item.isSelected === 1) {
                this.update(item)
            }
        },
        // 购物车结算验证
        async validate () {
            let res = await validateCart()
            console.log(res)
            // 跳转到订单提交页面
            this.$router.push({path: '/user/order/pay/confirm'})
        }
    },
    components: {
        footers,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.cart-index{
    //空购物车
    .empty{
        .img{margin-top: @rem*96;
            img{width: @rem*288; height: @rem*288; display: block; margin:0 auto;}
        }
        .text{margin-top: @rem*32; font-size: @rem*32; color:#999; text-align: center;}
        .btn{width: @rem*240; height: @rem*80;line-height: @rem*80;text-align: center; font-size: @rem*30; color:#fff; margin:0 auto; margin-top: @rem*60; background:#fe823f;border-radius:@rem*8;}
    }
    //非空购物车
    .unEmpty{
        .item{display: flex; align-items: center; width: @rem*750; padding: @rem*28 @rem*24; border-top: 1px solid #f5f5f5;
            .imgs{width: @rem*32; height: @rem*32;
                .icon-yuanxingweixuanzhong{color:#aaa; font-size: @rem*32;}
                img{width: 100%;height: 100%; display: block;}
            }
            .goods-detail{display: flex; position: relative; flex: 1; margin-left: @rem*20;
                img{width: @rem*150; height: @rem*150; margin-right: @rem*28; border-radius: @rem*8;}
                .goods-info{flex:1; height: @rem*150;
                    .title{font-size: @rem*28; color:#333;}
                    .spec{font-size: @rem*24; color:#999;}
                    .bottom{position: absolute; bottom:0; width: @rem*472;
                        .flex{display:flex; justify-content: space-between;
                            .price{font-size: @rem*28; color:#ff2828;}
                            .selector{display: flex; align-items: center;
                                .reduce,.add{width: @rem*32; height: @rem*32;
                                    img{width: @rem*32; height: @rem*32; display: block;}
                                }
                                .num{
                                    width: @rem*80; height:@rem*40; line-height: @rem*40; margin-left:@rem*18; margin-right:@rem*18;
                                    border-radius:@rem*8; font-size: @rem*28; background:#EBECF1; color:#333; text-align:center;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .cell{position: absolute; bottom: @rem*100; width: @rem*750; padding: @rem*24; border-top: 1px solid #f5f5f5; 
        .flex{display: flex; align-items: center; justify-content: space-between;
            .cell-left{display: flex; align-items: center;
                .icon-yuanxingweixuanzhong{margin-right: @rem*12; font-size: @rem*32;}
                img{width: @rem*32; height: @rem*32; margin-right: @rem*12;}
                .value{font-size: @rem*28; color:#666;}
            }
            .cell-right{display:flex; align-items: center;
                .value{font-size: @rem*28; color:#000; margin-right: @rem*24;
                    span{color:#ff2828;}
                }
                .btn{width: @rem*142; height: @rem*62; line-height: @rem*62; font-size: @rem*30; color:#fff; text-align: center; background:#fe823f; border-radius: @rem*8;}
            }
        }

    }
}
</style>
