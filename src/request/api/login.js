// 小程序基本模块
import http from "../http"

export default {
	login: data => http("POST", "/login", data), // 登录
	
	
	
	
	sendSmsCode: data => http("GET", "/apip/wxsp/v1/sendsms/sendsms", data), // 发送短信验证码
	validateSmsCode: data => http("GET", "/apip/wxsp/v1/sendsms/wxspcheckverifycode", data), // 校验短信验证码
	editPassword: data => http("POST", "/apip/wxsp/v1/wxspaccount/updatepassword", data), // 修改密码
}
