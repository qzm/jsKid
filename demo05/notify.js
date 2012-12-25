/////////////////////////////////////////////////////////////////////////////
								// 定义Notify
/////////////////////////////////////////////////////////////////////////////
function Notify($) {
	var notify=this;
	var map = [];
	var workerList = [];
	//注册notify
	notify.register = function (notifyName, notifyFunction) {
		var _notify = {
			name: notifyName,
			fun: notifyFunction
		};
		map.push(_notify);
	};
	//去除notify的注册
	notify.unregister = function (notifyName) {
		for (var i in map) {
			if (map[i].name == notifyName) {
				delete map[i];
				// break;
			}
		}
	};
	//运行notify
	notify.notify = function (notifyName, notifyArgs) {
		for (var i in map) {
			if (map[i].name == notifyName) {
				workerList.push({
					notify: map[i].fun,
					name  : map[i].name,
					args  : notifyArgs
				});
				// break;
			}
		}
	};
	//多线程跑,加速,防阻塞
	$.run(function () {
		var worker = workerList.shift();
		if (worker) {
			worker.notify(worker.args);
		}
	});
	$.run(function () {
		var worker = workerList.shift();
		if (worker) {
			worker.notify(worker.args);
		}
	});
	$.run(function () {
		var worker = workerList.shift();
		if (worker) {
			worker.notify(worker.args);
		}
	});
}

