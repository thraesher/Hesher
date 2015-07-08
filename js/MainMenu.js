// JavaScript Document
var hesher = hesher || {};

hesher.MainMenu = function(){};

hesher.MainMenu.prototype = {
	init: function(score) {
 		this.highscore = 0;
		if(score > this.highscore){
			this.highscore += score;
		}
	
    
   },
	create: function(){
		this.background = this.game.add.image(0,0,'title');
		this.moan = this.game.add.audio('zombieMoan');
		
		this.moan.play('',0,1,true);
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	},
  
  update: function() {
	  if(this.background.key == "title"){
		  this.setHighscore();
	  }
	  if(this.background.key == "title" && this.game.input.activePointer.justPressed() ){
		  this.changeScreen();
	  }
	  
    if(this.background.key == "controls") {
		
		this.backControls = this.game.add.image(600,100,'backControls');
		this.cursor2 = this.game.add.image(550,90,'menuCursor');
		this.cursor2.scale.setTo(2.7);
     	
    }
	if(this.background.key == "controls" && this.enter.justPressed(1) && this.cursor2.x == 550){
		this.cursor2.kill();
		this.changeScreen();
		
	}
	if(this.background.key == "menu" && this.cursors.left.justPressed(1) && this.cursor.x == 560){
		this.cursor.kill();
		this.cursor = this.game.add.image(0,200,'menuCursor');
		this.cursor.scale.setTo(2.9);
	}
	if(this.background.key == "menu" && this.cursors.right.justPressed(1) && this.cursor.x == 0){
		this.cursor.kill();
		this.cursor = this.game.add.image(560,200,'menuCursor');
		this.cursor.scale.setTo(2.7);
	}
	if(this.background.key == 'menu' && this.cursor.x == 560 && this.enter.justPressed(1)){
		this.moan.stop();
		
		this.game.state.start('Game');
		
	}
	if(this.background.key == 'menu' && this.cursor.x == 0 && this.enter.justPressed(1)){
		this.background = this.game.add.image(0,0,'controls');
	}
  },
  changeScreen: function(){
	  this.background = this.game.add.image(0,0,'menu');
	  
	  this.controls = this.game.add.image(50,200,'controlsMenu');
	  this.play = this.game.add.image(600,200,'playMenu');
	  
	  this.cursor = this.game.add.image(560,200,'menuCursor');
	  this.cursor.scale.setTo(2.7);
	  
  },
  setHighscore: function(score){
	  
    	this.highscoreText = this.add.text(
     		230, 480, '' + this.highscore, 
      		{ font: '20px monospace', fill: '#FFFFFF', align: 'center' }
    	);
    	this.highscoreText.anchor.setTo(0.5, 0.5);
		this.highscoreText.rotation = 25;
	},
};