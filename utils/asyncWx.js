/*
Promise形式 getSetting
 */
export const getSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    }); 
  })
}

/*
Promise形式 chooseAddress
 */
export const chooseAddress=()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/*
Promise形式 openSetting
 */
export const openSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/*
Promise形式 showModal
 */
export const showModal=({content})=>{
  return new Promise((resolve,reject)=>{
    // 弹窗提示
    wx.showModal({
      title: '提示',
      content: content,
      success :(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}

/*
Promise形式 showToast
 */
export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
    // 弹窗提示
    wx.showToast({
      title: title,
      icon: 'none',
      success :(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}

/*
Promise形式 login
 */
export const login=()=>{
  return new Promise((resolve,reject)=>{
    // 弹窗提示
    wx.login({
      timeout:10000,
      success :(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}

/*
Promise形式 requestPayment
 */
export const requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success :(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}