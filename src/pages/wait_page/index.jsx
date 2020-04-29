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
    this.conn();
  }

  conn(){
    const { questionStore } = this.props
    let nickName = questionStore.nickName;

    client.init("http://localhost:8899");
    client.on(Message.TYPE_CONNECT, () => {
        questionStore.changeClientId(client.getId());
        client.send(Message.TYPE_LOGIN, { 
          nickName: nickName,
          avatarUrl: questionStore.avatarUrl,
          openid: questionStore.openid,
          gender: questionStore.gender,
        });
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

        var others = [];
        data.forEach(item => {
          if(item.id != questionStore.clientId){
            others.push({
              clientId: item.id,
              openid: item.openid,
              nickName: item.nickName,
              avatarUrl: item.avatarUrl,
              gender: item.gender,
              score: 0
            })
          }
        })
        questionStore.changeOthers(others);
        this.addMessage("匹配完成");

        Taro.navigateTo({
          url: '/pages/pk_question_page/index'
        })
    })

    client.on(Message.TYPE_LIST_ID, data => {
      console.log(data);
      questionStore.changePkList(data);
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
      const { questionStore } = this.props

      client.send(Message.TYPE_START_MATCH);
      client.send(Message.TYPE_LIST_ID, {
        allSize: questionStore.allQuestion.length,
        pkSize: 4
      });
  }

  endMatch(){
    client.disconnect();
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

  render () {
    const { questionStore } = this.props
    if(!questionStore){
      return <View></View>
    }
    let other = questionStore.others[0];
    if(!other){
      return <View></View>;
    }

    let avatarUrl = questionStore.avatarUrl || "https://wlwol.cn/asset/img/boy.jpg";
    let nickName = questionStore.nickName || "点击登录账户";
    
    return (
      <View className='wait-page'>
        <View className='state'>
          <Image className='my-avatar' src={avatarUrl} onClick={this.getUserInfo.bind(this)}></Image>
          <View className='my-name'>{nickName}</View>

          <Image className='other-avatar' src={other.avatarUrl}></Image>
          <View className='other-name'>{other.nickName}</View>
        </View>

        <View className='state-tip'>{nickName} ：{this.state.word}</View>

        <View className='btn-list'>
          <View className="btn" onClick={this.clear.bind(this)}>清除</View>
          <View className="btn" onClick={this.say.bind(this)}>发送</View>
          <View className="btn" onClick={this.startMatch.bind(this)}>匹配</View>
          <View className="btn" onClick={this.endMatch.bind(this)}>退出</View>
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
