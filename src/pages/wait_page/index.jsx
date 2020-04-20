import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Video, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import AudioView from '../../components/audio_view'
import VideoView from '../../components/video_view'
import ShareView from '../../components/share_view'
import LoginView from '../../components/login_view'
import scope from '../../utils/scope'
import global from '../../core/global'

let screenHeight = 300;

@inject('questionStore')
@observer
class WaitPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      word: "匹配中",
    }
  }

  config = {
    navigationBarTitleText: '玩家匹配'
  }

  async componentWillMount () {
    const { questionStore } = this.props
    // questionStore.initAsync();
    
  }

  componentWillReact () {
    //console.log('componentWillReact')
  }

  componentDidMount () {
    console.log('wait componentDidHide', this)
    // this.props.router.setRouteLeaveHook(
    //     this.props.routes[1],
    //     this.routerWillLeave()
    // )
  }

  // routerWillLeave () {
  //   console.log("路由跳转==")
  //   return true;
  // }

  componentWillUnmount () {
    console.log('wait componentWillUnmount', this)
  }

  componentDidShow () {
    console.log('wait componentDidShow', this)
  }

  componentDidHide () {
    console.log('wait componentDidHide', this)
  }

  onShareAppMessage (option) {
    // option.from === 'button'
    return global.shareData
  }

  onPageScroll(e){ // 滚动事件
    this.showImg()
  }

  share(){
    const { questionStore } = this.props
    questionStore.changePopShare(true)
  }

  getUserInfo(e){
    const { questionStore } = this.props
    if(!questionStore.nickName){
      questionStore.changePopLogin(true);
    }
  }

  render () {
    const { questionStore } = this.props
    let avatarUrl = questionStore.avatarUrl || "https://wlwol.cn/asset/img/boy.jpg";
    let nickName = questionStore.nickName;
    let view = <View className='my-tip'>{nickName} ：{this.state.word}</View>
    
    return (
      <View className='rank-page'>
        {view}
      </View>
    )
  }
}

export default WaitPage 
