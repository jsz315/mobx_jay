import Taro from '@tarojs/taro'

//下载图片
function goDownImg(url){

  let imgPath1 = url;

  Taro.getSetting({

    success(res) {
      debugger
      console.log(res)
      if (!res.authSetting['scope.writePhotosAlbum']) {
        //没有授权

        Taro.authorize({

          scope: 'scope.writePhotosAlbum',

          success() {

            downloadImgToAlbum(imgPath1);

          },

          fail() {

            Taro.showToast({

              title: '需授权才能保存到相册',
          
              icon: 'none',
          
              duration: 2000
          
            })

          }

        })

      } else {
        //已授权

        downloadImgToAlbum(imgPath1);

      }

    }

  })

}

function downloadImgToAlbum(imgPath1) {

  Taro.showToast({

    title: '正在保存，请稍等',

    icon: 'none',

    duration: 2000

  })

  //下载图片

  downloadHttpImg(imgPath1)

    .then((res) => {

      sharePosteCanvas(res)

    })

  //生成海报

  //this.drawBall(imgPath1);

}

function downloadHttpImg(httpImg){

  return new Promise(((resolve, reject) => {

    Taro.downloadFile({

      url: httpImg,

      success: (res) => {

        if (res.statusCode === 200) {

          resolve(res.tempFilePath)

        } else {

          Taro.showToast({

            title: '图片下载失败！',

            icon: 'none',

            duration: 1000

          })

        }

      },

      fail: (res) => {

        Taro.showToast({

          title: '提示图片下载失败！',

          icon: 'none',

          duration: 1000

        })

      }

    })

  }))

}

function sharePosteCanvas(imgUrl){

  Taro.saveImageToPhotosAlbum({

    filePath: imgUrl,

    success(res) {

      Taro.showToast({

        title: '图片已保存到相册',

        icon: 'none',

        duration: 1000

      })

    },

    fail(err) {

      Taro.showToast({

        title: '图片保存失败',

        icon: 'none',

        duration: 1000

      })

    }

  })

}

export default {
  goDownImg
}