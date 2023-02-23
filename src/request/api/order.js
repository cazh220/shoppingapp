// 小程序基本模块
import http from "../http"

export default {
	createOrder: data => http("POST", "/order/add", data), // 创建订单
	listOrder: data => http("POST", "/order/list", data), // 订单列表
	stateOrder: data => http("POST", "/order/state", data), // 订单状态修改
}