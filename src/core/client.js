// import io from 'socket.io-client';
const io = require('weapp.socket.io')

var socket;

function init(url){
    socket = io(url);
}

function send(type, data){
    socket.emit(type, data);
}

function on(type, callback){
    socket.on(type, callback);
}

export default {
    init,
    send,
    on
}