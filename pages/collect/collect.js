// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },
      {
        id:1,
        value:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:2,
        value:"浏览足迹",
        isActive:false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const collect=wx.getStorageSync('collect')||[];
    this.setData({
      collect
    })
  },
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
  }
})