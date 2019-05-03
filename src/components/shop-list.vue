<template>
    <div class="shop-list-components">
        <div class="item" v-for="item in list" :key="item.shopId" @click="$router.push({path:'/shop/info',query:{shopId:item.shopId}})">
            <div class="imgs">
                <img :src="item.shopImage">
            </div>
            <div class="shop-detail">
                <div class="shop-name font-limit">{{item.shopName}}<span class="iconfont icon-more" style="color: #999;"></span></div>
                <div class="shop-subtitle">
                    <div class="left">{{item.shopSubtitle}}</div>
                    <div class="right">{{item.distance}}</div>
                </div>
                <div class="bottom">
                    <div class="status" v-if="item.shopStatus == 0">{{item.shopStatusName}}</div>
                    <div class="status1" v-if="item.shopStatus == 1">{{item.shopStatusName}}</div>
                    <div class="sale">已售：{{item.shopSaleNum}}</div>
                </div>
            </div>
        </div>
        <load-more :show-loading="true" tip="正在加载" v-if="hasNext === true"></load-more>
        <load-more :show-loading="false" tip='暂无数据' v-if="hasNext === false && list.length === 0"></load-more>
    </div>
</template>

<script>
import { LoadMore } from 'vux'

export default {
    data () {
        return {
        }
    },
    props: ['list', 'hasNext'],
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
    .item{width: 100%; height: @rem*174; margin-bottom:@rem*40; display: flex;
        .imgs{width:@rem*140; height:@rem*140; margin-right:@rem*40;
            img{width:@rem*140;height:@rem*140;border-radius:4px;}
        }
        .shop-detail{flex: 1; margin-top:@rem*7; border-bottom: 1px solid #f8f8f8;
            .shop-name{font-size:@rem*28;color:#333;
                .icon-more{font-size: @rem*32;}
            }
            .shop-subtitle{display: flex; margin-top: @rem*5;
                .left{font-size:@rem*24;color:#999; width: @rem*326; .font-limit;}
                .right{ flex: 1; text-align: right; color: #999; font-size: @rem*24;}
            }
            .bottom{display: flex; margin-top: @rem*10;
                .status{background: #ddd; border-radius: 4px; padding: @rem*5 @rem*10; color: #333; font-size: @rem*20;}
                .status1{background: #fe823f; border-radius: 4px; padding: @rem*5 @rem*10; color: #fff; font-size: @rem*20;}
                .sale{ flex: 1; text-align: right; font-size: @rem*24;}
            }
        }
    }
}
</style>
