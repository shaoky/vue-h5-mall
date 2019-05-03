<template>
    <div class="address-add">
        <div class="cell">
            <div class="value">收货人：</div>
            <div class="cell-input">
                <input type="text" class="input" v-model="form.userName">
            </div>
        </div>
        <div class="cell">
            <div class="value">手机号码：</div>
            <div class="cell-input">
                <input type="text" class="input" v-model="form.userPhone" maxlength="11">
            </div>
        </div>
        <!-- 地区选择 -->
        <div class="cell" >
            <div class="value" >省市区</div>
            <div class="cell-address" >
                <popup-picker :title="popupTitle" :data="citys" :columns="3"  @on-change="handleChange" ></popup-picker>
            </div>
        </div>
        <!-- 详细地址 -->
        <div class="cell">
            <div class="value">详细地址</div>
            <div class="cell-textarea">
                <textarea name="textarea"  class="textarea" v-model="form.address"></textarea>
            </div>
        </div>
        <group>
            <x-switch title="设为默认地址" v-model="isDefault"></x-switch>
        </group>
        <div class="btn" @click="submit">{{btn}}</div>
    </div>
</template>

<script>
import { XSwitch, PopupPicker } from 'vux'
import { getRegion, addAddress, editAddress, getAddressInfo } from '@/api/getData'

export default {
    data () {
        return {
            form: {},
            citys: [],
            regions: [],
            addressId: '',
            isAdd: true,
            isDefault: false,
            popupTitle: '请选择',
            btn: '添加',
            isOrder: false // 判断是否从提交订单页面过来
        }
    },
    mounted () {
        console.log(this.$route.query)
        if (this.$route.query.isOrder == 1) {
            this.isOrder = true
        }
        if (this.$route.query.addressId) {
            this.isAdd = false
            this.addressId = parseInt(this.$route.query.addressId)
            this.btn = '保存'
            this.getAddressInfo()
        }
        if (window.localStorage.getItem('citys')) {
            this.citys = JSON.parse(window.localStorage.getItem('citys'))
        } else {
            this.getRegion()
        }
    },
    methods: {
        // 获取地址
        async getRegion () {
            let res = await getRegion()
            console.log(res)
            let data = res.data.region.chindren
            let arr = []
            // 遍历地区
            for (let item1 of data) {
                item1.value = item1.id
                item1.parent = '0'
                delete item1.id
                arr.push(item1)
                if (typeof item1.children === 'object') {
                    for (let item2 of item1.children) {
                        item2.parent = item1.value
                        item2.value = item2.id
                        delete item2.id
                        arr.push(item2)
                        if (typeof item2.children === 'object') {
                            for (let item3 of item2.children) {
                                item3.parent = item2.value
                                item3.value = item3.id
                                delete item3.id
                                arr.push(item3)
                            }
                        }
                    }
                }
            }
            for (let item of arr) {
                let keys = Object.keys(item)
                if (keys.includes('children')) {
                    delete item.children
                }
            }
            this.citys = arr
            window.localStorage.setItem('citys', JSON.stringify(arr))
        },
        // 选择地区
        handleChange (val) {
            console.log(val)
            this.regions = val
            let regionName = []
            for (let item of this.citys) {
                for (let items of val) {
                    if (items === item.value) {
                        regionName.push(item.name)
                    }
                }
            }
            this.popupTitle = regionName.join('-')
        },
        // 添加/编辑
        async submit () {
            if (!this.form.userName) {
                this.$vux.toast.text('请填写收货人姓名', 'middle')
                return
            }
            if (!this.form.userPhone) {
                this.$vux.toast.text('请填写收货人手机号码', 'middle')
                return
            }
            if (this.popupTitle === '请选择') {
                this.$vux.toast.text('请选择区域', 'middle')
                return
            }
            if (!this.form.address) {
                this.$vux.toast.text('请填写详细地址', 'middle')
                return
            }
            if (this.isDefault) {
                this.form.isDefault = 1
            } else {
                this.form.isDefault = 0
            }
            if (this.regions.length === 3) {
                this.form.provinceId = parseInt(this.regions[0])
                this.form.cityId = parseInt(this.regions[1])
                this.form.countyId = parseInt(this.regions[2])
            }

            if (this.isAdd) {
                let res = await addAddress(this.form)
                console.log(res)
                this.$vux.toast.text('添加成功', 'middle')
                this.form = {}
                this.popupTitle = '请选择'
                if (this.isOrder) {
                    window.sessionStorage.setItem('addressId', res.data.addressId)
                    this.$router.go(-1)
                    // this.$router.push({path: '/user/order/pay/confirm', query: {addressId: res.data.addressId}})
                }
            } else {
                // 编辑
                await editAddress(this.form)
                this.$vux.toast.text('编辑成功', 'middle')
                this.$router.go(-1)
            }
        },
        // 编辑时 获取地址详情
        async getAddressInfo () {
            let res = await getAddressInfo({addressId: this.addressId})
            console.log(res)
            this.form = res.data.info
            if (this.form.isDefault === 1) {
                this.isDefault = true
            } else {
                this.isDefault = false
            }
            this.popupTitle = this.form.provinceName + this.form.cityName + this.form.countyName
        }
    },
    components: {
        XSwitch, PopupPicker
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.address-add{padding:0 @rem*20;width:@rem*750;margin:0 auto;
    .cell{padding:@rem*24 0;border-bottom:1px solid #f5f5f5;
        .value{font-size:@rem*28;color:#000;}
        .font{color:#959595;}
        .cell-input{margin-top:@rem*20;
            .input{border:none;color:#959595;font-size:@rem*28;width:100%;}
        }
        .cell-textarea{height:@rem*80;margin-top:@rem*20;
            .textarea{height:100%;width:100%;border:none;overflow-y: true;font-size:@rem*28;color:#959595;}
        }
        .cell-address{margin-top:@rem*20;
            .address{font-size:@rem*28;color:#959595;}
        }
    }
    .btn{width:@rem*670;height:@rem*88;line-height:@rem*88;text-align:center;font-size:@rem*32;color:#fff;border-radius:@rem*8;background:#fe823f;margin:0 auto;margin-top:@rem*60;}
}
</style>
<style lang="less">
@import '../../../assets/less/define.less';
.address-add{
    .weui-cells:before{border-top:0;}
    .weui-cells:after{border-bottom:0;}
    .weui-label{font-size:@rem*30;}
    .weui-cell{padding:@rem*20 0;}
    .weui-cell__hd{
        .weui-label{font-size:@rem*28!important;color:#959595;}
    }
}
</style>
