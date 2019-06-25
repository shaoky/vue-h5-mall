<template>
    <div class="user-index wrap">
        <div class="header">
            <div class="empty"></div>
            <div class="user-info">
                <div class="user-imgs">
                    <img :src="data.userPhoto">
                </div>
                <div class="user-name">{{data.userName}}</div>
            </div>
            <div class="member-imgs">
                <img class="setting" src="/static/images/user/index/icon-10.png" @click="$router.push({path:'/user/set/index'})">
                <img class="icon" src="/static/images/user/index/icon-06.png">
            </div>
        </div>
        <div class="my-order">
            <div class="cell" @click="toList(0)">
                <div class="label">我的订单</div>
                <div class="value">
                    所有订单<i class="iconfont icon-more"></i>
                </div>
            </div>
            <div class="icons">
                <div class="item" v-for="(item,index) in icons" :key="index" @click="toList(item.value)">
                    <img :src="item.imgUrl">
                    <div class="content">{{item.content}}</div>
                </div>
            </div>
        </div>
        <div class="bg"></div>
        <div class="cell-padding">
            <div class="x-cell">
                <div class="label">
                    <i class="iconfont icon-huiyuan"></i>
                    <div class="content">会员中心</div>
                </div>
                <i class="iconfont icon-more"></i>
            </div>
            <div class="x-cell" @click="$router.push({path:'/user/coupon/index'})">
                <div class="label">
                    <i class="iconfont icon-youhuiquan"></i>
                    <div class="content">我的优惠券</div>
                </div>
                <i class="iconfont icon-more"></i>
            </div>
            <div class="x-cell" @click="$router.push({path:'/user/address/index'})">
                <div class="label">
                    <i class="iconfont icon-dizhi"></i>
                    <div class="content">地址管理</div>
                </div>
                <i class="iconfont icon-more"></i>
            </div>
            <div class="x-cell">
                <div class="label">
                    <i class="iconfont icon-kefu"></i>
                    <div class="content">服务热线</div>
                </div>
                <div class="value">123456789</div>
            </div>
        </div>

        <footers :index="3"></footers>
    </div>
</template>

<script>
import footers from '@/components/footers'
import { getUserInfo } from '@/api/getData'

export default {
    data () {
        return {
            icons: [
                {imgUrl: '/static/images/user/index/icon-01.png', content: '待付款', value: 1}, {imgUrl: '/static/images/user/index/icon-02.png', content: '待发货', value: 2},
                {imgUrl: '/static/images/user/index/icon-03.png', content: '待收货', value: 3}, {imgUrl: '/static/images/user/index/icon-04.png', content: '交易完成', value: 4},
                {imgUrl: '/static/images/user/index/icon-05.png', content: '退款/售后', value: 5}
            ],
            data: {}
        }
    },
    computed: {

    },
    mounted () {
        this.getUserInfo()
    },
    methods: {
        // 获取用户信息
        async getUserInfo () {
            let res = await getUserInfo()
            console.log(res)
            this.data = res.data.userInfo
            this.$store.commit('setUserInfo', res.data.userInfo)
        },
        // 去订单列表页
        toList (n) {
            switch (n) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                window.sessionStorage.setItem('tabState', n)
                this.$router.push({path: '/user/order/index'})
                break
            case 5:
                this.$router.push({path: '/user/after-sales/index'})
                break
            }
        }
    },
    components: {
        footers
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.user-index{
    .icon-more{font-size:@rem*32;color:#666;}
    .header{display:flex;margin-top:@rem*32;padding:0 @rem*24;
        .empty{flex:1}
        .user-info{
            .user-imgs{
                img{height:@rem*120;width:@rem*120;display:block;border-radius:50%;margin:0 auto;}
            }
            .user-name{margin-top:@rem*20;font-size:@rem*28;color:#000;text-align:center;}
        }
        .member-imgs{flex:1;position:relative;margin-left:@rem*12;
            .icon{width:@rem*36;height:@rem*36;position:absolute;left:0;bottom:0;}
            .setting{width:@rem*32;height:@rem*32;position:absolute;top:0;right:0;}
        }
    }
    .my-order{margin-top:@rem*44;padding:0 @rem*24;
        .cell{display:flex;justify-content: space-between;
            .label{font-size:@rem*28;color:#000;}
            .value{font-size:@rem*28;color:#666;}
        }
        .icons{display:flex;padding:@rem*38 0 @rem*32;
            .item{flex:1;display:flex;flex-direction: column;align-items:center;
                img{height:@rem*80;width:@rem*80;}
                .content{font-size:@rem*24;color:#666;margin-top:@rem*20;}
            }
        }
    }
    .bg{height:@rem*20;background:#f5f5f5;}
    .cell-padding{padding:0 @rem*24;
        .x-cell{display:flex;border-bottom:1px solid #f5f5f5;height:@rem*80;align-items:center;
            .label{flex:1;display:flex;align-items:center;
                // img{height:@rem*30;width:@rem*30;margin-right:@rem*20;}
                .iconfont{font-size: @rem*28; margin-right: @rem*18; color: #ff843a;}
                .content{font-size:@rem*28;color:#000;}
            }
            .value{font-size:@rem*28;color:#999;padding-right:@rem*10;}
        }
    }

}
</style>
