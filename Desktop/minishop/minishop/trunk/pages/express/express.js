// pages/express/express.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: data.express,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.orderExpressPackage(userInfo.data.data.user.id, options.orderId) + "?pageNum=1&pageSize=10"
    }).then(data => {
      const expressList = ((expressList) => {
        util.loop(data.data.data,(item,index)=>{
          expressList.list.push({
            id: item.expressNum,
            code: item.expressCode,
            name: util.strlimit(item.name,20)
          });
        });
        return expressList;
      })({
        list:new Array()
      });
      that.setData({
        expressList: expressList
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
  //物流详情
  expressDetailTap: function (e) {
    wx.navigateTo({
      url: "../expressDetail/expressDetail?id=" + e.currentTarget.id + "&code=" + e.currentTarget.dataset.code,
    })
  }
})