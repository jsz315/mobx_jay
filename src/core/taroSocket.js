import Message from './message'
import Taro from '@tarojs/taro'
var ws;
var timer = 0;
var listeners = {};

function init() {
    ws = Taro.connectSocket({
        url: "wss://wlwol.cn/websocket",
        success: function () {
            console.log('connect success')
        }
    }).then(task => {
        task.onOpen(function () {
            console.log('onOpen')
            send(Message.TYPE_LOGIN, info);

            clearInterval(timer);
            timer = setInterval(() => {
                send(Message.TYPE_PING, 0);
            }, 6000)
        })
        task.onMessage(function (msg) {
            console.log("接收数据：")
            console.log(e);
            var obj = JSON.parse(e.data);
            listeners[obj.type] && listeners[obj.type](obj);
        })
        task.onError(function () {
            console.log('onError')
            clearInterval(timer);
        })
        task.onClose(function (e) {
            console.log('onClose: ', e)
            clearInterval(timer);
        })
    })

}

function send(type, data) {
    if (ws && ws.readyState == 1) {
        ws.send(JSON.stringify({
            type,
            data
        }));
    } else {
        console.log("socket未连接")
    }
}

function on(type, callback) {
    listeners[type] = callback;
}

function disconnect() {
    ws.close();
    clearInterval(timer);
}


export default {
    init,
    send,
    on,
    disconnect,
}
