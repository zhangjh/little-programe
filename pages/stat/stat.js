// pages/stat/stat.js
var Charts = require('../../resources/wxcharts-min.js');
var common = require("../common/common.js");

var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var weightChart;
var openId = wx.getStorageSync("openId");
var nickName = wx.getStorageSync("nickName");

Page({

  /**
   * 页面的初始数据
   */

  data: {
    days: [],
    weight: [],
    signedArr: [],
    curYear: year,
    curMonth: month,
    showList: false
  },

  drawSigned: function(res){
    if (this.data.signedArr && this.data.signedArr.length) {
      if (this.data.signedArr.filter(item => { return item != 0 }).length === 0) {
        wx.showModal({
          title: '打卡统计',
          content: '本月还没有打卡记录哦',
        });
        return;
      }
    }

    new Charts({
      canvasId: 'signStat',
      type: 'line',
      categories: this.data.days,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '打卡统计',
        data: this.data.signedArr
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '打卡统计'
      },
      width: res.screenWidth,
      height: 400,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  drawWeight: function (res) {
    if(this.data.weight && this.data.weight.length){
      if(this.data.weight.filter(item => {return item != 0}).length === 0){
        wx.showModal({
          title: '体重趋势',
          content: '本月还没有记录哦',
        });
        return;
      }
    }
    
    //柱状图
    weightChart = new Charts({
      canvasId: 'weightStat',
      type: 'column',
      enableScroll: true,
      categories: this.data.days,
      series: [{
        name: '体重',
        data: this.data.weight
      }],
      yAxis: {
        // format: function (val) {
        //   return val + '万';
        // }
        title: '体重',
        min: 40
      },
      xAxis: {
        disableGrid: true
      },
      width: res.screenWidth,
      height: 400
    });
  },

  touchHandler: e => {
    weightChart.scrollStart(e);
  },

  moveHandler: function (e) {
    weightChart.scroll(e);
  },

  touchEndHandler: function (e) {
    weightChart.scrollEnd(e);
    weightChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  curMonth: function(){
    var curYear = this.data.curYear;
    var curMonth = this.data.curMonth;
    return {
      findPattern: curYear + '-' + curMonth,
      month: curMonth,
      days: common.daysOfMonth(curMonth),
      sysInfo: wx.getSystemInfoSync()
    };
  },

  // 返回上一个月的查询参数，格式为yyyy-MM
  lastMonth: function(){
    var curYear = this.data.curYear;
    var curMonth = this.data.curMonth;
    if(curMonth > 1){
      return {
        findPattern: curYear + '-' + (curMonth - 1),
        year: curYear,
        month: curMonth - 1,
        days: common.daysOfMonth(curMonth - 1),
        sysInfo: wx.getSystemInfoSync()
      };
    }else {
      return {
        findPattern: (curYear - 1) + '-' + 12,
        year: curYear - 1,
        month: 12,
        days: 31,
        sysInfo: wx.getSystemInfoSync()
      };
    }
  },

  getSignedData: function(param){
    var findPattern = param.findPattern;
    var days = param.days;
    var sysInfo = param.sysInfo;
    wx.request({
      url: 'https://zhangjh.me/wx/getSignedBatch',
      data: {
        // openId: wx.getStorageSync("openId"),
        openId: param.openId,
        findPattern: findPattern
      },
      success: ret => {
        var signedArr = Array.apply(null, Array(days)).map(() => 0);
        if (ret.statusCode === 200) {
          var data = ret.data.data;
          data.map(item => {
            var index = parseInt(item.date.split('-').reverse()[0]) - 1;
            signedArr[index] = item.signed;
          });
          this.setData({
            signedArr: signedArr
          }, () => this.drawSigned(sysInfo));
        }
      }
    });
  },

  getWeightData: function(param){
    var findPattern = param.findPattern;
    var month = param.month;
    var days = param.days;
    var sysInfo = param.sysInfo;

    var daysArr = [];
    for (let i = 1; i <= days; i++) {
      daysArr.push(month + '-' + i);
    }
    wx.request({
      url: 'https://zhangjh.me/wx/getWeightBatch',
      data: {
        // openId: wx.getStorageSync("openId"),
        openId: param.openId,
        findPattern: findPattern
      },
      success: ret => {
        // 初始化days长度数组
        var weightArr = Array.apply(null, Array(days)).map(() => 0);
        if (ret.statusCode == 200) {
          var data = ret.data.data;
          data.map(item => {
            var index = parseInt(item.date.split('-').reverse()[0]) - 1;
            weightArr[index] = item.weight;
          });

          this.setData({
            days: daysArr,
            weight: weightArr
          }, () => this.drawWeight(sysInfo));
        }
      }
    });
  },

  drawLastMonth: function(){
    var ret = this.lastMonth();
    this.setData({
      curYear: ret.year,
      curMonth: ret.month
    },() => {
      // 获取上个月体重趋势数据并绘图
      this.getWeightData(this.curMonth());
      // 获取上个月签到数据并绘图
      this.getSignedData(this.curMonth());
    });
  },

  showList: function(){
    this.setData({
      showList: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let openId = options.openId || wx.getStorageSync("openId");
    let param = this.curMonth();
    param.openId = openId;
    // 获取本月体重趋势数据并绘图
    this.getWeightData(param);
    // 获取本月签到数据并绘图
    this.getSignedData(param);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新，重新绘制本月
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.setData({
      curYear: year,
      curMonth: month 
    },() => {
      // 获取本月体重趋势数据并绘图
      let param = this.curMonth();
      let openId = wx.getStorageSync("openId");
      param.openId = openId;
      this.getWeightData(param);
      // 获取本月签到数据并绘图
      this.getSignedData(param);
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(openId);
    return {
      title: nickName + '的统计',
      path: '/pages/stat/stat?openId=' + openId,
      success: res => {
        console.log(res);
      }
    };
  }
})