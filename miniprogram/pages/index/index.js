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
      name: 'pdfLib',
      data: {},
      success(res) {
        that.setData({
          fileID: res.result.fileID
        })
      }
    })
  },
  handlePreview: function () {
    if (this.data.fileID) {
      wx.cloud.downloadFile({
        fileID: this.data.fileID,
      }).then(res => {
        const filePath = res.tempFilePath
        console.log(filePath)
        wx.openDocument({
          filePath,
          fileType: 'pdf'
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