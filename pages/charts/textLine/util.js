function formatTime(date, type) {
  if (!date) {
    return '--'
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (type === 'day') {
    return [month, day].map(formatNumber).join('月')
  } else if (type === 'time') {
    return [hour, minute].map(formatNumber).join(':')
  } else {
    return [year, month, day].map(formatNumber).join('-') + '  ' + [hour, minute, second].map(formatNumber).join(':')
  }
}

var formatCoin = {
  ETH: {
    coin: 'ETH',
    value: '以太坊'
  },
  ZEC: {
    coin: 'ZEC',
    value: '零币'
  },
  ETC: {
    coin: 'ETC',
    value: '以太经典'
  },
  SIA: {
    coin: 'SIA',
    value: 'SIA'
  },
  XMR: {
    coin: 'XMR',
    value: '罗门币'
  },
  PASC: {
    coin: 'PASC',
    value: 'PASC'
  },
  BTC: {
    coin: 'BTC',
    value: '比特币'
  },
  CNY: {
    coin: 'CNY',
    value: '人民币'
  }
}

var formatCoinFn = function(key) {
  if (formatCoin[key]) {
    return formatCoin[key]
  } else {
    return {
      coin: key,
      value: key
    }
  }
}

function formatNumber(n) {
  n = n.toString()
  // return n[1] ? n : '0' + n
  return n[1] ? n : n
}

function numberToStringTofixed(n, index) {
  var list = []
  n = n+''

  list = n.split('.')
  if (n.indexOf('.') === -1) {
  return n
  }
  list[1] = list[1].substring(list[1].indexOf('.')+1, index)

  return list[0] + '.'+ list[1]
}

var errorObj = {
  // 1: '登录成功',
  // 2: '没有登录',
  3: '不支持此类操作',
  4: '提供的参数不全',
  5: '未知的错误',
  6: '无效的参数',
  7: '登录失败',
  100: '这个钱包地址已经被别人添加过了',
  101: '这个钱包地址您已经添加过了',
  102: '不要请求太频繁'
}

var formatCard = function(d, coin) {
  if (!d) {
    return [
      {
        left: { text: '临时钱包', value: '--' },
        right: { text: '当前算力', value: '--' }
      },
      {
        left: { text: '6小时平均算力',value: '--' },
        right: { text: '最近一次算力报告', value: '--' },
      }
    ]
  }
  return [
    {
      left: {
        text: '临时钱包',
        value: d.user.balance || d.user.balance === 0 ? numberToStringTofixed(d.user.balance, 7) + ' ' + coin : '--'
      },
      right: {
        text: '当前算力',
        value: d.user.hashrate || d.user.hashrate === 0 ? d.user.hashrate + ' Mh/s' : '--'
      },
    },
    {
      left: {
        text: '6小时平均算力',
        value: d.user.avgHashrate || d.user.avgHashrate === 0 ? numberToStringTofixed(d.user.avgHashrate.h6, 1) + ' Mh/s' : '--'
      },
      right: {
        text: '最近一次算力报告',
        value: d.user.unconfirmed_balance  || d.user.unconfirmed_balance === 0 ? d.user.unconfirmed_balance + ' Mh/s' : '--'
      },
    }
  ]
}


var calculatorData = [
  {
    key: 'minute',
    value: '一分钟'
  },
  {
    key: 'hour',
    value: '一小时'
  },{
    key: 'day',
    value: '一天'
  },{
    key: 'week',
    value: '一周'
  },{
    key: 'month',
    value: '一个月'
  },
]

module.exports = {
  formatTime: formatTime,
  numberToStringTofixed: numberToStringTofixed,
  errorObj: errorObj,
  formatCard: formatCard,
  calculatorData: calculatorData,
  formatCoin: formatCoin,
  formatCoinFn: formatCoinFn
}
