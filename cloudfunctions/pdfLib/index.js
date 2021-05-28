// 云函数入口文件
const cloud = require('wx-server-sdk')
const pdfLib = require('pdf-lib')

const { PDFDocument, StandardFonts, rgb } = pdfLib
cloud.init()


async function createPdf() {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const fontSize = 30
  page.drawText('这是一段中文文本!', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  })

  return await pdfDoc.save()
}

// 云函数入口函数
exports.main = async (event, context) => {
  const pdfBytes = await createPdf()
  const buffer = Buffer.from(pdfBytes)
  const {fileID}  = await cloud.uploadFile({
    cloudPath: 'demo.pdf',
    fileContent: buffer,
  })
  return {
    fileID
  }
}