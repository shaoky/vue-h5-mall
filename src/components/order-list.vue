<template>
    <div class="order-list-components">
        <div class="item" v-if="item">
            <div class="imgs">
                <img :src="item.goodsImage">
            </div>
            <div class="goods-detail">
                <div class="goods-name font-limit-2">{{item.goodsName}}</div>
                <div class="spec">{{item.skuSpec}}</div>
                <div class="cell">
                    <div class="flex">
                        <div class="price">￥{{item.goodsPrice}}</div>
                        <div class="num">x{{item.goodsNum}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    props: ['item'],
    mounted () {

    },
    methods: {

    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../assets/less/define.less';
.order-list-components{
    .item{padding:@rem*24;display:flex;border-bottom:1px solid #f5f5f5;
        .imgs{width:@rem*150;height:@rem*150;margin-right:@rem*28;
            img{display:block;width:100%;height:100%;}
        }
        .goods-detail{height:@rem*150;position:relative;flex:1;
            .goods-name{font-size:@rem*28;color:#000;}
            .spec{font-size:@rem*24;color:#999;}
            .cell{position:absolute;bottom:0;
                .flex{display:flex;width:@rem*524;justify-content: space-between;
                    .price,.num{font-size:@rem*28;color:#000;}
                }
            }
        }
    }
}
</style>
