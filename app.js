//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.checkSession({
    //   success: function(){
    //     // 登录未过期
    //     console.log(wx.getStorageSync("openId"));
    //   },
    //   fail: function(){
    //     // 登录过期，需要重新登录
    //     wx.login({
    //       success: res => {
    //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //         wx.request({
    //           url: "https://zhangjh.me/wx/getOpenId",
    //           data: {
    //             js_code: res.code
    //           },
    //           success: function (ret) {
    //             if (ret.statusCode == 200 && ret.data.status) {
    //               var data = JSON.parse(ret.data.data);
    //               var openId = data.openid;
    //               console.log(openId);
    //               wx.setStorageSync("openId", openId);
    //             }
    //           }
    //         })
    //       }
    //     })
    //   }
    // });

    // wx.login({
    //   success: res => {
    //     wx.request({
    //       url: "https://zhangjh.me/wx/getOpenId",
    //       data: {
    //         js_code: res.code
    //       },
    //       success: function(ret){
    //         if (ret.statusCode == 200 && ret.data.status) {
    //           var data = JSON.parse(ret.data.data);
    //           console.log(data);
    //           var openId = data.openid;
    //           var sessionKey = data.session_key;
    //           console.log(openId);
    //           wx.setStorageSync("openId", openId);
    //           console.log(this.globalData);
    //         }
    //       }
    //     })
    //   }
    // });
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.nickName = res.userInfo.nickName
              

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },
  globalData: {
    userInfo: null,
    nickName: null,
    openId: null
  }
})