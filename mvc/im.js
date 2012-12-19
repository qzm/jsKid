//通讯协议类
function Im($){
	im=this;
	ajaxPool=new $.AjaxPool(10);
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
		var ajax=ajaxPool.get();
		//动态线程池
		if(!ajax) {
			ajaxPool.free(new $.Ajax());
			ajax=ajaxPool.get();
		}
		protocal=args.protocal||null;
		senddata=args.data||null;
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
			data=$.JSON.parse(args);
			protocal=data.shift();
			model   =data.shift();
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
