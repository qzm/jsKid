//程序入口
function main(){
	//调用核心库
	$ = jsGame;
	c = jsGame.Cache;
	dom=$.dom;
	$.init(function(){
		c.set('Counter', 0);
	});
	// document.write($.print_r($.version));
	$.run(function(){
		time = new Date();
		if ($.Cache.get('timeCache') != time.getSeconds()) {
			dom('#timeZone').innerHTML = time.toLocaleDateString() + '<br/>' +$.t.now()+'<br/>'+$.print_r($.version);
			c.set('timeCache', time.getSeconds());
			$.log(123);
		}
		time = new Date();
	});
}
