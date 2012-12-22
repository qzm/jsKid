function View($) {
	//初始化Demo4中球的位置，颜色，数量
	this.HumanActionView = function (model) {
		this.model = model;
		this.model.human=new $.sprite.Human({tall:90,width:80,locationX:600*gl.zoom,locationY:$.canvas.height-(200+25)*gl.zoom});
		this.model.world=new $.sprite.World(map);
	};
	return this;
}