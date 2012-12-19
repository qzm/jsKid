function Contraler($) {
	this.demo4Ctrl = function (view) {
		_ctrl = this;
		_view = view;
		_model = view.model;
		_canvas = gl.canvas;
		_ctx = gl.ctx;
		// console.log(_model.balls);
		this.update = function (args) {
			startTime = new Date();
			_args = args || {
				ball:[]
			};
			// notify.notify('refreshDemo4');
			return this;
		};
		this.refresh = function () {
			return this;
		};

	};
}