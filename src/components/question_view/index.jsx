import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Video, Image, Ad, Audio } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import AudioView from '../../components/audio_view'
import VideoView from '../../components/video_view'
import StatusView from '../../components/status_view'
import UpdateView from '../../components/update_view'
import OverView from '../../components/over_view'
import AnswerView from '../../components/answer_view'
import LoginView from '../../components/login_view'
import ShareView from '../../components/share_view'
import AdView from '../../components/ad_view'
import global from '../../core/global'

let right = 0;
let innerAudioContext = null;
let rightSound = null;
let wrongSound = null;
let loseSound = null;
let winSound = null;
let resultSound = null;

@inject('questionStore')
@observer
class QuestionView extends Component {

  constructor(props){
    super(props)
    this.state = {
      clickId: -1,
      action: 1
    }
  }

  config = {
    navigationBarTitleText: '答题页面'
  }

  componentWillMount () {
    const { questionStore } = this.props
    // questionStore.initAsync();

    if(process.env.TARO_ENV === 'h5'){
        console.log("测试版本不播放音频");
        return;
    }
    
    rightSound = Taro.createInnerAudioContext();
    rightSound.autoplay = false;
    rightSound.obeyMuteSwitch = false;
    // rightSound.volume = 1;
    rightSound.src = 'https://wlwol.cn/asset/sound/right.mp3'

    wrongSound = Taro.createInnerAudioContext();
    wrongSound.autoplay = false;
    wrongSound.obeyMuteSwitch = false;
    // wrongSound.volume = 1;
    wrongSound.src = 'https://wlwol.cn/asset/sound/wrong.mp3'

    loseSound = Taro.createInnerAudioContext();
    loseSound.autoplay = false;
    loseSound.obeyMuteSwitch = false;
    // loseSound.volume = 1;
    loseSound.src = 'https://wlwol.cn/asset/sound/lose.mp3'

    winSound = Taro.createInnerAudioContext();
    winSound.autoplay = false;
    winSound.obeyMuteSwitch = false;
    // winSound.volume = 1;
    winSound.src = 'https://wlwol.cn/asset/sound/win.mp3'

    resultSound = Taro.createInnerAudioContext();
    resultSound.autoplay = false;
    resultSound.obeyMuteSwitch = false;
    // resultSound.volume = 1;
    resultSound.src = 'https://wlwol.cn/asset/sound/result.mp3'

    innerAudioContext = Taro.createInnerAudioContext();
    innerAudioContext.autoplay = false;
    innerAudioContext.obeyMuteSwitch = false;
    // innerAudioContext.volume = 1;
    // innerAudioContext.src = this.props.src
    innerAudioContext.onPlay(() => {
        console.log('开始播放')
        questionStore.changeAudioPlaying(true)
    })
    innerAudioContext.onPause(()=>{
        console.log('暂停播放')
        questionStore.changeAudioPlaying(false)
    })
    innerAudioContext.onStop(()=>{
      console.log('停止播放')
        questionStore.changeAudioPlaying(false)
    })
    innerAudioContext.onEnded(()=>{
      console.log('结束播放')
        questionStore.changeAudioPlaying(false)
    })
    innerAudioContext.onError((error) => {
        //console.log(error)
    })
    innerAudioContext.onTimeUpdate((res) => {
        let n = Math.floor(innerAudioContext.currentTime / innerAudioContext.duration * 100)
        console.log(n)
    })
  }

  componentWillReact () {
    //console.log('componentWillReact')
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  click = (index, level, e) => {
    innerAudioContext.stop();
    this.props.choose(index, level);
  }

  showChoose(index){
    this.setState({
      clickId: index
    })
  }

  playRightSound(){
    rightSound.play()
  }

  playWrongSound(){
    wrongSound.play()
  }

  playLoseSound(){
    loseSound.play()
  }

  playWinSound(){
    winSound.play()
  }

  playResultSound(){
    resultSound.play()
  }

  next(){
    const { questionStore } = this.props
    questionStore.next()

    Taro.pageScrollTo({
      scrollTop: 0
    })

    this.setState({
      clickId: -1,
      action: 2
    })

    setTimeout(()=>{
      this.setState({
        action: 1
      })
    }, 600)
  }

  toggler(){
    const { questionStore } = this.props
    if(innerAudioContext.paused){
      console.log('暂停=》播放')
        innerAudioContext.play();
        questionStore.changeAudioPlaying(true)
    }
    else{
      console.log('播放=》停止')
        innerAudioContext.stop();
        questionStore.changeAudioPlaying(false)
    }
  }

  render () {
    const { questionStore } = this.props
    
    // const obj = questionStore.list[questionStore.id];
    const obj = questionStore.getCurQuestion();
    let qid = questionStore.isPk ? questionStore.pkId : questionStore.id;

    console.log(obj, '题目数据', Math.random())
    if(!obj){
      return <View></View>
    }
    right = obj.right
    const { answer1, answer2, answer3, answer4, question, type, file } = obj
    const list = [answer1, answer2, answer3, answer4].map((item, index) => {
      let c = String.fromCharCode(65 + index);
      return (
        <View key={`${c}.${item}`} className={`answer ${this.state.clickId == index ? 'selected' : ''}`} onClick={this.click.bind(this, index, obj.level)}>{c}. {item}</View>
      )
    })

    let mediaView = null;
    let url = global.getUrl(type, file)
    
    if(type == 1){
      mediaView = <Image className='image' mode="widthFix" src={url}></Image>
    }
    else if(type == 2){
      innerAudioContext.src = url
      console.log("innerAudioContext.volume " + innerAudioContext.volume);
      // Taro.showToast({title: "当前音量：" + innerAudioContext.volume, icon: 'none'})

      mediaView = <AudioView volume={innerAudioContext.volume} className='audio' toggler={this.toggler.bind(this)}></AudioView>
    }
    else if(type == 3){
      mediaView = <VideoView className='video' src={url}></VideoView>
    }
    else{
      mediaView = ''
    }
    
    // let showAd = false;
    // if(global.platform == 1 && questionStore.showAd){
    //   showAd = true;
    // }

    return (
      <View className='question-view'>
        <View className={`move ${this.state.action == 1 ? "moveIn" : "moveOut"}`}>
          <View className='question'>
            <Text>{qid + 1}. {question}</Text>
            <View className='media'>
              {mediaView}
            </View>
          </View>
          <View className={`list ${questionStore.showAd == false ? "hide-ad" : ""}`}>
            {list}
          </View>
        </View>
      </View>
    )
  }
}

export default QuestionView
