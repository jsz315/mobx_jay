import Message from './message'
var ws;
var timer = 0;
var listeners = {};

function init(info) {
  ws = new WebSocket("wss://wlwol.cn/websocket");
  ws.onopen = (e) => {
    console.log("serve open");
    console.log(e);
    this.send(Message.TYPE_LOGIN, info);

    clearInterval(timer);
    timer = setInterval(() => {
      this.send(Message.TYPE_PING, 0);
    }, 6000)
  }

  ws.onclose = (e) => {
    console.log("serve close");
    console.log(e);
    clearInterval(timer);
  }

  ws.onmessage = (e) => {
    console.log("接收数据：")
    console.log(e);
    var obj = JSON.parse(e.data);
    listeners[obj.type] && listeners[obj.type](obj);
  }

  ws.onerror = (e) => {
    console.log("serve error");
    console.log(e);
  }
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
  listeners
}
