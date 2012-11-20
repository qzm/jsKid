var jsGame = {
	//初始化资源
	version:{
		name:'jsGame',
		version:'1.0',
		author:'QZM'
	},
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
			this.map[key] = value;
		},
		get: function(key){
			return this.map[key];
		},
		havekey: function(key){
			if(this.get(key)){
				return false;
			}
			else {
				return true;
			}
		},
		remove: function(key){
			delete this.map[key];
		},
		plus: function(key,step){
			return this.map[key]+=step;
		}
	},
	//动画入口
	run: function(funtionToRun){
		if (this.browser) {
			setInterval(funtionToRun, 1000 / 30);
		}
	},
	canvas:{

	},
	//日志封装
	log:function(args){console.log(args);},
	error:function(args){console.error(args);},
	//document 选择封装
	dom:function(args){
		if(args[0]){
			switch(args[0]){
				case '#' : //getElementById 的封装
					return document.getElementById(args.substring(1,args.length));
				case '@' : //getElementsByName 的封装
					return document.getElementsByName(args.substring(1,args.length));
				case '$' : //getElementsByTagName 的封装
					return document.getElementsByTagName(args.substring(1,args.length));
				case '.' : //getElementsByClass 的封装
					return document.getElementsByClassName(args.substring(1,args.length));
				default:return null;
			}
		}
		return null;
	},
	//时间封装
	t:{
		now:function(){
			return (new Date()).toTimeString();
		},
		today:function(){
			return (new Date()).toDateString();
		},
		sec:function(){
			return (new Date()).getSecond();
		}
	},
	print_r:function print_r(theObj){
		var html='';
		if(theObj.constructor == Array ||theObj.constructor == Object){
			html=html+("<ul>");
			for(var p in theObj){
				if(theObj[p].constructor == Array||theObj[p].constructor == Object){
					html=html+("<li>["+p+"] => "+typeof(theObj)+"</li>");
					html=html+("<ul>");
					print_r(theObj[p]);
					html=html+("</ul>");
				} else {
					html=html+("<li>["+p+"] => "+theObj[p]+"</li>");
				}
			}
			html=html+("</ul>");
		}
		return html;
	}

};

