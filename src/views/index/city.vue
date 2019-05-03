<template>
    <div class="index-city wrap">
        <div class="search-box">
            <div class="search">
                <i slot="label" class="iconfont icon-sousuo"></i>
                <input class="search-input" type="text" placeholder="输入城市名或拼音" v-model="search">
            </div>
        </div>
        <div class="top"></div>
        <div class="search-result" v-if="isSearch">
            <div class="item" v-for="item in searchList" :key="item.id" @click="onCity(item)">
                {{item.name}}
            </div>
            <div class="text" v-if="searchList.length == 0">没有找到相关的城市</div>
        </div>
        <div class="city" id="city" v-if="!isSearch">
            <div class="localtion">
                <i class="iconfont icon-iconfontzhizuobiaozhun16"></i>
                当前城市：{{cityName}}
                <!-- <span>gps定位</span> -->
            </div>
            <div class="list" v-for="(item, key) in list" :key="item.id">
                <div class="letter" :id="key">{{key}}</div>
                <div class="children" v-for="item1 in item" :key="item1.id" @click="onCity(item1)">
                    {{item1.name}}
                </div>
            </div>
            <div class="fixed" v-if="!isSearch">
                <p v-for="(item, key) in list" :key="item.id" @click="onLetter(key)">
                    {{key}}
                </p>
            </div>
        </div>

    </div>
</template>

<script>
import { getRegionCityList } from '@/api/getData'

export default {
    data () {
        return {
            cityName: '',
            isSearch: false,
            search: '',
            list: [],
            searchList: []
        }
    },
    mounted () {
        let city = JSON.parse(window.localStorage.getItem('city'))
        if (city) {
            this.cityName = city.name
        }
        if (!city) {
            let url = 'https://webapi.amap.com/maps?v=1.4.12&key=30c4305a8c658730b27e7ebf9a4ae54c&callback=onLoad&plugin=AMap.CitySearch'
            let jsapi = document.createElement('script')
            jsapi.charset = 'utf-8'
            jsapi.src = url
            document.head.appendChild(jsapi)
            let that = this
            window.onLoad = async function () {
                let map = new AMap.Map('container', {
                    resizeEnable: true,
                    center: [116.397428, 39.90923],
                    zoom: 13
                })
                // 获取用户所在城市信息
                function showCityInfo () {
                    // 实例化城市查询类
                    let citysearch = new AMap.CitySearch()
                    // 自动获取用户IP，返回当前城市
                    citysearch.getLocalCity(function (status, result) {
                        console.log(status, result)
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.city && result.bounds) {
                                that.cityName = result.city
                            }
                        } else {
                            document.getElementById('info').innerHTML = result.info
                        }
                    })
                }
                showCityInfo()
            }
        }
        this.getRegionCityList()
    },
    methods: {
        // 获取热门商品列表
        async getRegionCityList () {
            let res = await getRegionCityList(this.search)
            this.list = res.data.list
        },
        onSearch (value) {
            // console.log(value)
        },
        onCity (item) {
            window.localStorage.setItem('city', JSON.stringify(item))
            this.$router.push({path: '/'})
        },
        onLetter (key) {
            let value = document.getElementById(key).offsetTop
            document.documentElement.scrollTop = value - 70
            document.body.scrollTop = value - 70
        }

    },
    watch: {
        search (value) {
            if (value) {
                let arr = []
                for (let item in this.list) {
                    for (let item1 of this.list[item]) {
                        if (item1.pinyin.indexOf(value) === 0 || item1.name.indexOf(value) > -1) {
                        // if (item1.pinyin.search('/'+value))
                            arr.push(item1)
                        }
                    }
                }
                if (arr.length === 0) {

                }
                this.searchList = arr
                this.isSearch = true
            } else {
                this.searchList = []
                this.isSearch = false
            }
        }
    },
    components: {
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.index-city{background: #f2f2f2; padding: 0 @rem*28;
    .top{height: @rem*118;}
    .search-box{position: fixed; top: 0; left: @rem*24; right: @rem*24; background: #f2f2f2;}
    .search{display: flex;height: @rem*64; align-items: center; margin-top: @rem*32; padding: 0 @rem*20;  margin-bottom: @rem*24; background: #fff; border-radius: 5px; font-size: @rem*28;
        .icon-sousuo{color: #ccc; font-size: @rem*40; margin-right: @rem*10;}
        .search-input{
            flex: 1;
            width: 100%;
            border: 0;
            outline: 0;
            -webkit-appearance: none;
            background-color: transparent;
            font-size: inherit;
            color: inherit;color: #999999;}
        }
    .city{background: #fff;
        .localtion{height: @rem*86; margin: 0 @rem*24; line-height: @rem*86; border-bottom: 1px solid #f2f2f2;
            .iconfont{font-size: @rem*30;}
            span{color: #959595;}
        }
        .list{ padding: @rem*24; padding-right: @rem*46;
            .letter{font-size: @rem*24; color: #959595;}
            .children{font-size: @rem*28; color: #282828; height: @rem*68; line-height: @rem*68; border-bottom: 1px solid #f2f2f2;}
        }
        .fixed{position: fixed; right: @rem*42; top: @rem*120;
            p{text-align: center; margin-bottom: @rem*6;
                a{color: #282828;}
            }
        }
    }
    .search-result{background: #fff; padding: @rem*24; display: table; width: 100%; height: 100vh;
        .item{font-size: @rem*28; color: #282828; height: @rem*68; line-height: @rem*68; border-bottom: 1px solid #f2f2f2;}
        .text{text-align: center;}
    }

}
</style>
