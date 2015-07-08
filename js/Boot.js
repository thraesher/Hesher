// JavaScript Document
var hesher = hesher || {};

hesher.Boot = function(){};

hesher.Boot.prototype = {
	preload: function() {
  	//assets we'll use in the loading screen
    	
   		this.load.image('loadingBarMenu', 'assets/images/loadingBar.png');
  	},
	create: function(){
		
		//skalier optionen
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 896;
		this.scale.minHeight = 544;
		this.scale.maxWidth = 896;
		this.scale.maxHeight = 544;
		
		this.scale.pageAlignHorizontally = true;
		
		this.scale.setScreenSize(true);
		//engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//startet den preload der assets für das spiel
		this.state.start('Preload');
		
	}
	
};