import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

let innerAudioContext;

@inject('questionStore')
@observer
class AudioView extends Component {


  constructor(props){
	super(props)
    this.state = {
        percent: 0,
        playing: false,
        tip: '点击播放音频片段'
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
    // innerAudioContext = Taro.createInnerAudioContext();
    // innerAudioContext.autoplay = true;
    // innerAudioContext.src = this.props.src
    // innerAudioContext.onPlay(() => {
    //     //console.log('开始播放')
    //     this.setState({
    //         playing: true
    //     })
    // })
    // innerAudioContext.onPause(()=>{
    //     //console.log('停止播放')
    //     this.setState({
    //         playing: false
    //     })
    // })
    // innerAudioContext.onError((error) => {
    //     //console.log(error)
    // })
    // innerAudioContext.onTimeUpdate((res) => {
    //     let n = Math.floor(innerAudioContext.currentTime / innerAudioContext.duration * 100)
    //     //console.log(n)
    //     this.setState({
    //         percent: n
    //     })
    // })

    // tt.showShareMenu({
    //     success (res) {
    //         //console.log(`showShareMenu 调用成功`);
    //     },
    //     fail (res) {
    //         //console.log(`showShareMenu 调用失败`);
    //     }
    // });
  }

  componentWillUnmount () {
    //console.log('audio componentWillUnmount')
    // innerAudioContext.offPlay();
    // innerAudioContext.offPause();
    // innerAudioContext.offError();
    // innerAudioContext.offTimeUpdate();
    // innerAudioContext.destroy()
  }

  componentDidShow () {
    //console.log('audio componentDidShow')
  }

  componentDidHide () {
    //console.log('audio componentDidHide')
  }

  toggler = (e) => {
    //console.log(e)
    // if(innerAudioContext.paused){
    //     innerAudioContext.play();
    // }
    // else{
    //     innerAudioContext.pause();
    // }
    this.props.toggler();
  }
  

  render () {
    const { questionStore } = this.props
    if(!questionStore){
      return <View></View>
    }
    let cls = "";
    // if(questionStore.audioPlaying){
    //     cls = "pause"
    // }
    console.log(`questionStore.audioPlaying = ${questionStore.audioPlaying}`)
    return (
      <View className='audio-view'>
        <View className='poster'></View>
        <View className='tip'>
          <View className='word'>{this.state.tip}</View>
          <View className='help'>如听不到声音，请尝试调节音量</View>
        </View>
        <View className={`btn ${cls}`} onClick={this.toggler.bind(this)}></View>
      </View>
    )
  }
}

export default AudioView 
