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
  showAd: true,

  openid: global.readData("openid"),
  nickName: global.readData("nickName"),
  avatarUrl: global.readData("avatarUrl"),
  gender: global.readData("gender"),

  others: [
    {
      openid: '',
      nickName: '',
      avatarUrl: '',
      gender: ''
    }
  ],

  players: [],

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
    this.detail.forEach(item => {
      item.score = 0;
      item.wrong = 0;
      item.right = 0;
      item.lock = true;
    })
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
    if(this.id == this.list.length - 1){
      if(levelId < levels.length - 1){
        //console.log('level update')
        ++levelId;
        this.initLevel();
      }
      else{
        //console.log('game over')
        this.gameOver();
      }
    }
    else{
      this.id++;
    }
  },

  initLevel(){
    this.curLevel = levels[levelId];
    let tempList = this.filter(this.curLevel.list);
    this.list =  tooler.randomList(tempList, 10);
    this.levelName = this.curLevel.name;
    this.id = 0;
    //console.log(this.levelName)
    this.popUpdate = true;
    this.detail[levelId].lock = false;
    setTimeout(() => {
      this.popUpdate = false
    }, 2000);
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
    // if(this.wrong >= 3){
    //   setTimeout(()=>{
    //     this.gameOver();
    //   }, 2400)
    // }
  },

  gameOver(){
    this.popOver = true;
    global.updateScore({
      openid: this.openid,
      score: this.score
    })
  },

  addScore(n){
    //console.log('add score ' + n);
    this.score += n;
    this.detail[levelId].score += n;
  },

  addTime(n){
    this.time += n;
  },

  async initAsync() {
    //console.log('initAsync')
    let detail = [];
    let res = await global.getAllQuestion();
    levels.forEach(element => {
      element.list = [];
      detail.push({
        level: element.level,
        name: element.name,
        score: 0,
        wrong: 0,
        right: 0,
        lock: true
      })
    })

    this.detail = detail;

    res.data.forEach((element, index) => {
      let id = element.level - 1;

      if(id < levels.length){
        levels[id].list.push(element);
      }
    });

    //console.log(levels);
    levelId = 0;
    this.initLevel();
  }
})
export default questionStore