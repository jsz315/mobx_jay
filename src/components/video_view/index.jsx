import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Video } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'

// let innerAudioContext;

class VideoView extends Component {


  constructor(props){
	super(props)
    this.state = {
        percent: 0,
        playing: false
    }
  }

  config = {
    navigationBarTitleText: '首页'
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
  }

  componentWillUnmount () {
    // innerAudioContext.offPlay();
    // innerAudioContext.offPause();
    // innerAudioContext.offError();
    // innerAudioContext.offTimeUpdate();
    // innerAudioContext.destroy()
  }

  componentDidShow () { }

  componentDidHide () { }

  onPlay = () => {
    //console.log('开始播放')
    this.setState({
        playing: true
    })
  }

  onPause = () => {
    //console.log('停止播放')
    this.setState({
        playing: false
    })
  }

  toggler = (e) => {
    //console.log(e)
    // if(innerAudioContext.paused){
    //     innerAudioContext.play();
    // }
    // else{
    //     innerAudioContext.pause();
    // }
    
  }
  

  render () {
    let cls = "";
    if(this.state.playing){
        cls = "pause"
    }
    return (
      <View className='video-view'>
        <Video 
        className='video' 
        src={this.props.src}
        autoplay={true}
        onPlay={this.onPlay.bind(this)} 
        onPause={this.onPause.bind(this)}></Video>
      </View>
    )
  }
}

export default VideoView 
