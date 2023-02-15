// 小程序项目模块
import http from "../http"

export default {
	userProjects: data => http("GET", "/apip/wxsp/v1/project/all", data), // 获取用户下的所有项目
	changeProject: data => http("POST", "/apip/wxsp/v1/switch/project", data), // 切换项目
}
