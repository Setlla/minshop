// pages/address/address.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: data.address,

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
    var that = this;
    getList(that);
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
  //设置默认
  checkBoxTap: function (e) {
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    var addressInfo = that.data.addressInfo;
    util.loop(addressInfo.list, (item, index) => {
      if (e.currentTarget.dataset.id == item.id) {
        item.isChecked = true;
        req.send({
          url: req.API.receiverDefault(userInfo.data.data.user.id, item.id),
          method: "post"
        }).then(function (data) {
          if (data.data.success) { }
        });
      } else {
        item.isChecked = false;
      }
    });
    that.setData({
      addressInfo: addressInfo
    });
  },
  //删除地址
  deleteTap: function (e) {
    const that = this;
    if (e.currentTarget.dataset.checked) {
      wx.showModal({
        content: "不能删除默认地址",
        showCancel: false,
        success: data => { }
      });
    } else {
      wx.showModal({
        content: "是否确认删除？",
        success: data => {
          if (data.confirm) {
            var userInfo = wx.getStorageSync("userInfo");
            req.send({
              url: req.API.receiver(userInfo.data.data.user.id, e.currentTarget.dataset.id),
              method: "delete"
            }).then(data => {
              if (data.data.success) {
                getList(that);
              }
            });
          }
        }
      });
    }
  }
})

//获取地址列表
function getList(that) {
  var userInfo = wx.getStorageSync("userInfo");
  req.send({
    url: req.API.receiver(userInfo.data.data.user.id) + "?pageNum=1&pageSize=6"
  }).then(data => {
    req.errorStatus(data.statusCode);
    var addressInfo = {
      list: new Array()
    };
    util.loop(data.data.data, (item, index) => {
      addressInfo.list.push({
        id: item.id,
        name: item.consignee,
        phone: item.phone,
        address: item.cityName + item.areaName + item.address,
        isChecked: item.isDefault
      });
    });
    that.setData({
      addressInfo: addressInfo
    });
  });
}