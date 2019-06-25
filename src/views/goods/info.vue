<template>
    <div class="goods-info wrap">
        <!-- <div class="openApp">
            <div class="icon">
                <img :src="store.userPhoto">
            </div>
            <div class="title">{{store.userName}}的店铺</div>
            <div class="btn" @click="onApp">打开APP</div>
        </div> -->
        <div class="banner">
            <swiper class="swiper" style="width:100%;" height="750px" :auto="true" :show-dots="false" @on-index-change="getBannerIndex">
                <swiper-item v-for="(item,index) in goodsBannerList" :key="index">
                    <img :src="item.imageUrl">
                </swiper-item>
            </swiper>
            <div class="bannerIndex">{{bannerIndex}}/{{goodsBannerList.length}}</div>
        </div>
        <div class="shop-info">
            <!-- 价格 -->
            <div class="price">
                <!-- 会员价 -->
                <div class="price-left">
                    <div class="text" v-if="userInfo.userType>1">会员价</div>
                    <div class="member-price">￥{{data.shopPrice}}</div>
                    <!-- <div class="member-price" v-if="userInfo.userType===1 || !userInfo.userType">￥{{data.shopPrice}}</div> -->
                    <del>￥{{data.marketPrice}}</del>
                </div>
                <!-- 推广价 -->
                <div class="price-right">
                    <!-- <div class="text" v-if="userInfo.userType>1">推广赚 {{data.commissionMoney}}元</div> -->
                </div>
            </div>
            <div class="goods-name font-limit-2">{{data.goodsName}}</div>
            <div class="goods-subtitle">{{data.goodsSubtitle}}</div>
            <div class="sales" v-if="data.saleCount > 0">销量{{data.saleCount}}</div>
        </div>

        <!-- 邀请加入会员  v-if="isMember"-->
        <!-- <div class="message" v-if="app == 1">
            <div class="imgs">
                <img :src="store.userPhoto">
            </div>
            <div class="label">
                <div class="title">{{store.userName}}</div>
                <div class="value">邀请您加入会员</div>
            </div>
        </div> -->
        <div class="goods-details">
            <div class="goods-tabs">
                <div :class="['tabs-item',tabsIndex===index?'active':'']" v-for="(item,index) in tabs" :key="index" @click="activeTabs(index)">
                    {{item}}
                </div>
            </div>
            <!-- 图文详情 -->
            <div class="img-details" v-for="(item,index) in  goodsDetailList" :key="index" v-if="tabsIndex===0">
                <img :src="item.imageUrl" style="display:block;width:100%;">
            </div>
            <!-- 规格参数 -->
            <div class="spec" v-if="tabsIndex===1">
                <div class="text" v-for="(item,index) in data.goodsAttr" :key="index">{{item.attrName}}：{{item.value}}</div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="btns">
            <div class="btns-left">
                <div class="btn-index" @click.stop="$router.push({path: '/index'})">
                    <img src="/static/images/tabs/tab-icon-01.png">
                </div>
                <div class="btn-cart" @click="$router.push({path:'/cart/index'})">
                    <img src="/static/images/tabs/tab-icon-03.png">
                </div>
            </div>
            <div class="btns-right" @click="isPopup=true">加入购物车</div>
        </div>
        <!-- 会员招募底部 -->
        <!-- <div class="member-btn" v-if="app == 1" @click="toConfirm">
            <div class="member-btn-left" @click.stop="$router.push({path: '/member/list'})">
                <img src="/static/images/tabs/tab-icon-01.png">
            </div>
            <div class="member-btn-right">
                去付款
            </div>
        </div> -->

        <!-- 加入购买弹出框 -->
        <popup v-model="isPopup" hide-on-blur position="bottom">
            <div class="popup-container">
                <div class="goods-info">
                    <div class="info">
                        <div class="img">
                            <img :src="data.goodsImage">
                        </div>
                        <div class="box">
                            <div class="price" v-if="userInfo.userType>1">￥{{data.memberPrice}}</div>
                            <div class="price" v-if="userInfo.userType===1 || !userInfo.userType">￥{{data.shopPrice}}</div>
                            <div class="stock">(库存{{data.goodsStock}}件)</div>
                        </div>
                    </div>
                </div>
                <div class="spec-box">
                    <div class="specs" v-for="item in data.goodsSpec" :key="item.id">
                        <div class="spec-title">{{item.name}}</div>
                        <ul class="type-box">
                            <li class="spec-item" :class="{active: item.activeId === item1}"
                            v-for="item1 in item.subList"
                            :key="item1"
                            @click="item.activeId = item1, onSpec()">{{item1}}</li>
                        </ul>
                    </div>
                </div>
                <div class="buy">
                    <div class="text">购买数量</div>
                    <!-- <span>(购买数量无限制)</span> -->
                    <div class="selector">
                        <div class="reduce" @click="numOperation(1)">-</div>
                        <div class="num">{{goodsNum}}</div>
                        <div class="add" @click="numOperation(2)">+</div>
                    </div>
                </div>
                <div class="btn" @click="submit">确认</div>
            </div>
        </popup>

    </div>
