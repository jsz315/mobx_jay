import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

let innerAudioContext;

@inject('questionStore')
@observer
class PkStatusView extends Component {
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

  getUserInfo(e){
    const { questionStore } = this.props
    if(!questionStore.nickName){
      questionStore.changePopLogin(true);
    }
  }

  render () {
    const { questionStore } = this.props
    //console.log('questionStore prop')
    //console.log(questionStore)
    if(!questionStore){
      //console.log('questionStore not init');
      return <View></View>
    }
    let ary = ['', 'man', 'woman'];
    let sex = ary[questionStore.gender];
    let avatarUrl = questionStore.avatarUrl || "https://wlwol.cn/asset/img/boy.jpg";
    let nickName = questionStore.nickName || "点击登录账户";

    let other = questionStore.others[0];
    if(!other){
      return <View></View>;
    }


    return (
      <View className='pk-status-view'>

        <Image className='my-avatar' src={avatarUrl} onClick={this.getUserInfo.bind(this)}></Image>
        <View className='my-name'>{nickName}</View>
        <View className='my-score'>得分: {questionStore.score}</View>

        <Image className='other-avatar' src={other.avatarUrl}></Image>
        <View className='other-name'>{other.nickName}</View>
        <View className='other-score'>得分: {other.score}</View>
       
      </View>
    )
  }
}

export default PkStatusView 
