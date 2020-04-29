import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Video, Image, Ad, Audio } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import AudioView from '../../components/audio_view'
import VideoView from '../../components/video_view'
import PkStatusView from '../../components/pk_status_view'
import UpdateView from '../../components/update_view'
import PkOverView from '../../components/pk_over_view'
import PageView from '../../components/page_view'
import PkAnswerView from '../../components/pk_answer_view'
import LoginView from '../../components/login_view'
import QuestionView from '../../components/question_view'
import ShareView from '../../components/share_view'
import AdView from '../../components/ad_view'
import global from '../../core/global'
import client from "../../core/client";
import Message from "../../core/message";

let right = 0;
let innerAudioContext = null;
let rightSound = null;
let wrongSound = null;

@inject('questionStore')
@observer
class PkQuestionPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      showAnswer: false,
      isRight: false,
      isSelf: false,
      clickId: -1,
      action: 1
    }
  }

  config = {
    navigationBarTitleText: '答题页面'
  }

  async componentWillMount () {
    const { questionStore } = this.props
    questionStore.changeIsPk(true);
    questionStore.initPkData();
  }
  
  componentWillReact () {
    //console.log('componentWillReact')
  }

  componentDidMount () {
    client.on(Message.TYPE_CHOOSE_ANSWER, data => {
      this.serveChoose(data);
    })
  }

  componentWillUnmount () {
    client.disconnect();
  }

  componentDidShow () { }

  componentDidHide () { }

  onShareAppMessage (option) {
    // option.from === 'button'
    return global.shareData
  }

  choose = (index, level) => {
    client.send(Message.TYPE_CHOOSE_ANSWER, {
      index, level
    });
  }

  serveChoose(data){

    var index = data.obj.index;

    const { questionStore } = this.props
    const obj = questionStore.getCurQuestion();

    var isRight = obj.right == index + 1;
    var isSelf = data.player.id == questionStore.clientId;

    this.setState({
      showAnswer: true,
      isRight: isRight,
      isSelf: isSelf
    })

    this.refs.question.showChoose(index);

    if(isRight){
      if(isSelf){
        questionStore.doRight()
        questionStore.addScore(1)
        this.refs.question.playRightSound()
      }
      else{
        questionStore.doWrong()
        questionStore.addScore(1, true)
        this.refs.question.playWrongSound()
      }
    }
    else{
      if(isSelf){
        questionStore.doWrong()
        questionStore.addScore(1, true)
        this.refs.question.playWrongSound()
      }
      else{
        questionStore.doRight()
        questionStore.addScore(1)
        this.refs.question.playRightSound()
      }
    }
    
    setTimeout(()=>{
      this.setState({
        showAnswer: false,
      })

      // if(questionStore.wrong >= 3){
      //   console.log("over");
      //   questionStore.gameOver();
      // }
      // else{
      //   this.refs.question.next();
      // }

      this.refs.question.next();
      if(questionStore.popOver){
        console.log("over ===")
      }

    }, 2000)
  }

  
  render () {
    const { questionStore } = this.props

    let answerView = null;
    if(this.state.showAnswer){
      answerView = <PkAnswerView isRight={this.state.isRight} isSelf={this.state.isSelf} questionStore={questionStore}></PkAnswerView>
    }
    else{
      answerView = <View></View>
    }

    return (
      <PageView>
        <View className='pk-question-page'>
          <PkStatusView questionStore={questionStore}></PkStatusView>
          <QuestionView choose={this.choose.bind(this)} ref='question'></QuestionView>
          {answerView}
        </View>
        {
          questionStore.popOver && <PkOverView questionStore={questionStore}></PkOverView>
        }
      </PageView>
    )
  }
}

export default PkQuestionPage
