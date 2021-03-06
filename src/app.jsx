import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
// import Question from './pages/question'
import StartPage from './pages/start_page'

import counterStore from './store/counter'
import questionStore from './store/question_store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  counterStore,
  questionStore
}

// counterStore.initAsync();

class App extends Component {

  config = {
    pages: [
      'pages/start_page/index',
      'pages/rank_page/index',
      'pages/question_page/index',
      'pages/wait_page/index',
      'pages/pk_question_page/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    }
  }

  componentDidMount () {

  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <StartPage />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
