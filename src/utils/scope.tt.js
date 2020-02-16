import Taro from '@tarojs/taro'
import global from '../core/global'

function getUserInfo(){
  //console.log("tt getUserInfo");
  return new Promise(resolve => {
    tt.getUserInfo({
      success(res) {
        //console.log(`getUserInfo 调用成功`);
        resolve(res.userInfo);
      },
      fail(res) {
        //console.log(`getUserInfo 调用失败`);
        resolve(false)
      }
    });
      
  })
}

function authorize(key){
  //console.log("tt authorize");
  return new Promise(resolve => {
    tt.authorize({
      scope: key,
      success(res) {
        // 用户同意授权用户信息
        // callback(res)
        resolve(true)
      },
      fail(){
        resolve()
      }
    });
  })
}

function login(){
  return new Promise(resolve => {
    tt.login({
      success(res) {
        //console.log(`login调用成功`);
        //console.log(res);
        resolve(res);
      },
      fail(res) {
        //console.log(`login调用失败`);
        //console.log(res);
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