</template>

<script>
import { getGoodsInfo, addToCart, getStore } from '@/api/getData'
import { Swiper, SwiperItem, Popup } from 'vux'
import wx from '@/mixins/wechat'
import { loginUrl } from '@/config/env.js'
import { getCountdown } from '@/utils/date'
import { mapMutations } from 'vuex'

export default {
    mixins: [wx],
    data () {
        return {
            isPopup: false,
            goodsBannerList: [],
            goodsDetailList: [],
            store: {},
            tabs: ['图文详情', '规格参数'],
            progressStyle: {},
            progressPercentage: 0,
            bannerIndex: 1,
            data: {
                goodsSpec: []
            },
            tabsIndex: 0,
            sku: {},
            countdown: {},
            goodsNum: 1, // 商品数量
            href: null
        }
    },
    computed: {
        userInfo () {
            let value = {}
            if (JSON.parse(window.localStorage.getItem('userInfo'))) {
                value = JSON.parse(window.localStorage.getItem('userInfo'))
            }
            return value
        },
        userNo () {
            let userNo = this.$route.query.userNo
            if (userNo) {
                this.setUserNo(userNo)
            } else {
                userNo = this.$store.state.user.userNo
            }
            return userNo
        }
        // app () {
        //     let app = this.$route.query.app
        //     if (app) {
        //         window.sessionStorage.setItem('app', app)
        //     } else {
        //         app = window.sessionStorage.getItem('app')
        //     }
        //     return app
        // }
    },
    mounted () {
        this.goodsId = this.$route.query.id
        this.getGoodsInfo()
        // this.getStore()
        // 微信分享
        // this.getSignature(this.wxRegCallback)
        this.href = window.location.href
    },
    methods: {
        ...mapMutations(['setUserNo']),
        wxRegCallback () {
            let option = {
                title: this.data.goodsName,
                content: this.data.goodsSubtitle,
                url: window.location.href + '&userNo=' + this.userNo,
                imgUrl: this.data.goodsImage,
                success () {
                }
            }
            this.onMenuShareTimeline(option)
        },
        // 获取商品详情
        async getGoodsInfo () {
            let res = await getGoodsInfo({goodsId: this.goodsId})
            if (res.data.info.goodsSpec) {
                res.data.info.goodsSpec.forEach(function (value) {
                    value.activeId = value.subList[0]
                })
            }
            this.data = res.data.info
            if (res.data.info.isGoodsSku) {
                this.onSpec()
            }
            this.goodsBannerList = this.data.goodsBannerList
            this.goodsDetailList = this.data.goodsDetailList
        },
        onSpec () {
            this.goodsNum = 1
            let activeArr = []
            for (let item of this.data.goodsSpec) {
                activeArr.push(item.activeId)
            }
            for (let item of this.data.goodsSkuList) {
                if (item.skuSpec.toString() === activeArr.toString()) {
                    if (this.userInfo.uesrType > 1) {
                        this.data.shopPrice = (item.shopPrice * this.goodsNum).toFixed(2)
                    } else {
                        this.data.shopPrice = (item.memberPrice * this.goodsNum).toFixed(2)
                    }

                    this.data.memberPrice = (item.memberPrice * this.goodsNum).toFixed(2)
                    this.data.goodsStock = item.goodsStock
                    this.sku = item
                }
            }
        },
        setCountdown (time) {
            let date = getCountdown(time)
            console.log(date)
            this.countdown = date
            time--
            setTimeout(() => {
                this.setCountdown(time)
            }, 1000)
        },
        // 获取店铺信息
        async getStore () {
            let res = await getStore({userNo: this.userNo})
            // console.log(res)
            this.store = res.data.userInfo
        },
        // 获取轮播图索引
        getBannerIndex (n) {
            this.bannerIndex = n + 1
        },
        // 激活tabs样式
        activeTabs (index) {
            this.tabsIndex = index
        },
        // 商品数量操作
        numOperation (n) {
            // n为1是减，2为加
            if (n === 1) {
                if (this.goodsNum === 1) {
                    return
                }
                this.goodsNum--
            } else {
                if (this.data.goodsStock === this.goodsNum) {
                    this.$vux.toast.text('库存不足')
                    return
                }
                this.goodsNum++
            }
        },
        // 添加到购物车
        async submit () {
            console.log(window.location.href)
            if (!this.$store.state.user.token) {
                window.sessionStorage.setItem('returnUrl', this.href)
                window.location.href = loginUrl
                return
            }
            await addToCart({goodsId: parseInt(this.$route.query.id), goodsNum: this.goodsNum, skuId: this.sku.skuId || null})
            this.$vux.toast.text('添加成功', 'middle')
            this.isPopup = false
        },
        // 去订单预览页面
        toConfirm () {
            if (!this.$store.state.user.token) {
                window.sessionStorage.setItem('returnUrl', this.href)
                window.location.href = loginUrl
                return
            }
            this.$router.push({path: '/user/order/pay/confirm', query: {goodsId: this.goodsId, goodsNum: 1}})
        },
        onApp () {
            location.href = ''
        }
    },
    components: {
        Swiper,
        SwiperItem,
        Popup
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.goods-info{
    .openApp{height: @rem*80; display: flex; position: fixed; z-index: 99; top: 0; width: @rem*750; margin: 0 auto; border-bottom: 1px solid #e0e0e0; background: #fff; align-items: center;
        .icon{width: @rem*60; height: @rem*60; margin-left: @rem*20;
            img{border-radius: 50%;}
        }
        .title{flex: 1; margin-left: @rem*20; font-size: 16px;}
        .btn{padding: @rem*10; color: #fff; background: #000; margin-right: @rem*20;}
    }
    //轮播图
    .banner{position: relative; 
        .swiper{height: @rem*750;width: @rem*750;
            .vux-swiper{height: @rem*750!important;}
            img{width: 100%;height: @rem*750;}
        }
        .bannerIndex{
            position: absolute; bottom: @rem*36; right: @rem*20; width: @rem*90; height: @rem*48; line-height: @rem*48;
            text-align: center; background:#000; opacity: 0.3; font-size: @rem*28; color:#fff; border-radius:10px;
        }
    }
    // 限时购
    .seckill-time{background: #fe823f; display: flex; align-items: center; height: @rem*80;
        .left{width: @rem*123; height: @rem*41; background: #ff2828; border-radius: 20px; margin-left: @rem*24;  color: #fff; font-size: @rem*28; text-align: center; line-height: @rem*41;}
        .text{margin-left: @rem*20; flex: 1; font-size: @rem*28; color: #282828;}
        .time{margin-right: @rem*20; font-size: @rem*28;}
    }
    //商品名称 价格
    .shop-info{padding:@rem*28 @rem*28 0;
        .price{display:flex; justify-content: space-between;
            .price-left{display: flex; align-items: center;
                .text{padding: 0 @rem*10; text-align: center; background:#fe823f; font-size: @rem*20; color:#fff; border-radius: 2px; margin-right: @rem*16;}
                .member-price{font-size: @rem*32;color:#ff2828; margin-right: @rem*10;}
                del{font-size: @rem*24; color:#959595;}
            }
            .price-right{font-size: @rem*28;color:#ff2828;}
        }
        .goods-name{font-size: @rem*28; color:#000; margin: @rem*20 0 @rem*10;}
        .goods-subtitle{color: #979797;}
        .sales{font-size: @rem*24; color:#666; text-align: right; margin-top: @rem*10;}
    }
    // 进度条
    .seckill-progress{position: relative; margin: @rem*30 @rem*26 0; background: #e1e1e1; height: @rem*20; border-radius: @rem*10;
        .text{position: absolute; background: #fe823f; height: @rem*20; border-radius: @rem*10;}
    }
    .progressPercentage{margin: @rem*10 @rem*26 0; font-size: @rem*24; color: #666;}
    //邀请加入会员
    .message{display: flex; align-items: center; padding: 0 @rem*28; padding-top: @rem*38; border-top: 1px solid #f5f5f5; margin-top: @rem*10;
        .imgs{width: @rem*80; height: @rem*80; margin-right: @rem*20;
            img{display: block; height: 100%; width: 100%; border-radius: 4px;}
        }
        .label{flex:1;
            .title{font-size: @rem*28; color:#999;}
            .value{font-size: @rem*28; color:#000;}
        }
    }
    //商品详情
    .goods-details{ margin-top: @rem*38; padding-bottom: @rem*100; border-top: 1px solid #f5f5f5;
        .goods-tabs{display: flex; border-bottom: 1px solid #f5f5f5;
            .tabs-item{flex: 1; height: @rem*100; line-height: @rem*100; text-align: center; font-size: @rem*28; color:#999;}
            .active{position: relative; color:#000;}
            .active:after{position: absolute; left: 50%; display: block; width: @rem*128; height: @rem*4; content: ''; background:#fe823f; transform: translateX(-50%);}
        }
        .spec{padding:0 @rem*24 @rem*32;
            .text{margin-top: @rem*32; font-size: @rem*26; color:#666; word-wrap: break-word; word-break: normal; }
        }
    }
    //底部
    .btns{position: fixed; bottom: 0; background:#fff; display: flex;
        .btns-left{width: @rem*375; height: @rem*100; display: flex; align-items: center;
            .btn-index{flex: 1; height: @rem*80; border-right: 1px solid #f5f5f5; display: flex; align-items: center; justify-content: center;
                img{height: @rem*40; width: @rem*40;}
            }
            .btn-cart{flex: 1; height: @rem*80; display: flex; align-items: center; justify-content: center;
                img{height: @rem*40; width: @rem*40;}
            }
        }
        .btns-right{width: @rem*375; height: @rem*100; height: @rem*100; line-height: @rem*100; text-align: center; font-size: @rem*32; color:#fff; background:#fe823f;display:inline-block;}
    }
    //会员招募底部
    .member-btn{position: fixed; bottom: 0; display: flex; width: @rem*750;
        .member-btn-left{width: @rem*187.5; height: @rem*88; border-right: 1px solid #f5f5f5; display: flex; align-items: center; justify-content: center; background:#fff;
            img{height: @rem*40; width: @rem*40;}
        }
        .member-btn-right{flex: 1; height: @rem*88; line-height: @rem*88; background:#fe823f; text-align: center; font-size: @rem*36; color:#fff;}
    }
    .popup-container{background:#fff;
        .goods-info{padding-bottom: @rem*40; border-bottom: 1px solid #f5f5f5;
            .info{height: @rem*120; display: flex; align-items: center; position: relative; padding-left: @rem*168;
                .img{height: @rem*128; width: @rem*128; position: absolute; top: @rem*-12; left: @rem*20; border-radius: 3px; box-shadow: 0 0 2px #ccc;
                    image{width: 100%; height: 100%;}
                }
                .box{
                    .price{font-size: @rem*30; color:#ff2828; margin-bottom: @rem*10;}
                    .stock{font-size: @rem*24; color:#999;}
                }
            }
        }
        .spec-box{padding: @rem*20;
            .spec-title{font-size: 14px; color: #000; margin-bottom: @rem*20;}
            .spec-item{display: inline-block; padding: 0 @rem*20; font-size: 14px; margin-right: @rem*40; margin-bottom: @rem*20; height: @rem*60; line-height: @rem*58;text-align: center;border-radius: 10px;border: 1px solid #a8a8a8;
            &.active{color: #ff6400!important; border: 1px solid #ff6400!important;}
		}
        }
        .buy{height: @rem*140; display: flex; align-items: center; justify-content: space-between; padding:0 @rem*28;
            .text{font-size: @rem*28; color:#000;
                span{color:#999;}
            }
            .selector{display:flex; width: @rem*238; height: @rem*50; border: 1px solid #ccc;
                .reduce,.add{height: @rem*48; line-height: @rem*48; width: @rem*50; text-align: center; font-size: @rem*24; color:#000;}
                .num{height: @rem*48; line-height: @rem*48; width: @rem*146; font-size: @rem*24; color:#000; text-align: center; border-right: 1px solid #ccc; border-left:1px solid #ccc;}
            }
        }
        .btn{height: @rem*80; line-height: @rem*80; text-align: center; color:#fff; font-size: @rem*28; background:#fe823f;}
    }
    .vux-popup-dialog{
        overflow-y:visible;
    }
}
</style>
