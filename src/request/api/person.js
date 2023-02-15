// 小程序加油模块
import http from "../http"

export default {
	getDataCount: data => http("GET", "/apij/java/personnel/statistics", data), // 获取所有加油站
	getPersonList: data => http("GET", "/apij/java/personnel/infoList", data),//pageNum,pageSize,personnelName
	getPersonLocation: data => http("GET", "/apij/java/personnel/location", data),//personnelId
	getPersonTrack: data => http("GET", "/apij/java/personnel/track", data),//personnelId,endTime,startTime

	getPersonnelGIS: data => http("POST", "/apij/java/personnel/personnelGIS", data),//人员GIS
	getPersonnelDetail: data => http("GET", "/apij/java/personnel/getPersonnelDetail", data),//人员弹框详情
	getDepartmentList: data => http("GET", "/apij/java/personnel/getDepartmentList", data),//部门下拉接口


	getPersonnelNameList: data => http("GET", "/apij/java/personnel/getPersonnelNameList", data),//姓名下拉




}
