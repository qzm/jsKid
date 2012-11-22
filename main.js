//程序入口
function main(){
	//调用核心库
	var $ = new jsKid();
	//初始化资源
	$.init(function(){
		c = $.Cache;
		dom=$.dom;
		sto=$.Storage;
		c.set('Counter', 0);
	});
	// document.write($.print_r($.version));
	sto.set('123',123);
	$.l(sto.get('123'));
	$.run(function(){
		time = new Date();
		if ($.Cache.get('timeCache') != time.getSeconds()) {
			dom('#timeZone').innerHTML = time.toLocaleDateString() + '<br/>' +$.t.now()+'<br/>';
			c.set('timeCache', time.getSeconds());
			// $.log(c.get('timeCache'));
			// $.l(gl.tools.UA);

		}
		time = new Date();
	});
}
