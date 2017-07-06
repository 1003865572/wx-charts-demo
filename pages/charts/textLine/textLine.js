
var coinConfig = [
  {
    key: 'ETH',
    shearBrse: 8.5
  },
  {
    key: 'ZEC',
    shearBrse: 5.640000350988031
  },
  {
    key: 'ETC',
    shearBrse: 8.5
  },
  {
    key: 'SIA',
    shearBrse: 86
  },
  {
    key: 'XMR',
    shearBrse: 52.5
  },
  {
    key: 'PASC',
    shearBrse: 5.639996137504828
  }
]

var wxCharts = require('../../../utils/wxcharts.js');
var util = require('./util')
var data = require('./data')
console.info(data)
var resultData = {
  date: [],
  hashrate: [],
  shares: [],
  calculatedHashrate: [],
}

function initData(val) {
  // 初始化数据源
  var maxLength = 19;
  var minLength = 7;
  var accumulationIndex = 0
  var accumulationObj = {
    hashrate: 0,
    shares: 0,
    calculatedHashrate: 0,
  }
  // 累加
    /*
      accumulationObj.hashrate
      accumulationObj.shares
      accumulationObj.calculatedHashrate
      每次++ push 清零
    */

  data.default.data.map(function(item, i) {
    // 处理 all
    if (val.name === 'all') {
      console.info(data.default.data.length / 19)
      accumulationIndex++
      accumulationObj.calculatedHashrate = coinConfig[0].shearBrse * item.shares;
      accumulationObj.hashrate = item.hashrate / 1000;
      accumulationObj.shares += item.shares

      if (accumulationIndex >= data.default.data.length / 19) {
        if (resultData.date.length%2 === 0) {
          item.date = util.formatTime(new Date(item.date * 1000), 'time');
        } else {
          item.date = util.formatTime(new Date(item.date * 1000), 'day');
        }
        accumulationIndex = 0;
        resultData.date.push(item.date);
        resultData.hashrate.push(accumulationObj.hashrate);
        resultData.shares.push(accumulationObj.shares);
        resultData.calculatedHashrate.push(accumulationObj.calculatedHashrate);
        accumulationObj = {
          hashrate: 0,
          shares: 0,
          calculatedHashrate: 0
        }
      }

      // 处理 一天 或者 6小时
    } else if (val.name === '6h' ||  val.name === '1d') {
      accumulationObj.calculatedHashrate += coinConfig[0].shearBrse * item.shares;
      accumulationIndex++;
      accumulationObj.hashrate += item.hashrate / 1000;
      accumulationObj.shares += item.shares
      // 2 6H
      // 8 1D
      if (accumulationIndex === val.num) {
        if (resultData.date.length%2 === 0) {
          item.date = util.formatTime(new Date(item.date * 1000), 'time');
        } else {
          item.date = util.formatTime(new Date(item.date * 1000), 'day');
        }
        accumulationIndex = 0;
        resultData.date.push(item.date);
        resultData.hashrate.push(accumulationObj.hashrate);
        resultData.shares.push(accumulationObj.shares);
        resultData.calculatedHashrate.push(accumulationObj.calculatedHashrate);
        accumulationObj = {
          hashrate: 0,
          shares: 0,
          calculatedHashrate: 0
        }
      }

    } else {
      item.calculatedHashrate = coinConfig[0].shearBrse * item.shares;
      if (i%2 === 0) {
        item.date = util.formatTime(new Date(item.date * 1000), 'time');
      }else {
        item.date = util.formatTime(new Date(item.date * 1000), 'day');
      }
      item.hashrate = item.hashrate / 1000;

      resultData.date.push(item.date);
      resultData.hashrate.push(item.hashrate);
      resultData.shares.push(item.shares);
      resultData.calculatedHashrate.push(item.calculatedHashrate);
    }
    return null;
  })
  console.info(resultData)
}

initData({
  name: 'all',
  value: 'all'
})

