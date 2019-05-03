<template>
    <div class="shop-search wrap">
        <!-- 搜索框 -->
        <div class="search">
            <input class="search-input" type="text" placeholder="搜索内容" v-model="search.goodsName">
            <i class="iconfont icon-wode"></i>
            <span @click="goodsSearch">搜索</span>
        </div>
        <!-- 热门搜索 -->
        <div class="hot">
            <div class="title">热门搜索</div>
            <div class="content">
                <div class="item" v-for="item in searchList" :key="item.id" @click="$router.push({path:'/goods/index',query: {goodsName: item.keyword}})">{{item.keyword}}</div>
            </div>
        </div>
        <!-- 猜你喜欢 -->
        <div class="like">
            <div class="title">猜你喜欢</div>
            <div class="double-column">
                <div class="shop-item" v-for="(item,index) in goodsList" :key="index" @click.stop="$router.push({path:'/goods/info',query:{id:item.goodsId}})">
                    <img :src="item.goodsImage">
                    <div class="shop-info">
                        <div class="title font-limit">{{item.goodsName}}</div>
                        <!-- 非会员 -->
                        <div class="price" v-if="userInfo.userType==1 || !userInfo.userType">
                            <div class="member-price">{{item.shopPrice}}元</div>
                            <del>{{item.marketPrice}}元</del>
                        </div>
                        <!-- 会员 -->
                        <div class="is-member" v-if="userInfo.userType>1">
                            <span class="text">会员价</span>
                            <span class="member-price">{{item.shopPrice}}元</span>
                            <div>
                                <del>{{item.marketPrice}}元</del>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getGoodsSearchList, getGoodsLikeList } from '@/api/getData'

export default {
    data () {
        return {
            search: {
                page: 0,
                size: 20,
                goodsName: ''
            },
            searchList: [],
            goodsList: [],
            hasNext: false

        }
    },
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
        this.getGoodsSearchList()
        this.getGoodsLikeList()
    },
    methods: {
        // 获取商品列表
        async getGoodsSearchList () {
            let res = await getGoodsSearchList(this.search)
            this.searchList = res.data.list
        },
        async getGoodsLikeList () {
            let res = await getGoodsLikeList()
            this.goodsList = res.data.list
        },
        // 商品搜索
        async goodsSearch () {
            this.$router.push({path: '/goods/index', query: {goodsName: this.search.goodsName}})
            // console.log(1)
            // this.search.page = 0
            // this.search.size = 20
            // this.list = []
            // this.getGoodsList()
        }
    },
    components: {
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.shop-search{
    .search{background:#fff;position:fixed;width:@rem*750;top:0;display:flex;align-items:center;padding:0 @rem*28;z-index:999;height:@rem*120;
        .search-input{padding-left:@rem*60;width:100%;height:@rem*60;border: none;border-radius:4px;background:#F4F4F4;font-size:@rem*28;margin-right:@rem*15;color:#999;}
        span{width: @rem*70; font-size: @rem*28; color: #333;}
        .icon-column{width:@rem*32;height:@rem*32;}
        .icon-wode{position:absolute;left:@rem*40;top:@rem*44;font-size:@rem*32;color:#999;}
    }
    .title{font-size: @rem*36; color: #000;}
    .hot{padding: 0 @rem*28; margin-top: @rem*155;
        .content{margin-top: @rem*24;
            .item{display: inline-block; height: @rem*52; line-height: @rem*52; padding: 0 @rem*24; border-radius: @rem*20; color: #666; margin: 0 @rem*32 @rem*32 0; background: #f4f4f4; font-size: @rem*28;}
        }
    }
    .like{padding: 0 @rem*28; margin-top: @rem*34;}
     //双列
    .double-column{padding:@rem*36 0 0;
        .shop-item{width:@rem*320;display:inline-block;margin-bottom:@rem*40;
            img{width:@rem*320;height:@rem*320;border-radius:4px;}
            .shop-info{margin-top:@rem*20;
                .title{font-size:@rem*30;color:#000;}
                .price{display:flex;align-items:center;margin-top:@rem*15;
                    .member-price{font-size:@rem*28;color:#ff2828;margin-right:@rem*20;}
                    del{font-size:@rem*24;color:#959595;}
                }
                .is-member{margin-top:@rem*10;
                    .text{display:inline-block;padding:0 @rem*10; background:#fe823f; color: #fff; margin-right:@rem*10;font-size:@rem*24;}
                    .member-price{display:inline-block;font-size:@rem*28;color:#ff2828;}
                    del{font-size:@rem*24;color:#959595;margin-top:@rem*10;display:block;}
                }
            }
        }
        .shop-item:nth-child(odd){margin-right:@rem*54; }
    }

}
</style>
