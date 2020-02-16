import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Video, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import AudioView from '../../components/audio_view'
import VideoView from '../../components/video_view'
import ShareView from '../../components/share_view'
import scope from '../../utils/scope'
import global from '../../core/global'

@inject('questionStore')
@observer
class RankPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      word: "",
      ranks: [],
      myRank: '--'
    }
  }

  config = {
    navigationBarTitleText: '排行榜'
  }

  async componentWillMount () {
    const { questionStore } = this.props
    // questionStore.initAsync();

    let openid = questionStore.openid;
    let ranksRes = await global.getRanks();
    //console.log(ranksRes);
    this.setState({
      ranks: ranksRes.data
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

  render () {
    const { questionStore } = this.props

    return (
      <View className='rank-page'>
        <View className='my-rank-box'>
          <View className='my-rank'>
            <Image className='my-head' src={questionStore.avatarUrl}></Image>
            <View className='my-tip'>您当前的排名：{this.state.myRank}</View>
            <Button className='my-btn' open-type="share">
              <View className='my-ico'></View>
              <View className='my-share'>分享</View>
            </Button>
          </View>
        </View>

        <View className='rank-roles'>
          {
            this.state.ranks.slice(0, 3).map((item, index) => {
              return (
                <View key={item.openid} className={`rank-role num${index + 1}`}>
                  <Image className='rank-head' src={item.avatarUrl}></Image>
                  <View className='rank-name'>{item.nickName}</View>
                  <View className='rank-score'>总分：{item.score}</View>
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
                <View key={item.openid} className='rank-item'>
                  <View className='rank-num'>{index + 4}</View>
                  <Image className='rank-head' src={item.avatarUrl}></Image>
                  <View className='rank-nick'>{item.nickName}</View>
                  <View className='rank-score'>{item.score || 0}分</View>
                  <View className={`rank-ico platform${item.platform}`}></View>
                </View>
              );
            })
          }
        </View>
      </View>
    )
  }
}

export default RankPage 
