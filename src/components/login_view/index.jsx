import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import global from '../../core/global'
import scope from '../../utils/scope'

let innerAudioContext;

class LoginView extends Component {

  constructor(props){
	  super(props)
    this.state = {

    }
  }

  config = {
    // navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentWillReact () {
    //console.log('componentWillReact')
  }

  componentDidMount () {
    
  }

  componentWillUnmount () {
  }

  componentDidShow () { }

  componentDidHide () { }

  close(){
    const { questionStore } = this.props
    questionStore.changePopLogin(false);
  }

  async login(){
    const { questionStore } = this.props
    questionStore.changePopLogin(false);
    let authorizeRes = await scope.authorize("scope.userInfo");
    if(authorizeRes){
      let userInfoRes = await scope.getUserInfo();
      if(userInfoRes){
        await this.saveUser(userInfoRes);
      }
      else{
        Taro.showToast({title: '无法获取用户数据', icon: 'none'})
      }
    }
  }

  async bindGetUserInfo(e){
    console.log(e);
    this.close();
    if(e.detail.userInfo){
      await this.saveUser(e.detail.userInfo);
    }
    else{
      Taro.showToast({title: '无法获取用户数据', icon: 'none'})
    }
  }

  async saveUser(userInfo){
    const { questionStore } = this.props
    questionStore.changeNickName(userInfo.nickName);
    questionStore.changeAvatarUrl(userInfo.avatarUrl);
    questionStore.changeGender(userInfo.gender);

    await global.setUser({
      openid: questionStore.openid,
      avatarUrl: questionStore.avatarUrl,
      nickName: questionStore.nickName,
      gender: questionStore.gender,
      city: questionStore.city,
      province: questionStore.province,
      platform: global.platform,
      score: questionStore.score
    });
  }

  render () {
    return (
      <View className='login-view'>
        <View className='login-box'>
          <View className='login-title'>您还未登录</View>
          <View className='login-tip'>登录后可记录成绩及查看榜单</View>
          <View className='login-img'>
            <Image className='login-avatar' mode='widthFix' src='https://wlwol.cn/asset/img/login-img.png'></Image>
          </View>
          <View className='login-btns'>
            <Button className='login-btn hide' onClick={this.close.bind(this)}>暂不登录</Button>
            {/* <View className='login-btn' onClick={this.login.bind(this)}>立即登录</View> */}
            <Button className='login-btn' open-type="getUserInfo" onGetUserInfo={this.bindGetUserInfo.bind(this)}>授权登录</Button>
          </View>
        </View>
      </View>
    )
  }
}

export default LoginView 
