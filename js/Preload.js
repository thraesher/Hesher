// JavaScript Document
var hesher = hesher ||{};

hesher.Preload = function() {};

hesher.Preload.prototype = {
	
	preload: function(){
		this.load.image('space', 'assets/images/space.png');
		this.load.image('rock', 'assets/images/rock.png');
		this.load.image('bulletUp', 'assets/images/bullet_up.png');
		this.load.image('bulletDown', 'assets/images/bullet_down.png');
		this.load.image('bulletLeft', 'assets/images/bullet_left.png');
		this.load.image('bulletRight', 'assets/images/bullet_right.png');
		this.load.image('hitUp', 'assets/images/sword.png');
		this.load.image('menu','assets/images/weaponslot.png');
		this.load.spritesheet('playership', 'assets/images/player.png', 12, 12);
		this.load.spritesheet('power', 'assets/images/power.png', 12, 12);
		this.load.spritesheet('hesherWalkUp', 'assets/images/hesher_walk_up.png',16,16);
		this.load.spritesheet('hesherWalkDown', 'assets/images/hesher_walk_down.png',16,16);
		this.load.spritesheet('hesher', 'assets/images/hesher.png',32,32);
		this.load.spritesheet('dummy', 'assets/images/dummy.png',16,16);
		this.load.spritesheet('zombie','assets/images/zombie.png',32,32);
		this.load.spritesheet('baseballBat', 'assets/images/baseball_bat.png', 32,32);
		this.load.spritesheet('bong', 'assets/images/bong_smoke_white_2.png', 32, 32);
		this.load.spritesheet('testSword','assets/images/test_sword.png',32,32);
		this.load.spritesheet('hitAnimationUp','assets/images/baseballHitUp.png',96,32);
		this.load.spritesheet('hitAnimationDown','assets/images/baseballHitDown.png',96,32);
		this.load.spritesheet('hitAnimationRight','assets/images/baseballHitRight.png',32,96);
		this.load.spritesheet('hitAnimationLeft','assets/images/baseballHitLeft.png',32,96);
		this.load.tilemap('map', 'assets/tilemap/map.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'assets/images/mytilemap.jpg');
	},
	create: function(){
		this.state.start('Game');
	}
};