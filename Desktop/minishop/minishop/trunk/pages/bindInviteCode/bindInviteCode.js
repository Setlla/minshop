// pages/bindInviteCode/bindInviteCode.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.userDetail(userInfo.data.data.user.id)
    }).then(data=>{
      that.setData({
        value: data.data.data.bindInviteCode
      });
    });
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
  //绑定邀请码
  bindCodeTap:function(e){
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.bindCode(userInfo.data.data.user.id) +"?inviteCode="+that.data.value,
      method:"post"
    }).then(data=>{
      req.errorStatus(data.data.errCode);
      if(data.data.success){
        wx.showModal({
          content: "绑定成功",
          showCancel: false,
          success: data => {
            wx.redirectTo({
              url: "../index/index",
            })
          }
        });
      }
    });
  },
  //邀请码
  inputChange:function(e){
    const that = this;
    that.setData({
      value: e.detail.value
    });
  }
})