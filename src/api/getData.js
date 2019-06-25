import axios from '../config/axios'

/** *************** h5商城*******************/

/*
 *****公共模块
*/

// 获取地区
export const getRegion = (data) => axios('common/region/all', {data})

// 获取城市
export const getRegionCityList = (data) => axios('common/region/city', {data})

// 微信签名
export const getSignature = (data) => axios('h5/wechat/signature', {data})

// 分享内容
export const getShareInfo = (data) => axios('h5/index/share', {data})
/*
 *****登录模块
*/

// 获取验证码
export const getH5Code = (data) => axios('common/sms', {data})

// 用户登录
export const login = (data) => axios('h5/login', {data})

// 自动登录
export const autoLogin = (data) => axios('h5/autoLogin', {data})

// 绑定推荐人
export const bindManager = (data) => axios('h5/register', {data})

// 推荐人列表
export const managerList = (data) => axios('h5/referee/list', {data})

// 推荐人详情
export const managerInfo = (data) => axios('h5/referee/info', {data})

/*
 *****首页模块
*/

// 广告轮播图
// export const getBanner = (data) => axios('h5/index/data', {data})

// 热门商品
// export const getHotGoods = (data) => axios('h5/index/goods', {data})
// 首页数据
export const getIndexData = (data) => axios('h5/index/data', {data})

// 获取店铺信息
export const getStore = (data) => axios('h5/index/store', {data})

/*
 *****商品模块
*/

// 全部商品列表 (销量升降，价格升降)
export const getGoodsList = (data) => axios('h5/goods/list', {data})

// 搜索列表

export const getGoodsSearchList = (data) => axios('app/goods/search/list', {data})

// 喜欢
export const getGoodsLikeList = (data) => axios('app/goods/like/list', {data})

// 成为会员商品列表
export const getGoodsMemberList = (data) => axios('h5/goods/member/list', {data})

// 获取合集
export const getCompilation = (data) => axios('app/goods/series/list', {data})

// 商品详情
export const getGoodsInfo = (data) => axios('h5/goods/info', {data})

// 添加到购物车
export const addToCart = (data) => axios('h5/cart/add', {data})

/*
 *****购物车模块
*/

// 购物车列表
export const getCartList = (data) => axios('h5/cart/list', {data})

// 购物车结算验证
export const validateCart = (data) => axios('h5/order/cartValidate', {data})

// 购物车更新
export const updateCart = (data) => axios('h5/cart/update', {data})

// 购物车删除
export const delCart = (data) => axios('h5/cart/delete', {data})

/*
 *****订单模块
*/

// 购物车订单预览
export const previewOrder = (data) => axios('h5/order/cartPreview', {data})

// 商品订单预览
export const previewMemberOrder = (data) => axios('h5/order/goodsPreview', {data})

// 获取默认地址
export const getDefaultAddress = (data) => axios('h5/user/address/default/get', {data})

// 订单提交
export const confirmOrder = (data) => axios('h5/order/add', {data})

/*
 *****地址模块
*/

// 获取地址列表
export const getAddressList = (data) => axios('h5/user/address/list', {data})

// 添加地址
export const addAddress = (data) => axios('h5/user/address/add', {data})

// 获取地址详情
export const getAddressInfo = (data) => axios('h5/user/address/info', {data})

// 编辑地址
export const editAddress = (data) => axios('h5/user/address/update', {data})

// 删除地址
export const delAddress = (data) => axios('h5/user/address/delete', {data})

/*
 *****我的模块
*/

// 获取用户信息
export const getUserInfo = (data) => axios('h5/user/info', {data})

// 更改用户信息
export const editUserInfo = (data) => axios('h5/user/update', {data})

// 订单列表
export const getOrderList = (data) => axios('h5/order/list', {data})

// 取消订单
export const cancelOrder = (data) => axios('h5/order/cancel', {data})

// 删除订单
export const delOrder = (data) => axios('h5/order/delete', {data})

// 确认收货
export const sureOrder = (data) => axios('h5/order/confirm', {data})

// 订单支付
export const pay = (data) => axios('h5/order/pay', {data})

// 订单结算
export const settlement = (data) => axios('h5/wxpay/settlement', {data})
export const shopSettlement = (data) => axios('h5/wxpay/shopSettlement', {data})

// 订单详情
export const getOrderInfo = (data) => axios('h5/order/info', {data})

// 申请退款列表
export const getApplyList = (data) => axios('h5/order/refund/list', {data})

// 申请退款
export const apply = (data) => axios('h5/order/refund/add', {data})

// 退款详情
export const getApplyInfo = (data) => axios('h5/order/refund/info', {data})

// 支付宝支付
export const Alipay = (data) => axios('common/alipay/payUrlAlipay', {data})

// 我的优惠券
export const getMyCoupon = (data) => axios('app/coupon/selfcoupon', {data})

// 兑换码兑换
export const getCoupon = (data) => axios('app/coupon/exchange', {data})

// 可使用的优惠券
export const getCanUserCoupon = (data) => axios('app/coupon/usableCoupon', {data})
