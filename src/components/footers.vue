<template>
    <!-- <keep-alive >
        <div class="footers">
            <div class="footer">
                <div class="item" v-for="(item,index) in imgs" :key="index" @click="switchTabs(index)">
                    <img :src="item.url">
                </div>
            </div>
        </div>
    </keep-alive> -->
    <footer class="footer-container">
		<ul>
			<li v-for="item in list" :key="item.id">
				<router-link :to="item.path" v-if="$route.path == item.path" class="active">
                    <i class="iconfont" :class="item.iconActive" style="color: #fe823f;"></i>
					<!-- <img :src="item.iconActive" v-if="item.iconActive" class="iconfont"> -->
                    <span>{{item.title}}</span>
				</router-link>
				<router-link :to="item.path" v-if="$route.path != item.path">
                    <i class="iconfont" :class="item.icon"></i>
					<!-- <img :src="item.icon" v-if="item.icon" class="iconfont"> -->
                    <span>{{item.title}}</span>
				</router-link>
			</li>
		</ul>
	</footer>

</template>

<script>
export default {
    data () {
        return {
            list: [
                {
                    id: 1,
                    title: '首页',
                    path: '/',
                    icon: 'icon-shouye-xianxing',
                    iconActive: 'icon-shouye'
                },
                // {
                //     id: 2,
                //     title: '预告',
                //     path: '/activity/cityCard/trailer',
                //     icon: '/static/images/tabs/tab-icon-05.png',
                //     iconActive: '/static/images/tabs/tab-selected-05.png'
                // },
                // {
                //     id: 3,
                //     title: '全部',
                //     // path: '/activity/cityCard/join',
                //     path: '/shop/index',
                //     icon: '/static/images/tabs/tab-icon-02.png',
                //     iconActive: '/static/images/tabs/tab-selected-02.png'
                // },
                {
                    id: 2,
                    title: '商品',
                    // path: '/activity/cityCard/join',
                    path: '/goods/index',
                    icon: 'icon-dianpu-xianxing',
                    iconActive: 'icon-dianpu'
                },
                {
                    id: 4,
                    title: '购物车',
                    path: '/cart/index',
                    icon: 'icon-caigou-xianxing',
                    iconActive: 'icon-caigou'
                },
                {
                    id: 5,
                    title: '我的',
                    path: '/user/index',
                    icon: 'icon-yonghu-xianxing',
                    iconActive: 'icon-yonghu'
                }
            ]
            // arr: [{url: '/static/images/tabs/tab-icon-01.png'}, {url: '/static/images/tabs/tab-icon-02.png'}, {url: '/static/images/tabs/tab-icon-03.png'}, {url: '/static/images/tabs/tab-icon-04.png'}],
            // imgs: [{url: '/static/images/tabs/tab-icon-01.png'}, {url: '/static/images/tabs/tab-icon-02.png'}, {url: '/static/images/tabs/tab-icon-03.png'}, {url: '/static/images/tabs/tab-icon-04.png'}],
            // selectedImgs: [{url: '/static/images/tabs/tab-selected-01.png'}, {url: '/static/images/tabs/tab-selected-02.png'}, {url: '/static/images/tabs/tab-selected-03.png'}, {url: '/static/images/tabs/tab-selected-04.png'}]
        }
    },
    // props: ['index'],
    mounted () {
        // this.switchTabs(this.index)
    },
    methods: {
        switchTabs (index) {
            this.imgs = []
            for (let item of this.arr) {
                this.imgs.push({...item})
            }
            this.imgs[index].url = this.selectedImgs[index].url
            // switch (index) {
            // case 0:
            //     this.$router.push({path: '/index'})
            //     break
            // case 1:
            //     this.$router.push({path: '/shop/index'})
            //     break
            // case 2:
            //     this.$router.push({path: '/cart/index'})
            //     break
            // case 3:
            //     this.$router.push({path: '/user/index'})
            //     break
            // }
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../assets/less/define.less';
.footer-container{position:fixed;bottom:0;border-top:1px solid #f5f5f5;height:@rem*100; width: @rem*750; background: #fff;
    // ul{
    //     li{display:inline-block;width:@rem*187.5;height:@rem*100;position:relative;background:#fff;
    //         img{width:@rem*40;height:@rem*40;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);}
    //     }
    // }
    ul{display: flex;padding-top: 3px;
        li{flex: 1; text-align: center;
            a{color: #323232;display: block;text-align: center;
                .iconfont{margin-top: @rem*3; display: block;}
                span{font-size: 12px; color: #666; margin-top: @rem*0; display: block;}
            }
            // .active{color: #ff7000;}
        }
    }
}
</style>
