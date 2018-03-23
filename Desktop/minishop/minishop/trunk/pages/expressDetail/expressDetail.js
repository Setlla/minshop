// pages/expressDetail/expressDetail.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: "",
    name: "",
    list: new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    req.send({
      url: req.API.orderExpress + "?type=" + options.code + "&number=" + options.id
    }).then(data => {
      const dataObj = JSON.parse(data.data.data);
      that.data.num = dataObj.result.number;
      that.data.name = getExpName(dataObj.result.type);
      that.data.list = dataObj.result.list;
      that.setData({
        num: that.data.num,
        name: that.data.name,
        list: that.data.list
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

  }
})

function getExpName(data) {

  var name = {
    "ANE": "安能",
    "CHINAPOST": "邮政包裹",
    "DAYU": "大宇物流",
    "DEPPON": "德邦",
    "EMS": "邮政EMS",
    "ETD": "易通达",
    "FASTEXPRESS": "快捷",
    "FTD": "富腾达",
    "GTO": "国通",
    "HGWL": "弘广物流",
    "HNYX": "湖南云翔物流",
    "HTKY": "汇通",
    "JIAJI": "佳吉",
    "QFKD": "全峰",
    "SFEXPRESS": "顺丰快递",
    "STO": "申通快递",
    "SURE": "速尔",
    "TTKDEX": "天天",
    "YTO": "圆通快递",
    "YUANXUN": "长沙远顺",
    "YUNDA": "韵达快递",
    "YXWL": "河南永信物流",
    "ZTO": "中通"
  }

  return name[data.toUpperCase()] ? name[data.toUpperCase()] : data;
}