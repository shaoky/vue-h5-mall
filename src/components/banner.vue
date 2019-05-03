<template>
    <div class="componts-banner">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in list" :key="index" @click="bannerOperation(item)">
                    <img :src="item.imageUrl"/>
                </div>
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    props: {
        list: Array
    },
    mounted () {
        var certifySwiper = new Swiper('.swiper-container', {
            watchSlidesProgress: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            loop: true,
            loopedSlides: this.list.length,
            autoplay: false,
            // navigation: {
            //     nextEl: '.swiper-button-next',
            //     prevEl: '.swiper-button-prev'
            // },
            pagination: {
                el: '.swiper-pagination'
                // clickable :true,
            },
            on: {
                progress: function (progress) {
                    for (var i = 0; i < this.slides.length; i++) {
                        var slide = this.slides.eq(i)
                        var slideProgress = this.slides[i].progress
                        var modify = 1
                        if (Math.abs(slideProgress) > 1) {
                            modify = (Math.abs(slideProgress) - 1) * 0.3 + 1
                        }
                        var translate = slideProgress * modify * 0.34 + 'rem'
                        var scale = 1 - Math.abs(slideProgress) / 5
                        var zIndex = 999 - Math.abs(Math.round(10 * slideProgress))
                        slide.transform('translateX(' + translate + ') scale(' + scale + ')')
                        slide.css('zIndex', zIndex)
                        slide.css('opacity', 1)
                        if (Math.abs(slideProgress) > 3) {
                            slide.css('opacity', 0)
                        }
                    }
                },
                setTransition: function (transition) {
                    for (var i = 0; i < this.slides.length; i++) {
                        var slide = this.slides.eq(i)
                        slide.transition(transition)
                    }
                }
            }

        })
    },
    methods: {
        bannerOperation (item) {
            if (item.type === -1) {
                return
            }
            if (item.type === 2) {
                window.location.href = item.operation
                return
            }
            if (item.type === 1) {
                // this.$router.push({path: '/shop/info', query: {id: item.operation}})
                this.$router.push({path: item.webPage})
            }
            // this.$router.push({path: item.webPage})
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../assets/less/define.less';
.componts-banner{width:@rem*750;position: relative;
    .swiper-container {padding-bottom: @rem*50;
        .swiper-slide {width: @rem*480;height: @rem*320;background: #fff;box-shadow: 0 8*@rem 30*@rem #ddd;
            img{display:block;height: @rem*320;width:100%;border-radius:@rem*8;}
        }
    }
    .swiper-pagination {width: 100%;bottom: 0;}
    .swiper-pagination-bullets .swiper-pagination-bullet {margin: 0 @rem*10;border: 3px solid #fff;background-color: #d5d5d5;width: 10px;height: 10px;opacity: 1;}
}
</style>
<style lang="less">
@import '../assets/less/define.less';
.componts-banner{
    .swiper-pagination-bullets .swiper-pagination-bullet {margin-right:@rem*10;background-color: #d5d5d5;width: @rem*20;height: @rem*9;opacity: 1;border-radius:@rem*6;}
    .swiper-pagination-bullets .swiper-pagination-bullet:last-child{margin-right:0;}
    .swiper-pagination-bullets .swiper-pagination-bullet-active {background-color: #fe823f;width: @rem*32;}
}
</style>
