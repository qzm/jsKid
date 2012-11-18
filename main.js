//程序入口
function main(){
    //调用核心库
    $ = jsGame;
	$.init(function(){
        $.Cache.set('click', 'Click');
	});
    $.run(function(){
        time = new Date;
        if ($.Cache.get('timeCache') != time.getSeconds()) {
            var tz = document.getElementById('timeZone');
            tz.innerHTML = time.toLocaleDateString() + '<br/>' + time.toLocaleTimeString();
            $.Cache.set('timeCache', time.getSeconds());
			console.log($.Cache.get('click'));
        }
        time = new Date();
    });
}
