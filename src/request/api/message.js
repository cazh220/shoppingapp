// 小程序消息列表
import http from "../http"

export default {
	// 消息列表
	getMessageList: data => http("GET", "/apip/wxsp/v1/wxspaccountnotice/noticelist", data), // 获取消息列表
	readMessage: data => http("GET", "/apip/wxsp/v1/wxspaccountnotice/readnotice", data), // 阅读消息
	getUnreadMessage: data => http("GET", "/apip/wxsp/v1/wxspaccountnotice/notreadnoticenum", data), // 获取未读消息数量
	
}
