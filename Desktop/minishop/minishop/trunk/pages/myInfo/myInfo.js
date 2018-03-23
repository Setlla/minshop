const dataModel = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");

// pages/myInfo/myInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: dataModel.myInfo,

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
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.userDetail(userInfo.data.data.user.id)
    }).then(data => {
      req.errorStatus(data.statusCode);
      const user = {
        userPictrue: data.data.data.userPhoto == "" ? "../../images/userDefault.png" : data.data.data.userPhoto,
        nickName: data.data.data.nickName,
        isVip: data.data.data.isFromMciro == "0" ? false : true,
        sex: data.data.data.sex == 0 ? "女" : "男"
      }
      that.setData({
        user: user
      });
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
  //退出登录
  btnTap: function (e) {
    wx.removeStorageSync("userInfo");
    wx.navigateBack();
  },
  //修改密码、绑定邀请码
  detailMenuTap: function (e) {
    if (e.currentTarget.id == "pwd") {
      wx.navigateTo({
        url: "../findPwd/findPwd?reset=1",
      });
    } else {
      wx.navigateTo({
        url: "../bindInviteCode/bindInviteCode",
      });
    }
  },
  //修改个人信息
  inputChange: function (e) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    if (e.currentTarget.id == "nickName") {
      req.send({
        url: req.API.editNick(userInfo.data.data.user.id),
        method: "put",
        data: e.detail.value
      }).then(data => {
        console.log(data);
      });
    } else {

    }
  },
  //上传头像
  uploadImgTap: function (e) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    const desKey = wx.getStorageSync("desKey");
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: req.API.uploadImg(userInfo.data.data.user.id),
          filePath: tempFilePaths[0],
          header: {
            "Authorization": userInfo.data.data.token,
            "checkCode": util.encryptByDES(desKey.data.data, util.getCheckCode(userInfo.data.data.checkIndex, userInfo.data.data.user.id))
          },
          name: 'file',
          success: function (data) {
            console.log(data);
          }
        })
      }
    })
  }
})