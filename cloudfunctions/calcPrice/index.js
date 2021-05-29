// 云函数入口文件
const cloud = require('wx-server-sdk')
const xlsx = require('node-xlsx')
const {
  PDFNet
} = require('@pdftron/pdfnet-node');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 

  


  return {
    sheets,
    fileID: pdfFileID
  }
}