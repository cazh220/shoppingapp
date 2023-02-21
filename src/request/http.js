// 请求封装
var API_URL = "http://localhost:8080" // 请求地址
if (process.env.NODE_ENV === "development")
{
	// API_URL = "https://apitestj.jsyinghuan.com" // 请求地址
}
let goLogin = () => {
	uni.showToast({
		icon: "none",
		title: "请登录"
	})
	setTimeout(function() {
		uni.reLaunch({
			url: "/pages/index/index"
		})
	}, 1000);
}

// 免token接口组
// let exemptTokeUrls = [
// 	"/login",
// 	"/apip/wxsp/v1/sendsms/sendsms",
// 	"/apip/wxsp/v1/sendsms/wxspcheckverifycode",
// 	"/apip/wxsp/v1/wxspaccount/updatepassword"
// ]

export default (method, url, data) => {
	return new Promise((resolve, reject) => {
		// const token = uni.getStorageSync('token') || ""
		// if (token || exemptTokeUrls.includes(url)) {
			// console.log("url", url)
		// if (exemptTokeUrls.includes(url)) {
			uni.request({
					url: `${API_URL}${url}`,
					data,
					method: method || "GET",
					header: {}
				}) 
				.then(data => {
					const [error, res] = data
					console.log("ERORR", error)
					if (error) {
						reject(error.msg)
					} else {
						if (res.data.code === 200) {
							resolve(res.data)
						} else {
							if (res.data.code === -1000) {
								// 登录态异常，销毁登录态storage信息
								uni.removeStorageSync("token")
								uni.removeStorageSync("login_user")
								goLogin()
								reject(res.data.msg)
							} else {
								reject(res.data.msg)
							}
						}
					}
				})
		// } else {
		// 	goLogin()
		// 	reject("请登录")
		// }
	})
}
