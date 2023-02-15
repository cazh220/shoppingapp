// 车辆维修
import http from "../http"

export default {
	getVehicleNumber: data => http("GET", "/apip/wxsp/v1/imgtonumber", data), // 图片获取车牌号 
	getVehicleInfo: data => http("GET", "/apip/wxsp/v1/vehicle/getvehicleinfo", data), // 车牌号 获取公司部门列表
	getApplyMaintenanceList: data => http("GET", "/apip/wxsp/v1/vehiclemaintenance/maintenancelist", data), // 获取维修列表
	getApplyMaintenanceDetail: data => http("GET", "/apip/wxsp/v1/vehiclemaintenance/maintenancedetail", data), // 获取维修详情
	postApplyMaintenance: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/addapply", data), // 保存/提交维修申请
	editApplyMaintenance: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/editapply", data), // 修改维修申请
	postMaintenanceQuoted: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/addoffer", data), // 维修报价
	postMaintenanceExamine: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/addsurvey", data), // 维修审核
	postMaintenanceProcess: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/addprocess", data), // 维修审批
	getMaintenanceProcessList: data => http("GET", "/apip/wxsp/v1/vehiclemaintenance/processlist", data), // 维修审批列表
	postMaintenanceImg: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/maintenanceimg", data), // 上传维修图片
	postMaintenanceConfirm: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/confirm", data), // 维修确认
	postMaintenanceFeedback: data => http("POST", "/apip/wxsp/v1/vehiclemaintenance/feedback", data), // 维修反馈
	getMaintenanceShopList: data => http("GET", "/apip/wxsp/v1/maintenanceshop/maintenancelist", data), // 获取维修厂列表
}
