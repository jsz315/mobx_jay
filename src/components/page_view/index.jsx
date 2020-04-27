import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Progress, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.less'
import ShareView from '../../components/share_view'
import LoginView from '../../components/login_view'
import UpdateView from '../../components/update_view'
import OverView from '../../components/over_view'
import AdView from '../../components/ad_view'

@inject('questionStore')
@observer
class PageView extends Component {
  constructor(props){
	  super(props)
    this.state = {
      
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
    
  }

  componentWillUnmount () {
    
  }

  componentDidShow () { }

  componentDidHide () { }

  share(){
    const { questionStore } = this.props
    questionStore.changePopShare(true)
  }

  getUserInfo(e){
    console.log("click getUserInfo")
    const { questionStore } = this.props
    if(!questionStore.nickName){
      questionStore.changePopLogin(true);
    }
    else{
      console.log('用户已经登陆');
    }
  }

  render () {
    const { questionStore } = this.props
    if(!questionStore){
      return <View></View>
    }
    return (
      <View className='page-view'>
        {this.props.children}
        {
          questionStore.showAd && <AdView questionStore={questionStore}></AdView>
        }
        {
          questionStore.popLogin && <LoginView questionStore={questionStore}></LoginView>
        }
        {
          questionStore.popShare && <ShareView questionStore={questionStore}></ShareView>
        }
        {
          questionStore.popUpdate && <UpdateView questionStore={questionStore}></UpdateView>
        }
        {
          questionStore.popOver && <OverView questionStore={questionStore}></OverView>
        }
      </View>
    )
  }
}

export default PageView 
