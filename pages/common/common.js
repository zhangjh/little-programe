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

var inputCheck = function (e, cbFail,cbSucc) {
  // 不允许输入非数字
  if (!/^[\d\.]+$/.test(e.detail.value)) {
    wx.showToast({
      title: '请输入数字',
      duration: 1000,
      mask: true,
      image: '/resources/fail.png',
      success: cbFail()
    });
    return;
  }else {
    cbSucc();
  }
};

// 是否闰年
var isLeapYear = (year) => {
  return ((year % 400 !== 0) && (year % 4 === 0)) || (year % 400 === 0);
};

var daysOfMonth = (month, year) => {
  switch (month) {
    case 1, 3, 5, 7, 8, 10, 12:
      return 31;
      break;
    case 2:
      return isLeapYear(year) ? 29 : 28;
    default:
      return 30;
      break;
  }
};

var statUsers = function(){
  // 记录用户信息
  wx.request({
    url: "https://favlink.cn/wx/statUsers",
    data: {
      openId: wx.getStorageSync("openId"),
      nickName: wx.getStorageSync("nickName"),
      city: wx.getStorageSync("city"),
      gender: wx.getStorageSync("gender"),
      province: wx.getStorageSync("province"),
      avatarUrl: wx.getStorageSync("avatarUrl")
    },
    success: ret => {
      if (ret.statusCode == 200) {

      }
    }
  });
};

module.exports = {
  login,
  decrypt,
  inputCheck,
  isLeapYear,
  daysOfMonth,
  statUsers
};