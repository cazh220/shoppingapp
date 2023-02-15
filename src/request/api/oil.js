// 小程序加油模块
import http from "../http"

export default {
	getOilStations: data => http("GET", "/apij/java/appletsOilApplets/getAllStation", data), // 获取所有加油站
	getOilStationAddress: data => http("GET", "/apij/java/appletsOilApplets/getStationDetail", data), // 获取加油站地址
	getRefuelingRecord: data => http("GET", "/apij/java/appletsOilApplets/getRefuelingRecord", data), // 加油记录
	getRefuelingRecordDetail: data => http("GET", "/apij/java/appletsOilApplets/getRefuelingRecordDetail", data), // 加油记录详情
	getLastestPrice: data => http("GET", "/apij/java/appletsOilApplets/getLastPrice", data), // 最新油价信息
	getPriceRecord: data => http("GET", "/apij/java/appletsOilApplets/getPriceRecord", data), // 油价记录
	confirmPrice: data => http("GET", "/apij/java/appletsOilApplets/isAlter", data), // 油价是否已确认
	alterPrice: data => http("POST", "/apij/java/appletsOilApplets/alterPrice", data), // 油价编辑
	getOilType: data => http("GET", "/apij/java/appletsOilApplets/getProjectOil", data), // 油型
	getPriceRecordDetail: data => http("GET", "/apij/java/appletsOilApplets/getPriceRecordDetail", data), // 油价详情
	getCarDataByCarNum: data => http("GET", "/apij/java/appletsOilApplets/getCarDataByCarNum", data), // 根据车牌号获取车辆信息
	refueling: data => http("POST", "/apij/java/appletsOilApplets/refueling", data), // 加油
	getMasterCard: data => http("GET", "/apij/java/appletsOilApplets/getMasterCard", data), // 获取项目下的主卡
	getAllCards: data => http("GET", "/apij/java/appletsOilApplets/getAllCard", data), // 获取所有油卡
	rechargeCard: data => http("POST", "/apij/java/appletsOilApplets/recharge", data), // 油卡充值
	balanceRecord: data => http("GET", "/apij/java/appletsOilApplets/balanceRecord", data), // 交易记录汇总
	balanceRecordDetail: data => http("GET", "/apij/java/appletsOilApplets/balanceRecordDetail", data), // 交易记录明细
}
