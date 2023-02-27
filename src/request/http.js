// 请求封装
var API_URL = "http://localhost:8080" // 请求地址

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

export default (method, url, data) => {
	return new Promise((resolve, reject) => {
		uni.request({
				url: `${API_URL}${url}`,
				data,
				method: method || "GET",
				header: {}
			})
			.then(data => {
				const [error, res] = data
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
	})
}
