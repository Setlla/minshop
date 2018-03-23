// pages/register/register.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: data.register,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  //匹配验证码
  btnTap: function (e) {
    const that = this;
    req.send({
      url: req.API.smsCodeValidate + "?mobile=" + that.data.phone.value + "&smsCode=" + that.data.pwd.value + "&type=register"
    }).then(data => {
      if (data.data.success) {
        wx.navigateTo({
          url: "registerSubmit?phone=" + that.data.phone.value + "&smsCode=" + that.data.pwd.value,
        })
      } else {
        req.errorStatus(data.data.errCode);
      }
    });
  },
  btnRightTap: function () {
    wx.redirectTo({
      url: "../login/login",
    })
  },
  //获取验证码
  validateTap: function (e) {
    const that = this;
    if (that.data.pwd.time!=""){
      return;
    }
    that.data.pwd.time = 60;
    that.setData({
      pwd: that.data.pwd
    });
    const timeCount = setInterval(() => {
      that.data.pwd.time -= 1;
      if (that.data.pwd.time == 0) {
        that.data.pwd.time="";
        clearInterval(timeCount);
      }
      that.setData({
        pwd: that.data.pwd
      });
    }, 1000);
    req.send({
      url: req.API.sendSmsCode + "?mobile=" + that.data.phone.value + "&type=register"
    }).then(data => {
      req.errorStatus(data.data.errCode);
      if (!data.data.success && data.data.errCode == undefined) {
        wx.showModal({
          content: "验证码获取失败，请确认手机号是否输入正确",
          showCancel: false,
          success: data => { }
        });
      }
    });
  },
  inputChange: function (e) {
    const that = this;
    switch (e.currentTarget.id) {
      case "phone":
        that.data.phone.value = e.detail.value;
        that.setData({
          phone: that.data.phone
        });
        break;
      case "pwd":
        that.data.pwd.value = e.detail.value;
        that.setData({
          pwd: that.data.pwd
        });
        break;
      default:
        break;
    }
  }
})