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
    Taro.navigateTo({
      url: '/pages/rank_page/index'
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
    let nickName = questionStore.nickName || "点击登录账户";

    return (
      <View className='pk-over-view'>
        <View className='pop-box'>
          <View className='pop-title'>
            <View className='title-tip'>
            PK成绩单
            </View>
          </View>

          <Image className='my-avatar' src={avatarUrl} onClick={this.getUserInfo.bind(this)}></Image>
          <View className='my-name'>{nickName}</View>
          <View className='my-score'>{questionStore.score}</View>

          <Image className='other-avatar' src={other.avatarUrl}></Image>
          <View className='other-name'>{other.nickName}</View>
          <View className='other-score'>{other.score}</View>
          
          <View className='btns'>
            <View className='btn' onClick={this.share.bind(this)}>分享</View>
            <View className='btn' onClick={this.goon.bind(this)}>排名</View>
          </View>
        </View>

        {questionStore.popShare && <ShareView questionStore={questionStore}></ShareView>}
      </View>
    )
  }
}

export default PkOverView 
