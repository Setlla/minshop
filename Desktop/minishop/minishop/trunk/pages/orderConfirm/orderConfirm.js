// pages/orderConfirm/orderConfirm.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: data.orderConfirm,

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
    loadPage(that);
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
  //配送方式以及优惠券
  detailMenuTap: function (e) {
    const that = this;
    if (e.currentTarget.id != "deliver") {
      const discount = ((discount, orderList) => {
        discount.selectShopId = e.currentTarget.id;
        discount.hidden = false;
        util.loop(orderList.list, (item, index) => {
          if (item.shopId == e.currentTarget.id) {
            util.loop(discount.list, (jitem, jindex) => {
              if (jitem.id == item.discount.couponId) {
                jitem.isChecked = true;
              } else {
                jitem.isChecked = false;
              }
            });
          }
        });
        return discount;
      })(that.data.discount, that.data.orderList);
      that.setData({
        discount: discount
      });
    }
  },
  //选择配送方式
  deliverTap: function (e) {
    const that = this;
    const deliver = ((deliver, user) => {
      deliver.rightText = deliver.list[e.detail.value].name;
      user.deliveryId = deliver.list[e.detail.value].id;
      that.setData({
        user: user,
        deliver: deliver
      });
      return deliver;
    })(that.data.deliver, that.data.user);

    loadPage(that);
  },
  //设置收货地址
  addressSetTap: function (e) {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  //提交订单
  orderSubmit: function (e) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    const orderInfo = wx.getStorageSync("orderInfo");
    const shoppingCar = wx.getStorageSync("shoppingCar");
    var cartItemList = new Array();
    util.loop(that.data.orderList.list, function (item, index) {
      var obj = {
        shopId: item.shopId,
        couponCode: item.discount.couponId,
        cartProductItemList: new Array()
      }
      util.loop(item.list, function (jitem, jindex) {
        obj.cartProductItemList.push({
          price: jitem.price,
          quantity: jitem.num,
          skuId: jitem.skuId
        });
      });
      cartItemList.push(obj);
    });
    req.send({
      url: req.API.orders(userInfo.data.data.user.id) + "?receiverId=" + that.data.user.receiverId + "&deliveryMethodId=" + that.data.user.deliveryId,
      method: "post",
      data: {
        cartItemList: cartItemList
      }
    }).then(function (data) {
      req.errorStatus(data.data.errCode);
      if (data.data.success) {
        const deleteGoods = (id) => {
          util.loop(shoppingCar.list, (item, index) => {
            const rt = util.loop(item.list, (jitem, jindex) => {
              if (id == jitem.id) {
                shoppingCar.list[index].list.splice(jindex, 1);
                if (shoppingCar.list[index].list.length == 0) {
                  shoppingCar.list.splice(index, 1);
                }
                return false;
              }
            });
            if (!rt) {
              return false;
            }
          });
        }
        util.loop(orderInfo, (item, index) => {
          util.loop(item.list, (jitem, jindex) => {
            deleteGoods(jitem.id);
          });
        });
        wx.setStorageSync("shoppingCar", shoppingCar);
        req.wxPay({
          userId: userInfo.data.data.user.id,
          orderId: data.data.data.sn,
          pirce: data.data.data.allMoneyTotal,
          success: data => { }
        });
        wx.redirectTo({
          url: "../orderList/orderList",
        });
      }
    });
  },
  //选择优惠券
  discountTap: function (e) {
    const that = this;
    const dataArr = ((discount, count, orderList) => {
      util.loop(discount.list, (item, index) => {
        if (item.id == e.currentTarget.id) {
          if (item.isChecked) {
            item.isChecked = false;
            util.loop(orderList.list, (jitem, jindex) => {
              if (jitem.shopId == discount.selectShopId) {
                jitem.price = 0;
                util.loop(jitem.list, (zitem, zindex) => {
                  jitem.price += parseFloat(zitem.price) * parseFloat(zitem.num)
                });
                jitem.discount.couponId = "";
                jitem.discount.rightText = "-￥0";
                return false;
              }
            });
          } else {
            util.loop(orderList.list, (jitem, jindex) => {
              if (jitem.shopId == discount.selectShopId) {
                if (jitem.price < item.condition) {
                  wx.showModal({
                    content: "未满足使用条件",
                    showCancel: false,
                    success: data => { }
                  });
                  return false;
                }
                item.isChecked = true;
                jitem.price = 0;
                util.loop(jitem.list, (zitem, zindex) => {
                  jitem.price += parseFloat(zitem.price) * parseFloat(zitem.num)
                });
                jitem.discount.couponId = e.currentTarget.id;
                jitem.discount.rightText = "-￥" + item.price;
                jitem.price = (jitem.price - item.price).toFixed(2);
                return false;
              }
            });
          }
        } else {
          item.isChecked = false;
        }
      });
      count.sum = 0;
      util.loop(orderList.list, (jitem, index) => {
        count.sum = (parseFloat(count.sum) + parseFloat(jitem.price) + parseFloat(jitem.freight)).toFixed(2);
      });
      return [discount, count, orderList];
    })(that.data.discount, that.data.count, that.data.orderList);
    that.setData({
      discount: dataArr[0],
      count: dataArr[1],
      orderList: dataArr[2]
    });
  },
  //关闭选择弹窗
  discountCloseTap: function (e) {
    const that = this;
    const discount = ((discount) => {
      discount.hidden = true;
      return discount;
    })(that.data.discount);
    that.setData({
      discount: discount
    });
  },
  //优惠券确认
  confirmTap: function (e) {
    const that = this;
    const discount = ((discount) => {
      discount.hidden = true;
      return discount;
    })(that.data.discount);
    that.setData({
      discount: discount
    });
  }
})


