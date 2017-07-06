
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
var result = {
  date: [],
  hashrate: [],
  shares: [],
  calculatedHashrate: [],
}

data.default.data.map(function(item, i) {
  // 2-hour SMA
  item.calculatedHashrate = coinConfig[0].shearBrse * item.shares
  item.date = util.formatTime(new Date(item.date * 1000), 'time')
  item.hashrate = item.hashrate / 1000

  result.date.push(item.date)
  result.hashrate.push(item.hashrate)
  result.shares.push(item.shares)
  result.calculatedHashrate.push(item.calculatedHashrate)
  return null
})

result.date.length = 10
result.hashrate.length = 10
result.shares.length = 10
result.calculatedHashrate.length = 10

console.info(result)

var lineChart = null;
var columnChart = null;

Page({
  data: {},
  touchHandler: function(e) {
    lineChart.showToolTip(e, {
        background: '#000000'
    });
  },
  createSimulationData: function() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
        categories.push(i + 1);
        data.push(Math.random()*(20-10)+10);
    }
    return {
        categories: categories,
        data: data
    }
  },
  scanCode: function() {
    wx.scanCode({
      success: function(e) {
        console.info(e)
      }
    })
  },
  onReady: function() {

  },
  onLoad: function(e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!')
    }
    var simulationData = this.createSimulationData();
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
            disableGrid: true
        },
        yAxis: {
            format: function (val) {
                return val.toFixed(2);
            },
            disabled: false
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
          disableGrid: false,
          type: 'calibration'
      },
      extra: {
          column: {
              width: 15
          }
      },
      width: windowWidth,
      legend: false,
      dataLabel: true,
      height: 200
    })



  }
})
