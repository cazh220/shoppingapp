// 小程序基本模块
import http from "../http"

export default {
	login: data => http("POST", "/login", data), // 登录
	userDetail: data => http("POST", "/user/detail", data), // 用户信息
	userAdd: data => http("POST", "/user/add", data), // 用户注册
	editPassword: data => http("POST", "/user/editpwd", data), // 用户密码修改
}
