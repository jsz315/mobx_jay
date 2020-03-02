import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

let innerAudioContext;

@inject('questionStore')
@observer
class StatusView extends Component {
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
    return (
      <View className='status-view'>
        <Image className='avatar' src={avatarUrl} onClick={this.getUserInfo.bind(this)}></Image>
        <View className='status'>
          <View className='info'>
            <View className='name' onClick={this.getUserInfo.bind(this)}>{nickName}</View>
            <View className={`gender ${sex}`}></View>
          </View>
          <View className='info'>
            <View className='level'>Lv.{questionStore.curLevel.level}</View>
            <View className='score'>得分: {questionStore.score}</View>
          </View>
        </View>

        <View className='title'>
          <View className='type'>{questionStore.levelName}: </View>{questionStore.id + 1}/{questionStore.list.length}
        </View>
      </View>
    )
  }
}

export default StatusView 
