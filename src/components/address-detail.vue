<template>
    <div class="address-components">
        <div class="address" @click="toAddressList">
            <div class="imgs">
                <img src="/static/images/common/icon-02.png">
            </div>
            <div class="detail" v-if="defaultAddress">
                <div class="cell">
                    <div class="manager">收货人：{{defaultAddress.userName}}</div>
                    <div class="tel">{{defaultAddress.userPhone}}</div>
                </div>
                <div class="address-info">收货地址：{{defaultAddress.provinceName}}{{defaultAddress.cityName}}{{defaultAddress.countyName}} {{defaultAddress.address}}</div>
            </div>
            <div class="empty" v-if="defaultAddress === null">请添加地址</div>
            <i class="iconfont icon-more"></i>
        </div>
        <div class="icon">
            <img src="/static/images/common/icon-01.png">
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            len: true
        }
    },
    props: ['defaultAddress', 'isOrder'],
    mounted () {
    },
    methods: {
        // 从订单确认页面跳转收货地址列表选择地址
        toAddressList () {
            if (this.isOrder === 1) {
                this.$router.push({path: '/user/address/index', query: {isOrder: 1}})
            }
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../assets/less/define.less';
.address-components{
    .address{display:flex;align-items:center;padding:@rem*44 @rem*24 @rem*32;
        .imgs{width:@rem*40;height:@rem*40;margin-right:@rem*26;
            img{width:100%;height:100%;}
        }
        .detail{flex:1;margin-right:@rem*24;
            .cell{display:flex;justify-content: space-between;font-size:@rem*28;color:#000;}
            .address-info{word-wrap: break-word;word-break: normal;font-size:@rem*28;color:#000;margin-top:@rem*32;}
        }
        .empty{font-size:@rem*28;color:#000;flex:1;}
        .icon-more{font-size:@rem*36;}
    }
    .icon{height:@rem*7;
        img{height:100%;width:100%;display:block;}
    }
}
</style>
