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
import client from "../../core/taroSocket";
import PageView from '../../components/page_view'
import pagePath from '../../core/pagePath'

let screenHeight = 300;
let pkSize = 9;

@inject('questionStore')
@observer
class WaitPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            word: "匹配中",
            list: []
        }
    }

    config = {
        navigationBarTitleText: '玩家匹配'
    }

    async componentWillMount() {
        const { questionStore } = this.props
        // questionStore.initAsync();
        this.conn();
    }

    conn() {
        const { questionStore } = this.props
        let nickName = questionStore.nickName;
        // questionStore.changeClientId(questionStore.openid);

        client.init({
            nickName: nickName,
            avatarUrl: questionStore.avatarUrl,
            openid: questionStore.openid,
            gender: questionStore.gender,
        });
        
        client.on(Message.TYPE_END_MATCH, res => {
            console.log(Message.TYPE_END_MATCH, res);
            var others = [];
            res.players.forEach(item => {
                if (item.openid != questionStore.openid) {
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

            client.send(Message.TYPE_LIST_ID, {
                allSize: questionStore.allQuestion.length,
                pkSize: pkSize
            });
        })

        client.on(Message.TYPE_LOGIN, res => {
            console.log(Message.TYPE_LOGIN, res);
        });

        client.on(Message.TYPE_LIST_ID, res => {
            console.log(Message.TYPE_LIST_ID, res);
            questionStore.changePkList(res.data);

            setTimeout(() => {
                Taro.redirectTo({
                    url: '/pages/pk_question_page/index'
                })
            }, 40);
        })

        client.on(Message.TYPE_QUIT, res => {
            console.log(Message.TYPE_QUIT, res);
            client.disconnect();
        })
    }

    getUserInfo() {
        const { questionStore } = this.props
        if (!questionStore.nickName) {
            questionStore.changePopLogin(true);
        }
    }

    componentWillReact() {
        //console.log('componentWillReact')
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        console.log(nextProps, this.props);
    }

    componentDidMount() {
        console.log('wait componentDidHide', this)
    }

    componentWillUnmount() {
        console.log('wait componentWillUnmount', this)
    }

    componentDidShow() {
        pagePath.push("wait");
        console.log(pagePath.path, "page path");
    }

    componentDidHide() {
        console.log('wait componentDidHide', this)
    }

    onShareAppMessage(option) {
        // option.from === 'button'
        return global.shareData
    }

    render() {
        const { questionStore } = this.props
        if (!questionStore) {
            return <View></View>
        }
        let other = questionStore.others[0];
        if (!other) {
            return <View></View>;
        }

        let avatarUrl = questionStore.avatarUrl || "https://wlwol.cn/asset/img/boy.jpg";
        let nickName = questionStore.nickName || "点击登录账户";

        let otherAvatarUrl = other.avatarUrl || "https://wlwol.cn/asset/img/loading.gif";
        let otherNickName = other.nickName || "匹配中";

        return (
            <PageView>
                <View className='wait-page'>
                    <View className='state'>
                        <Image className='my-avatar' src={avatarUrl} onClick={this.getUserInfo.bind(this)}></Image>
                        <View className='my-name' onClick={this.getUserInfo.bind(this)}>{nickName}</View>

                        <Image className='other-avatar' src={otherAvatarUrl}></Image>
                        <View className='other-name'>{otherNickName}</View>
                    </View>

                </View>
            </PageView>
        )
    }
}

export default WaitPage 
