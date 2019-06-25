    <template>
    <div class="index-container wrap">
            <!-- 公司详情 -->
            <!-- <div class="company" v-if="userNo" >
                <img :src="store.userPhoto" class="icon">
                <div class="text">{{store.userName}}的店铺</div>
            </div> -->
            <!-- 搜索框 -->
            <div class="top">
                <div class="localtion" @click="$router.push({path:'/index/city'})">{{cityName}}<i class="iconfont icon-unfold"></i></div>
                <div class="search" @click.stop="$router.push({path:'/goods/search'})">
                    <i class="iconfont icon-sousuo"></i>
                    <div class="text">搜索</div>
                </div>
                <div class="scan" @click="onScan()">
                    <i class="iconfont icon-fukuan"></i>
                </div>
            </div>
            <!-- 轮播图 -->
            <div class="banner" v-if="data.iconList.length > 0">
                <swiper class="swiper" :auto="true" dots-position="center" height="100%">
                    <swiper-item v-for="(item,index) in data.adList" :key="index">
                        <img :src="item.imageUrl" @click="bannerOperation(item)">
                    </swiper-item>
                </swiper>
                <!-- <banner v-if="bannerList.length>0"  :list="bannerList"></banner> -->
            </div>
            <!-- 次导航 -->
            <div class="nav" v-if="data.iconList.length > 0">
                <div class="grid">
                    <div class="item" v-for="item in data.iconList" :key="item.id" @click="goNav(item)" >
                        <img :src="item.imageUrl" class="img">
                        <div class="name">{{item.title}}</div>
                    </div>
                </div>
            </div>
            <!-- 图片 -->
            <div class="t1" v-if="data.t1">
                <div class="left">
                    <img :src="data.t1[0].imageUrl" @click="bannerOperation(data.t1[0])">
                </div>
                <div class="right">
                    <img :src="data.t1[1].imageUrl" @click="bannerOperation(data.t1[1])">
                    <img :src="data.t1[2].imageUrl" @click="bannerOperation(data.t1[2])" class="image3">
                </div>
            </div>
            <div class="week" v-if="data.iconList.length > 0">
                <div class="top">
                    <span class="title">本周必买</span>
                    <div class="time" v-if="countdown.second">
                        <span>{{countdown.day}}</span> 天
                        <span>{{countdown.hour}}</span>：
                        <span>{{countdown.minute}}</span>：
                        <span>{{countdown.second}}</span>
                    </div>
                </div>
                <scroller lock-y :scrollbar-x=false>
                    <div class="box" :style="boxStyle">
                        <div class="item" v-for="item in data.weekBuy" :key="item.goodsId" ref="weekBox" @click="$router.push({path:'/goods/info',query:{id:item.goodsId}})">
                            <div class="image">
                                <img :src="item.goodsImage">
                            </div>
                            <div class="price">￥{{item.shopPrice}}</div>
                        </div>
                    </div>
                </scroller>
            </div>
            <div class="banner2"  v-if="data.bannerList2.length > 0">
                <swiper class="swiper" :auto="true" dots-position="center" height="100%">
                    <swiper-item v-for="(item,index) in data.bannerList2" :key="index">
                        <img :src="item.imageUrl" @click="bannerOperation(item)">
                    </swiper-item>
                </swiper>
            </div>
            <!-- 热门商品 -->
            <div class="hot">
                <div class="title" v-if="data.iconList.length > 0">
                    <div class="classify">热门商品</div>
                </div>
                <goodsList :list="goodsList" :loading="loading"></goodsList>

            </div>
                <!--
                <div class="goods-info" v-for="item in hotList" :key="item.goodsId" @click="$router.push({path:'/shop/info',query:{id:item.goodsId}})">
                    <img :src="item.goodsCover">
                    <div class="hot-text">HOT</div>
                    <div class="info">
                        <div class="goods-name font-limit-2">{{item.goodsName}}</div>
                        <div class="price">
                            <div class="member" v-if="userInfo.userType>1">会员价</div>
                            <div class="promotion">￥{{item.shopPrice}}</div> -->
                            <!-- <div class="promotion" v-if="userInfo.userType===1 || !userInfo.userType">￥{{item.shopPrice}}</div> -->
                            <!-- <del>￥{{item.marketPrice}}</del> -->
                        <!-- </div> -->
                    <!-- </div> -->
                <!-- </div> -->
            <!-- </div> -->
            <!-- <load-more :show-loading="true" tip="正在加载" v-if='hasNext===true'></load-more> -->
            <!-- <load-more :show-loading="false" tip='暂无数据' v-else></load-more> -->
            <!-- <load-more tip="正在加载"></load-more> -->

        <!-- 底部 -->
        <footers :index="0"></footers>
    </div>
