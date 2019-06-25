<template>
    <div class="bind-manager">
        <div class="item">
            <div class="title">请输入推荐人ID</div>
            <group class="group">
                <XInput v-model.number="form.userNo"></XInput>
            </group>
        </div>
        <div class="btn">
            <div class="btn-item btn-left" @click="bindBtn">绑定</div>
            <!-- <div class="btn-item btn-right" @click="$router.push({path:'manager-list',query:{loginName:form.loginName,code:form.code}})">没有推荐人</div> -->
        </div>
        <!-- 模态框 -->

        <x-dialog v-model="visible" :hide-on-blur="true" class="dialog">
            <div class="title">您将绑定推荐人</div>
            <img class="icon" src="/static/images/juhe/bg.png"> <!-- info.userPhoto -->
            <div class="referee-info">
                <div class="name">{{info.userName}}</div>
                <div class="id">ID:{{info.userNo}}</div>
            </div>
            <div class="btn">
                <div class="btn-item btn-left" @click="bindManager">确定</div>
                <div class="btn-item btn-right" @click="visible=false">取消</div>
            </div>
        </x-dialog>

    </div>
</template>

<script>
import { XInput, XDialog } from 'vux'
import { bindManager, managerInfo } from '@/api/getData'

export default {
    data () {
        return {
            form: {userNo: ''},
            info: {},
            visible: false
        }
    },
    computed: {
        userNo () {
            let value = ''
            if (window.sessionStorage.getItem('userNo')) {
                value = window.sessionStorage.getItem('userNo')
            }
            return value
        }
    },
    mounted () {
        if (this.userNo) {
            this.form.userNo = parseInt(this.userNo)
        }
        // console.log(this.$route.query)
        if (this.$route.query.loginName) {
            this.form.loginName = this.$route.query.loginName
        }
        if (this.$route.query.code) {
            this.form.code = this.$route.query.code
        }
        if (this.$route.query.userNo) {
            this.form.userNo = parseInt(this.$route.query.userNo)
        }
        console.log(this.form)
    },
    methods: {
        bindBtn () {
            if (!this.form.userNo) {
                this.$vux.toast.text('请先填写推荐人ID')
                return
            }
            this.getInfo()
        },
        // 绑定推荐人
        async bindManager () {
            let res = await bindManager(this.form)
            this.$store.commit('setUserInfo', res.data.userInfo)
            this.$store.commit('setToken', res.data.userInfo.token)
            console.log(res)
            this.$router.push({path: '/index'})
        },
        // 获取推荐人详情
        async getInfo () {
            try {
                let res = await managerInfo({userNo: this.form.userNo})
                if (res.code === 200) {
                    this.info = res.data.info
                    this.visible = true
                } else {
                    this.visible = false
                }
            } catch (error) {

            }
        }
    },
    components: {
        XInput,
        XDialog
    }
}
</script>

<style scoped lang="less">
@import '../../assets/less/define.less';
.bind-manager{padding: 0 40*@rem; width: @rem*750; margin:0 auto;
    .item{margin-top: @rem*110;
        .title{font-size: @rem*28; color:#282828;}
        .group{border-bottom: 1px solid #f5f5f5; height: @rem*80;}
    }
    .btn{margin-top:@rem*80; display: flex; justify-content: center;
        .btn-item{width: @rem*240;height: @rem*80;line-height: @rem*80;text-align: center;border-radius: 4px;font-size: @rem*30;color: #000;}
        .btn-left{background: #fe823f;margin-right: @rem*60;}
        .btn-right{border: 1px solid #fe823f;}
    }
    .dialog{
        .title{font-size: @rem*30;color: #282828; text-align: center; margin-top: @rem*56; margin-bottom: @rem*44;}
        .icon{width: @rem*140; height: @rem*140; margin: 0 auto;}
        .referee-info{margin-top: @rem*16;
            .name{font-size: @rem*28;color: #282828;}
            .id{font-size: @rem*30;color: #959595;margin-top: @rem*15;}
        }
        .btn{margin-top: @rem*45; margin-bottom: @rem*60; display: flex; justify-content: center;
            .btn-item{width: @rem*126; height: @rem*56; line-height: @rem*56; text-align: center; border-radius: 4px; font-size: @rem*28; color: #282828;}
            .btn-left{background: #fe823f; margin-right: @rem*55;}
            .btn-right{border: 1px solid #fe823f;}
        }
    }
}
</style>
