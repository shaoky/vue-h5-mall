<template>
    <div class="manager-list">
        <scroller  v-model="scrollerStatus" :use-pullup="true" ref="scroller" lock-x  height="100vh"  :pullup-config="upobj" @on-pullup-loading="getMore" :bounce="false" :scroll-bottom-offset="0">
            <div class="container">
                <div class="item" v-for="(item,index) in list" :key="index">
                    <img :src="item.userPhoto"> <!-- item.userPhoto -->
                    <div class="item-right">
                        <div class="referee-info">
                            <div class="name">{{item.userName}}</div>
                            <div class="id">ID：{{item.userNo}}</div>
                        </div>
                        <div class="btn" @click="choice(item.userNo)">选择TA</div>
                    </div>
                </div>
                <div class="scroll-after" v-if="isComplete">全部数据加载完毕</div>
            </div>
        </scroller>
        <!-- <scroller  v-model="scrollerStatus" :use-pullup="true" ref="scroller" lock-x  height="100vh"  :pullup-config="upobj" @on-pullup-loading="getMore" :bounce="false" :scroll-bottom-offset="0">

        </scroller> -->
        <div class="message" @click="visible=true">
            <img src="/static/images/login/icon-01.png" >
        </div>
        <x-dialog v-model="visible" :hide-on-blur="true">
            <div class="content">选择推荐人,可获得一对一的优质导购服务,掌握平台最新最全的优惠信息;并能获得最丰富的商品素材,自购轻松省钱,分享轻松赚钱.</div>
            <div class="dialog-btn" @click="visible=false">确定</div>
        </x-dialog>
    </div>
</template>

<script>

import { XDialog, Scroller } from 'vux'
import { managerList } from '@/api/getData'
export default {
    data () {
        return {
            search: {
                page: 0,
                size: 20
            },
            form: {},
            list: [],
            visible: false,
            isLoading: true,
            hasNext: false,
            isComplete: false,
            scrollerStatus: {
                pullupStatus: 'default'
            },
            upobj: {
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
        this.getList()
        if (this.$route.query.loginName) {
            this.form.loginName = this.$route.query.loginName
        }
        if (this.$route.query.code) {
            this.form.code = this.$route.query.code
        }
    },
    methods: {
        async getList () {
            this.isLoading = false
            let res = await managerList(this.form)
            console.log(res)
            this.list.push(...res.data.list)
            if (this.list.length >= res.data.count) {
                this.hasNext = false
            } else {
                this.hasNext = true
            }
            this.isLoading = true
            this.scrollerStatus.pullupStatus = 'default'
        },
        choice (userNo) {
            this.$router.push({path: 'bind-manager', query: {loginName: this.form.loginName, userNo: userNo, code: this.form.code}})
        },
        // 上拉触底事件
        getMore () {
            if (!this.hasNext) {
                this.isComplete = true
                this.$refs.scroller.disablePullup()
            }
            if (this.hasNext && this.isLoading) {
                this.search.page++
                this.getList()
            }
        }
    },
    components: {
        XDialog,
        Scroller
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.manager-list{padding:0 @rem*25;width:@rem*750;margin:0 auto;
    .container{
        .item{display:flex;padding:@rem*28 0;border-bottom:1px solid #f5f5f5;
            img{width:@rem*100;height:@rem*100;}
            .item-right{flex:1;display:flex;align-items:center;padding:@rem*15;height:@rem*100;
                .referee-info{flex:1;
                    .name{font-size:@rem*28;color:#000;}
                    .id{font-size:@rem*28;color:#959595;}
                }
                .btn{width:@rem*153;height:@rem*56;line-height:@rem*56;text-align:center;font-size:@rem*28;color:#fff;background:#fe823f;border-radius:4px;}
            }
        }
    }
    .message{position:absolute;right:@rem*24;bottom:@rem*40;width:@rem*40;height:@rem*40;
        img{width:@rem*40;height:@rem*40;}
    }

    .content{padding:@rem*55 @rem*100;word-wrap: break-word;word-break: normal;line-height:@rem*60;font-size:@rem*28;color:#000;text-align:center;}
    .dialog-btn{font-size:@rem*30;color:#fff;height:@rem*80;line-height:@rem*80;background:#fe823f;}

}
</style>
