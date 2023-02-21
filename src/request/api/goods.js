// 小程序基本模块
import http from "../http"

export default {
	getGoodsList: data => http("POST", "/goods/list", data), // 商品列表
	getGoodsDetail: data => http("POST", "/goods/detail", data), // 商品详情
}