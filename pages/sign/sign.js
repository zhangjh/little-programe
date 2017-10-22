// pages/sign/sign.js
// const app = getApp();
var common = require("../common/common.js");

// const date = new Date();
// const years = [];
// const months = [];
// const days = [];
// const today = [];

// (function(){
//   for(let i=2017;i<=date.getFullYear();i++){
//     years.push(i);
//   }

//   for(let i=1;i<=12;i++){
//     months.push(i);
//   }

//   for(let i=1;i<=31;i++){
//     days.push(i);
//   }

//   let year = date.getFullYear();
//   let month = date.getMonth() + 1;
//   let day = date.getDate();
//   today.push(year - 1);          // 下标从0开始
//   today.push(month - 1);
//   today.push(day - 1);
// })();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    nickName: "",
    signIcon: "/resources/sign.png",
    signedIcon: "/resources/signed.png",
    iconSrc: "/resources/sign.png",
    signed: false,
    weight: null
    // value: [2017,0,0],
    // years: years,
    // months: months,
    // days: days,
    // isTodaySigned: false,
    // iconType: 'cancel'
  },

  getCurDate: function(){
    var time = new Date();
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  },

  sign: function(){
    wx.showToast({
      title: this.data.signed ? "取消打卡" : '打卡成功',
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
    var time = new Date();
    wx.request({
      url: "https://favlink.cn/wx/isSigned",
      data: {
        openId: wx.getStorageSync("openId"),
        date: this.getCurDate()
      },
      success: (ret) => {
        if (ret.statusCode === 200) {
          var data = ret.data.data;
          if (data) {
            this.setData({
              signed: true,
              iconSrc: this.data.signedIcon
            },function(){
              if (cb) {
                cb();
              }
            });
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败，请稍后重试',
          duration: 1000,
          mask: true
        })
      }
    });
  },

  // bindChange: function(e){
  //   const val = e.detail.value;
  //   var date = this.data.years[val[0]] + '-' + this.data.months[val[1]] + '-' + this.data.days[val[2]];
  //   this.setData({
  //     year: this.data.years[val[0]],
  //     month: this.data.months[val[1]],
  //     day: this.data.days[val[2]]
  //   });
  //   wx.request({
  //     url: 'https://favlink.cn/wx/isSigned',
  //     data: {
  //       openId: wx.getStorageSync("openId"),
  //       date: date
  //     },
  //     success: (ret) => {
  //       if(ret.statusCode == 200){
  //         this.setData({
  //           isTodaySigned: ret.data.data,
  //           iconType: ret.data.data ? 'success' : 'cancel'
  //         });
  //       }
  //     }
  //   });
  // },

  // x,y,width,height
  // drawOnePoint: function(ctx,x,y,w,h,color){
  //   ctx.setFillStyle(color);
  //   var step = Math.floor(152 / 3);
  //   for(var i=0;i<3;i++){
  //     // ctx.fillRect(x, y + step * i, w, h);
  //     ctx.strokeRect(x,y+step*i,w,h);
  //     ctx.setStrokeStyle(color);
  //     ctx.fillText("10-17",x, y + step * i+15);
  //   }
  // },

  setTodayWeight: function(e){
    var _this = this;
    common.inputCheck(e,() => {
      _this.setData({
        weight: null
      });
    },() => {
      _this.setData({
        weight: e.detail.value
      });
    });
  },

  saveTodayWeight: function(e){
    if(this.data.weight){
      wx.request({
        url: 'https://favlink.cn/wx/saveTodayWeight',
        data: {
          openId: wx.getStorageSync("openId"),
          date: this.getCurDate(),
          weight: this.data.weight
        },
        success: ret => {
          if (ret.statusCode == 200) {
            wx.showToast({
              title: '保存成功',
              duration: 1000,
              mask: true,
              image: '/resources/succ.png'
            })
          } else {
            wx.showToast({
              title: '保存失败',
              duration: 1000,
              mask: true,
              image: '/resources/fail.png'
            })
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var colorDark = "#ebedf0";
    // var colorLight = "#c6e48b";
    // const ctx = wx.createCanvasContext('myCanvas')

    // var canvasW = wx.getSystemInfoSync().screenWidth * 0.9;    

    // var x = 10;
    // var step = Math.floor(canvasW / 10);
    // for(var i=0;i<31;i++){
    //   if(i % 10 == 0){
    //     x = 10;
    //   }else {
    //     x += step;
    //   }
    //   this.drawOnePoint(ctx, x, 10, 30, 30, colorLight);
    // }

    // ctx.draw();
    // this.drawOnePoint(ctx,20,10,10,10,'red');
    common.statUsers();
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