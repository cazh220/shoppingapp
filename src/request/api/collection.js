// 收运
import http from "../http"

export default {
	getCollectionNumber: data => http("GET", "/apip/wxsp/v1/collect/number", data), // 获取收运点数
	getCollectionGISData: data => http("GET", "/apip/wxsp/v1/collect/picture", data), // 获取GIS数据
	getCollectionGISList: data => http("GET", "/apip/wxsp/v1/show/facilities", data), // 获取GIS数据列表
	addFacilities: data => http("POST", "/apip/wxsp/v1/add/facilities", data), // 新增设施
	editFacilities: data => http("PUT", "/apip/wxsp/v1/edit/facilities", data), // 编辑设施
	getFacilitiesDetail: data => http("GET", "/apip/wxsp/v1/info/facilities", data), // 获取设施详情
	
	getCollectionVehicle: data => http("GET", "/apip/wxsp/v1/fixation/vehicle/operation", data), // 获取收运车辆列表(固定5个)
	getCollectionVehicleList: data => http("GET", "/apip/wxsp/v1/show/vehicle/operation", data), // 获取收运车辆列表
	getCollectionProcess: data => http("GET", "/apip/wxsp/v1/collection", data), // 获取收运车辆进度
	
	getCollectionAreaList: data => http("GET", "/apip/wxsp/v1/area/list", data), // 获取三级联动列表

	appletsVehicleManager: data => http("GET", "/apij/java/appletsVehicleManager/vehicleInfo", data), // 车辆统计数据
	getVehicleList: data => http("GET", "/apij/java/appletsVehicleManager/getVehicleList", data), // 车辆列表
	getVehicleLocation: data => http("GET", "/apij/java/appletsVehicleManager/viewingLocation", data), // 查看定位
	getTrackList: data => http("GET", "/apij/java/appletsVehicleManager/getTrackList", data), // 查看历史轨迹
	getVehicleAvplay: data => http("GET", "/apij/java/appletsVehicleManager/avplay", data), //  查看视频
	getChannelListByVehicleId: data => http("GET", "/apij/java/appletsVehicleManager/getChannelListByVehicleId", data), // 获取通道列表

	viewVehicleDetail: data => http("GET", "/apij/java/appletsVehicleManager/getVehicleInfo", data), //车辆弹框详情
	getVehicleGIS: data => http("POST", "/apij/java/appletsVehicleManager/vehicleGIS", data), // 车辆GIS
	getLicensePlateNumbertList: data => http("GET", "/apij/java/appletsVehicleManager/getLicensePlateNumbertList", data), // 车牌号下拉接口
	getDepartmentList: data => http("GET", "/apij/java/appletsVehicleManager/getDepartmentList", data), // 部门下拉接口

	 
	stopFFmpegTask: data => http("GET", "/apij/java/appletsVehicleManager/stopFFmpegTask", data), // 视频暂停接口



	
	
}
