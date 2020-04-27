import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Video, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import AudioView from '../../components/audio_view'
import VideoView from '../../components/video_view'
import ShareView from '../../components/share_view'
import PageView from '../../components/page_view'
import scope from '../../utils/scope'
import global from '../../core/global'


@inject('questionStore')
@observer
class StartPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      showUserBtn: false
    }
  }

  config = {
    navigationBarTitleText: '开始页面'
  }

  async componentWillMount () {
    this.initData();
  }

  async initData(){
    const { questionStore } = this.props
    let openid = questionStore.openid;
    if(!openid){
      //console.log('scope.login')
      let loginRes = await scope.login();
      if(loginRes){
        let getOpenidRes = await global.getOpenid(loginRes.code);
        openid = getOpenidRes.data.openid;
        //console.log('openid = ' + openid);
        questionStore.changeOpenid(openid);
      }
    }
    console.log('openid = ' + openid);
  }

  saveUser(userInfo){
    const { questionStore } = this.props
    questionStore.changeNickName(userInfo.nickName);
    questionStore.changeAvatarUrl(userInfo.avatarUrl);
    questionStore.changeGender(userInfo.gender);

    global.setUser({
      openid: questionStore.openid,
      avatarUrl: questionStore.avatarUrl,
      nickName: questionStore.nickName,
      gender: questionStore.gender,
      city: questionStore.city,
      province: questionStore.province,
      platform: global.platform
    });
  }

  componentWillReact () {
    //console.log('componentWillReact')
  }

  componentDidMount () {
    console.log('start componentDidMount', this)
  }

  componentWillUnmount () { 
    console.log('start componentWillUnmount', this)
  }

  componentDidShow () {
    console.log('start componentDidShow', this)
  }

  componentDidHide () {
    
    console.log('start componentDidHide', this)
  }

  onShareAppMessage (option) {
    // option.from === 'button'
    return global.shareData
  }

  onConfirm = (e) => {
    //console.log(e.detail.value)
  }

  jump = (n, e) => {
    const { questionStore } = this.props
    if(n == 1){
      questionStore.reset();
      Taro.navigateTo({
        url: '/pages/question_page/index'
      })
    }
    else if(n == 2){
      questionStore.reset();
      Taro.navigateTo({
        url: '/pages/wait_page/index'
      })
    }
    else{
       Taro.navigateTo({
        url: '/pages/rank_page/index'
      })
    }
   
  }

  bindGetUserInfo(e){
    console.log(e);
    if(e.detail.userInfo){
      this.saveUser(e.detail.userInfo);
      this.setState({
        showUserBtn: false
      })
    }
    else{
      Taro.showToast({title: '请先授权获取用户数据', icon: 'none'})
    }
  }

  bindContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  }

  render () {
    const { questionStore } = this.props

    // {
    //       this.state.showUserBtn == true && (
    //         <View className='mask'>
    //           <View className='pop'>
    //             <View className='user-tip'>无需注册，直接点击下面按钮即可使用当前账户登录</View>
    //             <Button className='user-btn' open-type="getUserInfo" onGetUserInfo={this.bindGetUserInfo.bind(this)}>授权登录</Button>
    //           </View>
    //         </View>
    //       )
    //     }

    //<Button className="btn" open-type="contact" bindcontact="handleContact">联系我们</Button>
    //<Button className="btn" open-type="contact" onContact={this.bindContact.bind(this)}>联系我们</Button>

    return (
      <PageView>
        <View className='start-page'>
          <View className='btns'>
            <View className="btn" onClick={this.jump.bind(this, 1)}>开始测试</View>
            <View className="btn" onClick={this.jump.bind(this, 2)}>PK模式</View>
            <View className="btn" onClick={this.jump.bind(this, 3)}>查看榜单</View>
          </View>
        </View>
      </PageView>
    )
  }
}

export default StartPage 
