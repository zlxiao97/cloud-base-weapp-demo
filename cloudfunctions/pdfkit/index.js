// 云函数入口文件
const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit');

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

cloud.init()

const getPDFBuffer = async () => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({
      margin: 0,
      font: 'fonts/puhui/Alibaba-PuHuiTi-Medium.ttf',
      size: 'A4'
    });
    const buf = []

    doc.on('data', (chunk) => {
      buf.push(chunk)
    });

    doc.on('end', () => {
      const buffer = Buffer.concat(buf)
      resolve(buffer)
    })
    doc.image('img/demo_empty.jpg', {
      width: A4_WIDTH,
      height: A4_HEIGHT,
      align: 'center',
      valign: 'center'
    })
    doc
      .fillColor([192, 80, 77])
      .fontSize(10)
      .text('熊巍', 0.32 * A4_WIDTH, 0.158 * A4_HEIGHT);

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