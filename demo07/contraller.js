function Contraller($) {
	var contraller=this;
	contraller.HumanActionCtrl = function (view) {
		var _ctrl = this;
		var _view = view;
		var _model = view.model;

		//动画循环
		$.run(function () {
			//绘制视图
			// $.notify.notify('setBallView');
		});
	};
	return this;
}