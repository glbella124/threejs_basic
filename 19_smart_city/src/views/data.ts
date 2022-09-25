/**
 * 平台类型列表
 */

export const typeList: any = {
  接入IOT设备: {
    id: 1,
    name: "接入IOT设备",
    number: 1200,
    unit: "(台)",
  },
  未处理治安事件: {
    id: 2,
    name: "未处理治安事件",
    number: 108,
    unit: "(起)",
  },
  城市电力能耗: {
    id: 3,
    name: "城市电力能耗",
    number: 75.17,
    unit: "(兆瓦时)",
  },
  今日核算采集量: {
    id: 4,
    name: "今日核算采集量",
    number: 1587,
    unit: "(人)",
  },
};

/**
 * 事件列表
 */
export const eventList= [
  {
    name: "电力",
    time: "21:45:12",
    content: "重大事故,需派人支援",
  },
  {
    name: "治安",
    time: "08:15:30",
    content: "存在隐患,需派人排除隐患",
  },
  {
    name: "火警",
    time: "10:32:00",
    content: "存在隐患,需派人排除隐患",
  },
];
