import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

let innerAudioContext;

@inject('questionStore')
@observer
class UpdateView extends Component {
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
    const { questionStore } = this.props
    // //console.log('questionStore prop')
    // //console.log(questionStore)

    return (
      <View className='update-view'>
        <View className='update-box'>
          <View className={'title-tip word'}>题目难度</View>
          <View className={'level-tip word'}>{questionStore.curLevel.name}</View>
        </View>
      </View>
    )
  }
}

export default UpdateView 
