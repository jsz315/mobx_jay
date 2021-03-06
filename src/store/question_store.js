import Taro, { Component } from '@tarojs/taro'
import { observable } from 'mobx'
import global from '../core/global'
import tooler from '../utils/tooler'

let levels = [
  {
    level: 1,
    name: "初级",
    list: []
  },
  {
    level: 2,
    name: "普通",
    list: []
  },
  {
    level: 3,
    name: "高级",
    list: []
  },
  {
    level: 4,
    name: "资深",
    list: []
  },
  {
    level: 5,
    name: "骨灰",
    list: []
  }
]

let levelId = 0;

function getSaveScore(){
  var n = global.readData("score");
  n = Number(n);
  if(isNaN(n)){
    return 0;
  }
  return n;
}

const questionStore = observable({
  id: 0,
  list: [],
  curLevel: null,
  score: getSaveScore(),
  level: 1,
  right: 0,
  wrong: 0,
  time: 0,
  shareTimes: 0,
  popShare: false,
  popOver: false,
  popUpdate: false,
  popLogin: false,
  levelName: '',

  audioPlaying: false,
  audioSrc: null,
  detail: [],
  showAd: false,

  allQuestion: [],
  pkList: [],
  pkId: 0,
  isPk: false,
  popQuit: false,
  clientId: '',

  openid: global.readData("openid"),
  nickName: global.readData("nickName"),
  avatarUrl: global.readData("avatarUrl"),
  gender: global.readData("gender"),

  others: [
    {
      clientId: '',
      openid: '',
      nickName: '',
      avatarUrl: '',
      gender: '',
      score: 0
    }
  ],

  players: [],

  changeOthers(value){
    console.log("changeOthers", value);
    this.others = value;
  },

  changePopQuit(value){
    this.popQuit = value;
  },

  changeClientId(value){
    this.clientId = value;
  },

  changeIsPk(value){
    this.isPk = value
  },

  changePkId(value){
    this.pkId = value
  },

  changePkList(value){
    this.pkList = value;
  },
  
  changeShowAd(value){
    this.showAd = value
  },

  changePopLogin(value){
    this.popLogin = value
  },

  changeAudioSrc(value){
    this.audioSrc = value
  },

  changeAudioPlaying(value){
    console.log(`changeAudioPlaying ${value}`)
    this.audioPlaying = value
  },

  reset(){
    levelId = 0;
    this.id = 0;
    this.popOver = false;
    this.score = 0;
    this.level = 1;
    this.right = 0;
    this.wrong = 0;
    this.pkId = 0;
    this.isPk = false;
    this.popQuit = false;
    this.detail.forEach(item => {
      item.score = 0;
      item.wrong = 0;
      item.right = 0;
    //   item.lock = true;
    })
    this.others = [
      {
        clientId: '',
        openid: '',
        nickName: '',
        avatarUrl: '',
        gender: '',
        score: 0
      }
    ];
  },

  addPlay(){

  },

  removePlay(){

  },

  changePopOver(value){
    this.popOver = value
  },

  changePopShare(value){
    this.popShare = value
  },

  checkOver(){
    if(this.isPk){
      if(this.pkId >= this.pkList.length - 1){
        return true;
      }
    }
    else{
      if(this.wrong >= 3){
        return true;
      }
      if(this.id >= this.list.length - 1){
        if(levelId < levels.length - 1){
          
        }
        else{
          return true;
        }
      }
    }
    return false;
  },

  next() {
    console.log("next", Math.random());
    if(this.isPk){
      if(this.pkId >= this.pkList.length - 1){
        this.gameOver();
      }
      else{
        this.pkId++;
      }
    }
    else{
      if(this.id >= this.list.length - 1){
        if(levelId < levels.length - 1){
          ++levelId;
          this.initLevelData();
        }
        else{
          this.gameOver();
        }
      }
      else{
        this.id++;
      }
    }
  },

  resetLevelData(){
    levelId = 0;
    this.initLevelData();
  },

  initLevelData(){
    this.curLevel = levels[levelId];
    // let tempList = this.filter(this.curLevel.list);
    let tempList = this.curLevel.list;
    this.list =  tooler.randomList(tempList, 5);
    this.levelName = this.curLevel.name;
    this.id = 0;
    this.popUpdate = true;
    // this.detail[levelId].lock = false;
    setTimeout(() => {
      this.popUpdate = false
    }, 2400);
  },

  initPkData(){
    
  },

  getCurQuestion(){
    if(this.isPk && this.pkList.length > 0){
      var id = this.pkList[this.pkId];
      return this.allQuestion[id];
    }
    if(this.list.length > 0){
      return this.list[this.id];
    }
    return {};
  },

  filter(list){
    console.log('global.filter = ' + global.isFilter());
    if(global.isFilter()){
      return list.filter(item => item.type != 2);
    }
    return list;
  },

  changeOpenid(value){
    this.openid = value;
    global.saveData('openid', value);
  },

  changeNickName(value){
    this.nickName = value;
    global.saveData('nickName', value);
  },

  changeAvatarUrl(value){
    this.avatarUrl = value;
    global.saveData('avatarUrl', value);
  },

  changeGender(value){
    this.gender = value;
    global.saveData('gender', value);
  },

  doRight() {
    this.right++;
    this.detail[levelId].right += 1;
  },

  doWrong(){
    this.wrong++;
    this.detail[levelId].wrong += 1;
  },

  async gameOver(){
    this.popOver = true;
    if(this.isPk){
      return;
    }
    global.saveData("score", this.score);
    global.setUser({
      openid: questionStore.openid,
      avatarUrl: questionStore.avatarUrl,
      nickName: questionStore.nickName,
      gender: questionStore.gender,
      city: questionStore.city,
      province: questionStore.province,
      platform: global.platform,
      score: questionStore.score
    })
  },

  addScore(n, isOther = false){
    if(this.isPk){
      if(isOther){
        this.others[0].score += 1;
      }
      else{
        this.score += 1;
      }
    }
    else{
      if(isOther){
        this.others[0].score += n;
      }
      else{
        this.score += 4;
        this.detail[levelId].score += 4;
      }
    }
    
  },

  addTime(n){
    this.time += n;
  },

  async initAsync() {
    let detail = [];
    levels.forEach(element => {
      element.list = [];
      detail.push({
        level: element.level,
        name: element.name,
        score: 0,
        wrong: 0,
        right: 0,
        // lock: true
      })
    })

    this.detail = detail;

    if(this.allQuestion.length > 0){
      console.log("使用缓存数据");
    }
    else{
      let res = await global.getAllQuestion();
      console.log("网络请求数据", res);
      if(!res){
        await sleep(900);
        console.log("重新请求数据");
        res = await global.getAllQuestion();
      }
      this.allQuestion = res.data;
    }

    console.log("过滤前总数", this.allQuestion.length);
    this.allQuestion = this.filter(this.allQuestion);
    console.log("过滤后总数", this.allQuestion.length)
    
    this.allQuestion.forEach((element, index) => {
      let id = element.level - 1;
      if(id < levels.length){
        levels[id].list.push(element);
      }
    });

    // this.allQuestion = res.data;  
  }
})
export default questionStore