//加载页面数据
function loadPage(that) {
  const orderInfo = wx.getStorageSync("orderInfo");
  const userInfo = wx.getStorageSync("userInfo");
  var user = null;
  var cartProductItem = new Array();
  var orderList = new Object();
  var deliver = {
    id: "deliver",
    leftText: "配送方式：",
    rightText: that.data.deliver.rightText,
    list: new Array()
  };
  var count = {
    sum: 0
  }

  if (that.data.orderList.list[0].shopId == "") {
    orderList.list = new Array();
    util.loop(orderInfo, function (item, index) {
      orderList.list.push({
        shopId: item.shopId,
        shopImg: item.shopImg,
        shopName: item.shopName,
        freight: 0,
        price: 0,
        discount: {
          id: item.shopId,
          leftText: "优惠券：",
          rightText: "-￥0",
          couponId: "",
        },
        list: new Array
      });
      util.loop(item.list, function (jItem, jIndex) {
        orderList.list[index].price += (jItem.price * jItem.num);
        orderList.list[index].list.push({
          id: jItem.id,
          imgSrc: jItem.imgSrc,
          name: jItem.name,
          description: jItem.description,
          price: jItem.price,
          skuId: jItem.skuId,
          spec: jItem.spec,
          num: jItem.num
        });
        cartProductItem.push({
          price: jItem.price,
          quantity: jItem.num,
          skuId: jItem.skuId
        });
      });
    });
  } else {
    orderList.list = that.data.orderList.list;
  }

  wx.showLoading({
    title: '加载中',
  });



  req.send({
    url: req.API.receiver(userInfo.data.data.user.id) + "?pageNum=1&pageSize=6"
  }).then(function (data) {
    req.errorStatus(data.statusCode);
    if (data.data.data.length <= 0) {
      wx.hideLoading();
      wx.showModal({
        content: "请先添加收货地址",
        success: data => {
          if (data.confirm) {
            wx.navigateTo({
              url: "../newAddress/newAddress",
            });
          } else {
            wx.navigateBack();
          }
        }
      });
      return;
    }
    var reqFn = null;
    util.loop(data.data.data, function (item, index) {
      if (item.isDefault) {
        user = {
          name: item.consignee,
          phone: item.phone,
          areaId: item.area,
          address: item.provinceName + item.cityName + item.areaName + item.address,
          receiverId: item.id,
          deliveryId: ""
        }
        reqFn = req.send({
          url: req.API.deliver
        });
        return false;
      }
    });
    return reqFn;
  }).then(function (data) {
    if (deliver.rightText == "") {
      deliver.rightText = data.data.data[0].pname;
    }
    util.loop(data.data.data, (item, index) => {
      deliver.list.push({
        id: item.id,
        name: item.pname
      })
    });
    user.deliveryId = data.data.data[0].id;
    return req.send({
      url: req.API.freight + "?areaId=" + user.areaId + "&deliveryId=" + user.deliveryId,
      method: "post",
      data: cartProductItem
    });
  }).then(function (data) {
    util.each(data.data.data, (item) => {
      util.loop(orderList.list, (jitem, index) => {
        if (jitem.shopId == item) {
          jitem.freight = data.data.data[item];
        }
      });
    });
    util.loop(orderList.list, (jitem, index) => {
      count.sum = (parseFloat(count.sum) + parseFloat(jitem.price) + parseFloat(jitem.freight)).toFixed(2);
    });
    that.setData({
      orderList: orderList,
      user: user,
      deliver: deliver,
      count: count
    });
    wx.hideLoading();
  });
  req.send({
    url: req.API.orderCoupon + "?userId=" + userInfo.data.data.user.id,
    method: "post",
    data: ((list) => {
      util.loop(orderInfo, (item, index) => {
        util.loop(item.list, (jitem, jindex) => {
          list.push({
            price: jitem.price,
            quantity: jitem.num,
            skuId: jitem.skuId
          });
        });
      });
      return list;
    })(new Array())
  }).then(data => {
    const discount = ((discount) => {
      util.loop(data.data.data, (item, index) => {
        discount.list.push({
          id: item.id,
          name: util.strlimit(item.couponName, 18),
          price: item.value,
          condition: item.beginValue,
          endTime: util.formatTimeShort(new Date(item.startDate)) + "-" + util.formatTimeShort(new Date(item.endDate)),
          isChecked: false
        });
      });
      return discount;
    })({
      selectShopId: "",
      hidden: true,
      list: new Array()
    });

    that.setData({
      discount: discount
    });

  });
}