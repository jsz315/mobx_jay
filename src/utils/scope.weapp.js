import Taro from '@tarojs/taro'
import global from '../core/global'

function getUserInfo(){
  return new Promise(resolve => {
    wx.getUserInfo({
      success(res) {
        console.log(`getUserInfo 调用成功`);
        console.log(res);
        resolve(res.userInfo);
      },
      fail(res) {
        console.log(`getUserInfo 调用失败`);
        resolve(false)
      }
    });
      
  })
}

function authorize(key){
  return new Promise(resolve => {
    wx.authorize({
      scope: key,
      success(res) {
        console.log(`authorize 调用成功`);
        console.log(res);
        resolve(true)
      },
      fail(){
        console.log(`authorize 调用失败`);
        resolve()
      }
    });
  })
}

function login(){
  return new Promise(resolve => {
    wx.login({
      success(res) {
        console.log(`login 调用成功`);
        console.log(res);
        resolve(res);
      },
      fail(res) {
        console.log(`login 调用失败`);
        resolve();
      }
    });
  });
}


export default {
  getUserInfo,
  authorize,
  login,
}
