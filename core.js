var jsGame = {
    //初始化资源
    init: function(args){
        args.call();
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
    message: {
        queue: [],
        en: function(msg){
            for (var m in this.queue) 
                if (m == msg) 
                    return false;
            this.queue.push(msg);
            return true;
        },
        de: function(){
			if(this.queue[0]!=null)
				return this.queue[0];
        	return null;
        }
    },
    //动画入口
    run: function(funtionToRun){
		if(this.message.queue[0]!=null){
			this.message.queue[0].call();
		}
        setInterval(funtionToRun, 1000 / 30);
    }
}

