import Vue from 'vue'
import Router from 'vue-router'
import { routerMode } from '@/config/env'

Vue.use(Router)

export default new Router({
    mode: routerMode,
    routes: [
        /** **************************h5商城***************************/
        // 登录模块
        {
            meta: { title: '绑定手机号' },
            path: '/login/bind-phone',
            component: (resovle) => { require(['../views/login/bind-phone.vue'], resovle) }
        },
        {
            meta: { title: '绑定联系人' },
            path: '/login/bind-manager',
            component: (resovle) => { require(['../views/login/bind-manager.vue'], resovle) }
        },
        {
            meta: { title: '联系人列表' },
            path: '/login/manager-list',
            component: (resovle) => { require(['../views/login/manager-list.vue'], resovle) }
        },
        // 首页
        {
            meta: { title: '首页', keepAlive: true },
            path: '/',
            component: (resovle) => { require(['../views/index/index.vue'], resovle) }
        },
        // 首页
        {
            meta: { title: '首页' },
            path: '/index',
            component: (resovle) => { require(['../views/index/index.vue'], resovle) }
        },
        // 首页
        {
            meta: { title: '选择城市' },
            path: '/index/city',
            component: (resovle) => { require(['../views/index/city.vue'], resovle) }
        },
        // 购物车
        {
            meta: { title: '购物车', requireAuth: true },
            path: '/cart/index',
            component: (resovle) => { require(['../views/cart/index.vue'], resovle) }
        },
        // 全部商品
        {
            meta: { title: '全部商品', keepAlive: true },
            path: '/goods/index',
            component: (resovle) => { require(['../views/goods/index.vue'], resovle) }
        },
        // 商品详情
        {
            meta: { title: '商品详情' },
            path: '/goods/info',
            component: (resovle) => { require(['../views/goods/info.vue'], resovle) }
        },
        // 搜索商品
        {
            meta: { title: '商品搜索' },
            path: '/goods/search',
            component: (resovle) => { require(['../views/goods/search.vue'], resovle) }
        },
        /**
         * 抢购
         */
        // 商品详情
        {
            meta: { title: '商品详情' },
            path: '/goods/seckill/info',
            component: (resovle) => { require(['../views/goods/seckill/info.vue'], resovle) }
        },
        // 提交订单
        {
            meta: { title: '订单确认', requireAuth: true },
            path: '/user/order/pay/confirm',
            component: (resovle) => { require(['../views/user/order/pay/confirm.vue'], resovle) }
        },
        // 支付宝提示页面
        {
            meta: { title: '支付宝支付' },
            path: '/user/order/pay/alipay',
            component: (resovle) => { require(['../views/user/order/pay/alipay.vue'], resovle) }
        },
        // 支付宝提示页面
        {
            meta: { title: '到店付' },
            path: '/user/order/pay/shop',
            component: (resovle) => { require(['../views/user/order/pay/shop.vue'], resovle) }
        },
        // 支付宝交易详情
        {
            meta: { title: '交易详情' },
            path: '/user/order/pay/alipay-order',
            component: (resovle) => { require(['../views/user/order/pay/alipay-order.vue'], resovle) }
        },
        // 我的
        {
            meta: { title: '我的', requireAuth: true },
            path: '/user/index',
            component: (resovle) => { require(['../views/user/index/index.vue'], resovle) }
        },
        {
            meta: { title: '个人信息', requireAuth: true },
            path: '/user/set/index',
            component: (resovle) => { require(['../views/user/set/index.vue'], resovle) }
        },
        {
            meta: { title: '到店付款', requireAuth: true },
            path: '/user/consumption/index',
            component: (resovle) => { require(['../views/user/consumption/index.vue'], resovle) }
        },
        {
            meta: { title: '收货地址', requireAuth: true },
            path: '/user/address/index',
            component: (resovle) => { require(['../views/user/address/index.vue'], resovle) }
        },
        {
            meta: { title: '编辑地址', requireAuth: true },
            path: '/user/address/add',
            component: (resovle) => { require(['../views/user/address/add.vue'], resovle) }
        },
        {
            meta: { title: '订单列表', requireAuth: true },
            path: '/user/order/index',
            component: (resovle) => { require(['../views/user/order/index.vue'], resovle) }
        },
        {
            meta: { title: '订单详情', requireAuth: true },
            path: '/user/order/info',
            component: (resovle) => { require(['../views/user/order/info.vue'], resovle) }
        },
        {
            meta: { title: '结算中心', requireAuth: true },
            path: '/user/order/pay/index',
            component: (resovle) => { require(['../views/user/order/pay/pay.vue'], resovle) }
        },
        {
            meta: { title: '支付成功' },
            path: '/user/order/success',
            component: (resovle) => { require(['../views/user/order/success.vue'], resovle) }
        },
        {
            meta: { title: '退款列表', requireAuth: true },
            path: '/user/after-sales/index',
            component: (resovle) => { require(['../views/user/after-sales/index.vue'], resovle) }
        },
        {
            meta: { title: '申请退款', requireAuth: true },
            path: '/user/after-sales/apply',
            component: (resovle) => { require(['../views/user/after-sales/apply.vue'], resovle) }
        },
        {
            meta: { title: '退款详情', requireAuth: true },
            path: '/user/after-sales/info',
            component: (resovle) => { require(['../views/user/after-sales/info.vue'], resovle) }
        },
        {
            meta: { title: '我的优惠券' },
            path: '/user/coupon/index',
            component: (resovle) => { require(['../views/user/coupon/index.vue'], resovle) }
        },
        {
            meta: { title: '优惠券选择' },
            path: '/user/coupon/pick',
            component: (resovle) => { require(['../views/user/coupon/pick.vue'], resovle) }
        },
        /**
         * 单页
         */
        // 待开发中
        {
            meta: { title: '待开发中' },
            path: '/single/system/developing',
            component: (resovle) => { require(['../views/single/system/developing'], resovle) }
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})
