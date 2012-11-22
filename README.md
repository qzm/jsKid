jsKid说明文档
=============

这是一个用JavaScript+Html5技术制作的游戏

文件说明
-------

* core.js --- `核心的游戏引擎文件`

* main.js --- `游戏的主程序`


jsKid
-------

###init(function)
	属于：jsKid
	类型：function
	参数：function
	返回：null
	作用：初始化调用的资源
###run(function)
	属于：jsKid
	类型：function
	参数：function
	返回：null
	作用：以每秒30帧的速度运行参数名称的函数
###Cache
	属于：jsKid
	类型：Calss
	作用：缓存类
###map
	属于：jsKid.Cache
	类型：数组
	作用：存放缓存表
###set(key,value)
	属于：jsKid.Cache
	类型：function
	参数：String key,Object value
	作用：设置key和value
###get(key)
	属于：jsKid.Cache
	类型：function
	参数:String key
	作用：获取key值对应的value值

