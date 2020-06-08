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
import client from "../../core/websocket";
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

        // client.init("http://localhost:7788");
        client.init({
            nickName: nickName,
            avatarUrl: questionStore.avatarUrl,
            openid: questionStore.openid,
            gender: questionStore.gender,
        });

        questionStore.changeClientId(questionStore.openid);

        // client.on(Message.TYPE_CONNECT, () => {
        //     questionStore.changeClientId(client.getId());
        //     client.send(Message.TYPE_LOGIN, { 
        //       nickName: nickName,
        //       avatarUrl: questionStore.avatarUrl,
        //       openid: questionStore.openid,
        //       gender: questionStore.gender,
        //     });
        //     this.startMatch();
        // });

        // client.on(Message.TYPE_MESSAGE, data => {
        //     this.addMessage(data.player.nickName + "：" + data.msg);
        // });
        // client.on(Message.TYPE_LOGIN, data => {
        //     this.addMessage("【" + data.nickName + "  （" + data.id + "）进入房间】");
        // });
        // client.on(Message.TYPE_WAIT_MATCH, data => {
        //     console.log(Message.TYPE_WAIT_MATCH);
        //     console.log(data);
        //     this.addMessage("当前玩家个数：" + data.length);
        // })

        client.on(Message.TYPE_END_MATCH, res => {
            console.log(Message.TYPE_END_MATCH);
            console.log(res);

            this.setState({
                ready: true
            })

            var others = [];
            res.players.forEach(item => {
                if (item.openid != questionStore.clientId) {
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

            client.send(Message.TYPE_LIST_ID, {
                allSize: questionStore.allQuestion.length,
                pkSize: pkSize
            });

            setTimeout(() => {
                Taro.redirectTo({
                    url: '/pages/pk_question_page/index'
                })
            }, 40);
        })

        client.on(Message.TYPE_LIST_ID, res => {
            console.log(res);
            questionStore.changePkList(res.data);
        })

        client.on(Message.TYPE_QUIT, res => {
            console.log(Message.TYPE_QUIT);
            console.log(res);
            this.setState({
                ready: false
            })

            // this.addMessage(data.nickName + "退出");
        })
    }

    say() {
        if (this.state.ready) {
            this.send("random " + Math.random());
        }
        else {
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

    endMatch() {
        client.disconnect();
    }

    getUserInfo() {
        console.log('getUserInfo')
        const { questionStore } = this.props
        if (!questionStore.nickName) {
            questionStore.changePopLogin(true);
        }
    }

    addMessage(msg) {
        console.log(msg);
        this.setState({
            list: [...this.state.list, msg]
        })
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

                    <View className='debug'>
                        <View className='state-tip'>{nickName} ：{this.state.word}</View>

                        <View className='btn-list'>
                            <View className="btn" onClick={this.clear.bind(this)}>清除</View>
                            <View className="btn" onClick={this.say.bind(this)}>发送</View>
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
                </View>
            </PageView>
        )
    }
}

export default WaitPage 
