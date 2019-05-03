<template>
    <div class="user-set-index">
        <div class="info">
            <div class="x-cell">
                <div class="label">头像</div>
                <div class="value">
                    <div class="imgs" @click="changeImg">
                        <img :src="form.userPhoto">
                    </div>
                    <i class="iconfont icon-more"></i>
                </div>
            </div>
            <div class="x-cell" @click="nameVisible=true">
                <div class="label">昵称</div>
                <div class="value">
                    <div class="text">{{form.userName}}</div>
                    <i class="iconfont icon-more"></i>
                </div>
            </div>
            <div class="x-cell" @click="wxVisible=true">
                <div class="label">微信号</div>
                <div class="value">
                    <div class="text">{{form.weixinAccount}}</div>
                    <i class="iconfont icon-more"></i>
                </div>
            </div>
            <div class="x-cell">
                <div class="label">手机号</div>
                <div class="value">
                    <div class="text">{{form.loginName}}</div>
                </div>
            </div>
            <div class=""></div>
        </div>
        <div class="btn" @click="logout">退出</div>
        <div class="btn-bottom" @click="submit">保存</div>

        <x-dialog v-model="nameVisible" :hide-on-blur="true" class="dialog">
            <div class="title">请输入昵称</div>
            <div class="input">
                <input type="text" v-model="form.userName">
            </div>
            <div class="btn" @click="nameVisible=false">确定</div>
        </x-dialog>

        <x-dialog v-model="wxVisible" :hide-on-blur="true" class="dialog">
            <div class="title">请输入微信号</div>
            <div class="input">
                <input type="number" v-model="form.weixinAccount">
            </div>
            <div class="btn" @click="wxVisible=false">确定</div>
        </x-dialog>
    </div>
</template>

<script>
import { XDialog } from 'vux'
import { getUserInfo, editUserInfo } from '@/api/getData'

export default {
    data () {
        return {
            form: {},
            nameVisible: false,
            wxVisible: false
        }
    },
    mounted () {
        this.getUserInfo()
    },
    methods: {
        // 获取用户信息
        async getUserInfo () {
            let res = await getUserInfo()
            console.log(res)
            this.form = res.data.userInfo
        },
        // 上传图片
        changeImg () {
            this.$wechat.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    console.log(res)
                    this.form.userPhoto = res.localIds[0]
                }
            })
        },
        // 保存信息
        async submit () {
            var obj = {}
            if (this.form.userPhoto) {
                obj.userPhoto = this.form.userPhoto
            }
            if (this.form.userName) {
                obj.userName = this.form.userName
            }
            if (this.form.weixinAccount) {
                obj.weixinAccount = this.form.weixinAccount
            }
            let res = await editUserInfo(obj)
            console.log(res)
            this.$vux.toast.text('修改成功')
            this.getUserInfo()
        },
        // 退出登陆
        logout () {
            this.$store.commit('delToken')
            this.$store.commit('delUserInfo')
            this.$router.push({path: '/index'})
        }
    },
    components: {
        XDialog
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.user-set-index{padding:0 @rem*28;width:@rem*750;margin:0 auto;
    .info{
        .x-cell{display:flex;height:@rem*88;align-items:center;border-bottom:1px solid #f5f5f5;
            .label{flex:1;font-size:@rem*28;color:#000;}
            .value{display:flex;align-items:center;
                .imgs{width:@rem*80;height:@rem*80;margin-right:@rem*16;
                    img{height:100%;width:100%;display:block;border-radius:50%;}
                }
                .text{font-size:@rem*24;margin-right:@rem*16;color:#959595;}
                .icon-more{font-size:@rem*30;}
            }
        }
        .x-cell:first-child{height:@rem*140;}
        .x-cell:last-child{border-bottom:0;}
    }
    .btn{width:@rem*670;height:@rem*88;line-height:@rem*88;text-align:center;font-size:@rem*32;color:#fff;background:#fe823f;border-radius:@rem*8;margin-top:@rem*80;}
    .btn-bottom{position:fixed;bottom:0;left:0;width:@rem*750;height:@rem*90;line-height:@rem*90;text-align:center;font-size:@rem*32;color:#000;background:#fe823f;}
    .dialog{
        .title{font-size:@rem*30;color:#000;text-align:center;margin-top:@rem*60;}
        .input{width:@rem*440;height:@rem*40; margin:0 auto;margin-top:@rem*60;margin-bottom:@rem*60;
            input{border:none;width:100%;height:@rem*40;line-height:@rem*40;font-size:@rem*28;color:#959595;border-bottom:1px solid #ddd;border-radius:0px;}
        }
        .btn{height:@rem*80;line-height:@rem*80;text-align:center;font-size:@rem*30;color:#fff;background:#fe823f;}
    }
}
</style>