</template>

<script>
import footers from '@/components/footers'
import goodsList from '@/components/goods-list'
// import banner from '@/components/banner'
import { getIndexData, getStore } from '@/api/getData'
import { Swiper, SwiperItem, Scroller } from 'vux'
import { getCountdown } from '@/utils/date'
import wx from '@/mixins/wechat'
import { getIsWeixin } from '@/utils/app'
import { mapMutations } from 'vuex'

export default {
    mixins: [wx],
    data () {
        return {
            cityName: '',
            search: {
                page: 1,
                size: 20
            },
            data: {
                iconList: [],
                bannerList2: []
            },
            boxStyle: {},
            goodsList: [],
            store: {},
            searchWord: '',
            footers: footers,
            isMember: false,
            hasNext: true,
            loading: true,
            isLoading: false,
            // isComplete: false,
            scrollValue: 0,
            countdown: {}
        }
    },
    computed: {
        userInfo () {
            let value = ''
            if (window.localStorage.getItem('userInfo')) {
                value = JSON.parse(window.localStorage.getItem('userInfo'))
            }
            return value
        },
        userNo () {
            // let value = ''
            // if (window.sessionStorage.getItem('userNo')) {
            //     value = window.sessionStorage.getItem('userNo')
            // }
            let userNo = this.$route.query.userNo
            if (userNo) {
                this.setUserNo(userNo)
            } else {
                userNo = this.$store.state.user.userNo
            }
            return userNo
        }
        // cityName () {
        //     let cityName = ''
        //     let city = JSON.parse(window.localStorage.getItem('city'))
        //     if (city) {
        //         cityName = city.name
        //     }
        //     return cityName
        // }
    },
    mounted () {
        window.addEventListener('scroll', this.scroll)
        let isWeixin = getIsWeixin()
        if (isWeixin) {
            // this.getSignature(this.getUserLocation)
            this.getIndexData()
        } else {
            this.getIndexData()
        }
        if (this.userNo) {
            this.getStore()
        }

        let city = JSON.parse(window.localStorage.getItem('city'))
        if (city) {
            this.cityName = city.name
        }

        if (!this.cityName) {
            let url = 'https://webapi.amap.com/maps?v=1.4.12&key=30c4305a8c658730b27e7ebf9a4ae54c&callback=onLoad&plugin=AMap.CitySearch'
            let jsapi = document.createElement('script')
            jsapi.charset = 'utf-8'
            jsapi.src = url
            document.head.appendChild(jsapi)
            let that = this
            window.onLoad = async function () {
                let map = new AMap.Map('container', {
                    resizeEnable: true,
                    // center: [116.397428, 39.90923],
                    zoom: 13
                })
                // 获取用户所在城市信息
                function showCityInfo () {
                    // 实例化城市查询类
                    let citysearch = new AMap.CitySearch()
                    // 自动获取用户IP，返回当前城市
                    citysearch.getLocalCity(function (status, result) {
                        // console.log(status, result)
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.city && result.bounds) {
                                that.cityName = result.city
                                // that.city = result
                                // var citybounds = result.bounds
                            // 地图显示当前城市
                            // map.setBounds(citybounds)
                            }
                        }
                    })
                }
                showCityInfo()
            }
        }

        // AMap.plugin('AMap.CitySearch', function () {
        // var citySearch = new AMap.CitySearch()
        // citySearch.getLocalCity(function (status, result) {
        // console.log(status, result)
        // if (status === 'complete' && result.info === 'OK') {
        // 查询成功，result即为当前所在城市信息
        // }
        // })
        // })
    },
    methods: {
        ...mapMutations(['setLocation', 'setUserNo']),
        onScan () {
            this.getSignature(this.wxRegCallback)
        },
        wxRegCallback () {
            let option = {
                needResult: 1,
                scanType: ['qrCode', 'barCode'],
                success (res) {
                    // console.log(res)
                    // console.log(res.resultStr)
                    let data = JSON.parse(res.resultStr)
                    // console.log(data)
                    window.location.href = '/user/order/pay/shop?shopId=' + data.shopId
                }
            }
            this.scanQRCode(option)

            let option1 = {
                title: '1',
                content: '好货都在这里',
                url: window.location.href + '&userNo=' + this.userNo,
                imgUrl: '',
                success () {
                }
            }
            this.onMenuShareTimeline(option1)
        },
        getUserLocation () {
            console.log(1)
            let that = this
            let option = {
                type: 'wgs84',
                success (res) {
                    if (res.errMsg === 'getLocation:ok') {
                        // that.search.localtion = res.longitude + ',' + res.latitude
                        that.setLocation(res)
                        // window.localStorage.setItem('localtion', JSON.stringify(res))
                    }
                    that.getIndexData()
                    //
                }
            }
            this.getLocation(option)
        },
        scroll () {
            this.scrollValue = document.documentElement.scrollTop || document.body.scrollTop
            if ((this.scrollValue + window.screen.height) > (document.body.clientHeight - 50) && this.hasNext) {
                this.hasNext = false
                this.search.page++
                this.getIndexData()
            }
        },
        setCountdown (time) {
            let date = getCountdown(time)
            this.countdown = date
            time--
            setTimeout(() => {
                this.setCountdown(time)
            }, 1000)
        },
        bannerOperation (item) {
            if (item.adClass === 2) {
                window.location.href = item.operation
            }
            if (item.adClass === 4) {
                let row = JSON.parse(item.valueMap)
                this.$router.push({path: '/goods/seckill/info', query: {id: row.goodsId}})
            }
            if (item.adClass === 6) {
                this.$router.push({path: '/goods/index'})
            }
        },
        // 获取热门商品列表
        async getIndexData () {
            let res = await getIndexData(this.search)
            this.data = res.data
            if (res.data.goodsList.length > 0) {
                this.goodsList.push(...res.data.goodsList)
                this.hasNext = true
                // this.isComplete = true
                // this.$refs.scroller.disablePullup()
            } else {
                this.hasNext = false
                this.loading = false
                // this.isComplete = false
                // this.$refs.scroller.enablePullup()
                // document.getElementsByClassName('xs-plugin-pullup-container')[0].innerHTML = '请上拉刷新数据'
            }

            if (this.search.page === 1) {
                let time = res.data.weekCountdown - parseInt(new Date().getTime() / 1000)
                // let a = getCountdown(time)
                // console.log(a)
                this.setCountdown(time)
                let width
                this.$nextTick(() => {
                    width = this.$refs.weekBox[0].clientWidth + 5
                    this.boxStyle = {
                        width: this.data.weekBuy.length * width + 'px'
                    }
                })
            }
        },
        goNav (item) {
            if (item.adClass === 100) {
                this.$router.push('/single/system/developing')
            }
        },
        // 获取店铺信息
        async getStore () {
            let res = await getStore({userNo: this.userNo})
            console.log(res)
            this.store = res.data.userInfo
        }

    },
    activated () {
        let city = JSON.parse(window.localStorage.getItem('city'))
        if (city) {
            this.cityName = city.name
        }
    },
    components: {
        footers,
        Swiper,
        SwiperItem,
        Scroller,
        goodsList
        // banner
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.index-container{padding-bottom: @rem*120;
    //公司
    .company{display: flex; align-items: center; padding: @rem*28 @rem*28 0;
        .icon{width: @rem*80; height: @rem*80; margin-right:@rem*20; border-radius: @rem*8;}
        .text{flex: 1; font-size: @rem*36; color:#000;}
    }
    //搜索框
    .top{display: flex; align-items: center; margin-top: @rem*20;
        .localtion{margin-left: @rem*28; font-size: @rem*28;
            .iconfont{font-size: @rem*32;}
        }
        .search{padding-left: @rem*20;height:@rem*60; flex: 1; background:#fff; display: inline-flex; align-items: center; background:#F4F4F4; border-radius: 4px; margin-left: @rem*15;
            .text{font-size:@rem*28; color:#999;}
            .icon-sousuo{font-size: @rem*30; color:#999; margin-right: @rem*10;}
        }
        .scan{margin: 0 @rem*40 0 @rem*20;
            .iconfont{font-size: @rem*36;}
        }
    }

    //广告轮播图
    .banner{width: @rem*694; height: @rem*360; margin: 0 auto; margin-top:@rem*26;
        .vux-slider{height: 100%;}
        img{height: 100%; width: 100%; display: block;}
    }
    //广告轮播图
    .banner2{width: @rem*694; height: @rem*240; margin: 0 auto; margin-top:@rem*60;
        .vux-slider{height: 100%;}
        img{height: 100%; width: 100%; display: block;}
    }
    //导航
    .nav{padding: 0 @rem*20; margin-top: @rem*42;
        .grid{display:flex; flex-wrap:wrap; background: #fff; padding-bottom: @rem*20;
            .item{width: @rem*141; height: @rem*150; display: flex; flex-direction: column; justify-content: flex-end; align-items: center;
                .img{width: @rem*80; height: @rem*80;}
                .name{padding-top: @rem*10; white-space: nowrap; color: #999; font-size: @rem*24;}
            }
        }
    }
    // 城市
    .city{margin-top: @rem*38; padding: 0 @rem*28;}

    // 图片系列1
    .t1{display: flex; margin-top: @rem*60; padding: 0 @rem*28;
        img{display: block;}
        .left{width: @rem*344; margin-right: @rem*6;
        }
        .right{flex: 1;
            .image3{margin-top: @rem*6;}
        }
    }

    // 本周必买
    .week{margin-top: @rem*40; padding-left: @rem*28;
        .top{display: flex; align-items: center; margin-bottom: @rem*25;
            .title{font-size: @rem*36;}
            .time{margin-left: @rem*20;
                span{padding: @rem*5 @rem*8; background: #000; color: #fff; font-size: @rem*22; border-radius: 4px;}
            }
        }
        .scroll-after{padding-bottom:@rem*180;}
        .box {
            position: relative;
            // width: 1490px;
        }
        .item {
            float: left;
            width: @rem*212;
            // height: @rem*180;
            // display:inline-block;
            padding-top: @rem*20;
            padding-right: @rem*32;
            text-align: center;
            // line-height: 100px;
            .image{width: @rem*180; height: @rem*180; box-shadow: 0 0 5px 5px #fafafa;
                img{width: 100%; height: 100%; display: block;}
            }
            .price{margin-top: @rem*14; height: @rem*40; width: @rem*180; font-size: @rem*32; color: #ff3333;}
        }
        .box1-item:first-child {
            margin-left: 0;
        }
        .box2-wrap {
            height: 300px;
            overflow: hidden;
        }
    }

    //热门商品
    .hot{padding: 0 @rem*28; margin-top: @rem*65;
        .title{display:flex; justify-content: space-between; align-items: center; margin-bottom: @rem*20;
            .classify{font-size: @rem*36; color:#000;}
            .more{font-size: @rem*28; color:#666;}
        }
        // .goods-info{margin-top:@rem*40;position:relative;
        //     img{width:100%;height:@rem*340;border-radius:@rem*4;}
        //     .hot-text{width:@rem*66;height:@rem*32;color:#fff;font-size:@rem*24;position:absolute;left:-10*@rem;top:@rem*28;background:#FF2828;text-align:center;}
        //     .info{margin-top:@rem*10;line-height:@rem*45;
        //         .goods-name{font-size:@rem*30;color:#000;}
        //         .price{display:flex;justify-content:flex-end;margin-top:@rem*5;
        //             .promotion{font-size:@rem*28;color:#FF2828;display:inline-block;margin-right:@rem*30;}
        //             del{color:#999;font-size:@rem*24;display:inline-block;}
        //         }
        //     }
        // }
        // .goods-info:last-child{padding-bottom:@rem*120;}
    }
    // 本周必买

    }
</style>
<style lang="less">
@import '../../assets/less/define.less';
.index-container{
    .banner{
        .vux-slider{overflow: visible;}
        .vux-indicator{bottom: -@rem*32;}
        .vux-slider > .vux-indicator > a > .vux-icon-dot, .vux-slider .vux-indicator-right > a > .vux-icon-dot{background-color: #cccccc; width: @rem*16; transition: 0.3s;}
        .vux-slider > .vux-indicator > a > .vux-icon-dot.active, .vux-slider .vux-indicator-right > a > .vux-icon-dot.active{background-color: #ffd900; width: @rem*32; transition: 0.3s;}
        .vux-swiper{
            .vux-swiper-item{}
        }
        // img{width:100%;height:@rem*347;}
    }
}
</style>
