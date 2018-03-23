// pages/goodsDetail/goodsDetail.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");

var imgMaxHeight = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: data.goodsDetail,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中",
    });
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.productDetail(options.id)
    }).then(function (res) {
      const data = res.data.data;
      var bannerList = {
        height: that.data.bannerList.height,
        list: new Array()
      };
      var goodsContent = {
        list: new Array()
      };
      var bannerImgList = data.image.split(",");
      var shopDetail = {
        id: data.id,
        shopId: data.shopId,
        name: data.name,
        shopName: data.shopName,
        shopImg: data.shopLogoImage,
        description: data.subName,
        price: data.skuList[0].price,
        marketPrice: data.skuList[0].marketPrice,
        bonus: data.radix,
        isVip: userInfo.isFromMciro == "0" ? false : true
      }
      var imgList = data.introduction.match(/<*?src[=\"\s]+([^\"\']*)/gi);
      var spec = that.data.spec;
      var specList = {
        img: bannerImgList[0],
        price: data.skuList[0].price,
        num: 1,
        list: [],
        hidden: true
      }
      util.loop(bannerImgList, function (item, index) {
        bannerList.list.push({
          url: "",
          imgSrc: item
        });
      });
      if (imgList != null) {
        util.loop(imgList, function (item, index) {
          imgList[index] = imgList[index].split("\"")[1].replace("\"");
        });
      }
      util.loop(data.skuList, function (item, index) {
        specList.list.push({
          id: item.id,
          name: item.specName,
          price: item.price,
          selected: index == 0 ? "on" : "off"
        });
      });

      goodsContent.list = imgList;
      spec.rightText = data.skuList[0].specName;
      that.setData({
        bannerList: bannerList,
        shopDetail: shopDetail,
        goodsContent: goodsContent,
        spec: spec,
        specList: specList
      });
      return req.send({
        url: req.API.favoritesValidate(userInfo.data.data.user.id, that.data.shopDetail.id) + "?type=product"
      });
    }).then(data => {
      var collect = {
        isFavorites: false
      }
      if (data.data.data) {
        collect.isFavorites = true;
      } else {
        collect.isFavorites = false;
      }
      that.setData({
        collect: collect
      });
      wx.hideLoading();
    }).catch(data => {
      wx.hideLoading();
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
  ,
  //关闭规格弹窗
  specClose: function (e) {
    var that = this;
    var specList = that.data.specList;
    specList.hidden = true;
    that.setData({
      specList: specList
    });
  },
  detailMenuTap: function (e) {
    var that = this;
    switch (e.currentTarget.id) {
      case "spec":
        var specList = that.data.specList;
        specList.hidden = false;
        that.setData({
          specList: specList
        });
        break;
      default:
        break;
    }
  },
  //选择规格
  specTap: function (e) {
    var that = this;
    var specList = that.data.specList;
    var spec = that.data.spec;

    util.loop(specList.list, function (item, index) {
      if (e.target.dataset.id == item.id) {
        specList.list[index].selected = "on";
        specList.price = item.price;
        spec.rightText = item.name;
      } else {
        specList.list[index].selected = "off";
      }
    });
    that.setData({
      specList: specList,
      spec: spec
    });
  },
  //数量
  numberTap: function (e) {
    var that = this;
    var specList = that.data.specList;
    if (e.target.id == "numMinus") {
      specList.num--;
    } else if (e.target.id == "numAdd") {
      specList.num = parseInt(e.detail.value);
    } else {
      specList.num++;
    }

    if (specList.num < 0) {
      specList.num = 0;
    }
    that.setData({
      specList: specList
    });
  },
  //购买商品
  goodsPayTap: function (e) {
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo == "") {
      req.errorStatus("no_login");
      return;
    }
    var that = this;
    var shopList = new Array();
    shopList.push({
      shopId: that.data.shopDetail.shopId,
      shopName: that.data.shopDetail.shopName,
      shopImg: that.data.shopDetail.shopImg,
      list: [{
        id: that.data.shopDetail.id,
        imgSrc: that.data.bannerList.list[0].imgSrc,
        name: that.data.shopDetail.name,
        description: that.data.shopDetail.description,
        price: that.data.specList.price,
        skuId: that.data.specList.list[0].id,
        spec: that.data.spec.rightText,
        num: that.data.specList.num
      }]
    });
    wx.setStorageSync("orderInfo", shopList);
    wx.navigateTo({
      url: "../orderConfirm/orderConfirm",
    })
  },
  // 收藏
  collectTap: function (e) {
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo == "") {
      req.errorStatus("no_login");
      return;
    }
    var that = this;
    var collect = {
      isFavorites: false
    }
    req.send({
      url: req.API.favoritesValidate(userInfo.data.data.user.id, that.data.shopDetail.id) + "?type=product"
    }).then(data => {
      req.errorStatus(data.statusCode);
      if (data.data.data) {
        collect.isFavorites = false;
        return req.send({
          url: req.API.favorites(userInfo.data.data.user.id, that.data.shopDetail.id) + "?type=product",
          method: "delete"
        });
      } else {
        collect.isFavorites = true;
        return req.send({
          url: req.API.favorites(userInfo.data.data.user.id, that.data.shopDetail.id) + "?type=product",
          method: "post"
        });
      }
    }).then(data => {
      if (data.data.success) {
        that.setData({
          collect: collect
        });
      }
    });
  },
  //加入购物车
  shoppingCarTap: function (e) {
    var that = this;
    var shoppingCar = wx.getStorageSync("shoppingCar");
    var noGoods = true;
    if (shoppingCar == "") {
      shoppingCar = {
        price: "",
        isChecked: true,
        list: new Array()
      }
    }
    util.loop(shoppingCar.list, (item, index) => {
      if (item.shopId == that.data.shopDetail.shopId) {
        noGoods = false;
        var hasGoods = false;
        util.loop(item.list, (jitem, jindex) => {
          if (jitem.id == that.data.shopDetail.id) {
            jitem.num = parseInt(jitem.num) + 1;
            hasGoods = true;
          }
        });
        if (!hasGoods) {
          item.list.push({
            id: that.data.shopDetail.id,
            imgSrc: that.data.bannerList.list[0].imgSrc,
            name: that.data.shopDetail.name,
            description: that.data.shopDetail.description,
            price: that.data.specList.price,
            spec: that.data.spec.rightText,
            skuId: that.data.specList.list[0].id,
            num: that.data.specList.num,
            isChecked: true
          });
        }
      }
    });
    if (noGoods) {
      shoppingCar.list.push({
        shopId: that.data.shopDetail.shopId,
        shopImg: that.data.shopDetail.shopImg,
        shopName: that.data.shopDetail.shopName,
        isChecked: true,
        list: [{
          id: that.data.shopDetail.id,
          imgSrc: that.data.bannerList.list[0].imgSrc,
          name: that.data.shopDetail.name,
          description: that.data.shopDetail.description,
          price: that.data.specList.price,
          spec: that.data.spec.rightText,
          skuId: that.data.specList.list[0].id,
          num: that.data.specList.num,
          isChecked: true
        }]
      });
    }
    wx.setStorageSync("shoppingCar", shoppingCar);
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    })
  },
  //轮播图图片高度适应
  imgLoad: function (e) {
    var that = this;
    var bannerList = that.data.bannerList;
    var SysInfo = wx.getSystemInfoSync();
    var scale = SysInfo.windowWidth / e.detail.width;
    if (imgMaxHeight < e.detail.height * scale) {
      imgMaxHeight = e.detail.height * scale;
      bannerList.height = imgMaxHeight + "px";
      that.setData({
        bannerList: bannerList
      });
    }
  }
})