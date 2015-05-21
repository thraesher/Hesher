// JavaScript Document
var hesherWasHere = hesherWasHere || {};

hesherWasHere.Game = function(){};

hesherWasHere.Game.prototype = {
	create: function(){
		this.game.world.setBounds(0,0,1920,1920);
		this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height, 'space');
		
		this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
		this.player.scale.setTo(2);
		this.player.animations.add('fly',[0,1,2,3],5, true);
		this.player.animations.play('fly');
		
		this.playerScore = 0;
		
		this.game.physics.arcade.enable(this.player);
		
		this.player.body.collideWorldBounds = true;
		
		this.game.camera.follow(this.player);
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.attackButtonOben = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.attackButtonUnten = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		
		this.bullets = [];
		
		this.generateAsteriods();
		
		
		
	},
	update: function(){
		
		
		
		
		this.player.body.velocity.y = 0;
    	this.player.body.velocity.x = 0;
		
		
		if(this.cursors.up.isDown){
			this.player.body.velocity.y -= 140;
		}
		else if(this.cursors.down.isDown){
			this.player.body.velocity.y += 140;
		}
		else if(this.cursors.right.isDown){
			this.player.body.velocity.x += 140;
		}
		else if(this.cursors.left.isDown){
			this.player.body.velocity.x -= 140;
		};
		
		if(this.attackButtonOben.isDown){
			this.hitOben();	
		};
		/*kolision zwischen spieler und gegner und führt dann hitAsteroid aus.*/
		this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);
		/*kolision zwischen abgefeuerter kugel und einem gegner. führt dann enemyHit aus.*/
		for(var i = 0; i< this.bullets.lenght; i++){
			this.game.physics.arcade.overlap(this.bullets[i],this.asteroid,this.enemyHit, null,this);
		};
	},/*diese function regeneriert asteroiden am anfang des spiels.*/
	 generateAsteriods: function() {
    	this.asteroids = this.game.add.group();
    
   		//enable physics in them
    	this.asteroids.enableBody = true;
    	this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;

    	//phaser's random number generator
    	var numAsteroids = this.game.rnd.integerInRange(150, 200);
    	var asteriod;

    	for (var i = 0; i < numAsteroids; i++) {
      		//add sprite
      		asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
      

      		//physics properties
      		asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
      		asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
      		asteriod.body.immovable = true;
      		asteriod.body.collideWorldBounds = true;
    	}
  	},
  
  	hitOben: function(){
		var bullet = this.add.sprite(this.player.x, this.player.y - 20,'rock');
		bulllet.anchor.setTo(0.5,0.5);
		this.physics.enable(bullet,Phaser.Physics.ARCADE);
		bullet.body.velocity.y = -500;
		this.bullets.push(bullet);
	},
	
	hitUnten: function(){
		var bullet = this.add.sprite(this.player.x, this.player.y + 20,'rock');
		bulllet.anchor.setTo(0.5,0.5);
		this.physics.enable(bullet,Phaser.Physics.ARCADE);
		bullet.body.velocity.y = +500;
		this.bullets.push(bullet);
	},
	hitRechts: function(){
		var bullet = this.add.sprite(this.player.x + 20, this.player.y,'rock');
		bulllet.anchor.setTo(0.5,0.5);
		this.physics.enable(bullet,Phaser.Physics.ARCADE);
		bullet.body.velocity.x = +500;
		this.bullets.push(bullet);
	},
	hitLinks: function(){
		var bullet = this.add.sprite(this.player.x - 20, this.player.y ,'rock');
		bulllet.anchor.setTo(0.5,0.5);
		this.physics.enable(bullet,Phaser.Physics.ARCADE);
		bullet.body.velocity.y = -500;
		this.bullets.push(bullet);
	},
	enemyHit: function(bullet, asteroid){
		bullet.kill();
		asteroid.kill();
	}
		
	
};