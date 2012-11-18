var jsGame = {
	//初始化资源
	browser: true,
	init: function(args){
		if (window.ActiveXObject) {
			this.browser = false;
			alert("Not IE !");
			return null;
		}
		args.call();
		return null;
	},
	//缓存机制
	Cache: {
		map: [],
		set: function(key, value){
			this.map[key] = value
		},
		get: function(key){
			return this.map[key]
		},
		havekey: function(key){
			return this.get(key) == null ? false : true
		},
		remove: function(key){
			delete this.map[key]
		}
	},
	//动画入口
	run: function(funtionToRun){
		if (this.browser) {
			setInterval(funtionToRun, 1000 / 30);
		}
	}
}

