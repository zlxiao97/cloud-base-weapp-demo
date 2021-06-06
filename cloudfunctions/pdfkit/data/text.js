module.exports = [
  {
    "texts": [
      {
        "dataIndex": "contractCode",
        "positionX": 67.5,
        "positionY": 11.05
      }
    ]
  },
  {
    "texts": [
      {
        "dataIndex": "signingTime",
        "positionX": 25.7,
        "positionY": 92.8
      }
    ]
  },
  {
    "texts": [
      {
        "dataIndex": "extensionPeriod",
        "positionX": 10.8,
        "positionY": 23.45,
        "formatter": (data) => `本合同延长保修责任${data[0]}月或${data[1]}公里，以先到者为准，但车辆总里程数不超过${data[2]}公里。`
      },
      {
        "dataIndex": "deductible",
        "positionX": 10.8,
        "positionY": 31.1,
        "formatter": (data) => `本合同每次事故绝对免赔为人民币${data[0]}元或损失金额的${data[1]}，两者以高者为准。`
      }
    ]
  },
  {},
  {
    "texts": [
      {
        "dataIndex": "saleStore",
        "positionX": 22.3,
        "positionY": 78.2,
      },
      {
        "dataIndex": "contactAddr",
        "positionX": 22.3,
        "positionY": 79.9,
      },
      {
        "dataIndex": "serviceLine",
        "positionX": 22.3,
        "positionY": 81.6,
      }
    ]
  }
]
