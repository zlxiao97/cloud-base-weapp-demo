// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  PDFNet
} = require('@pdftron/pdfnet-node');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const newBuffer = event.newBuffer
  // 第三步，excel buffer to pdf buffer
  const convertToPDF = async () => {
    console.log('create exce')
    const pdfdoc = await PDFNet.PDFDoc.create()
    console.log('initSecurityHandler exce')
    await pdfdoc.initSecurityHandler()
    console.log('Convert exce')
    await PDFNet.Convert.toPdfWithBuffer(pdfdoc, newBuffer, 'xlsx')
    console.log('saveMemoryBuffer exce')
    return pdfdoc.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_linearized)
  }
  const getPdfBuffer = () => new Promise((resolve, reject) => {
    console.log('run exce')
    PDFNet.runWithCleanup(convertToPDF).then(res => {
      resolve(res)
    }).catch(err => {
      console.log('err',err)
      reject(err)
    }).then(() => {
      PDFNet.shutdown()
    })
  })
  console.log('1111')
  const newPdfBuffer = await getPdfBuffer()

  // 第四步，上传pdf，得到fileID用于小程序端下载文件并预览
  const uploadRes = await cloud.uploadFile({
    cloudPath: '预览PDF' + Date.now() + '.pdf',
    fileContent: newPdfBuffer
  })
  const {
    fileID
  } = uploadRes

  return {
    fileID
  }
}