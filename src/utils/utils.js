// 公共方法
const utils = {
	// 生成唯一id
	createUUID: () => {
		let d = new Date().getTime()
		let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			let r = (d + Math.random() * 16) % 16 | 0
			d = Math.floor(d / 16)
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
		})
		return uuid
	},

	// 深拷贝
	deepCopy: obj => {
		if (!obj) return
		let newObj
		try {
			newObj = obj.constructor && obj.constructor === Array ? [] : {}
			newObj.constructor = obj.constructor
		} catch (e) {
			newObj = []
		}
		if (typeof obj !== "object") {
			return
		} else {
			for (let prop in obj) {
				if (!obj[prop] || obj[prop].constructor === RegExp || obj[prop].constructor === Date) {
					newObj[prop] = obj[prop]
				} else if (typeof obj[prop] === "object") {
					// 递归
					newObj[prop] = utils.deepCopy(obj[prop])
				} else {
					newObj[prop] = obj[prop]
				}
			}
		}
		return newObj
	},

	// 防抖
	debounce: (fn, wait = 1000, immediate = false) => {
		let timer = null
		return function(...args) {
			// 立即执行的功能（timer为空表示首次触发）
			if (immediate && !timer) {
				fn.apply(this, args)
			}
			// 有新的触发，则把定时器清空
			timer && clearTimeout(timer)
			// 重新计时
			timer = setTimeout(() => {
				fn.apply(this, args)
			}, wait)
		}
	},

	// 节流
	throttle: (fn, wait = 1000) => {
		// 上一次执行时间
		let previous = 0
		return function(...args) {
			// 当前时间
			let now = +new Date()
			if (now - previous > wait) {
				previous = now
				fn.apply(this, args)
			}
		}
	},

	// 图片编码
	getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = error => reject(error)
		})
	},

	// 中国标准时间转为常规日期格式   Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间) => 2019-03-07 00:00:00
	forMatDate(date) {
		function formatTen(num) {
			return num > 9 ? num + "" : "0" + num
		}
		const d = new Date(date)
		return d.getFullYear() + "-" + formatTen(d.getMonth() + 1) + "-" + formatTen(d.getDate()) + " " + formatTen(d.getHours()) + ":" + formatTen(d.getMinutes()) + ":" +
			formatTen(d.getSeconds())
	},

	// 日期转为中国标准时间  2019-03-07 00:00:00 => Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间)
	parserDate(date) {
		let t = Date.parse(date)
		if (!isNaN(t)) {
			return new Date(Date.parse(date.replace(/-/g, "/")))
		}
	},

	// 数组分割为指定长度的数组
	sliceArrFn(array, size) {
		let result = []
		for (let x = 0; x < Math.ceil(array.length / size); x++) {
			let start = x * size
			let end = start + size
			result.push(array.slice(start, end))
		}
		return result
	},

	// 获取当月的初末时间
	currentMonthStartEnd() {
		function getMonth(type, months) {
			var d = new Date()
			var year = d.getFullYear()
			var month = d.getMonth() + 1
			if (Math.abs(months) > 12) {
				months = months % 12
			}
			if (months != 0) {
				if (month + months > 12) {
					year++
					month = (month + months) % 12
				} else if (month + months < 1) {
					year--
					month = 12 + month + months
				} else {
					month = month + months
				}
			}
			month = month < 10 ? "0" + month : month
			var date = d.getDate()
			var firstday = year + "-" + month + "-" + "01"
			var lastday = ""
			if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
				lastday = year + "-" + month + "-" + 31
			} else if (month == "02") {
				if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
					lastday = year + "-" + month + "-" + 29
				} else {
					lastday = year + "-" + month + "-" + 28
				}
			} else {
				lastday = year + "-" + month + "-" + 30
			}
			var day = ""
			if (type == "s") {
				day = firstday
			} else {
				day = lastday
			}
			return day
		}
		return [getMonth("s", 0), getMonth("e", 0)]
	},


}
export default utils
