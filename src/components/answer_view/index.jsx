import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

let innerAudioContext;

class AnswerView extends Component {
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
    const { questionStore, isRight } = this.props
    //console.log('questionStore prop isRight ' + isRight)
    let tip = null;
    if(isRight){
      tip = <View className={'title-tip word'}>获得积分 +4</View>
    }
    else{
      tip = <View className={'title-tip word'}>累计错误 X {questionStore.wrong}</View>
    }
    return (
      <View className='answer-view'>
        <View className={`answer-box ${isRight ? 'right' : 'wrong'}`}>
          <View className='state'></View>
          <View className={'state-tip word'}>- {isRight ? '回答正确' : '回答错误'} -</View>
          {tip}
        </View>
      </View>
    )
  }
}

export default AnswerView 
