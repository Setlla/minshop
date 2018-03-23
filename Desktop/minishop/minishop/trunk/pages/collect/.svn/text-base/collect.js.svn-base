// pages/collect/collect.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: data.collect,

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
  //取消收藏
  cancelTap:function(e){
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.favorites(userInfo.data.data.user.id, e.currentTarget.dataset.id) + "?type=product",
      method: "delete"
    }).then(data=>{
      getList(that);
    });
  }
})

function getList(that){
  var userInfo = wx.getStorageSync("userInfo");
  var collectList = {
    list: new Array()
  }
  req.send({
    url: req.API.favoritesList(userInfo.data.data.user.id) + "?type=product&pageNum=1&pageSize=6"
  }).then(data => {
    req.errorStatus(data.statusCode);
    util.loop(data.data.data, (item, index) => {
      collectList.list.push({
        id: item.id,
        imgSrc: item.dImage,
        name: util.strlimit(item.pname,28),
        description: item.subName,
        price: item.price
      });
    });
    that.setData({
      collectList: collectList
    })
  });
}