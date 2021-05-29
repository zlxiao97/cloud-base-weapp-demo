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
    wx.cloud.callFunction({
      name: 'pdfkit',
      data: {},
      success(res) {
        that.setData({
          fileID: res.result.fileID
        })
      }
    })
  },
  renamePDFAndOpen: function (savedFilePath) {
    wx.openDocument({
      filePath: savedFilePath,
      fileType: 'pdf'
    })
    // const FileSystemManager = wx.getFileSystemManager()
    // FileSystemManager.rename({
    //   oldPath: savedFilePath,
    //   newPath: wx.env.USER_DATA_PATH + '/这是一个自定义文件名.pdf',
    //   success() {
    //     wx.openDocument({
    //       filePath: wx.env.USER_DATA_PATH + '/这是一个自定义文件名.pdf',
    //       fileType: 'pdf'
    //     })
    //     wx.getSavedFileList({
    //       success (res) {
    //         console.log(res.fileList)
    //       }
    //     })
    //   },
    //   fail(err) {
    //     console.error(err)
    //   }
    // })
  },
  handlePreview: function () {
    const that = this;
    if (that.data.fileID) {
      wx.cloud.downloadFile({
        fileID: that.data.fileID,
      }).then(res => {
        const filePath = res.tempFilePath
        wx.saveFile({
          tempFilePath: filePath,
          success(res) {
            const savedFilePath = res.savedFilePath
            that.renamePDFAndOpen(savedFilePath)
          }
        })

      }).catch(error => {
        console.error(error)
      })
    } else {
      wx.showToast({
        title: '请先上传PDF',
        icon: 'none'
      })
    }
  }
})