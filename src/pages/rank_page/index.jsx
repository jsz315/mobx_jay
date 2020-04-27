import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Video, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import AudioView from '../../components/audio_view'
import VideoView from '../../components/video_view'
import ShareView from '../../components/share_view'
import LoginView from '../../components/login_view'
import PageView from '../../components/page_view'
import scope from '../../utils/scope'
import global from '../../core/global'

let screenHeight = 300;

@inject('questionStore')
@observer
class RankPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      word: "",
      ranks: [],
      visibles: [],
      myRank: '--'
    }
  }

  config = {
    navigationBarTitleText: '杰迷榜单'
  }

  async componentWillMount () {
    const { questionStore } = this.props
    // questionStore.initAsync();

    Taro.getSystemInfo({
      success: res => {
        console.log("res", res)
        screenHeight = res.screenHeight
      }
    })

    let openid = questionStore.openid;
    let ranksRes = await global.getRanks();
    //console.log(ranksRes);
    let visibles = ranksRes.data.slice(3).map((item, index)=>{
      return index < 10;
    })
    this.setState({
      ranks: ranksRes.data,
      visibles: visibles
    })
    let myRankRes = await global.getMyRank(openid);
    //console.log(myRankRes);
    if(myRankRes.data[0]){
      //console.log('rank = ' + myRankRes.data[0].rownumber);
      this.setState({
        myRank: myRankRes.data[0].rownumber
      })
    }
    else{
      //console.log('no your rank');
    }

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

  onPageScroll(e){ // 滚动事件
    this.showImg()
  }

  showImg(){
    let visibles = this.state.visibles;
    Taro.createSelectorQuery().selectAll('.rank-item').boundingClientRect((rect) => {
     rect.forEach((item, index) => {
      //  console.log('item.top = ' + item.top)
       if (item.top <= screenHeight) {
         visibles[index] = true
       }
     })
     this.setState({
       visibles
     })
    }).exec()
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
    let avatarUrl = questionStore.avatarUrl || "https://wlwol.cn/asset/img/boy.jpg";
    let nickName = questionStore.nickName;
    let visibles = this.state.visibles;
    console.log("nickName = " + nickName);
    let view;
    if(nickName){
      view = <View className='my-tip'>{nickName} 当前排名：{this.state.myRank}</View>
    }
    else{
      view = <View className='my-tip' onClick={this.getUserInfo.bind(this)}>点击登录查看当前排名</View>
    }
    return (
      <PageView>
        <View className='rank-page'>
          <View className='my-rank-box'>
            <View className='my-rank'>
              <Image className='my-head' src={avatarUrl} onClick={this.getUserInfo.bind(this)}></Image>
              {view}
              <View className='my-btn' onClick={this.share.bind(this)}>
                <View className='my-ico'></View>
                <View className='my-share'>分享</View>
              </View>
            </View>
          </View>
          
          <View className='rank-roles'>
            {
              this.state.ranks.slice(0, 3).map((item, index) => {
                return (
                  <View key={item.openid + '_' + index} className={`rank-role num${index + 1}`}>
                    <Image className='rank-head' src={item.avatarUrl}></Image>
                    <View className='rank-name'>{item.nickName}</View>
                    <View className='rank-score'>{item.score}分</View>
                    <View className={`rank-ico platform${item.platform}`}></View>
                  </View>
                )
              })
            }
          </View>

          <View className='rank-list'>
            {
              this.state.ranks.slice(3).map((item, index) => {
                return (
                  <View key={item.openid + ' ' + index} className='rank-item'>
                    <View className='rank-num'>{index + 4}</View>
                    {visibles[index] && <Image className='rank-head' src={item.avatarUrl}></Image>}
                    <View className='rank-nick'>{item.nickName}</View>
                    <View className='rank-score'>{item.score || 0}分</View>
                    <View className={`rank-ico platform${item.platform}`}></View>
                  </View>
                );
              })
            }
          </View>
        </View>
      </PageView>
    )
  }
}

export default RankPage 
