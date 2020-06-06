/**
1 获取用户的收货地址
  1绑定点击事件
  2 调用小程序内置 api 获取用户的收货地址  wx.chooseAddress

  2 获取用户 对小程序所授予 获取地址的权限状态 scope
    1假设 用户 点击获取收货地址的提示框 确定 authgetSetting scope.address
      scope 值为 true   直接调用获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api
      scope 值为 underfined  直接调用获取收货地址
    3 假设用户点击获取收货地址的提示框 取消
      scope 值为 false
      1诱导用户打开权限 (wx.openSetting) 重新获取收货地址
      2获取收货地址
    4 把获取的收货地址 存入到本地存储中
2 页面加载完毕
  1获取本地存储中的地址数据
  2 把数据设置给data中的一个变量
3 onShow
  1 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1；
    2 checked=true；
  2 获取缓存中的购物车数组
  3 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所以的商品都被选中 checked=true 全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来结算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 +=商品的单价 * 商品数量
  6 总数量 +商品的数量
  7 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选 总价格 总数量
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取data中的全选变量 allChecked
  3 直接取反allChecked=！allChecked
  4 遍历购物车数组 让里面商品选中状态跟随  allChecked改变而改变
  5 把购物车车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中
8 商品数量的编辑
  1 “+” “-” 按钮 绑定同一个点击事件 区分的关键 自定义属性
    1 “+” “+1"
    2 “-” “-1”
  2 传递被点击的商品的ID goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 当购物车的数量 =1 同时 用户 点击 “-"
    弹窗提示 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消 什么都不做 wx.showModal
  5 直接修改商品对象的数量 num
  6 把cart数组 重新设置回 缓存中 和data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到支付页面
 */

import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    // 1 获取缓存中的收货地址
    const address=wx.getStorageSync('address');
    //  1 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];

    this.setData({address});
    this.setCart(cart);
  },
  //  点击收货地址
  async handleChooseAddress() {
    // // 1 获取权限
    // wx.getSetting({
    //   success: (result) => {
    //     // 2 获取权限状态 只要发现一些属性名很怪异的时候 都要用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success: (res) => {
    //           console.log(res);
    //         },
    //       })
    //     }else{
    //       // 3用户 拒绝过授予权限 先诱导打开授予页面
    //       wx.openSetting({
    //         success: (res1) => {
    //           console.log(res1);
    //         },
    //       })
    //     }
    //   },
    // })

    // // 1 获取 权限状态
    // const res1 = await getSetting();
    // const scopeAddress = res1.authSetting["scope.address"];
    // // 2 判断 权限状态
    // if(scopeAddress===true||scopeAddress===undefined){
    //   // 3 调用获取收货地址的api
    //   const res2 = await chooseAddress();
    //   console.log(res2);
    // }else{
    //   // 4 先诱导用户打开授权页面
    //   await openSetting();
    //   // 5 调用获取收货地址 api
    //   const res2 = await chooseAddress();
    //   console.log(res2);
    // }

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
  // 商品的选中
  handeItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {cart}=this.data;
    // 3 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 4 选中状态取反
    cart[index].checked=!cart[index].checked;
    
    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    let allChecked=true;
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked) {
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    // 判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  // 商品全选功能
  handleItemAllCheck(){
    // 1 获取data中的数据
    let {cart,allChecked}=this.data;
    // 2 修改值
    allChecked=!allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e){
    // 1 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart}=this.data;
    // 3 找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    // 4 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      // 弹窗提示
      const res=await showModal({content:"您是否要删除？"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      // 5 进行修改数量
      cart[index].num += operation;
      // 6 设置回缓存和data中
      this.setCart(cart);
    }
  },
  async handlePay(){
    const {address,totalNum}=this.data;
    // 判断用户有没有选择商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 1 判断收货地址
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  }
})