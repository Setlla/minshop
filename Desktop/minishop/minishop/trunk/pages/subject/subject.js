// pages/subject/subject.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: data.subject,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var shopList = {
      list: new Array()
    }
    var subjectList = {
      img: "",
      name: options.title,
      content: ""
    }
    req.send({
      url: req.API.subjectDetail(options.id) + "?pageNum=1&pageSize=10"
    }).then(data => {
      subjectList.img = data.data.data[0].subjectImage;
      subjectList.content = data.data.data[0].subjectRemarks;
      util.loop(data.data.data, function (item, index) {
        shopList.list.push({
          id: item.id,
          imgSrc: item.image,
          name: util.strlimit(item.name, 26),
          description: item.subName,
          price: item.price,
          marketPrice: ""
        });
      });
      that.setData({
        subjectList: subjectList,
        shopList: shopList
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
  goodsDetailTap: function (e) {
    wx.navigateTo({
      url: "../goodsDetail/goodsDetail?id=" + e.currentTarget.dataset.id,
    })
  }
})