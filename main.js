//程序入口
function main(){
	//调用核心库
	$ = jsGame;
	c = jsGame.Cache;
	$.init(function(){
		c.set('Counter', 0);
	});
	$.run(function(){
		time = new Date();
		if ($.Cache.get('timeCache') != time.getSeconds()) {
			var tz = document.getElementById('timeZone');
			tz.innerHTML = time.toLocaleDateString() + '<br/>' + time.toLocaleTimeString();
			c.set('timeCache', time.getSeconds());
		}
		time = new Date();
	});
}
