		window.onload=function() {
			/*Ajax框架 author:qzm*/
			/*类的继承*/
			Object.extend = function(d, s) {
				for(var key in s) {
					d[key] = s[key];
				}
				return d;
			};
			/*Ajax 类*/
			function Ajax() {
				/*创建XMLHttpRequest对象*/
				function cresteXHR() {
					if(window.XMLHttpRequest) {
						return new XMLHttpRequest();
					} else if(window.ActiveXObject) {
						return new ActiveXObject("Microsoft.XMLHTTP");
					}
				}
				var ajax = this,
					xmlhttp = cresteXHR();
				/*发送数据*/
				ajax.send = function(args) {
					var _args = Object.extend({
						method: 'POST',
						url   : '',
						async : true,
						data  : null
					}, args);
					try {
						xmlhttp.open(_args.method, _args.url, _args.async);
						xmlhttp.send(_args.data);
					} catch(e) {
						if(console && console.log) {
							alert('必须放在服务器上');
						}
					}
					return ajax;
				};
				/*
					异步回调
					成功回调callback
					失败回调error
				*/
				ajax.response = function(callback,error) {
					xmlhttp.onreadystatechange = function() {
						if(xmlhttp.readyState == 4) {
							if(xmlhttp.status == 200) {
								var data = xmlhttp.responseText || xmlhttp.responseXML || xmlhttp.responseBody;
								callback(data);
							}else if(error){
								error();
							}
						}
					};
					return ajax;
				};
			}
//////////////////////////////////////////////////////////////////////////////
			/*业务逻辑 author:qzm*/
			var inputs=document.getElementsByTagName('input');
			inputs[0].focus();
			/*按钮点击事件*/
			inputs[1].onclick=function() {
				/*验证输入是否正确*/
				if(/^\d+$/.test(inputs[0].value)) {
					var ajax = new Ajax();
					/*发送数据*/
					ajax.send({
						url: 'response.txt',
						data: inputs[0].value
					/*Ajax请求成功操作*/
					}).response(function(args) {
						var _args = Object.extend({
							data: ''
						}, args);
						var table=document.getElementById('table');
						table.innerHTML='Value:'+inputs[1].value;
					/*Ajax请求失败后的操作*/
					},function() {
						alert('Ajax失败');
					});
				/*输入错误时*/
				} else {
					alert('请输入数字');
					inputs[0].focus();
				}
			};
			/*按下回车后的操作*/
			inputs[0].onkeydown=function(event) {
				var e=event||window.event;
				if (e.keyCode===13) {
					inputs[1].click();
				}
			};
		};