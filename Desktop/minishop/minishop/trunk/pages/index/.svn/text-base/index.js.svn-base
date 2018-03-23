// pages/index/index.js
const dataModel = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");

const imgMaxHeight = (() => {
  var max = 0;
  return (num) => {
    if (num != undefined) {
      max = num;
    }
    return max;
  }
})();

Page({

  /**
   * 页面的初始数据
   */
  data: dataModel.index,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    wx.showLoading({
      title: "加载中",
    });
    if (options.shoppingCar) {
      var e = {
        currentTarget: {
          dataset: {
            id: "shoppingCar"
          }
        }
      }
      that.menuBarTap(e);
    }
    util.promise.all([
      req.send({
        url: req.API.ads
      }).then(data => {
        const dataObj = data.data.data;
        var bannerList = {
          height: that.data.bannerList.height,
          list: new Array()
        }
        util.loop(dataObj, function (item, index) {
          var urlStr = "";
          switch (item.linkType) {
            case "10":
              urlStr: "";
              break;
            case "20":
              urlStr = "../subject/subject?id=" + item.url;
              break;
            case "30":
              urlStr = "../goodsDetail/goodsDetail?id=" + item.url;
              break;
            default:
              break;
          }
          bannerList.list.push({
            url: urlStr,
            imgSrc: item.imgpath
          });
        });
        return bannerList;
      }),
      req.send({
        url: req.API.products + "?tag=special&pageNum=1&pageSize=6"
      }).then(function (data) {
        var data = data.data.data;
        var shopList = {
          list: new Array()
        }
        util.loop(data, function (item, index) {
          shopList.list.push({
            id: item.id,
            imgSrc: item.image,
            name: util.strlimit(item.name, 28),
            description: item.subName,
            price: item.price,
            marketPrice: item.marketPrice
          });
        });
        return shopList;
      }),
      req.send({
        url: req.API.subject + "?pageNum=1&pageSize=4"
      }).then(function (data) {
        var data = data.data.data;
        var subjectList = {
          list: []
        };
        util.loop(data, function (item, index) {
          subjectList.list.push({
            id: item.id,
            img: item.image,
            name: item.title,
            content: item.remarks
          });
        });
        return subjectList;
      }),
      req.send({
        url: req.API.category
      }).then(function (data) {
        var data = data.data.data;
        var goodsTypeList = {
          list: new Array()
        };
        util.loop(data, function (item, index) {
          goodsTypeList.list.push({
            id: item.id,
            name: item.name,
            img: item.image,
            isChecked: false
          });
        });

        goodsTypeList.list[0].isChecked = true;
        categoryDetail(that, goodsTypeList.list[0].id);
        return goodsTypeList;
      })
    ]).then(data => {
      that.setData({
        bannerList: data[0],
        shopList: data[1],
        subjectList: data[2],
        goodsTypeList: data[3]
      });
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    req.send({
      url: req.API.desKey
    }).then(data => {
      wx.setStorageSync("desKey", data);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    var shoppingCar = wx.getStorageSync("shoppingCar");
    if (userInfo != "") {
      req.send({
        url: req.API.userDetail(userInfo.data.data.user.id)
      }).then(data => {
        userInfo.isFromMciro = data.data.data.isFromMciro;
        wx.setStorageSync("userInfo", userInfo);
        that.setData({
          user: {
            name: userInfo.data.data.user.nickName,
            img: userInfo.data.data.user.userPhoto == "" ? "../../images/userDefault.png" : userInfo.data.data.user.userPhoto,
            isVip: data.data.data.isFromMciro == "0" ? false : true,
            isLogin: true
          }
        });
      });
    } else {
      that.setData({
        user: {
          name: "",
          img: "",
          isLogin: false
        }
      });
    }
    if (shoppingCar != "") {
      shoppingCar.price = shoppingCarSum(that, shoppingCar);
      wx.setStorageSync("shoppingCar", shoppingCar);
    } else {
      shoppingCar = {
        price: "0",
        isChecked: true,
        list: new Array()
      }
    }
    that.setData({
      shoppingCar: shoppingCar
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
  //商品详情
  goodsDetailTap: function (e) {
    wx.navigateTo({
      url: "../goodsDetail/goodsDetail?id=" + e.currentTarget.dataset.id,
    })
  },
  //专题详情
  subjectTap: function (e) {
    wx.navigateTo({
      url: "../subject/subject?id=" + e.currentTarget.dataset.id + "&title=" + e.currentTarget.dataset.title,
    })
  },
  //底部菜单
  menuBarTap: function (e) {
    var menu = this.data.menuBar;
    menu.indexPage = false;
    menu.typePage = false;
    menu.shoppingCar = false;
    menu.myInfoPage = false;
    switch (e.currentTarget.dataset.id) {
      case "indexPage":
        menu.indexPage = true;
        wx.setNavigationBarTitle({
          title: "首页"
        })
        break;
      case "typePage":
        menu.typePage = true;
        wx.setNavigationBarTitle({
          title: "分类"
        })
        break;
      case "shoppingCar":
        menu.shoppingCar = true;
        wx.setNavigationBarTitle({
          title: "购物车"
        })
        break;
      case "myInfoPage":
        menu.myInfoPage = true;
        wx.setNavigationBarTitle({
          title: "我的"
        })
        break;
      default:
        break;
    }
    this.setData({
      menuBar: menu
    });
  },
  //购物车商品选择
  checkboxTap: function (e) {
    var that = this;
    var shoppingCar = wx.getStorageSync("shoppingCar");
    var allSelect = true;
    util.loop(shoppingCar.list, (item, index) => {
      item.isChecked = true;
      util.loop(item.list, (jitem, jindex) => {
        if (e.currentTarget.dataset.id == jitem.id) {
          if (jitem.isChecked) {
            jitem.isChecked = false;
          } else {
            jitem.isChecked = true;
          }
        }
        if (!jitem.isChecked) {
          item.isChecked = false;
        }
      });
      if (!item.isChecked) {
        allSelect = false;
      }
    });
    shoppingCar.isChecked = allSelect;
    wx.setStorageSync("shoppingCar", shoppingCar);
    shoppingCar.price = shoppingCarSum(that, shoppingCar);
    that.setData({
      shoppingCar: shoppingCar
    });
  },
  //购物车店铺选择
  shopCheckboxTap: function (e) {
    const that = this;
    var shoppingCar = wx.getStorageSync("shoppingCar");
    var allSelect = true;
    util.loop(shoppingCar.list, (item, index) => {
      if (e.currentTarget.dataset.id == item.shopId) {
        if (item.isChecked) {
          item.isChecked = false;
        } else {
          item.isChecked = true;
        }
        util.loop(item.list, (jitem, jindex) => {
          jitem.isChecked = item.isChecked;
        });
      }
      if (!item.isChecked) {
        allSelect = false;
      }
    });
    shoppingCar.isChecked = allSelect;
    wx.setStorageSync("shoppingCar", shoppingCar);
    shoppingCar.price = shoppingCarSum(that, shoppingCar);
    that.setData({
      shoppingCar: shoppingCar
    });
  },
  //购物车商品数量
  numberTap: function (e) {
    const that = this;
    const shoppingCar = ((shoppingCar) => {
      util.loop(shoppingCar.list, (item, index) => {
        const rt = util.loop(item.list, (jitem, jindex) => {
          if (jitem.id == e.currentTarget.dataset.pid) {
            if (e.currentTarget.dataset.id == "numMinus") {
              jitem.num -= 1;
              if (jitem.num < 1) {
                jitem.num = 1;
                wx.showModal({
                  content: "确认删除商品?",
                  success: data => {
                    if (data.confirm) {
                      shoppingCar.list[index].list.splice(jindex, 1);
                      if (shoppingCar.list[index].list.length == 0) {
                        shoppingCar.list.splice(index, 1);
                      }
                      shoppingCar.price = shoppingCarSum(that, shoppingCar);
                      wx.setStorageSync("shoppingCar", shoppingCar);
                      that.setData({
                        shoppingCar: shoppingCar
                      });
                    }
                  }
                });
                return false;
              }
            } else if (e.currentTarget.dataset.id == "numAdd") {
              jitem.num = parseInt(e.detail.value);
            } else {
              jitem.num += 1;
            }
          }
        });
        if (!rt) {
          return false;
        }
      });
      return shoppingCar;
    })(wx.getStorageSync("shoppingCar"));
    shoppingCar.price = shoppingCarSum(that, shoppingCar);
    wx.setStorageSync("shoppingCar", shoppingCar);
    that.setData({
      shoppingCar: shoppingCar
    });
  },
  //购物车全选
  checkboxAllTap: function (e) {
    const that = this;
    const shoppingCar = ((shoppingCar) => {
      if (shoppingCar.isChecked) {
        shoppingCar.isChecked = false;
      } else {
        shoppingCar.isChecked = true;
      }
      util.loop(shoppingCar.list, (item, index) => {
        item.isChecked = shoppingCar.isChecked;
        util.loop(item.list, (jitem, jindex) => {
          jitem.isChecked = shoppingCar.isChecked;
        });
      });
      shoppingCar.price = shoppingCarSum(that, shoppingCar);
      return shoppingCar;
    })(wx.getStorageSync("shoppingCar"));

    wx.setStorageSync("shoppingCar", shoppingCar);
    that.setData({
      shoppingCar: shoppingCar
    });
  },
  //购物车结算
  orderConfirmTap: function (e) {
    const userInfo = wx.getStorageSync("userInfo");
    var shoppingCar = wx.getStorageSync("shoppingCar");
    if (userInfo == "") {
      req.errorStatus("no_login");
      return;
    }
    var that = this;
    var shopList = new Array();
    util.loop(shoppingCar.list, (item, index) => {
      var childList = new Array();
      util.loop(item.list, (jitem, jindex) => {
        if (jitem.isChecked) {
          childList.push({
            id: jitem.id,
            imgSrc: jitem.imgSrc,
            name: jitem.name,
            description: jitem.description,
            price: jitem.price,
            skuId: jitem.skuId,
            spec: jitem.spec,
            num: jitem.num
          });
        }
      });
      if (childList.length > 0) {
        shopList.push({
          shopId: item.shopId,
          shopName: item.shopName,
          shopImg: item.shopImg,
          list: childList
        });
      }
    });
    wx.setStorageSync("orderInfo", shopList);
    if (shopList.length > 0) {
      wx.navigateTo({
        url: "../orderConfirm/orderConfirm",
      })
    } else {
      wx.showModal({
        content: "订单没有商品，请您添加商品",
        showCancel: false,
        success: data => {

        }
      });
    }
  },
  //登录
  btnTap: function (e) {
    if (e.currentTarget.id == "loginBtn") {
      wx.navigateTo({
        url: "../login/login",
      })
    }
  },
  //绑定邀请码
  bindCodeTap:function(e){
    wx.navigateTo({
      url: "../bindInviteCode/bindInviteCode",
    });
  },
  //分类选择
  goodsTypeTap: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.id;
    var goodsTypeList = that.data.goodsTypeList;
    util.loop(goodsTypeList.list, function (item, index) {
      if (item.id == tid) {
        item.isChecked = true;
      } else {
        item.isChecked = false;
      }
    });
    that.setData({
      goodsTypeList: goodsTypeList
    });
    categoryDetail(that, tid);
  },
  //跳转个人中心
  myInfoTap: function (e) {
    const userInfo = wx.getStorageSync("userInfo");
    wx.navigateTo({
      url: "../myInfo/myInfo?userId=" + userInfo.data.data.user.id,
    })
  },
  //轮播图图片高度适应
  imgLoad: function (e) {
    const that = this;
    const bannerList = ((bannerList) => {
      const SysInfo = wx.getSystemInfoSync();
      const scale = SysInfo.windowWidth / e.detail.width;
      if (imgMaxHeight() < e.detail.height * scale) {
        imgMaxHeight(e.detail.height * scale);
        bannerList.height = imgMaxHeight() + "px";
        that.setData({
          bannerList: bannerList
        });
      }
      return bannerList;
    })(that.data.bannerList);
  }
})

//商品分类列表
function categoryDetail(that, id) {
  req.send({
    url: req.API.categoryDetail(id) + "?pageNum=1&pageSize=10"
  }).then(function (data) {
    var data = data.data.data
    var shopTypeList = {
      list: new Array()
    }
    util.loop(data, function (item, index) {
      shopTypeList.list.push({
        id: item.id,
        imgSrc: item.image,
        name: util.strlimit(item.name, 28),
        description: item.subName,
        price: item.price,
        marketPrice: item.marketPirce
      });
    });
    that.setData({
      shopTypeList: shopTypeList
    });
  });
}

//选中商品总价
function shoppingCarSum(that, shoppingCar) {
  var sum = 0;
  util.loop(shoppingCar.list, (item, index) => {
    util.loop(item.list, (jitem, jindex) => {
      if (jitem.isChecked) {
        sum += parseFloat(jitem.price) * parseFloat(jitem.num);
      }
    });
  });
  return sum.toFixed(2);
}