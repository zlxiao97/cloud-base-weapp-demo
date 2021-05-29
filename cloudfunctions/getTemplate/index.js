// 云函数入口文件
const cloud = require('wx-server-sdk')
const xlsx = require('node-xlsx')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 第一步，获取模板JSON
  const fileID = 'cloud://cloud1-8gjz82po20c4c1ce.636c-cloud1-8gjz82po20c4c1ce-1306016870/odoo社区消息跟踪.xlsx'
  const excelRes = await cloud.downloadFile({
    fileID
  })
  const excelBuffer = excelRes.fileContent;
  const sheets = xlsx.parse(excelBuffer)

  // 第二步，插入数据并生成新的excel buffer
  const newSheets = [
    sheets[0].data[0],
    sheets[0].data[1],
    [2, "这是一条生成的数据", "这是一条生成的数据", "这是一条生成的数据", ],
    ...sheets[0].data.slice(3)
  ]
  const newBuffer = xlsx.build([{
    name: "pdfExcel",
    data: newSheets
  }]);

  return {
    sheets: newSheets,
    buffer: newBuffer
  }

}