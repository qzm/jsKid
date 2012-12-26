function View($) {
	//初始化Demo4中球的位置，颜色，数量
	this.HumanActionView = function (model) {
		this.model = model;
		this.model.human=new $.sprite.Human({tall:60,width:60,locationX:300*gl.zoom,locationY:$.canvas.height-(300)*gl.zoom});
		this.model.world=new $.sprite.World(map);
		this.model.logo=new $.sprite.Logo();
	};
	return this;
}