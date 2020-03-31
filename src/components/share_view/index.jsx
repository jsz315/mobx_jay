import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import global from '../../core/global'
import tooler from '../../core/tooler'

let innerAudioContext;

class ShareView extends Component {

  constructor(props){
	  super(props)
    this.state = {
      pop: false,
      url: null
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

  close(){
    const { questionStore } = this.props
    questionStore.changePopShare(false)
  }

  share(item){
    console.log(item);
    if(item.type == global.platform){
      return;
    }
    this.setState({
      url: `https://wlwol.cn/asset/img/share${item.type}.jpg`,
      pop: true
    })
  }

  hide(){
    this.setState({
      pop: false
    })
  }

  save(){
    this.hide();
    tooler.goDownImg(this.state.url);
  }

  render () {
    var list = [{type: 0, name: '微信'}, {type: 1, name: '抖音'}, {type: 2, name: 'QQ'}];
    var auto = global.platform
    // global.platform == 1
    var views = list.map(item=>{
      return (
        <Button key={item} className='btn' open-type={`${global.platform == item.type ? "share" : ""}`} onClick={this.share.bind(this, item)}>
          <View className={`ico type${item.type}`}></View>
          <View className='name'>{item.name}</View>
        </Button>
      )
    })

    return (
      <View className='share-view'>
        <View className='btns'>
          {views}
          <View className='close' onClick={this.close.bind(this)}></View>
        </View>
        {
          this.state.pop && (
            <View className='mask'>
              <View className='pop-box'>
                <Image className='pop-img' mode='widthFix' src={this.state.url}></Image>
                <View className='pop-btns'>
                  <View className='pop-btn' onClick={this.hide.bind(this)}>我知道了</View>
                  <View className='pop-btn save' onClick={this.save.bind(this)}>保存图片</View>
                </View>
              </View>
            </View>
          )
        }
        
      </View>
    )
  }
}

export default ShareView 
