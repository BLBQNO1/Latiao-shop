import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 左侧的返回数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
   1先判断一下本地存储中有没有旧的数据
   2没有数据直接发送新请求
   3有旧的数据并且没有过期就使用本地旧数据
   */
    // 1获取本地存储中的数据
    const Cates=wx.getStorageSync('cates');
    // 2判断
    if(!Cates){
      // 不存在，发送请求获取数据
      this.getCates();
    }else{
      if(Date.now()-Cates.time>1000*300){
        this.getCates();
      }else{
        this.Cates=Cates.data
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url:"/categories"
    // })
    // .then(res => {
    //   this.Cates=res;
    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1 使用es7的async await来发送请求
    const res=await request({url:"/categories"});
    this.Cates=res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});

    // 构造左侧的大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    // 构造右侧的商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    /*
      获取被点击的标题的index
      给data中的currentIndex赋值就可以了
      根据不同的索引来渲染右侧的商品内容
    */ 
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签距离顶部的距离
      scrollTop:0
    })
  }
})