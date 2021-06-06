//index.js
const app = getApp()

Page({
  data: {
    fileID: ''
  },

  onLoad: function () {
    if (!wx.cloud) {
      return
    }
  },

  handleTest: function () {
    const that = this
    wx.showLoading({
      title: '正在生成文件...',
    })
    wx.cloud.callFunction({
      name: 'pdfkit',
      data: {},
      success(res) {
        that.setData({
          fileID: res.result.fileID
        }, () => {
          that.handlePreview()
        })
      },
      error(err) {
        console.error(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  renamePDFAndOpen: function (name, tempFileURL) {
    // 利用 downloadFile API 可以通过 filePath 同时重命名文件，文件路径需要加环境变量 wx.env.USER_DATA_PATH
    wx.downloadFile({
      url: tempFileURL,
      filePath: wx.env.USER_DATA_PATH + '/' + name,
      success(res) {
        if (res.statusCode === 200) {
          wx.showLoading({
            title: '正在打开文件...',
          })
          wx.openDocument({
            filePath: res.filePath,
            fileType: 'pdf',
            showMenu: true, // 允许发送文件到其他聊天
          }).then(() => {
            wx.hideLoading()
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })

  },
  handlePreview: function () {
    const that = this;
    if (that.data.fileID) {
      wx.showLoading({
        title: '正在下载文件...',
      })
      // 用上传后获得的 fileID 换取临时链接
      wx.cloud.callFunction({
        name: 'getFile',
        data: {
          fileID: that.data.fileID
        },
        success(res) {
          const {
            tempFileURL
          } = res.result[0] || {}
          if (tempFileURL) {
            // 默认不能直接打开临时链接文件，下载后才可以打开
            that.renamePDFAndOpen('机动车延长保修服务合同.pdf', tempFileURL)
          }
        },
        error(err) {
          console.error(err)
          wx.hideLoading()
        },
      })
    } else {
      wx.showToast({
        title: '请先上传PDF',
        icon: 'none'
      })
    }
  }
})