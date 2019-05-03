<template>
    <div class="system-developing">
        <div class="box">
            <img src="../../../assets/images/icon/icon-consumption-null.png">
            <p>即将上线 敬请期待</p>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    mounted () {

    },
    methods: {

    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.system-developing{
    .box{width: @rem*288; margin: 0 auto; margin-top: @rem*164;
        img{display: block; width: 100%;}
        p{margin-top: @rem*30; text-align: center; font-size: @rem*32; color: #999;}
    }
}
</style>
