var jsGame = {
    //初始化资源
	browser:true,
    init: function(args){
        if (window.ActiveXObject) {
			this.browser=false;
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
	//消息机制
    Message: {
        queue: [],
        en: function(msg){
            for (var m in this.queue) 
                if (m == msg) 
                    return false;
            this.queue.push(msg);
            return true;
        },
        de: function(){
            if (this.queue[0] != null) 
                return this.queue[0];
            return null;
        }
    },
    //动画入口
    run: function(funtionToRun){
		if (this.browser) {
			if (this.Message.queue[0] != null) {
				this.Message.queue[0].call();
			}
			funtionToRun.call();
			setInterval(funtionToRun, 1000 / 30);
		}
    }
}

