// import io from 'socket.io-client';
const io = require('weapp.socket.io')

var socket;

function init(url){
    socket = io(url);
    console.log(socket, 'socket');
    console.log(socket, window);
    setTimeout(()=>{
      console.log('timer start');
      setTimeout(() => {
        console.log('timer end');
      }, 30);
    }, 3000)
}

function send(type, data){
    socket.emit(type, data);
}

function on(type, callback){
    socket.on(type, callback);
}

function disconnect(){
  try{
    socket.destroy();
  }
  catch(e){
    console.log("-----")
    console.log(e);
  }
}

function getId(){
  return socket.id;
}

export default {
    init,
    send,
    on,
    disconnect,
    getId
}