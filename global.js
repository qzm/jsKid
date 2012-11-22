function global(){
	this.tools={
		UA:string=window.navigator.userAgent,
		ifIE:function(){
			if (window.ActiveXObject) 
					return true;
			return false;
		},
		ifMobile:function(){
			if(window.navigator.userAgent.indexOf('Mobile')!=-1)
				return true;
			return false;
		}
	};
}