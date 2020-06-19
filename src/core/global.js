import Taro from '@tarojs/taro'
const host = 'https://wlwol.cn';
const shareData = {
    title: '太难了！80%的杰迷拿不到60分',
    desc: '测试一下你是不是真正的杰迷吧',
    path: '/pages/start_page/index?from=share', // ?后面的参数会在转发页面打开时传入onLoad方法
    // imageUrl: 'https://wlwol.cn/asset/logo.png', // 支持本地或远程图片，默认是小程序 icon
    templateId: '这是开发者后台设置的分享素材模板id',
    success() {
        //console.log('转发发布器已调起，并不意味着用户转发成功，微头条不提供这个时机的回调');
    },
    fail() {
        //console.log('转发发布器调起失败');
    }
}

const h5Debug = {
    "nickName": "王小峰",
    "gender": 1,
    "language": "zh_CN",
    "city": "Hangzhou",
    "province": "Zhejiang",
    "country": "China",
    "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DHWgKy6wNsEOTqenta2SGQk8suNl6sfmu2LBBfPhzicGBCPrtEWboiaL0NJyhicm8hPS0wzyy2yN1k35OWDB7cWPw/132",
    "openid": "openid5BBvPjJJ5lSF4C-000000",
    "code": "codesPIlU0Pwdy22F9Kz22000000"
}

let filterData = {
    weapp: false,
    tt: false,
    qq: false
}

const platform = getPlatform();
setTimeout(() => {
  initShare();
}, 300);
setTimeout(() => {
  initFilter();
}, 600);

function getUrl(type, file) {
    if (type == 1) {
        return host + '/media/image/' + file;
    } else if (type == 2) {
        return host + '/media/audio/' + file;
    } else if (type == 3) {
        return host + '/media/video/' + file;
    }
    return "";
}

function httpRequest(url, method, data, times = 0) {
    return new Promise(resolve => {
        Taro.request({
            url: url,
            data: data,
            method,
            header: {
                'content-type': 'application/json'
            },
            async success(res) {
                console.log(url, res.statusCode);
                console.log(res);
                // resolve(res);
                if(res.statusCode == 502){
                  console.warn("502错误，重新请求", times);
                  if(times > 4){
                      resolve();
                  }
                  else{
                    await sleep(900);
                    let obj = await httpRequest(url, method, data, times + 1);
                    resolve(obj);
                  }
                }
                else{
                  resolve(res);
                }
            },
            fail(res) {
                console.log("[fail request]", res);
                resolve();
            }
        })
    })
}

function getPlatform() {
    let platform = 0;
    if (process.env.TARO_ENV === 'weapp') {
        platform = 0;
    } else if (process.env.TARO_ENV === 'tt') {
        platform = 1;
    } else if (process.env.TARO_ENV === 'qq') {
        platform = 2;
    } else if (process.env.TARO_ENV === 'h5') {
        platform = 3;
    }
    console.log(`当前平台：${process.env.TARO_ENV} = ${platform}`);
    return platform;
}

async function initShare() {
    let res = await httpRequest(host + '/yun/mini/share', 'GET', {
        v: Math.random()
    });
    if (res.data) {
        let obj = res.data[process.env.TARO_ENV];
        if (obj) {
            shareData.title = obj.title;
            shareData.desc = obj.desc;
            shareData.imageUrl = obj.imageUrl;
        }

    }
}

async function initFilter() {
    let res = await httpRequest(host + '/yun/mini/filter', 'GET', {
        v: Math.random()
    });
    if (res.data) {
        console.log("filter data");
        console.log(res.data);
        filterData = res.data;
    }
}

function isFilter() {
    return filterData[process.env.TARO_ENV];
}

function getOpenid(code) {
    if (process.env.TARO_ENV === 'weapp') {
        return httpRequest(host + '/weapp/login', 'GET', {
            code: code
        });
    } else if (process.env.TARO_ENV === 'tt') {
        return httpRequest(host + '/tt/login', 'GET', {
            code: code
        });
    } else if (process.env.TARO_ENV === 'qq') {
        return httpRequest(host + '/qq/login', 'GET', {
            code: code
        });
    } else if (process.env.TARO_ENV === 'alipay') {
        return httpRequest(host + '/alipay/login', 'GET', {
            code: code
        });
    } else if (process.env.TARO_ENV === 'h5') {
        return Promise.resolve({
            data: {
                openid: h5Debug.openid
            }
        });
    }
}

async function setUser(obj) {
    let infoRes = await httpRequest(host + '/yun/user/info', 'GET', {
        openid: obj.openid
    })
    if (infoRes.data.length == 0) {
        await httpRequest(host + '/yun/user/add', 'POST', obj);
    } else {
        await httpRequest(host + '/yun/user/updateInfo', 'POST', obj);
    }
}

function getLevelQuestion(level) {
    return httpRequest(host + '/yun/question/level', 'GET', {
        level
    });
}

function getAllQuestion() {
    return httpRequest(host + '/yun/question/all', 'GET', {
        v: Math.random()
    });
}

function updateScore(obj) {
    return httpRequest(host + '/yun/user/updateScore', 'POST', obj);
}

function getRanks() {
    return httpRequest(host + '/yun/user/ranks', 'POST', {});
}

function getMyRank(openid) {
    return httpRequest(host + '/yun/user/myRank', 'POST', {
        openid: openid
    });
}

function readData(key) {
    return Taro.getStorageSync(key)
}

function saveData(key, value) {
    Taro.setStorageSync(key, value)
}

function sleep(timer) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timer);
    })

}



export default {
    host,
    getUrl,
    getOpenid,
    readData,
    saveData,
    setUser,
    httpRequest,
    getRanks,
    getMyRank,
    updateScore,
    getLevelQuestion,
    getAllQuestion,
    shareData,
    platform,
    isFilter,
    h5Debug,
    sleep
}
