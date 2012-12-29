

//jsKid 说明

// 随机取出数组中的一个元素

["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"].random();

// 继承对象
// 继承后会覆盖原有的默认值，未定义的，会自动添加默认值

args={name:'jQuery'};
var _args=Object.extend({
		name:'jsKid',
		version:'1.0'
	},args);

 var xhr=window.XMLHttpRequest||window.ActiveXObject('Mircosoft.XMLHttp')||window.ActiveXObject('msxml.XMLHttp')