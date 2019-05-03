<template>
    <div class="user-address-index">
        <!-- 地址列表空 -->
        <div class="empty" v-if="isLoading&&list.length===0">
            <div class="imgs">
                <img src="../../../assets/images/icon/icon-address-null.png">
            </div>
            <div class="text">暂无收货地址</div>
        </div>
        <!-- 有地址 -->

            <scroller v-show="isLoading&&list.length>0"  v-model="scrollerStatus" :use-pullup="true" ref="scroller" lock-x  height="100vh"  :pullup-config="upobj" @on-pullup-loading="getMore" :bounce="false" :scroll-bottom-offset="0">
                <div class="container" >
                    <div class="address-list" v-if="list.length>0">
                        <swipeout>
                            <swipeout-item v-for="(item,index) in list" :key="index">
                                <div slot="right-menu">
                                    <swipeout-button :width="126">
                                        <img src="/static/images/buy-cart/del.png" style="width:100%;height:100%;" @click="del(item.addressId,index)" v-if="item.isDefault===0">
                                        <div class="del" @click="del(item.addressId,index)" v-if="item.isDefault===1">
                                            <img src="/static/images/user/address/icon-01.png">
                                        </div>
                                    </swipeout-button>
                                </div>
                                <div class="item" slot="content" @click="toOrderConfirm(item.addressId)">
                                    <div class="default" v-if="item.isDefault===1">
                                        <div class="btn-default">默认</div>
                                    </div>
                                    <div class="cell">
                                        <div class="address-detail">
                                            <div class="name">{{item.userName}} <span>13587998239</span></div>
                                            <div class="address font-limit-2">{{item.provinceName}}{{item.cityName}}{{item.countyName}} {{item.address}}</div>
                                        </div>
                                        <div class="edit-container">
                                            <div class="edit" @click.stop="$router.replace({path:'/user/address/add',query:{addressId:item.addressId}})">编辑</div>
                                        </div>
                                    </div>
                                </div>
                            </swipeout-item>
                        </swipeout>
                    </div>
                    <!-- <div class="scroll-after" v-if="isComplete && list.length>0">暂无数据</div> -->
                </div>
            </scroller>

        <div class="btn-bottom" @click="toEdit">
            添加地址
        </div>
    </div>
</template>

<script>
import { getAddressList, delAddress } from '@/api/getData'
import { Swipeout, SwipeoutItem, SwipeoutButton, Scroller } from 'vux'

export default {
    data () {
        return {
            isLoading: false,
            search: {page: 1, size: 20},
            list: [],
            isOrder: false, // 判断是否是从订单页面过来
            hasNext: false,
            isComplete: false,
            scrollerStatus: {
                pullupStatus: 'default'
            },
            upobj: { // 初始化数据
                content: '请上拉刷新数据',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '请上拉刷新数据',
                upContent: '请上拉刷新数据',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            }
        }
    },
    mounted () {
        if (this.$route.query.isOrder == 1) {
            this.isOrder = true
        }
        this.getAddressList()
    },
    methods: {
        // 获取地址列表
        async getAddressList () {
            let res = await getAddressList(this.search)
            console.log(res)
            let data = res.data
            this.list.push(...data.list)
            if (this.list.length >= data.count) {
                this.hasNext = false
                this.isComplete = true
                this.$refs.scroller.disablePullup()
            } else {
                this.hasNext = true
                this.isComplete = false
                this.$refs.scroller.enablePullup()
                document.getElementsByClassName('xs-plugin-pullup-container')[0].innerHTML = '请上拉刷新数据'
            }
            this.isLoading = true
            // if (this.list.length === 0) {
            //     this.$refs.scroller.disablePullup()
            //     document.getElementsByClassName('xs-plugin-pullup-container')[0].innerHTML = ''
            // }
        },
        // 删除收货地址
        async del (addressId, index) {
            console.log(index)
            await delAddress({addressId: addressId})
            this.$vux.toast.text('删除成功', 'middle')
            this.list.splice(index, 1)
            // this.getAddressList()
        },
        // 回订单确认页面
        toOrderConfirm (addressId) {
            if (this.isOrder) {
                window.sessionStorage.setItem('addressId', addressId)
                this.$router.go(-1)
                // this.$router.push({path: '/user/order/pay/confirm', query: {addressId: addressId}})
            }
        },
        // 上拉触底事件
        getMore () {
            if (!this.hasNext) {
                return
            }
            if (this.hasNext) {
                this.search.page++
                this.getAddressList()
            }
        },
        // 去编辑页面
        toEdit () {
            if (this.isOrder) {
                this.$router.replace({path: '/user/address/add', query: {isOrder: 1}})
            } else {
                this.$router.push({path: '/user/address/add'})
            }
        }
    },
    components: {
        Swipeout, SwipeoutItem, SwipeoutButton, Scroller
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.user-address-index{width:@rem*750;margin:0 auto;
    .empty{
        .imgs{margin-top:@rem*96;
            img{width:@rem*288;height:@rem*288;margin:0 auto;display:block;}
        }
        .text{margin-top:@rem*32;text-align:center;font-size:@rem*32;color:#999;}
    }
    .address-list{
        .del{height:100%;width:100%;background:#FF2828;display:flex;align-items:center;justify-content: center;
            img{height:@rem*40;width:@rem*40;}
        }
        .item{border-bottom:1px solid #f5f5f5;min-height:@rem*198;
            .default{height:@rem*60;display:flex;justify-content: flex-end;align-items:flex-end;
                .btn-default{width:@rem*120;height:@rem*40;line-height:@rem*40;text-align:center;font-size:@rem*26;color:#fff;background:#fe823f;border-radius:@rem*4;}
            }
            .cell{display:flex;padding:0 @rem*24;
                .address-detail{flex:1;
                    .name{font-size:@rem*28;color:#000;margin-top:@rem*20;
                        span{font-size:@rem*24;color:#999;}
                    }
                    .address{font-size:@rem*28;color:#000;margin-top:@rem*30;word-wrap: break-word;word-break: normal;}
                }
                .edit-container{height:@rem*198;width:@rem*126;display:flex;align-items:center;justify-content: center;}
                .edit{width:@rem*126;height:@rem*40;line-height:@rem*40;font-size:@rem*28;color:#999;text-align:center;border-left:1px solid #f5f5f5;}
            }
        }
    }
    .btn-bottom{position:fixed;bottom:0;width:@rem*750;height:@rem*90;line-height:@rem*90;text-align:center;font-size:@rem*32;color:#fff;background:#fe823f;}

}
</style>
