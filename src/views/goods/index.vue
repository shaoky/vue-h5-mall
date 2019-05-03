<template>
    <div class="shop-index">
        <!-- 搜索框 -->
        <div class="search">
            <input class="search-input" type="text" placeholder="搜索" v-model="search.goodsName" @click.stop="$router.push({path:'/goods/search'})">
            <!-- <i class="iconfont icon-wode" @click="goodsSearch"></i> -->
            <!-- <img src="/static/images/shop/search.png" class="icon-search"> -->
            <img src="/static/images/shop/single-column.png" class="icon-column" v-if="isDouble" @click="isDouble=!isDouble">
            <img src="/static/images/shop/double-column.png" class="icon-column" v-if="!isDouble" @click="isDouble=!isDouble">
        </div>

        <!-- <scroller  v-model="scrollerStatus" :use-pullup="true" ref="scroller" lock-x  height="100vh"  :pullup-config="upobj" @on-pullup-loading="getMore" :bounce="false" :scroll-bottom-offset="0"> -->
            <div class="container">
                <div class="empty"></div>
                <!-- 商品列表 -->
                <div class="condition">
                    <div class="choice">
                        <div :class="['item',isActive==index?'active':'']" v-for="(item,index) in condition" :key="index" @click="switchTabs(index)">
                            {{item}}
                            <div class="sort" v-if="index===1">
                                <img src="/static/images/shop/icon-price.png" v-if="salesDefault">
                                <img src="/static/images/shop/icon-price-top.png" v-if="isSalesTop && !salesDefault">
                                <img src="/static/images/shop/icon-price-bottom.png" v-if="!isSalesTop && !salesDefault">
                            </div>
                            <div class="sort" v-if="index===2">
                                <img src="/static/images/shop/icon-price.png" v-if="priceDefault">
                                <img src="/static/images/shop/icon-price-top.png" v-if="isPriceTop && !priceDefault">
                                <img src="/static/images/shop/icon-price-bottom.png" v-if="!isPriceTop && !priceDefault">
                            </div>
                        </div>
                    </div>

                    <!-- 双列 -->
                    <div class="double-column" v-if="isDouble">
                         <goodsList :list="list" :loading="loading"></goodsList>
                        
                    </div>
                    <!-- 单列 -->
                    <div class="single-column" v-if="!isDouble">
                        <div class="shop-item" v-for="(item,index) in list" :key="index" @click.stop="$router.push({path:'/goods/info',query:{id:item.goodsId}})">
                            <img :src="item.goodsImage">
                            <div class="shop-info">
                                <div class="title font-limit-2">{{item.goodsName}}</div>
                                <!-- 非会员 -->
                                <div class="price" v-if="userInfo.userType==1 || !userInfo.userType">
                                    <span class="member-price">{{item.shopPrice}}元</span>
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
                    <!-- 没有产品 -->
                    <div class="icon-null" v-if="isLoading && list.length == 0">
                        <img src="../../assets/images/icon/icon-cart-null.png">
                        <span>没有商品</span>
                    </div>
                </div>
                <!-- <div class="scroll-after" v-if="isComplete">暂无数据</div> -->
                <div class="empty"></div>
            </div>
        <!-- </scroller> -->

        <!-- 底部 -->
        <footers :index="1"></footers>
    </div>
</template>

<script>
import footers from '@/components/footers'
import { getGoodsList } from '@/api/getData'
import goodsList from '@/components/goods-list'

