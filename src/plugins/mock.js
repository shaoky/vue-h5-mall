import Mock from 'mockjs'
import {
    shopListTitle,
    shopTypeList
} from './mockData'

// 注册随机数
const Random = Mock.Random
Random.first()
Random.image()
/**
 * 首页数据
 */
Random.ctitle()
Random.date()
Mock.mock('/mock/index', {
    code: 200,
    'data|20': {
        order: {
            'payment|1-50': 1,
            'shipping|1-50': 1,
            'dispose|1-50': 1,
            'inventory|1-50': 1
        },
        'announcement|10': [{
            'id|+1': 1,
            'title': '@ctitle()',
            'date': '@date()'
        }],
        'guide|10': [{
            'id|+1': 1,
            'title': '@ctitle()',
            'date': '@date()'
        }],
        'problems|10': [{
            'id|+1': 1,
            'title': '@ctitle()',
            'date': '@date()'
        }]
    }
})

/**
 * 新闻列表
 */
Random.ctitle()
Random.date()
Mock.mock('/mock/article/list', {
    'data|20': [{
        'id|+1': 1,
        'title': '@ctitle()',
        'date': '@date()'
    }]
})

/**
 * 新闻详情
 */
Random.cparagraph()
Mock.mock('/mock/article/info', {
    'data': {
        'content': '@cparagraph()'
    }
})

/**
 * 商品类别
 */
Mock.mock('/mock/shop/type', {
    'data|8': [{
        'id|+1': 1,
        'label|+1': shopTypeList,
        'value|+1': 1
    }]
})

/**
 * 商品列表
 */
Mock.mock('/mock/shop/list', {
    'data|20': [{
        'id|+1': 1,
        'date|1': '@date()',
        'image|1': Random.dataImage(),
        'title|1': shopListTitle,
        'subtitle|1': shopListTitle,
        'brand|1': shopListTitle,
        'status|1': [0, 1]
    }]
})

/**
 * 供应订单列表
 */
Random.natural()
Mock.mock('/mock/order/supply-list', {
    'data|20': [{
        'id|+1': 1,
        'date': '@date()',
        'orderNumber': '@natural()'
    }]
})

/**
 * 设置-日志
 */
Random.natural()
Mock.mock('/mock/setting/logs', {
    'data|20': [{
        'id|+1': 1,
        'userName': '@first()',
        'date': '@date("yyyy-yy-yy MM:dd:ss")'
    }]
})
