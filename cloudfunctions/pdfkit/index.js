// 云函数入口文件
const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit');
const fs = require('fs');

cloud.init()

const getPDFBuffer = async () => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buf = []

    doc.on('data', (chunk) => {
      buf.push(chunk)
    });

    doc.on('end', () => {
      const buffer = Buffer.concat(buf)
      resolve(buffer)
    })
    // doc
    //   .font('fonts/puhui/Alibaba-PuHuiTi-Medium.ttf')
    //   .fontSize(25)
    //   .text('我爱你中国!', 100, 100);
    doc.image('img/demo.png', 0, 0, {
      width: 1200,
      height: 2000,
      align: 'center',
      valign: 'center'
    })
    doc.end();
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const buffer = await getPDFBuffer()

  const {
    fileID
  } = await cloud.uploadFile({
    cloudPath: 'demo.pdf',
    fileContent: buffer,
  })
  return {
    fileID
  }
}