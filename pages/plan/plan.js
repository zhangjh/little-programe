// pages/plan/plan.js
// const app = getApp();
var common = require("../common/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    date: '2017-09-14',
    curWeight: "",
    objectWeight: ""
  },

  setCurWeight: function(e){
      var _this = this;
      common.inputCheck(e,() => {
        _this.setData({
          curWeight: ""
        });
      },() => {
        _this.setData({
          curWeight: parseFloat(e.detail.value).toFixed(1)
        });
      });
  },
  
  setObjectWeight: function(e){
    var _this = this;
    common.inputCheck(e,() => {
      _this.setData({
        objectWeight: ""
      });
    },() => {
      this.setData({
        objectWeight: parseFloat(e.detail.value).toFixed(1)
      });
    });
  },

  dateChange: function(e){
    this.setData({
      date: e.detail.value
    });
  },

  getObject: function(cb){
    var _this = this;
    wx.request({
      url: "https://zhangjh.me/wx/getObject",
      data: {
        openId: wx.getStorageSync("openId")
      },
      success: function (ret) {
        if (ret.statusCode === 200) {
          console.log(ret);
          var data = ret.data.data[0];
          if (data) {
            _this.setData({
              curWeight: data.curWeight,
              objectWeight: data.objectWeight,
              date: data.endDate
            },function(){
              if(cb)cb();
            });
          }
        }
      }
    });
  },

  saveObject: function(e){
    var _this = this;
    if(this.data.curWeight != "" && 
      this.data.objectWeight != "" &&
      this.data.date != "2017-09-14"
    ){
      wx.request({
        url: "https://zhangjh.me/wx/saveObject",
        data: {
          openId: wx.getStorageSync("openId"),
          nickName: wx.getStorageSync("nickName"),
          gender: wx.getStorageSync("gender"),
          city: wx.getStorageSync("city"),
          curWeight: _this.data.curWeight,
          objectWeight: _this.data.objectWeight,
          endDate: _this.data.date
        },
        success: function (res) {
          if (res.statusCode === 200) {
            console.log(res);
            wx.showModal({
              title: '目标设定成功',
              content: '请坚持目标每天来打卡哦',
              showCancel: false
            });
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.decrypt();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    common.login(this.getObject);
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
    this.getObject(function(){
      wx.stopPullDownRefresh();
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
  onShareAppMessage: function () {
  
  }
})