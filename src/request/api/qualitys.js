// 小程序质量模块
import http from "../http"

export default {
	//创建上报
	inspectReport: data => http("POST", "/apip/wxsp/v1/inspect/report", data), // 创建上报
	getPersonnel: data => http("GET", "/apip/wxsp/v1/personnel/job", data), //环卫工
	getVehicle: data => http("GET", "/apip/wxsp/v1/vehicle/job", data), // 环卫车
	getPersonnelorVehicle: data => http("GET", "/apip/wxsp/v1/inspect/report", data), //查询附近环卫工或环卫车
	viewPersonnelorVehicle: data => http("GET", "/apip/wxsp/v1/vehicle/personnel", data), //根据人或车获取详情
	
	//上报记录
	getPending: data => http("GET", "/apip/wxsp/v1/inspect/report/pending", data), //待处理列表
	postDispose: data => http("POST", "/apip/wxsp/v1/inspect/report/dispose", data), //处理
	getProcessed: data => http("GET", "/apip/wxsp/v1/inspect/report/processed", data), //已处理列表
	getProcessedInfo: data => http("GET", "/apip/wxsp/v1/inspect/report/info", data), //查看详情
	postInvestigate: data => http("POST", "/apip/wxsp/v1/inspect/investigate", data), //审查
	getFinished: data => http("GET", "/apip/wxsp/v1/inspect/report/finished", data), //已完成列表
	getAssessList: data => http("GET", "/apip/wxsp/v1/assess", data), // 考核标准下拉
}
