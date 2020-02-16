import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import global from '../../core/global'

let innerAudioContext;

class OverView extends Component {
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

  render () {
    const { questionStore } = this.props
    if(!questionStore){
      console.log('questionStore.detail not init')
      return <View></View>
    }

    return (
      <View className='over-view'>
        <View className='pop-box'>
          <View className='pop-title'>
            <View className='title-tip'>
            杰迷成绩单
            </View>
          </View>

          <View className='row-box row-head'>
            <View className='row-name'>难度</View>
            <View className='row-right'>答对</View>
            <View className='row-score'>得分</View>
          </View>
          {
            questionStore.detail.map((item, index) => {
              return (
                <View className='row-box'>
                  <View className='row-name'>{item.name}</View>
                  <View className='row-right'>{item.right}</View>
                  <View className='row-score'>{item.score}</View>
                </View>
              );
            })
          }
          <View className='row-total'>
            总成绩：
            <View className='total-score'>{questionStore.score}</View>
          </View>

          <View className='score-type'>{questionStore.curLevel.name}杰迷</View>
          
          <View className='btns'>
            <Button className='btn' open-type="share">分享</Button>
            <Button className='btn' onClick={this.goon.bind(this)}>排名</Button>
          </View>
        </View>
      </View>
    )
  }
}

export default OverView 
