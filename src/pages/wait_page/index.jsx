import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Video, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import AudioView from '../../components/audio_view'
import VideoView from '../../components/video_view'
import ShareView from '../../components/share_view'
import LoginView from '../../components/login_view'
import scope from '../../utils/scope'
import global from '../../core/global'
import listener from "../../core/listener";
import Message from "../../core/message";
import client from "../../core/client";

let screenHeight = 300;

@inject('questionStore')
@observer
class WaitPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      word: "匹配中",
      list: []
    }
  }

  config = {
    navigationBarTitleText: '玩家匹配'
  }

  async componentWillMount () {
    const { questionStore } = this.props
    // questionStore.initAsync();
    this.test();
    
  }

  test(){
    const { questionStore } = this.props
    let nickName = questionStore.nickName;

    client.init("http://localhost:8899");
    client.on(Message.TYPE_CONNECT, () => {
        client.send(Message.TYPE_LOGIN, { nickName: nickName });
    });
    client.on(Message.TYPE_MESSAGE, data => {
        this.addMessage(data.player.nickName + "：" + data.msg);
    });
    client.on(Message.TYPE_LOGIN, data => {
        this.addMessage("【" + data.nickName + "  （" + data.id + "）进入房间】");
    });
    client.on(Message.TYPE_WAIT_MATCH, data => {
        console.log(Message.TYPE_WAIT_MATCH);
        console.log(data);
        this.addMessage("当前玩家个数：" + data.length);
    })
    client.on(Message.TYPE_END_MATCH, data => {
        console.log(Message.TYPE_END_MATCH);
        console.log(data);
        this.setState({
          ready: true
        })
        
        this.addMessage("匹配完成");
    })
    client.on(Message.TYPE_EXIT_MATCH, data => {
        console.log(Message.TYPE_END_MATCH);
        console.log(data);
        this.setState({
          ready: false
        })
        
        this.addMessage(data.nickName + "退出");
    })
  }

  say() {
    if(this.state.ready){
        this.send("random " + Math.random());
    }
    else{
        this.addMessage("尚未匹配完成");
    }
  }

  clear() {
      this.setState({
        list: []
      })
  }

  send(msg) {
      client.send(Message.TYPE_MESSAGE, msg);
  }

  startMatch() {
      client.send(Message.TYPE_START_MATCH);
  }

  addMessage(msg){
    console.log(msg);
    this.setState({
      list: [...this.state.list, msg]
    })
  }

  componentWillReact () {
    //console.log('componentWillReact')
  }

  componentDidMount () {
    console.log('wait componentDidHide', this)
  }

  componentWillUnmount () {
    console.log('wait componentWillUnmount', this)
  }

  componentDidShow () {
    console.log('wait componentDidShow', this)
  }

  componentDidHide () {
    console.log('wait componentDidHide', this)
  }

  onShareAppMessage (option) {
    // option.from === 'button'
    return global.shareData
  }

  onPageScroll(e){ // 滚动事件
    this.showImg()
  }

  share(){
    const { questionStore } = this.props
    questionStore.changePopShare(true)
  }

  getUserInfo(e){
    const { questionStore } = this.props
    if(!questionStore.nickName){
      questionStore.changePopLogin(true);
    }
  }

  render () {
    const { questionStore } = this.props
    let nickName = questionStore.nickName;
    let view = <View className='state-tip'>{nickName} ：{this.state.word}</View>
    
    return (
      <View className='wait-page'>
        {view}
        <View className='btn-list'>
          <View className="btn" onClick={this.clear.bind(this)}>清除</View>
          <View className="btn" onClick={this.say.bind(this)}>发送</View>
          <View className="btn" onClick={this.startMatch.bind(this)}>匹配</View>
        </View>
        
        <View className='msg-list'>
          {
            this.state.list.map((item, index) => {
              return (
                <View key={'k_' + index} className='msg-item'>
                  <View className='msg'>{item}</View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

export default WaitPage 
