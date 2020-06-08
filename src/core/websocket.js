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
    // if(obj.type == Message.TYPE_MESSAGE){
    //     this.addMessage(obj.data);
    // }
    // else if(obj.type == Message.TYPE_LOGIN){
    //     this.addMessage(obj.player.nickName + "登录成功");
    // }
    // else if(obj.type == Message.TYPE_QUIT){
    //     this.addMessage(obj.player.nickName + "退出房间");
    //     this.addMessage("自动销毁房间");
    //     this.disconnect();
    // }
    // else if(obj.type == Message.TYPE_WAIT_MATCH){
    //     this.addMessage("当前玩家个数：" + obj.players.length);
    // }
    // else if(obj.type == Message.TYPE_END_MATCH){
    //     ready = true;
    //     this.addMessage("匹配完成");
    // }
    // else if(obj.type == Message.TYPE_LIST_ID){
    //     console.log(obj);
    //     this.questions = obj.data;
    //     this.questionId = 0;
    // }
    // else if(obj.type == Message.TYPE_CHOOSE_ANSWER){
    //     console.log(obj);
    //     this.answerId = obj.data.index;
    //     setTimeout(()=>{
    //         this.answerId = -1;
    //         this.questionId++;
    //     }, 3000)
    // }
    // else if(obj.type == Message.TYPE_PING){
    //     console.log(obj);
    // }
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
}
