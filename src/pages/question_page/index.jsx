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
import PageView from '../../components/page_view'
import QuestionView from '../../components/question_view'
import AdView from '../../components/ad_view'
import global from '../../core/global'


@inject('questionStore')
@observer
class QuestionPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      showAnswer: false,
      isRight: false
    }
  }

  config = {
    navigationBarTitleText: '答题页面'
  }

  async componentWillMount () {
    const { questionStore } = this.props
    questionStore.changeIsPk(false);
    questionStore.initLevelData();
    // await questionStore.initAsync();
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

  choose = (index, level) => {
    const { questionStore } = this.props
    const obj = questionStore.getCurQuestion();

    var isRight = obj.right == index + 1;

    this.setState({
      showAnswer: true,
      isRight: isRight
    })

    this.refs.question.showChoose(index);

    if(isRight){
      questionStore.doRight()
      questionStore.addScore(level)
      this.refs.question.playRightSound()
    }
    else{
      questionStore.doWrong()
      this.refs.question.playWrongSound()
    }
    
    setTimeout(()=>{
      this.setState({
        showAnswer: false,
      })

      if(questionStore.wrong >= 3){
        console.log("over");
        questionStore.gameOver();
      }
      else{
        this.refs.question.next();
      }
    }, 2000)
  }
  
  render () {
    const { questionStore } = this.props

    let answerView = null;
    if(this.state.showAnswer){
      answerView = <AnswerView isRight={this.state.isRight} questionStore={questionStore}></AnswerView>
    }
    else{
      answerView = <View></View>
    }

    return (
      <PageView>
        <View className='question-page'>
          <StatusView questionStore={questionStore}></StatusView>
          <QuestionView choose={this.choose.bind(this)} ref='question'></QuestionView>
          {answerView}
        </View>
<<<<<<< HEAD
=======
        
>>>>>>> 8548137b374497811a827d1ced78bc5e607d0f89
        {
          questionStore.popUpdate && <UpdateView questionStore={questionStore}></UpdateView>
        }
        {
          questionStore.popOver && <OverView questionStore={questionStore}></OverView>
        }
      </PageView>
    )
  }
}

export default QuestionPage
