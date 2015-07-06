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
		this.load.image('weaponSlot','assets/images/weaponslot.png');
		this.load.image('gunSlot','assets/images/gunSlot.png');
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
		this.load.image('scoreDisplay','assets/images/scorehud.png');
		this.load.spritesheet('gun','assets/images/gun.png',32,32);
		this.load.spritesheet('forg','assets/images/forg.png',32,96);
		this.load.spritesheet('forgAttackUp','assets/images/forgAttackUp.png',32,96);
		this.load.spritesheet('forgAttackDown','assets/images/forgAttackDown.png',32,96);
		this.load.spritesheet('forgAttackRight','assets/images/forgAttackRight.png',96,32);
		this.load.spritesheet('forgAttackLeft','assets/images/forgAttackLeft.png',96,32);
		this.load.spritesheet('spit','assets/images/spit.png',16,16);
		this.load.audio('baseballSwing','assets/sounds/baseBallSwing.mp3');
		this.load.audio('forgStab','assets/sounds/forgStab.mp3');
		this.load.audio('gunReload','assets/sounds/gunReload.mp3');
		this.load.audio('gunShot','assets/sounds/gunShot.mp3');
		this.load.audio('zombieDies','assets/sounds/zombieDies.mp3');
		this.load.audio('zombieMoan','assets/sounds/zombieMoan.mp3');
		this.load.audio('track1','assets/sounds/track1.mp3');
		this.load.audio('track2','assets/sounds/track2.mp3');
	},
	create: function(){
		this.state.start('Game');
	}
};