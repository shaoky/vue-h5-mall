<template>
    <div class="bind-phone">
        <div class="container">
            <div class="item" >
                <div class="title">手机号</div>
                <div class="v-box">
                    <span>+86</span>
                    <group class="group">
                        <XInput placeholder="请输入手机号码"  v-model="form.phone" :max="11"></XInput>
                    </group>
                </div>
            </div>
            <div class="item" >
                <div class="title">验证码</div>
                <div class="v-box">
                    <group class="group">
                        <XInput placeholder="请输入验证码"  v-model="login.loginSms" :max="4"></XInput>
                    </group>
                    <div class="btn-code"   @click="getCode" :class="[isSend?'active':'']">{{message}}</div>
                </div>
                <div class="btn" @click="submit">
                    登录
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getH5Code, login, bindManager } from '@/api/getData'
import { XInput } from 'vux'
import validator from '@/utils/validator.js'

export default {
    data () {
        return {
            form: { type: 1 },
            login: {

            },
            message: '获取验证码',
            isSend: false,
            code: null
        }
    },
    computed: {
        token () {
            let value = ''
            if (window.localStorage.getItem('token')) {
                value = JSON.parse(window.localStorage.getItem('token'))
            }
            return value
        },
        userNo () {
            let value = ''
            if (window.sessionStorage.getItem('userNo')) {
                value = window.sessionStorage.getItem('userNo')
            }
            return parseInt(value)
        }
        // isMember () {
        //     let value = ''
        //     if (window.sessionStorage.getItem('isMember')) {
        //         value = window.sessionStorage.getItem('isMember')
        //     }
        //     return value
        // }
    },
    mounted () {
        console.log(this.isMember)
        this.code = this.getRequest(window.location.href).code
        // let code = this.getRequest(window.location.href).code
        // if (code) {
        //     this.autoLogin(code)
        // }
        // if (this.token) {
        //     this.$vux.toast.text('已登录，自动跳转中...')
        //     // this.$vux.toast.text(this.token)
        //     setTimeout(() => { this.$router.push({path: '/index'}) }, 1000)
        // }
    },
    methods: {
        // 获取验证码
        async getCode () {
            if (!this.isSend) {
                let tel = validator.tel(this.form.phone)
                if (tel) {
                    this.$vux.toast.text(tel)
                    return
                }
                await getH5Code(this.form)
                let t = 120
                this.setTime(t)
            }
        },
        // 判断code是否绑定过账号
        // async autoLogin (code) {
        //     let res = await autoLogin({code: code})
        //     console.log(res)

        //     if (res.data.isAutoLogin === 1) {
        //         this.$store.commit('setUserInfo', res.data.userInfo)
        //         this.$store.commit('setToken', res.data.userInfo.token)
        //         if (this.isMember) {
        //             this.$router.push({path: '/shop/info'})
        //         } else {
        //             this.$router.push({path: '/index'})
        //         }
        //     }
        // },
        setTime (countdown) {
            if (countdown < 0) {
                this.message = '重新获取'
                this.isSend = false
                return
            } else {
                this.message = '已发送' + '(' + countdown + ')'
                this.isSend = true
            }
            countdown--
            setTimeout(() => {
                this.setTime(countdown)
            }, 1000)
        },
        // 登录
        async submit () {
            this.login.loginName = this.form.phone
            this.login.code = this.code
            let tel = validator.tel(this.login.loginName)
            if (tel) {
                this.$vux.toast.text(tel)
                return
            }
            let res = await login(this.login)
            if (!res.data.isUser) {
                if (this.userNo) {
                    this.bindManager()
                } else {
                    let code = this.getRequest(window.location.href).code
                    console.log(code)
                    this.$router.push({path: 'bind-manager', query: {loginName: this.login.loginName, code: code}})
                }
            }
            if (res.data.userInfo) {
                this.$store.commit('setUserInfo', res.data.userInfo)
                this.$store.commit('setToken', res.data.userInfo.token)
                window.location.href = window.sessionStorage.getItem('returnUrl')
                // if (this.isMember === 1) {
                //     this.$router.push({path: '/shop/info'})
                // } else {
                //     this.$router.push({path: '/index'})
                // }
            }
            console.log(res)
        },
        getRequest (url) {
            let obj = {}
            if (!url.includes('?')) {
                return obj
            }
            url.includes('?')
            let index = url.indexOf('?')
            let str = url.substring(index + 1)
            if (str.includes('&')) {
                let arr1 = str.split('&')
                for (let item of arr1) {
                    let arr2 = item.split('=')
                    obj[arr2[0]] = arr2[1]
                }
            } else {
                let arr3 = str.split('=')
                obj[arr3[0]] = arr3[1]
            }
            return obj
        },
        // 如果有userNo,就调用 绑定推荐人
        async bindManager () {
            let obj = {}
            obj.userNo = this.userNo
            obj.loginName = this.login.loginName
            if (this.getRequest(window.location.href).code) {
                obj.code = this.getRequest(window.location.href).code
            }
            let res = await bindManager(obj)
            this.$store.commit('setUserInfo', res.data.userInfo)
            this.$store.commit('setToken', res.data.userInfo.token)
            // console.log(res)
            window.location.href = window.sessionStorage.getItem('returnUrl')
            // if (this.isMember === 1) {
            //     this.$router.push({path: '/shop/info'})
            // } else {
            //     this.$router.push({path: '/index'})
            // }
        }
    },
    components: {
        XInput
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.bind-phone{padding: 0 @rem*36; width: @rem*750; margin: 0 auto;
    .container{
        .item{margin-top: @rem*32;
            .title{font-size: @rem*28;color:#000;}
            .v-box{border-bottom: 1px solid #f5f5f5; margin-top: @rem*30; padding-bottom: @rem*12; display: flex; align-items: center;
                span{display: inline-block; text-align: center; width: @rem*64; height: @rem*40; line-height: @rem*40; background:#fe823f; font-size: @rem*28; color:#000;border-radius: @rem*4;margin-right:@rem*20;}
                .btn-code{padding: @rem*5 @rem*10; background:#fe823f; font-size: @rem*24; color:#fff; border-radius: @rem*4;}
            }
        }
        .item:first-child{margin-top: @rem*100;}
        .btn{width: @rem*670; height: @rem*88; line-height: @rem*88; text-align: center; font-size: @rem*32; color:#fff; background:#fe823f; border-radius: @rem*8; margin-top: @rem*80;}
        .active{background:#ccc!important;}
    }
}
</style>
