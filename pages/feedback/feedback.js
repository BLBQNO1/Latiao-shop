/*
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的选择图片的api
  2 获取到图片的路径 数组
  3 把图片路径 存到data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件 
  1 获取被点击的元素的索引
  2 获取data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品/商家投诉",
        isActive:false
      }
    ],
    // 被选中图片路径 数组
    chooseImgs:[],
    textVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 点击 “+” 选择图片
    handleChooseImg(){
      wx.chooseImage({
        // 最多可以选择的图片张数
        count: 9,
        // 所选的图片的尺寸 [原图 压缩]
        sizeType: ['original', 'compressed'],
        // 选择图片的来源 [相册 照相机]
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.setData({
            // 图片数组 进行拼接
            chooseImgs:[...this.data.chooseImgs,...res.tempFilePaths]
          })
        }
      })
    },
    // 点击 自定义图片组件
    handleRemoveImg(e){
      // 2 获取被点击的组件的索引
      const {index}=e.currentTarget.dataset;
      // 3 获取data中的图片数组
      let {chooseImgs}=this.data;
      // 4 删除元素
      chooseImgs.splice(index,1);
      this.setData({
        chooseImgs
      })
    },
    // 文本域输入的事件
    handleTextInput(e){
      this.setData({
        textVal:e.detail.value
      })
    },
    // 提交按钮的点击
    handleFormSubmit(){
      // 1 获取文本域的内容
      const {textVal}=this.data;
      // 2 合法性的验证
      if(!textVal.trim()){
        // 不合法
        wx.showToast({
          title: '输入不合法',
          icon:'none',
          mask:true
        })
        return;
      }
      wx.showLoading({
        title: '上传中',
      })
      
      setTimeout(function () {
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
        })
      }, 2000)

      setTimeout(function (){
        wx.navigateBack({
          delta:1,
        })
      },2500)

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

  }
})