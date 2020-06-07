import Taro from "@tarojs/taro-h5";
import global from '../core/global'

function getUserInfo() {
  //console.log("tt getUserInfo");
  return new Promise(resolve => {
      console.log(`getUserInfo 调用成功(调试)`);
      resolve(global.h5Debug);
  });
}

function authorize(key) {
  //console.log("tt authorize");
  return new Promise(resolve => {
    console.log(`authorize 调用成功(调试)`);
    resolve(true);
  });
}

function login() {
  return new Promise(resolve => {
    console.log(`login调用成功(调试)`);
    resolve({errMsg: "login:ok", code: global.h5Debug.code});
  });
}

export default {
  getUserInfo,
  authorize,
  login
};