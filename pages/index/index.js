// 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList:[],
    catesList:[],
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList(){
    // 发送异步请求获取轮播图数据  优化的手段可以使用es6的promise
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    request({ url: "/home/swiperdata"})
    .then(result => {
      this.setData({
        swiperList:result
      })
    })
  },
  getCatesList(){
    request({ url: "/home/catitems"})
    .then(result => {
      this.setData({
        catesList:result
      })
    })
  },
  getFloorList(){
    request({ url: "/home/floordata"})
    .then(result => {
      this.setData({
        floorList:result
      })
    })
  }
})