var lineChart = null;
var columnChart = null;

Page({
  data: {
    arrayScale: {
      index: 0,
      length: 19
    },
    condition: [
      {
        name: '1h',
        value: 7
      },
      {
        name: '3h',
        value: 19
      },
      {
        name: '6h',
        value: 37,
        num: 2
      },
      {
        name: '1d',
        value: 145,
        num: 8
      },
      {
        name: 'all',
        value: 'all'
      }
    ],
    touch: null,
    result: {
      date: [],
      hashrate: [],
      shares: [],
      calculatedHashrate: [],
    }
  },
  moveData: function(e) {
    // 判断加减 或者缩放
    // 存储结果
    // 获取数据源
    // 更新图表
    var that = this
    const { arrayScale, touch } = this.data
    // 判断加减
    if (e.touches[0].x % 2 !== 0) {
      return null
    }
    if (touch.length === 1) {
      // 拖动
        //如果左向右++ （index 最大值为  resultData.data.length - arrayScale.length ）
        //如果从右向左-- (index 最小值为 0 )
      if (touch[0].x < e.touches[0].x) {
        arrayScale.index = arrayScale.index-1 >= 0 ? arrayScale.index-1 : 0
      } else {
        arrayScale.index++
        arrayScale.index = arrayScale.index
      }
      // 向右
      this.setData({
        arrayScale: arrayScale,
        touch: e.touches
      })
      that.updateData()
    } else {
      // 缩放
    }
  },
  getData: function(resultData) {
    const { arrayScale, result } = this.data
    Object.keys(resultData).map(function(item, i) {
      result[item] = resultData[item].slice(arrayScale.index, arrayScale.index + arrayScale.length)
      return null
    })
    this.setData({
      result: result
    })
    return result
  },
  updateData: function() {
    var result = this.getData(resultData)
    var categories = result.date
    var columnChartService = [{
        name: '份额',
        data: result.shares
    }]
    var lineChartSeries = [
      {
        name: '报告算力',
        data: result.hashrate,
        format: function (val, name) {
            return val.toFixed(2) + 'Mh/s';
        },
      },
      {
        name: '有效算力',
        data: result.calculatedHashrate,
        format: function (val, name) {
            return val.toFixed(2) + 'Mh/s';
        }
      }
    ]

    lineChart.updateData({
      categories: categories,
      series: lineChartSeries
    })
    columnChart.updateData({
      categories: categories,
      series: columnChartService
    })
  },
  changeCondition: function(e) {
    console.info(e)
  },
  touchMove: function(e) {
    this.moveData(e)
  },
  touchHandler: function(e) {
    this.setData({
      touch: e.touches
    })
    lineChart.showToolTip(e);
  },
  onLoad: function(e) {
    var result = this.getData(resultData)
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!')
    }
    // 算力图
    lineChart = new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: result.date,
        animation: false,
        series: [
          {
            name: '报告算力',
            data: result.hashrate,
            format: function (val, name) {
                return val.toFixed(2) + 'Mh/s';
            },
          },
          {
            name: '有效算力',
            data: result.calculatedHashrate,
            format: function (val, name) {
                return val.toFixed(2) + 'Mh/s';
            }
          }
        ],
        xAxis: {
            disableGrid: true,
            disabled: false
        },
        yAxis: {
            format: function (val) {
                return val.toFixed(2);
            },
            disabled: true
        },
        width: windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: false,
        extra: {
            lineStyle: 'curve'
        }
    });

    // 份额
    columnChart = new wxCharts({
      canvasId: 'columnChart',
      type: 'column',
      animation: false,
      categories: result.date,
      series: [{
          name: '份额',
          data: result.shares
      }],
      xAxis: {
          disableGrid: true,
          type: 'calibration',
      },
      yAxis: {
        disabled: true
      },
      extra: {
          column: {
              width: 15
          }
      },
      width: windowWidth,
      legend: true,
      dataLabel: true,
      height: 100
    })

  }
})
