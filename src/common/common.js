export default {
	/*
	  获取权限  
	  1. route信息
	  2. 当前权限对应的key
	  3. 是否是特殊权限 2级页面以下的权限 不能通过目录匹配到 需要全局匹配
	*/
	getPermission: key => {
		return uni.getStorageSync("permissionList").includes(key)
	},

	applicationTypeList: () => {
		return [{
				label: "大修",
				value: 1
			},
			{
				label: "小修",
				value: 2
			},
			{
				label: "保养",
				value: 3
			},
			{
				label: "其它",
				value: 4
			}
		]
	},
	damageTypeList: () => {
		return [{
				text: "正常损坏",
				value: 1
			},
			{
				text: "人为损坏",
				value: 2
			},
			{
				text: "其它",
				value: 3
			}
		]
	},

	// 设施类型选择
	facilitiesList: () => {
		return [{
				value: 1,
				text: "河道"
			},
			{
				value: 2,
				text: "垃圾收集点"
			},
			{
				value: 3,
				text: "垃圾中转站"
			},
			{
				value: 4,
				text: "作业所"
			},
			{
				value: 5,
				text: "加水站"
			},
			{
				value: 6,
				text: "垃圾处置场"
			},
			{
				value: 7,
				text: "公共厕所"
			},
			{
				value: 8,
				text: "维修厂"
			},
			{
				value: 9,
				text: "加油站"
			}
		]
	},

	// 收集点类型
	collectionTypeList: () => {
		return [{
				value: 1,
				label: "垃圾桶"
			},
			{
				value: 2,
				label: "果壳箱"
			},
			{
				value: 3,
				label: "小型勾臂箱"
			},
			{
				value: 4,
				label: "垃圾池"
			}
		]
	},

	// 公厕类型列表
	publicToiletTypeList: () => {
		return [{
				value: 1,
				label: "一类"
			},
			{
				value: 2,
				label: "二类"
			}
		]
	},

	// 周几 范围选择
	weekList: () => {
		const week = [{
				value: "1",
				label: "周一"
			},
			{
				value: "2",
				label: "周二"
			},
			{
				value: "3",
				label: "周三"
			},
			{
				value: "4",
				label: "周四"
			},
			{
				value: "5",
				label: "周五"
			},
			{
				value: "6",
				label: "周六"
			},
			{
				value: "7",
				label: "周日"
			}
		]
		return [week, week]
	},
	// 小时分钟范围选择
	hmRangeList: () => {
		const hour = [{
				label: "00时",
				value: "00"
			},
			{
				label: "01时",
				value: "01"
			},
			{
				label: "02时",
				value: "02"
			},
			{
				label: "03时",
				value: "03"
			},
			{
				label: "04时",
				value: "04"
			},
			{
				label: "05时",
				value: "05"
			},
			{
				label: "06时",
				value: "06"
			},
			{
				label: "07时",
				value: "07"
			},
			{
				label: "08时",
				value: "08"
			},
			{
				label: "09时",
				value: "09"
			},
			{
				label: "10时",
				value: "10"
			},
			{
				label: "11时",
				value: "11"
			},
			{
				label: "12时",
				value: "12"
			},
			{
				label: "13时",
				value: "13"
			},
			{
				label: "14时",
				value: "14"
			},
			{
				label: "15时",
				value: "15"
			},
			{
				label: "16时",
				value: "16"
			},
			{
				label: "17时",
				value: "17"
			},
			{
				label: "18时",
				value: "18"
			},
			{
				label: "19时",
				value: "19"
			},
			{
				label: "20时",
				value: "20"
			},
			{
				label: "21时",
				value: "21"
			},
			{
				label: "22时",
				value: "22"
			},
			{
				label: "23时",
				value: "23"
			}
		]
		const min = [{
				label: "00分",
				value: "00"
			},
			{
				label: "01分",
				value: "01"
			},
			{
				label: "02分",
				value: "02"
			},
			{
				label: "03分",
				value: "03"
			},
			{
				label: "04分",
				value: "04"
			},
			{
				label: "05分",
				value: "05"
			},
			{
				label: "06分",
				value: "06"
			},
			{
				label: "07分",
				value: "07"
			},
			{
				label: "08分",
				value: "08"
			},
			{
				label: "09分",
				value: "09"
			},
			{
				label: "10分",
				value: "10"
			},
			{
				label: "11分",
				value: "11"
			},
			{
				label: "12分",
				value: "12"
			},
			{
				label: "13分",
				value: "13"
			},
			{
				label: "14分",
				value: "14"
			},
			{
				label: "15分",
				value: "15"
			},
			{
				label: "16分",
				value: "16"
			},
			{
				label: "17分",
				value: "17"
			},
			{
				label: "18分",
				value: "18"
			},
			{
				label: "19分",
				value: "19"
			},
			{
				label: "20分",
				value: "20"
			},
			{
				label: "21分",
				value: "21"
			},
			{
				label: "22分",
				value: "22"
			},
			{
				label: "23分",
				value: "23"
			},
			{
				label: "24分",
				value: "24"
			},
			{
				label: "25分",
				value: "25"
			},
			{
				label: "26分",
				value: "26"
			},
			{
				label: "27分",
				value: "27"
			},
			{
				label: "28分",
				value: "28"
			},
			{
				label: "29分",
				value: "29"
			},
			{
				label: "30分",
				value: "30"
			},
			{
				label: "31分",
				value: "31"
			},
			{
				label: "32分",
				value: "32"
			},
			{
				label: "33分",
				value: "33"
			},
			{
				label: "34分",
				value: "34"
			},
			{
				label: "35分",
				value: "35"
			},
			{
				label: "36分",
				value: "36"
			},
			{
				label: "37分",
				value: "37"
			},
			{
				label: "38分",
				value: "38"
			},
			{
				label: "39分",
				value: "39"
			},
			{
				label: "40分",
				value: "40"
			},
			{
				label: "41分",
				value: "41"
			},
			{
				label: "42分",
				value: "42"
			},
			{
				label: "43分",
				value: "43"
			},
			{
				label: "44分",
				value: "44"
			},
			{
				label: "45分",
				value: "45"
			},
			{
				label: "46分",
				value: "46"
			},
			{
				label: "47分",
				value: "47"
			},
			{
				label: "48分",
				value: "48"
			},
			{
				label: "49分",
				value: "49"
			},
			{
				label: "50分",
				value: "50"
			},
			{
				label: "51分",
				value: "51"
			},
			{
				label: "52分",
				value: "52"
			},
			{
				label: "53分",
				value: "53"
			},
			{
				label: "54分",
				value: "54"
			},
			{
				label: "55分",
				value: "55"
			},
			{
				label: "56分",
				value: "56"
			},
			{
				label: "57分",
				value: "57"
			},
			{
				label: "58分",
				value: "58"
			},
			{
				label: "59分",
				value: "59"
			}
		]
		return [hour, min, ["至"], hour, min]
	},
	// 油型大类
	oilTypeList: () => {
		return [{
				label: "汽油",
				value: 1
			},
			{
				label: "柴油",
				value: 2
			}
		]
	}
}
