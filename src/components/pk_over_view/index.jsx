import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import global from '../../core/global'
import ShareView from '../share_view'

let innerAudioContext;

@inject('questionStore')
@observer
class PkOverView extends Component {
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
    // const { questionStore } = this.props
    // //console.log(questionStore)
    // global.updateScore({
    //   openid: questionStore.openid,
    //   score: questionStore.score
    // })
  }

  componentWillUnmount () {
    
  }

  componentDidShow () { }

  componentDidHide () { }

  goon(){
    //console.log("son goon")
    // this.props.goon();
    Taro.reLaunch({
      url: '/pages/start_page/index'
    })
  }

  share(){
    const { questionStore } = this.props
    questionStore.changePopShare(true)
  }

  render () {
    const { questionStore } = this.props
    if(!questionStore){
      console.log('questionStore.detail not init')
      return <View></View>
    }

    let other = questionStore.others[0];
    if(!other){
      return <View></View>;
    }
    let avatarUrl = questionStore.avatarUrl || "https://wlwol.cn/asset/img/boy.jpg";
    let nickName = questionStore.nickName || "未登录账户";

    let tip = '挑战成功'
    let rs = 'win'
    let player1, player2;
    if(other.score > questionStore.score){
      tip = '挑战失败'
      rs = "lost"
      player1 = {
        avatarUrl: other.avatarUrl,
        nickName: other.nickName,
        score: other.score
      };
      player2 = {
        avatarUrl: avatarUrl,
        nickName: nickName,
        score: questionStore.score
      }
    }
    else{
      player1 = {
        avatarUrl: avatarUrl,
        nickName: nickName,
        score: questionStore.score
      };
      player2 = {
        avatarUrl: other.avatarUrl,
        nickName: other.nickName,
        score: other.score
      }
    }

    return (
      <View className='pk-over-view'>
        <View className='pop-box'>
          <View className='state-tip'>{tip}</View>
          <View className={`state-face ${rs}`}></View>

          <Image className='my-avatar' src={player1.avatarUrl}></Image>
          <View className='my-name'>{player1.nickName}</View>
          <View className='my-score'>{player1.score}分</View>

          <Image className='other-avatar' src={player2.avatarUrl}></Image>
          <View className='other-name'>{player2.nickName}</View>
          <View className='other-score'>{player2.score}分</View>
          
          <View className='btns'>
            <View className='btn' onClick={this.share.bind(this)}>分享</View>
            <View className='btn' onClick={this.goon.bind(this)}>返回</View>
          </View>
        </View>

        {questionStore.popShare && <ShareView questionStore={questionStore}></ShareView>}
      </View>
    )
  }
}

export default PkOverView 
