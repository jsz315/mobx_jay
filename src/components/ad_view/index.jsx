import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Ad } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

@inject('questionStore')
@observer
class AdView extends Component {
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

  adLoad(e){
    console.log('adLoad')
    console.log(e)
  }

  adError(e){
    console.log('adError')
    console.log(e)
  }

  adClose(e){
    console.log('adClose')
    console.log(e)
    const { questionStore } = this.props
    questionStore.changeShowAd(false)
  }
  
  render () {
    // const { questionStore } = this.props
    // let ad = null
    // if(questionStore.showAd){
    //   ad = <Ad
    //         unit-id='ci3fkkbfado53fcek6'
    //         ad-intervals={30}
    //         onLoad={this.adLoad.bind(this)}
    //         onError={this.adError.bind(this)}
    //         onClose={this.adClose.bind(this)}
    //       />
    // }
    // else{
    //   ad = <View></View>
    // }

    return (
      <View className='ad-view'>
          <Ad
            unit-id='ci3fkkbfado53fcek6'
            ad-intervals={30}
            onLoad={this.adLoad.bind(this)}
            onError={this.adError.bind(this)}
            onClose={this.adClose.bind(this)}
          />
      </View>
    )
  }
}

export default AdView 
