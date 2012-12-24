function View($) {
	//初始化Demo4中球的位置，颜色，数量
	this.HumanActionView = function (model) {
		this.model = model;
		this.model.human=new $.sprite.Human({tall:90,width:90,locationX:300*gl.zoom,locationY:$.canvas.height-(200)*gl.zoom-200});
		this.model.world=new $.sprite.World(map);
	};
	return this;
}