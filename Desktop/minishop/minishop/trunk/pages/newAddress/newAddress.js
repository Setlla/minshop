// pages/newAddress/newAddress.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
const city = require("../../utils/city");
const cityObj = JSON.parse(city.city.data);
var cityRt = cityChange(0);
var rid = null;
var mid = null;
Page({
  /**
   * 页面的初始数据
   */
  data: data.newAddress,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    rid = options.id;
    const that = this;
    if (rid != undefined) {
      var userInfo = wx.getStorageSync("userInfo");
      var inputText = that.data.inputText;
      var cityList = that.data.cityList;
      var addressInfo = {
        name: "",
        phone: "",
        addressId: "",
        addressDetail: ""
      }
      req.send({
        url: req.API.receiver(userInfo.data.data.user.id, options.id)
      }).then(data => {
        inputText.list[0].value = data.data.data.consignee;
        inputText.list[1].value = data.data.data.phone;
        inputText.list[2].value = data.data.data.address;
        cityList.text = data.data.data.provinceName + data.data.data.cityName + data.data.data.areaName;
        mid = data.data.data.memberId;
        addressInfo.name = data.data.data.consignee;
        addressInfo.phone = data.data.data.phone;
        addressInfo.addressId = data.data.data.area;
        addressInfo.addressDetail = data.data.data.address;
        that.setData({
          inputText: inputText,
          cityList: cityList,
          addressInfo: addressInfo
        });
      });
    }
    var cityList = cityRt(0);
    that.setData({
      cityList: cityList
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
    var cityList = cityRt(0);
    var that = this;
    that.setData({
      cityList: cityList
    });
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
  //城市选择
  citySelect: function (e) {
    const that = this;
    var addressInfo = that.data.addressInfo;
    var cityList = that.data.cityList;
    var numList = [e.detail.value[0] == null ? 0 : e.detail.value[0], e.detail.value[1] == null ? 0 : e.detail.value[1], e.detail.value[2] == null ? 0 : e.detail.value[2]];
    addressInfo.addressId = cityList.list[2][numList[2]].id;
    cityList.text = cityList.list[0][numList[0]].name + cityList.list[1][numList[1]].name + cityList.list[2][numList[2]].name;
    cityList.selected[2] = numList[2];
    that.setData({
      addressInfo: addressInfo,
      cityList: cityList
    });
  },
  //地区联动
  cityColChange: function (e) {
    var cityList = null;
    var that = this;
    if (e.detail.column == 0) {
      cityRt = cityChange(e.detail.value);
      cityList = cityRt(0);
    } else if (e.detail.column == 1) {
      cityList = cityRt(e.detail.value);
    } else {
      return;
    }
    that.setData({
      cityList: cityList
    });
  },
  //输入框事件
  inputChange: function (e) {
    const that = this;
    var addressInfo = that.data.addressInfo;
    switch (e.target.id) {
      case "name":
        addressInfo.name = e.detail.value;
        break;
      case "phone":
        addressInfo.phone = e.detail.value;
        break;
      case "address":
        addressInfo.addressDetail = e.detail.value;
        break;
      default:
        break;
    }
    that.setData({
      addressInfo: addressInfo
    });
  },
  //确认
  btnTap: function (e) {
    wx.showLoading({
      title: '请稍候',
    });
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    var addressInfo = that.data.addressInfo;

    if (addressInfo.name == "" || addressInfo.phone == "" || addressInfo.addressId == "" || addressInfo.addressDetail == "") {
      wx.hideLoading();
      wx.showModal({
        content: "请填写完整",
        showCancel: false,
        success: data => { }
      });
      return;
    }

    if (rid != undefined) {
      req.send({
        url: req.API.receiver(userInfo.data.data.user.id, rid),
        header: { "Content-type": "application/x-www-form-urlencoded" },
        method: "put",
        data: {
          consignee: addressInfo.name,
          phone: addressInfo.phone,
          areaId: addressInfo.addressId,
          address: addressInfo.addressDetail,
          memberId: mid,
          isDefault: false
        }
      }).then(data => {
        if (data.data.success) {
          wx.hideLoading();
          wx.navigateBack();
        } else {
          req.errorStatus(data.errCode);
        }
      });
    } else {
      req.send({
        url: req.API.receiver(userInfo.data.data.user.id),
        header: { "Content-type": "application/x-www-form-urlencoded" },
        method: "post",
        data: {
          consignee: addressInfo.name,
          phone: addressInfo.phone,
          areaId: addressInfo.addressId,
          address: addressInfo.addressDetail,
          isDefault: false
        }
      }).then(data => {
        if (data.data.success) {
          wx.hideLoading();
          wx.navigateBack();
        } else {
          req.errorStatus(data.data.errCode);
        }
      });
    }


  }

})

//地区联动
function cityChange(provinceNum) {
  return function (cityNum) {
    var cityList = {
      text: "请选择",
      selected: [provinceNum, cityNum, 0],
      list: [new Array(), new Array(), new Array()]
    }
    util.loop(cityObj, function (item, index) {
      cityList.list[0].push({
        id: item.value,
        name: item.text
      });
    });
    util.loop(cityObj[provinceNum].children, function (item, index) {
      cityList.list[1].push({
        id: item.value,
        name: item.text
      });
    });
    util.loop(cityObj[provinceNum].children[cityNum].children, function (item, index) {
      cityList.list[2].push({
        id: item.value,
        name: item.text
      });
    });
    return cityList;
  }
}