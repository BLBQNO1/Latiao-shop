/*
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1找到滚动条触底事件
  2 判断还有没有下一页数据
    1 获取到总页数 只有总条数
      总页数 = Math。ceil（总条数 / 页容量 pagesize）
    2 获取到当前的页码 pagenum
    3 判断一下 当前的页码是否大于等于 总页数
      表示没有下一页数据
  3假如没有下页数据 弹出一个提示
  4有数据就行加载
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来 要对data中的数据拼接
2 下拉刷新页面
  1 触发下拉刷新事件  需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组
  3 重置页码 设置唯一
  4 重新发送请求
  5 数据请求回来 需要手动关闭等待效果
*/

import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
    wx.showLoading({
      title: '加载中',
    })
    
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    
    
  },
  
  // 获取商品数据
  async getGoodsList() {
    const res=await request({url: '/goods/search',data:this.QueryParams});
    // 获取 总条数
    const total=res.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  // 标题点击事件 从子组件传递过来
  hadleTabsItemChange(e) {
    // 1 获取被点击的标题的索引
    const {index}=e.detail
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 微信官方监听用户上拉触底事件
  onReachBottom() {
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '我们是有底线的~~~',
      })
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1;
    // 发送请求
    this.getGoodsList();
  }
}) 