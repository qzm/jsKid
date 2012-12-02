function global() {
	this.STATIC = {
		UA: string = window.navigator.userAgent,
		URL: string = document.URL,
		IE: boolean = function () {
			if (window.ActiveXObject) return true;
			return false;
		}.call(),
		Chrome: boolean = function () {
			if (window.navigator.userAgent.indexOf('Chrome') != -1) return true;
			return false;
		}.call(),
		Mobile: boolean = function () {
			if (window.navigator.userAgent.indexOf('Mobile') != -1) return true;
			return false;
		}.call(),
		START: object = function () {
			return new Date();
		}.call()
	};
}