import { request } from "../../request/index.js";
import { login } from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户信息
  async handleGetUserInfo(e){
    try {
      // 1 获取用户信息
      const {encryptedData,rawData,iv,signature} = e.detail;
      // 2 获取小程序登陆成功后的code
      const {code}=await login();
      
      // const loginParams={encryptedData,rawData,iv,signature,code};
      // 3 发送请求 获取用户的token
      // const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
      // console.log(token);
      
      // 4 把token存入缓存中 同时跳转回到上一个页面     // 没有token权限 设定一个固定模拟值
      const token="xmCe4NvXuRnRB8OMCfnPo";
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta:1
      });
      
    }catch(error) {
      console.log(error);
    }
  }
})