import Message from './message'
import Taro from '@tarojs/taro'
var ws;
var timer = 0;
var listeners = {};

async function init(info) {
	Taro.connectSocket({
		url: "wss://wlwol.cn/websocket",
		success: function () {
			console.log('connect success');
      clearInterval(timer);
      setTimeout(() => {
        send(Message.TYPE_LOGIN, info);
      }, 300);
      timer = setInterval(() => {
        send(Message.TYPE_PING, 0);
      }, 6000)
		}
	}).then(task => {
		// send(Message.TYPE_LOGIN, info);
		// ws.onOpen(function () {
		// 	console.log('onOpen')
		// 	send(Message.TYPE_LOGIN, info);
    // })
    ws = task;
		ws.onMessage(function (e) {
			console.log("接收数据：")
			console.log(e);
			var obj = JSON.parse(e.data);
			listeners[obj.type] && listeners[obj.type](obj);
		})
		ws.onError(function () {
			console.log('onError')
			clearInterval(timer);
		})
		ws.onClose(function (e) {
			console.log('onClose')
			clearInterval(timer);
		})
	})

}

function send(type, data) {
  console.log("send", type, ws);
	if (ws && ws.readyState == 1) {
    console.log("发送数据");
    console.log(type, data);
		ws.send({data: JSON.stringify({type,data})});
	} else {
    console.log("socket未连接");
    // setTimeout(() => {
    //   send(type, data);
    // }, 120);
	}
}

function on(type, callback) {
	listeners[type] = callback;
}

function disconnect() {
	if(ws && ws.readyState == 1){
    ws.close();
  }
	clearInterval(timer);
}


export default {
	init,
	send,
	on,
  disconnect,
  listeners
}
