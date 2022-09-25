import axios from "axios";

const baseUrl: string = "http://127.0.0.1:4523/m1/1670937-0-default/api/";

/**
 * 获取城市信息面板
 * @returns
 */
export function getSmartCityInfo() {
  return axios.get(`${baseUrl}smartcity/info`);
}

/**
 * 获取城市事件列表
 * @returns
 */
export function getSmartCityList() {
  return axios.get(`${baseUrl}smartcity/list`);
}
