import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

let innerAudioContext;

class PkAnswerView extends Component {
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
  

  render () {
    const { questionStore, isRight, isSelf } = this.props
    //console.log('questionStore prop isRight ' + isRight)
    
    var tip1 = '';
    var tip2 = '';

    if(isRight){
      if(isSelf){
        tip1 = '你答对了';
        tip2 = '你的积分+1';
      }
      else{
        tip1 = '对方答对了';
        tip2 = '对方积分+1';
      }
    }
    else{
      if(isSelf){
        tip1 = '你答错了';
        tip2 = '对方积分+1';
      }
      else{
        tip1 = '对方答错了';
        tip2 = '你的积分+1';
      }
    }

    return (
      <View className='pk-answer-view'>
        <View className={`answer-box ${isRight ? 'right' : 'wrong'}`}>
          <View className='state'></View>
          <View className={'state-tip word'}>- {tip2} -</View>
          <View className={'title-tip word'}>{tip1}</View>
        </View>
      </View>
    )
  }
}

export default PkAnswerView 
