import client from "./taroSocket";
import Message from './message'

let running = false;

const player = {
  "nickName": "八度空间",
  "gender": 1,
  "language": "zh_CN",
  "city": "Hangzhou",
  "province": "Zhejiang",
  "country": "China",
  "avatarUrl": "https://wlwol.cn/asset/img/ai.jpg",
  "openid": "openid5BBvPjJJ5lSF4C-000000",
  "code": "codesPIlU0Pwdy22F9Kz22000000"
}

function init(){
  running = true;
  var res = {
    players: [player]
  }
  console.log("机器人初始化");
  client.listeners[Message.TYPE_END_MATCH](res);
  // client.send(Message.TYPE_USE_AI);
}

function choose(){
  if(!running) return;
  var res = {
    data: {
      index: Math.floor(Math.random() * 4)
    },
    player: player
  }
  client.listeners[Message.TYPE_CHOOSE_ANSWER](res);
}

function setRunning(v){
  running = v;
}
function getRunning(){
  return running;
}

export default {
  init,
  setRunning,
  getRunning,
  choose
}
