// pages/walletDetail/walletDetail.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");
const pageNum = ((num) => {
  return (rest) => {
    if (rest != undefined) {
      num = 0;
    } else {
      num++;
    }
    return num
  }
})(1);
Page({

  /**
   * 页面的初始数据
   */
  data: data.walletDetail,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.walletDetail(userInfo.data.data.user.id) + "?pageNum=1&pageSize=20"
    }).then(data => {
      getList(data, that);
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
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.walletDetail(userInfo.data.data.user.id) + "?pageNum=" + pageNum()+"&pageSize=20"
    }).then(data => {
      getList(data, that, that.data.walletList);
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function getList(data, that, list) {
  const userInfo = wx.getStorageSync("userInfo");
  const walletList = ((walletList = { list: new Array() }) => {
    util.loop(data.data.data, (item, index) => {
      walletList.list.push({
        status: item.type == 10 ? "in" : "out",
        price: item.money,
        orderNo: item.orderSn,
        time: util.formatTime(new Date(item.time))
      });
    });
    return walletList;
  })(list);
  that.setData({
    walletList: walletList
  });
}