export default {
    data () {
        return {
            isLoading: false,
            search: {
                page: 1,
                size: 20,
                sales: 0,
                price: 0,
                goodsName: ''
            },
            list: [],
            condition: ['默认', '销量', '价格'],
            isActive: 0, // tabs激活样式
            isDouble: true, // 显示单双列
            // 控制升降图片显示
            salesDefault: true,
            priceDefault: true,
            isPriceTop: false,
            isSalesTop: false,
            footers: footers,
            hasNext: true,
            loading: true,
            scrollValue: 0
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
        window.addEventListener('scroll', this.scroll)
        // this.search.goodsName = this.$route.query.goodsName
        this.getGoodsList()
    },
    methods: {
        scroll () {
            this.scrollValue = document.documentElement.scrollTop || document.body.scrollTop
            if ((this.scrollValue + window.screen.height) > (document.body.clientHeight - 50) && this.hasNext) {
                this.hasNext = false
                this.search.page++
                this.getGoodsList()
            }
        },
        // 获取商品列表
        async getGoodsList () {
            let res = await getGoodsList(this.search)
            let data = res.data
            this.list.push(...data.list)
            if (data.list.length > 0) {
                this.hasNext = true
            } else {
                this.hasNext = false
                this.loading = false
            }
            this.isLoading = true
        },
        // 切换导航条
        switchTabs (index) {
            this.isActive = index
            if (index === 1) {
                this.salesDefault = false
                this.isSalesTop = !this.isSalesTop
                this.priceDefault = true
            } else if (index === 2) {
                this.priceDefault = false
                this.isPriceTop = !this.isPriceTop
                this.salesDefault = true
            } else {
                this.priceDefault = true
                this.salesDefault = true
                this.search.sales = 0
                this.search.price = 0
            }
            // 销售升序
            if (this.isSalesTop && !this.salesDefault) {
                this.search.sales = 2
                this.search.price = 0
            }
            // 销售降序
            if (!this.isSalesTop && !this.salesDefault) {
                this.search.sales = 1
                this.search.price = 0
            }
            // 价格升序
            if (this.isPriceTop && !this.priceDefault) {
                this.search.price = 2
                this.search.sales = 0
            }
            // 价格降序
            if (!this.isPriceTop && !this.priceDefault) {
                this.search.price = 1
                this.search.sales = 0
            }
            this.list = []
            this.getGoodsList()
        },
        // 上拉触底事件
        getMore () {
            if (!this.hasNext) {
                return
            }
            if (this.hasNext) {
                this.search.page++
                this.getGoodsList()
            }
        }
    },
    activated () {
        let goodsName = this.$route.query.goodsName || ''
        if (goodsName.length > 0) {
            this.search.goodsName = goodsName
            this.list = []
            this.getGoodsList()
        }
    },
    components: {
        footers,
        goodsList
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.shop-index{width:@rem*750;margin:0 auto;
    .search{background:#fff;position:fixed;width:@rem*750;top:0;display:flex;align-items:center;padding:0 @rem*28;z-index:999;height:@rem*120;
        .search-input{padding-left:@rem*60;width:100%;height:@rem*60;border: none;border-radius:4px;background:#F4F4F4;font-size:@rem*28;margin-right:@rem*15;color:#999;}
        .icon-column{width:@rem*32;height:@rem*32;}
        .icon-wode{position:absolute;left:@rem*40;top:@rem*44;font-size:@rem*32;color:#999;}
    }
    .empty{height:@rem*100;}
    //margin-bottom:@rem*100;
    .condition{padding:0 @rem*28;
        .choice{margin-top:@rem*40;padding-bottom:@rem*28;display:flex;border-bottom:1px solid #f5f5f5;
            .item{font-size:@rem*32;color:#000;flex:1;display:flex;justify-content:center;align-items:center;
                .sort{margin-left:@rem*10;
                    img{width:@rem*13;height:@rem*20;}
                }
            }
            .active{color:#ff2828;}
        }
        .icon-null{ text-align: center; margin-top: @rem*100;
            img{width: @rem*288; display: block; margin: 0 auto;}
            span{margin-top: @rem*32; display: block; font-size: @rem*28; color: #999;}
        }
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
        //单列
        .single-column{padding:@rem*36 0 0;
            .shop-item{display:flex;margin-bottom:@rem*40;
                img{width:@rem*200;height:@rem*200;}
                .shop-info{position:relative;height:@rem*200;padding:@rem*20 @rem*24;
                    .title{font-size:@rem*30;color:#000;}
                    .price{margin-top:@rem*15;position:absolute;bottom:@rem*20;width:@rem*470;
                        .member-price{font-size:@rem*28;color:#ff2828;margin-right:@rem*20;display:inline-block;}
                        del{font-size:@rem*24;color:#959595;display:inline-block;}
                    }
                    .is-member{position:absolute;bottom:0;width:@rem*470;
                        .text{display:inline-block;padding:0 @rem*10; background:#fe823f; color: #fff; margin-right:@rem*10;font-size:@rem*24;}
                        .member-price{display:inline-block;font-size:@rem*28;color:#ff2828;}
                        del{font-size:@rem*24;color:#959595;margin-top:@rem*10;display:block;}
                    }
                }
            }
        }
    }

}
</style>
