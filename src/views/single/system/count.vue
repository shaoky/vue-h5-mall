<template>
    <div class="system-developing">
        <div class="box">
            <p>A资源<input v-model.number="a">  点：<input v-model.number="a1"></p>
            <p style="margin-top: 20px;">B资源<input v-model.number="b">  点：<input v-model.number="b1"></p>
            <p style="margin-top: 20px;">A：{{a2}}</p>
            <p>B：{{b2}}</p>
            <button @click="handleInput">计算</button>
            <div class="" v-if="tj">
                <p>win条件</p>
                <p>要拿{{b3}}个点</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            a: 1,
            a1: 3,
            a2: 0,
            a4: 0,
            b: 1,
            b1: 2,
            b2: 0,
            b3: 0,
            b4: 0,
            tj: false
        }
    },
    mounted () {

    },
    methods: {
        handleInput () {
            this.a2 = this.a
            this.b2 = this.b
            while (this.a2 < 1500 && this.b2 < 1500) {
                this.a2 += this.a1 * 2
                this.b2 += this.b1 * 2
            }
            if (this.a2 > 1500) {
                this.a2 = 1500
            }
            if (this.b2 > 1500) {
                this.b2 = 1500
            }
            if (this.b2 < 1500) {
                this.a4 = this.a
                this.b4 = this.b
                while (this.a2 < 1500 && this.b2 < 1500) {
                    this.a4 += (this.a1 - 1) * 2
                    this.b4 += (this.b1 + 1) * 2
                }
                this.tj = true
            } else {
                this.tj = false
            }
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.system-developing{width: 1000px; margin: 0 auto;
    .box{padding: @rem*50;
        input{display: inline-block;}
    }
}
</style>
