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
    name: "中等",
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
  }
]

let levelId = 0;

const questionStore = observable({
  id: 0,
  list: [],
  curLevel: null,
  score: 0,
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
          this.initLevel();
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

  initLevelData(){
    levelId = 0;
    this.curLevel = levels[levelId];
    let tempList = this.filter(this.curLevel.list);
    this.list =  tooler.randomList(tempList, 10);
    this.levelName = this.curLevel.name;
    this.id = 0;
    this.popUpdate = true;
    // this.detail[levelId].lock = false;
    setTimeout(() => {
      this.popUpdate = false
    }, 2000);
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

  gameOver(){
    this.popOver = true;
    global.updateScore({
      openid: this.openid,
      score: this.score
    })
  },

  addScore(n, isOther = false){
    if(isOther){
      this.others[0].score += n;
    }
    else{
      this.score += n;
      this.detail[levelId].score += n;
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

    let res = await global.getAllQuestion();
    console.log("res=====", res);
    if(!res){
      await sleep(900);
      console.log("重新请求数据");
      res = await global.getAllQuestion();
    }
    res.data.forEach((element, index) => {
      let id = element.level - 1;
      if(id < levels.length){
        levels[id].list.push(element);
      }
    });

    this.allQuestion = res.data;  
  }
})
export default questionStore