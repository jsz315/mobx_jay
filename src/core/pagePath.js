let path = [];

function push(url){
  if(path.length == 0){
    path.push(url);
  }
  else{
    if(path[path.length - 1] != url){
      path.push(url);
    }
  }
  if(path.length > 2){
    path.shift();
  }
}

function prev(){
  if(path.length == 2){
    return path[0];
  }
  return null;
}

export default {
  push,
  prev,
  path
}