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
import AdView from '../../components/ad_view'
import global from '../../core/global'

let right = 0;
let innerAudioContext = null;
let rightSound = null;
let wrongSound = null;

@inject('questionStore')
@observer
class QuestionPage extends Component {

  constructor(props){
	super(props)
  this.state = {
    showAnswer: false,
    isRight: false,
    clickId: -1
  }
    // this.state = {
    //   video: 'https://wlwol.cn/asset/1578261425430.mp4',
    //   image: 'https://wlwol.cn/asset/jay7.jpeg',
    //   question: "混合双打d",
    //   type: 0,
    //   answers: [
    //     "方法1",
    //     "方法2",
    //     "方法3",
    //     "方法4",
    //   ]
    // }
  }

  config = {
    navigationBarTitleText: '答题页面'
  }

  componentWillMount () {
    const { questionStore } = this.props
    questionStore.initAsync();

    
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

    // innerAudioContext = tt.createInnerAudioContext();
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

  onShareAppMessage (option) {
    // option.from === 'button'
    return global.shareData
  }

  choose = (index, level, e) => {
    const { questionStore } = this.props
    //console.log(index)
    //console.log(e)
    if(index + 1 == right){
      //console.log("right");
      //console.log("wrong");
      questionStore.doRight();
      questionStore.addScore(level)
      rightSound.play()
      this.setState({
        isRight: true
      })
    }
    else{
      //console.log("wrong");
      questionStore.doWrong();
      this.setState({
        isRight: false
      })
      wrongSound.play()
    }
    
    this.setState({
      showAnswer: true,
      clickId: index
    })

    setTimeout(()=>{
      this.setState({
        showAnswer: false,
        clickId: -1
      })

      if(questionStore.wrong >= 3){
        console.log("over");
        questionStore.gameOver();
      }
      else{
        Taro.pageScrollTo({
          scrollTop: 0
        })
        questionStore.next()
      }
    }, 2000)

    innerAudioContext.stop();
  }
  
  goon(){
    //console.log("parent goon")
    // this.setState({
    //   popUpdate: false
    // })
    // const { questionStore } = this.props
    // questionStore.changePopOver(false);
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
    //console.log("questionStore")
    //console.log(questionStore)
    if(questionStore.list.length == 0){
      return <View></View>
    }
    const obj = questionStore.list[questionStore.id];
    right = obj.right
    const { answer1, answer2, answer3, answer4, question, type, file } = obj
    const list = [answer1, answer2, answer3, answer4].map((item, index) => {
      let c = String.fromCharCode(65 + index);
      return (
        <View key={`${c}.${item}`} className={`answer ${this.state.clickId == index ? 'selected' : ''}`} onClick={this.choose.bind(this, index, obj.level)}>{c}. {item}</View>
      )
    })

    let mediaView = null;
    let url = global.getUrl(type, file)
    //console.log('media = ' + url)
    
    if(type == 1){
      mediaView = <Image className='image' mode="widthFix" src={url}></Image>
    }
    else if(type == 2){
      innerAudioContext.src = url
      console.log("innerAudioContext.volume " + innerAudioContext.volume);
      // innerAudioContext.obeyMuteSwitch = false;

      // Taro.showToast({title: "当前音量：" + innerAudioContext.volume, icon: 'none'})

      mediaView = <AudioView volume={innerAudioContext.volume} className='audio' toggler={this.toggler.bind(this)}></AudioView>
    }
    else if(type == 3){
      mediaView = <VideoView className='video' src={url}></VideoView>
    }
    else{
      mediaView = ''
    }
  

    let popView = null;
    //console.log('questionStore.popUpdate = ' + questionStore.popUpdate)
    if(questionStore.popUpdate){
      popView = <UpdateView questionStore={questionStore}></UpdateView>
      questionStore.changeShowAd(true);
    }
    else if(questionStore.popOver){
      popView = <OverView goon={this.goon.bind(this)} questionStore={questionStore}></OverView>
    }
    else{
      popView = <View></View>
    }

    let answerView = null;
    if(this.state.showAnswer){
      //console.log("this.state.isRight = " + this.state.isRight);
      answerView = <AnswerView isRight={this.state.isRight} questionStore={questionStore}></AnswerView>
    }
    else{
      answerView = <View></View>
    }

    let showAd = false;
    // if(global.platform == 1 && questionStore.showAd){
    //   showAd = true;
    // }

    return (
      <View className='question-page'>
        <StatusView questionStore={questionStore}></StatusView>
        <View className='question'>
          <Text>{questionStore.id + 1}. {question}</Text>
          <View className='media'>
            {mediaView}
          </View>
        </View>
        <View className={`list ${questionStore.showAd == false ? "hide-ad" : ""}`}>
          {list}
        </View>
        {popView}
        {answerView}
        {
          showAd && (
            <AdView questionStore={questionStore}></AdView>
          )
        }
      </View>
    )
  }
}

export default QuestionPage
