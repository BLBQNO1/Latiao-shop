/**
1 页面被打开的时候 onShow
  0  onShow 不同于onload 无法在形参上接收options 参数
    判断缓存中有没有token
      1 没有 直接跳转到啊授权页面
      2 有 直接往下进行
  1 获取url上的参数type
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据
 */

import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:2,
        value:"退款/退货",
        isActive:false
      }
    ]
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }

    //1 获取当前的小程序的页面栈 - 数组 长度最大的10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    console.log(currentPage.options);
    // 3 获取url的type参数
    const {type}=currentPage.options;
    // 4 激活选中页面标题 当 type=1 index=0
    this.cheangTitleByIndex(type-1);
    this.gerOrders();

  },
  // 获取订单列表的方法
  async gerOrders(type) {
    const res=await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.orders
    })
  },
  // 根据标题索引来激活选中 标题数组
  cheangTitleByIndex(index){
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })    
  },
  hadleTabsItemChange(e) {
    // 1 获取被点击的标题的索引
    const {index}=e.detail
    this.cheangTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.gerOrders(index+1);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }



  
})