// pages/sign/sign.js
// const app = getApp();
var common = require("../common/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    nickName: "",
    signIcon: "/pages/../resources/sign.png",
    signedIcon: "/pages/../resources/signSucc.png",
    iconSrc: "/pages/../resources/sign.png",
    signed: false
  },

  getCurDate: function(){
    var time = new Date();
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  },

  sign: function(){
    var _this = this;
    wx.showToast({
      title: _this.data.signed ? "取消打卡" : '打卡成功',
      icon: 'success',
      duration: 1000,
      mask: true,
      complete: () => {
        this.setData({
          signed: !this.data.signed,
          iconSrc: this.data.signed ? this.data.signIcon : this.data.signedIcon
        });
        
        // 数据持久化
        wx.request({
          url: "https://favlink.cn/wx/sign",
          data: {
            openId: wx.getStorageSync("openId"),
            date: this.getCurDate(),
            signed: this.data.signed ? 1 : 0
          },
          success: (ret) => {
            if(ret.statusCode !== 200 || (ret.statusCode == 200 && !ret.data.status)){
              // TODO：失败
            }
          }
        })
      }
    });
  },

  // 判断当天是否已经打卡
  getSigned: function(cb){
    var _this = this;
    var time = new Date();
    wx.request({
      url: "https://favlink.cn/wx/signed",
      data: {
        openId: wx.getStorageSync("openId"),
        date: _this.getCurDate()
      },
      success: function (ret) {
        if (ret.statusCode === 200) {
          var data = ret.data.data;
          if (data && data[0] && data[0].signed === 1) {
            _this.setData({
              signed: true,
              iconSrc: "/pages/../resources/signSucc.png"
            },function(){
              if (cb) {
                cb();
              }
            });
          }
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    common.login(this.getSigned);
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
    var _this = this;
    this.getSigned(function(){
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