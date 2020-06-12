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
    if(!questionStore){
      return <View></View>
    }
    let other = questionStore.others[0];
    if(!other){
      return <View></View>;
    }

    let avatarUrl = questionStore.avatarUrl || "https://wlwol.cn/asset/img/boy.jpg";
    let nickName = questionStore.nickName || "点击登录账户";

    const style = {
      width: (questionStore.pkId + 1) / questionStore.pkList.length * 100 + "%"
    }
    
    return (
      <View className='pk-status-view'>

        <Image className='my-avatar' src={avatarUrl} onClick={this.getUserInfo.bind(this)}></Image>
        <View className='my-name'>{nickName}</View>
        <View className='my-score'>当前得分:{questionStore.score}</View>

        <Image className='other-avatar' src={other.avatarUrl}></Image>
        <View className='other-name'>{other.nickName}</View>
        <View className='other-score'>当前得分:{other.score}</View>

        <View className='progress'>
          <View className='color' style={style}></View>
        </View>
       
      </View>
    )
  }
}

export default PkStatusView 
