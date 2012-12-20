//通讯协议类
function Im($){
	var im=this;
	var ajaxPool=new $.AjaxPool(10);
	var _url='http://q.com/mvc/test_xmlhttpArray.txt';
	var callbackList={
		//协议簇1
		1:{
			//模块1
			1:{send:'goAlert', callback:'callAlert'}
		},
		2:{
			1:{send:'Alert', callback:'callAlert'}
		}
	};
	this.send=function(args){
		var ajax=ajaxPool.get(this);
		//动态线程池
		if(!ajax) {
			ajaxPool.free(new $.Ajax());
			ajax=ajaxPool.get();
		}
		var protocal=args.protocal||null;
		var senddata=args.data||null;
		for(var p in callbackList){
			for(var m in callbackList[p]){
				if(callbackList[p][m].send==protocal){
					ajax.send({url:_url,data:senddata});
					p=callbackList.length;
					break;
				}
			}
		}
		ajax.response(function(args){
			var data=$.JSON.parse(args);
			var protocal=data.shift();
			var model   =data.shift();
			im.callback(protocal,model,data);
		},function(){
			//回收Ajax线程
			ajaxPool.free(ajax);
		});
	};
	this.callback=function(protocal,model,data){
		notify.notify(callbackList[protocal][model].callback,data);
	};
}
