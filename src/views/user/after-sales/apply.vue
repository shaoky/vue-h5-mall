<template>
    <div class="after-sales-apply">
        <div class="detail">
            <div class="cell">
                <img src="/static/images/common/icon-04.png">
                <div class="text">退款信息</div>
            </div>
            <ul>
                <li v-for="(item,index) in data.goodsList" :key="index">
                    <order-list :item="item"></order-list>
                </li>
            </ul>
            <div class="cost-detail">
                <!-- <div class="cell">
                    <div class="label">运费</div>
                    <div class="value">￥{{data.deliverMoney}}</div>
                </div> -->
                <div class="cell">
                    <div class="label">退款金额</div>
                    <div class="value red">￥{{data.payMoney}}</div>
                </div>
            </div>
            <div class="x-cell">
                <div class="label">
                    <div class="title">仅退款</div>
                    <!-- <div class="value">XXXXXXXXXXX</div> -->
                </div>
                <i class="iconfont icon-yuanxingweixuanzhong" v-if="!isSelected" @click="isSelected=true"></i>
                <img src="/static/images/common/seleted.png" v-if="isSelected">
            </div>
            <div class="x-cell">
                <div class="label">
                    <div class="title">退货退款</div>
                    <!-- <div class="value">XXXXXXXXXXX</div> -->
                </div>
                <i class="iconfont icon-yuanxingweixuanzhong" v-if="isSelected" @click="isSelected=false"></i>
                <img src="/static/images/common/seleted.png" v-if="!isSelected">
            </div>
        </div>
        <div class="bg"></div>
        <div class="apply-info">
            <popup-picker title="退款原因" :data="reason" v-model="arr" ></popup-picker>
            <div class="cell">
                <div class="input">
                    <span>留言：</span>
                    <input type="text" placeholder="(选填)" v-model="form.refundRemark">
                </div>
            </div>
        </div>
        <div class="upload">
            <div class="title">上传凭证</div>
            <div class="imgs">
                <img :src="form.refundImage" class="img-icon" v-if="form.refundImage" @click="uploadImgs">
                <img src="/static/images/user/apply/icon.png" class="img-add" @click="uploadImgs" v-if="!form.refundImage">
            </div>
        </div>
        <div class="empty"></div>
        <div class="btn-bottom" @click="submit">提交</div>
    </div>
</template>

<script>
import { getOrderInfo, apply } from '@/api/getData'
import orderList from '@/components/order-list'
import { PopupPicker } from 'vux'

export default {
    data () {
        return {
            data: {},
            isSelected: true,
            form: {
                refundReason: '',
                refundImage: ''
            },
            arr: [],
            reason: [['拍错了', '不想要了', '没货了', '其他原因']]
        }
    },
    mounted () {
        if (this.$route.query.orderId) {
            this.form.orderId = parseInt(this.$route.query.orderId)
        }
        this.getOrderInfo()
    },
    methods: {
        // 获取详情
        async getOrderInfo () {
            let res = await getOrderInfo({orderId: this.form.orderId})
            console.log(res)
            this.data = res.data.info
        },
        handleChange (val) {
            console.log(val)
        },
        async submit () {
            if (this.arr.length === 0) {
                this.$vux.toast.text('请选择退款原因')
                return
            }
            this.form.refundReason = this.arr[0]
            if (this.isSelected) {
                this.form.refundType = 1
            } else {
                this.form.refundType = 2
            }
            await apply(this.form)
            this.$vux.toast.text('申请成功')
            this.$router.push({path: '/user/after-sales/index'})
        },
        // 上传照片
        uploadImgs () {
            this.$wechat.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    console.log(res)

                    this.form.refundImage = res.localIds[0]
                }
            })
        }
    },
    components: {
        orderList,
        PopupPicker
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/define.less';
.after-sales-apply{width:@rem*750;margin:0 auto;
    .detail{padding-top:@rem*20;padding-bottom:@rem*32;border-bottom:1px solid #f5f5f5;
        .cell{display:flex;align-items:center;padding:0 @rem*24;
            img{width:@rem*28;height:@rem*28;display:block;margin-right:@rem*12;}
            .text{font-size:@rem*28;color:#000;}
        }
        .cost-detail{padding:@rem*32 @rem*24 0;border-bottom:1px solid #f5f5f5;
            .cell{display:flex;justify-content: space-between;margin-bottom:@rem*32;padding:0;
                .label{font-size:@rem*28;color:#333;}
                .value{font-size:@rem*28;color:#333;}
                .red{color:#ff2828;}
            }
        }
        .x-cell{display:flex;align-items:center;padding:0 @rem*24;margin-top:@rem*32;
            .label{flex:1;
                .title{font-size:@rem*28;color:#000;}
                .value{font-size:@rem*24;color:#999;margin-top:@rem*10;}
            }
            .icon-yuanxingweixuanzhong{font-size:@rem*32;}
            img{width:@rem*36;height:@rem*36;}
        }
    }
    .bg{height:@rem*20;background:#f5f5f5;}
    .apply-info{padding-top:@rem*32;padding-bottom:@rem*32;border-bottom:1px solid #f5f5f5;
        .cell{display:flex;font-size:@rem*28;color:#000;margin-top:@rem*32;padding:0 @rem*24;
            .input{flex:1;display:flex;align-items:center;
                span{display:inline-block;white-space:nowrap;}
                input{border:none;width:100%;color: #959595;font-size: @rem*28;}
                input::-webkit-input-placeholder {color: #959595;font-size: @rem*28;}
            }
        }
    }
    .upload{padding:0 @rem*24;
        .title{height:@rem*80;line-height:@rem*80;font-size:@rem*28;color:#000;}
        .imgs{margin-top:@rem*32;display:flex;
            .img-icon{width:@rem*160;height:@rem*160;margin-right:@rem*20;}
            .img-add{width:@rem*160;height:@rem*160;}
        }

    }
    // .vux-cell-box{padding:0 @rem*24;}
    .empty{height:@rem*100;}
    .btn-bottom{width:@rem*750;height:@rem*88;line-height:@rem*88;background:#fe823f;font-size:@rem*32;color:#fff;text-align:center;position:fixed;bottom:0;left:0;}
    .weui-cell__ft:after{content: " ";display: inline-block;height: 6px;width: 6px;border-width: 2px 2px 0 0;border-color: #C8C8CD;border-style: solid;-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);position: relative;top: -2px;position: absolute;top: 50%;margin-top: -3px;right: 2px;}
}
</style>
