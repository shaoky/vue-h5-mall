<template>
    <div class="shop-list-components">
        <div class="item" v-for="item in list" :key="item.goodsId" @click="$router.push({path:'/goods/info',query:{id:item.goodsId}})">
            <div class="imgs">
                <img :src="item.goodsImage">
            </div>
            <div class="goods-detail">
                <div class="goods-name font-limit">{{item.goodsName}}</div>
                <div class="cell">
                    <!-- <div class="text" v-if="userInfo.userType > 1">会员价</div> -->
                    <div class="price">￥{{item.shopPrice}}</div>
                    <del>{{item.marketPrice}}</del>
                </div>
            </div>
        </div>
        <load-more :show-loading="true" tip="正在加载" v-if="loading === true"></load-more>
        <load-more :show-loading="false" tip='暂无数据' v-if="loading === false && list.length === 0">></load-more>
    </div>
</template>

<script>
import { LoadMore } from 'vux'

export default {
    data () {
        return {

        }
    },
    props: ['list', 'loading'],
    computed: {
        userInfo () {
            let value = {}
            if (JSON.parse(window.localStorage.getItem('userInfo'))) {
                value = JSON.parse(window.localStorage.getItem('userInfo'))
            }
            return value
        }
    },
    mounted () {

    },
    methods: {

    },
    components: {
        LoadMore
    }
}
</script>

<style scoped lang="less">
@import '../assets/less/define.less';
.shop-list-components{
    .item{width:@rem*320;display:inline-block;margin-bottom:@rem*40;
        .imgs{width:@rem*320;height:@rem*320;margin-right:@rem*28;
            img{width:@rem*320;height:@rem*320;border-radius:4px;}
        }
        .goods-detail{margin-top:@rem*20;
            .goods-name{font-size:@rem*30;color:#000;}
            .spec{font-size:@rem*24;color:#999;}
            .cell{display:flex;align-items:center;margin-top:@rem*15;
                .text{display:inline-block;padding:0 @rem*10; background:#fe823f; color: #fff; margin-right:@rem*10;font-size:@rem*24;}
                .price{font-size:@rem*28; color:#ff2828; margin-right:@rem*20;}
                del{font-size:@rem*24; color:#959595; display:block;}
            }
        }
        &:nth-child(odd){margin-right:@rem*54; }
    }
}
</style>
