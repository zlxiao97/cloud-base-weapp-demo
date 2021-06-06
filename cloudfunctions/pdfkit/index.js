// 云函数入口文件
const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit');

cloud.init()

/** demo 数据 */
const demo = require('./demo/data.json')
const USE_DEMO_DATA = true
const demoData = USE_DEMO_DATA ? demo : {}

/** 绘制参数 */
const config = require('./data/config')

/** 表格数据 */
const formData = require('./data/form.json')

/** 其他字段数据 */
const textData = require('./data/text')

/** 工具类 */
const utils = require('./utils')
const {
  setText,
  setCheckBox,
  drawRect,
  getCenteredPostion
} = utils;

/** PDF绘制程序 */
const getPDFBuffer = async () => {
  return new Promise((resolve) => {
    /** 创建 PDF 给定文档配置 */
    const doc = new PDFDocument({
      margin: 0,
      font: 'fonts/puhui/Alibaba-PuHuiTi-Medium.ttf',
      size: 'A4'
    });

    /** 全局字体大小配置 */
    doc.fontSize(config.TEXT_SIZE)

    /** PDFBuffer */
    const buf = []
    doc.on('data', (chunk) => {
      buf.push(chunk)
    });
    doc.on('end', () => {
      const buffer = Buffer.concat(buf)
      resolve(buffer)
    })

    /** 逐页绘制 */
    formData.pages.forEach((page, index) => {
      if (index) {
        doc.addPage()
      }
      /** 底图：空白合同 */
      doc.image(`img/page${index + 1}.jpg`, {
        width: config.A4_WIDTH,
        height: config.A4_HEIGHT,
        align: 'center',
        valign: 'center'
      })

      const drawRow = (lastOffsetY, row) => {
        /** 绘制边框，预览表格定位用代码 */
        // drawRect(doc, { offsetX: 0, offsetY: lastOffsetY, rowHeight: row.height, page })
        const drawFiled = field => {
          /** 绘制边框，预览表格定位用代码 */
          // drawRect(doc, { offsetX: field.startX, offsetY: lastOffsetY, rowHeight: row.height, column: field.column, color: 'blue', page })
          /** 插入数据 */
          if (field.dataIndex && demoData[field.dataIndex]) {
            const fieldData = demoData[field.dataIndex]
            const position = getCenteredPostion(doc, {
              offsetX: field.startX,
              offsetY: lastOffsetY,
              rowHeight: row.height,
              column: field.column,
              page,
              text: fieldData
            })
            setText(doc, {
              text: fieldData,
              color: config.TEXT_BLUE_COLOR,
              ...position
            })
          }
        }
        if (row.fields) {
          row.fields.forEach(drawFiled)
        }
        return lastOffsetY + row.height
      }
      const drawForm = (page) => page.rows.reduce(drawRow, 0)
      /** 绘制表格 */
      drawForm(page)
      /** 个别字段单独绘制 */
      const curPageText = textData[index]
      if (curPageText && curPageText.texts) {
        const texts = curPageText.texts
        texts.forEach(text => {
          let fieldData = demoData[text.dataIndex]
          if (text.formatter) {
            fieldData = text.formatter(fieldData)
          }
          setText(doc, {
            text: fieldData,
            color: config.TEXT_BLUE_COLOR,
            positionX: text.positionX,
            positionY: text.positionY,
          })
        })
      }
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