// 公共接口
import http from "../http"

export default {
	uploadFile: () => {
		let url = "apip/wxsp/v1/upload"
		if (process.env.NODE_ENV === "development") return `https://apitestj.jsyinghuan.com/${url}`
		if (process.env.NODE_ENV === "production") return `https://hwapij.jsyinghuan.com/${url}`
	},
	getUrl: (url) => {
		if (url === "") return ""
		if (process.env.NODE_ENV === "development") return `https://apitestp.jsyinghuan.com/storage/${url}`
		if (process.env.NODE_ENV === "production") return `https://hwapip.jsyinghuan.com/storage/${url}`
	}
}
