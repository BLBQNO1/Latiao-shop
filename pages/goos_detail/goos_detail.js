/*
1 发送请求获取数据
2 点击轮播图 预览大图
  1给轮播图绑定点击事件
  2 调用小程序api previewImage
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存的购物车数据 数据格式
  3 先判断 当前的商品是否已经存在于购物车
  4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在与购物车数组中 直接给购物车数组添加一个新元素 带上num属性
  6 弹出提示
4 商品收藏
  1 页面onShow的时候 加载缓存中饿商品收藏的数据
  2 判断当前商品是不是被收藏
    1 是 改变页面的图标
    2 不是
  3 点击商品收藏按钮
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入缓存中即可
*/

import { request } from "../../request/index.js";
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否收藏
    isCollect:false,
    isLogin:true
  },
  // 商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages=getCurrentPages();
    let CurrentPage=pages[pages.length-1];
    let options=CurrentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    // 1 获取缓存中的商品收藏的数组
    let collect=wx.getStorageSync('collect')||[];
    // 判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);

    this.setData({
      goodsObj : {
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 接受传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    });
  },
  // 点击加入购物车
  handleCartAdd() {
    // 获取用户是否有登录信息
    const userInfo=wx.getStorageSync('userInfo')
    if(!userInfo.nickName){
      this.setData({
        isLogin:false
      })
      return;
    }
    // 1 获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    // 2 判断 商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 3 不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      // 4 已经存在购物车数据 执行num++
      cart[index].num++
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    // 6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      mask: true
    })
  },
  //  点击收货地址
  async handleChooseAddress() {
    console.log("aaaa");
    

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
  // 立即购买
  async handleBuy() {
    // 获取用户是否有登录信息
    const userInfo=wx.getStorageSync('userInfo')
    if(!userInfo.nickName){
      this.setData({
        isLogin:false
      })
      return;
    }
    const {address}=this.data;
    
    if(!address){
      await showToast({title:"您还没有选择收货地址"});

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
    return;
  }

    this.GoodsInfo.num=1;
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },
  // 点击 商品收藏图标
  handleCollect() {
    // 获取用户是否有登录信息
    const userInfo=wx.getStorageSync('userInfo')
    if(!userInfo.nickName){
      this.setData({
        isLogin:false
      })
      return;
    }
    let isCollect=false;
    // 1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync('collect')||[];
    // 2 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3 当index! = -1 表示 已经收藏过
    if(index!==-1){
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);
      isCollect:false;
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      });
    }
    // 4 把数组存入缓存中
    wx.setStorageSync('collect', collect);
    // 5 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  },
  // 用户登录
  handleGetUserInfo(e){
    const {userInfo}=e.detail;
    wx.setStorageSync('userInfo', userInfo);
    this.setData({isLogin: true});
  },
  // 暂不授权
  handleCancel(){
    this.setData({isLogin: true});
    wx.showToast({
      title: '您还未登录！',
      icon:'loading',
      mask: true
    })
  }

})