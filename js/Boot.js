// JavaScript Document
var hesher = hesher || {};

hesher.Boot = function(){};

hesher.Boot.prototype = {
	create: function(){
		
		//skalier optionen
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 240;
		this.scale.minHeight = 170;
		this.scale.maxWidth = 2880;
		this.scale.maxHeight = 1920;
		
		this.scale.pageAlignHorizontally = true;
		
		this.scale.setScreenSize(true);
		//engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//startet den preload der assets für das spiel
		this.state.start('Preload');
	}
	
};