//程序入口
function main(){
	//调用核心库
	var $ = new jsKid();
	//初始化资源
	$.init(function(){
		c  =$.Cache;
		dom=$.dom;
	});
	//动画循环
	$.run(function(){
		if ($.Cache.get('timeCache') != $.t.sec()) {
			dom('#timeZone').innerHTML = $.t.now();
			c.set('timeCache', $.t.sec());
			$.l('Tick');
		}
	});
}
