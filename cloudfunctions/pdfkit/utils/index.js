const config = require('../data/config')
const formData = require('../data/form.json')

const DOC_WIDTH = formData.width
const DOC_MAX_COLUMNS = 24

/** 单位换算工具 */
const getX = xPercent => xPercent * 0.01 * config.A4_WIDTH
const getY = yPercent => yPercent * 0.01 * config.A4_HEIGHT
const getPercentX = x => x * 100 / config.A4_WIDTH
const getPercentY = y => y * 100 / config.A4_HEIGHT

/** 数据插入辅助方法 */
const setText = (doc, { text, positionX, positionY, color, needWrap = false, containerWidth, containerY }) => {
  if (needWrap) {
    doc
      .fillColor(color)
      .text(text, getX(positionX), getY(containerY), { width: getX(containerWidth) });
  } else {
    doc
      .fillColor(color)
      .text(text, getX(positionX), getY(positionY));
  }

}

const setCheckBox = (doc, { text, positionX, positionY, gap = 2, boxSize = 10, color, size = config.TEXT_SIZE }) => {
  doc
    .fillColor(color)
    .fontSize(size)
    .text(text, getX(positionX), getY(positionY));
  // const textWidth = doc.widthOfString(text)
  const textHeight = doc.heightOfString(text)
  doc.strokeColor('black').rect(getX((positionX - gap)), getY(positionY + getPercentY(textHeight / 2) - getPercentY(boxSize / 2)), boxSize, boxSize).stroke()
}

/** 表格绘制辅助方法 */
const drawRect = (doc, { offsetX = 0, offsetY = 0, column = DOC_MAX_COLUMNS, color = "red", rowHeight, page }) => {
  const docPostionX = page.startX
  const docPositionY = page.startY
  doc.strokeColor(color).rect(getX(docPostionX + offsetX), getY(docPositionY + offsetY), getX(column / DOC_MAX_COLUMNS * DOC_WIDTH), getY(rowHeight)).stroke()
}

/** 文本垂直水平居中辅助方法 */
const getCenteredPostion = (doc, { offsetX = 0, offsetY = 0, column = DOC_MAX_COLUMNS, rowHeight, page, text }) => {
  const docPostionX = page.startX
  const docPositionY = page.startY
  const containerX = docPostionX + offsetX
  const containerY = docPositionY + offsetY
  const containerWidth = column / DOC_MAX_COLUMNS * DOC_WIDTH
  const containerHeight = rowHeight
  const textWidth = getPercentX(doc.widthOfString(text))
  const textHeight = getPercentY(doc.heightOfString(text))
  let needWrap = false
  if (textWidth > containerWidth) {
    needWrap = true
  }
  return {
    positionX: containerX + 0.6,
    positionY: containerY + containerHeight / 2 - textHeight / 2,
    needWrap,
    containerWidth,
    containerY
  }

}

module.exports = { setText, setCheckBox, drawRect, getCenteredPostion }