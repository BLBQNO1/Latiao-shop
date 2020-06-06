import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}

  },

  onShow: function() {
    const userInfo=wx.getStorageSync('userInfo');
    
    const collect=wx.getStorageSync('collect')||[];
    this.setData({userInfo,collectNums:collect.length});
  },
    //  点击收货地址
  async handleChooseAddress() {
    try {
      // 1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断 权限状态
      if(scopeAddress === false){
        await openSetting();
      }
      // 3 调用获取收货地址 api
      let address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 4 存入到缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },
  // 关于我们
  handleInfo() {
    wx.showModal({
      confirmColor: '#1E9FFF',
      showCancel: false,
      content:'积一时之跬步\r\n臻千里之遥程\r\n\r\n开发者信息搜小程序："陈海旺简历"'
    })
  },
  // 用户登录
  handleGetUserInfo(e) {
    const {userInfo}=e.detail;
    wx.setStorageSync('userInfo', userInfo);
    this.setData({userInfo});
  },
  // 暂不授权
  handleCancel() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }


})