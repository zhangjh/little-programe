var login2saveInfo = function(cb){
  wx.login({
    success: res => {
      wx.request({
        url: "https://favlink.cn/wx/getOpenId",
        data: {
          js_code: res.code
        },
        success: (ret) => {
          if (ret.statusCode == 200 && ret.data.status) {
            var data = JSON.parse(ret.data.data);
            var openId = data.openid;
            var sessionKey = data.session_key;
            wx.setStorageSync("openId", openId);
            wx.setStorageSync("sessionKey", sessionKey);
            wx.getUserInfo({
              success: res => {
                wx.setStorageSync("nickName", res.userInfo.nickName);
                wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl);
                wx.setStorageSync("city", res.userInfo.city);
                wx.setStorageSync("gender", res.userInfo.gender);
                wx.setStorageSync("province", res.userInfo.province);
                wx.setStorageSync("iv", res.iv);
                wx.setStorageSync("encryptedData", res.encryptedData);
                if(cb)cb();
              }
            });
          }
        }
      })
    }
  });
};

var login = function(cb) {
  wx.checkSession({
    success: () => {
      // 登录未过期
      if(!wx.getStorageSync("openId")){
        login2saveInfo();
      }
      if (cb) cb();
    },
    fail: () => {
      // 重新登录
      login2saveInfo(cb);
    }
  });
};

var decrypt = function(){
  wx.request({
    url: "https://favlink.cn/wx/decrypt",
    data: {
      sessionKey: wx.getStorageSync("sessionKey"),
      iv: wx.getStorageSync("iv"),
      encryptedData: wx.getStorageSync("encryptedData"),
    },
    success: res => {
      console.log(res);
    }
  });
};

module.exports = {
  login,
  decrypt
};