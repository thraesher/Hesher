// JavaScript Document
var hesher = hesher || {};

hesher.Game = function() {};

hesher.Game.prototype = {
	create: function(){
		
		/////////////////////////////////////////////WorldAndBackground/////////////////////////////////////////
		this.game.world.setBounds(0,0,window.innerWidth,window.innerHeight);
		this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height, 'rock');
		///////////////////////////////////////////////////////////////////////////////////////////////////////
		
		/////////////////////////////////////////PlayerSetings///////////////////////////////////////////////
		this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'hesher');
		this.player.anchor.setTo(0.5,0.5)
		//this.player.scale.setTo(5);
		this.player.inventar = [];
		this.player.hp = 1;
		this.player.maxHp = 3;
		this.player.animations.add('up',[4,5],5, true);
		this.player.animations.add('down',[1,2],5, true);
		this.player.animations.add('right',[6,7],5, true);
		this.player.animations.add('left',[8,9],5, true);
		this.player.animations.add('wait',[0],5, true);
		this.game.physics.arcade.enable(this.player);
		this.player.speed = 300;
		this.player.body.collideWorldBounds = true;
		this.game.camera.follow(this.player);
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////ItemsSetting/////////////////////////////////////////////////
		this.items = this.game.add.group();
		this.bong = this.items.create(200, 200, 'bong');
		this.bong.anchor.setTo(0.5, 0.5);
		this.bong.animations.add('hitsFromTheBong', [1,2,3,4,5,6,7,8,9,10,1,12],5, false);
		this.bong.animations.add('bongUnused', [0],5, false);
		this.game.physics.arcade.enable(this.items);
		this.collectedItem = false;
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////WeaponsSetting///////////////////////////////////////////
		this.weapons = this.game.add.group();
		this.baseballBat = this.weapons.create(100,100,'baseballBat');
		this.baseballBat.anchor.setTo(0.5,0.5);
		this.game.physics.arcade.enable(this.weapons);
		this.baseballBatEquiped = false;
		/////////////////////////////////////////////////////////////////////////////////////////////////
		
		///////////////////////////////////////////////EnemiesSetting////////////////////////////////////
		this.enemies = this.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemies.createMultiple(10,'dummy');
		this.enemies.setAll('anchor.x',0.5);
		this.enemies.setAll('anchor.y', 0.5);
		this.enemies.setAll('outOfBoundsKill', true);
		this.enemies.setAll('checkWorldBounds', true);
		this.enemies.forEach(function(enemy){
			enemy.animations.add('fly', [0,1],5,true);
		});
		this.nextEnemyAt = 0;
		this.enemyDelay = 10;
		/////////////////////////////////////////////////////////////////////////////////////////////////
		this.bullets = [];
		
		/////////////////////////////////////////ControlSettings///////////////////////////////////////////
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.walkUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.walkDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.walkLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.walkRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.hitButton = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		
		
		
		
	},
	update: function(){
		
		///////////////////////////////Physics///////////////////////////////////////////////////
		/*
		Überprüft Kollision zwischen Kugeln und Gegnern
		und führt dann die enemyHit function aus.
		*/
		for (var i = 0; i < this.bullets.length; i++) {
     		 this.physics.arcade.overlap(this.bullets[i], this.enemies, this.enemyHit, null, this);
    	};
		//Überprüft Kollision zwischen Gegnern und Baseballschläger.!!!!!!!!!!!!!Fehlerhaft.
		this.physics.arcade.overlap(this.enemies, this.baseballBat , this.enemyHitBaseballBat, null, this);
		/*
		Überprüft Kollision zwischen dem Spieler und den Gegnern
		und führt die playerHit function aus.
		*/
		this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
		
		/*
		Überprüft Kollision zwischen dem Spieler und Waffenobjekten
		und führt die collectWeapon function aus.
		*/
		this.physics.arcade.overlap(this.player, this.weapons, this.collectWeapon, null, this);
		/*
		Überprüft Kollision zwischen dem Spieler und Itemobjekten
		und führt die collectItem function aus.
		*/
		this.physics.arcade.overlap(this.player, this.items, this.collectItem, null, this);
		////////////////////////////////////////////////////////////////////////////////////////
		
		///////////////////////EnemySpawn//////////////////////////////////////////////////////
		
		//this.spawnEnemy();
		
		///////////////////////////////////////////////////////////////////////////////////////
		
		
		
		
		/////////////////////////////FireDirection///////////////////////////////////////////////
		
		
		if(this.hitButton.isUp){
			this.baseballBat.animations.stop();
		};
		
		if(this.cursors.up.isDown){
			this.fireUp();
		}else if(this.cursors.down.isDown){
			this.fireDown();
		};
		
		if(this.cursors.right.isDown){
			this.fireRight();
		}else if(this.cursors.left.isDown){
			this.fireLeft();
		};
		
		////////////////////////////////////////////////////////////////////////////////////////
		
		//////////////////////PlayerMovement////////////////////////////////////////////////////
		
		//Setzt die Geschwindigkeit auf 0 wenn kein Input getätigt wird.
		this.player.body.velocity.y = 0;
    	this.player.body.velocity.x = 0;
		
		// Wenn alle Walktasten oben sind wird 'wait' animations abgespielt.
		if(this.walkUp.isUp && this.walkDown.isUp && this.walkLeft.isUp && this.walkRight.isUp){
			this.player.animations.play('wait');
			if(this.baseballBatEquiped){
				this.baseballBat.x = -10;
				this.baseballBat.y = -3;
			}
		}else{
		
		/*
		Beschreibt bei welcher Walktaste (WASD) welche Animations abgespielt wird.
		Und korregiert die Position der Waffe.
		*/
			if(this.walkUp.isDown){
				this.player.body.velocity.y -= this.player.speed;
				this.player.animations.play('up');
				if(this.baseballBatEquiped){
					this.baseballBat.x = 10;
					this.baseballBat.y = -3;
				}
				if(this.walkUp.isUp){
					this.player.animations.stop();
					if(this.baseballBatEquiped){	
						this.baseballBat.x = -10;
						this.baseballBat.y = -3;
					}
				}
			
			}
			else if(this.walkDown.isDown){
				this.player.body.velocity.y += this.player.speed;
				this.player.animations.play('down');
				if(this.baseballBatEquiped){
					this.baseballBat.x = -10;
					this.baseballBat.y = -3;
				}
				if(this.walkDown.isUp){
					this.player.animations.stop();
					if(this.baseballBatEquiped){	
						this.baseballBat.x = -10;
						this.baseballBat.y = -3;
					}
				}
			}
		
			if(this.walkRight.isDown){
				this.player.body.velocity.x += this.player.speed;
				if(this.baseballBatEquiped){
					this.baseballBat.x = 0;
			    	this.baseballBat.y = 0;
				}
				
				this.player.animations.play('right');
				if(this.walkRight.isUp){
					this.player.animations.stop();
					if(this.baseballBatEquiped){
						this.baseballBat.x = -10;
						this.baseballBat.y = -3;
					}
				}
			}
			else if(this.walkLeft.isDown){
				this.player.body.velocity.x -= this.player.speed;
				if(this.baseballBatEquiped){
					this.baseballBat.x = 0;
			    	this.baseballBat.y = 0;
				}
				this.player.animations.play('left');
				if(this.walkLeft.isUp){
				this.player.animations.stop();
				if(this.baseballBatEquiped){
					this.baseballBat.x = -10;
					this.baseballBat.y = -3;
				}
				}
				
		};
		////////////////////////////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////DropWeapon///////////////////////////////////////////////////
		if(this.hitButton.isDown){
			this.player.removeChild(this.baseballBat);
			
		}
		};
		/////////////////////////////////////////////////////////////////////////////////////////////////
		
	},/*
	render: function(){
		this.game.debug.body(this.baseballBat);
		this.game.debug.body(this.player);
		this.game.debug.body(this.enemies);
	},*/
	fireUp: function(){
		var bullet = this.add.sprite(this.player.x, this.player.y  -20,'bulletUp');
		bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.body.velocity.y = -500;
		this.bullets.push(bullet);
		
	},
	fireDown: function(){
		var bullet = this.add.sprite(this.player.x, this.player.y  +20,'bulletDown');
		bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.body.velocity.y = +500;
		this.bullets.push(bullet);
		
	},
	fireLeft: function(){
		var bullet = this.add.sprite(this.player.x -20, this.player.y  ,'bulletLeft');
		bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.body.velocity.x = -500;
		this.bullets.push(bullet);
	},
	fireRight: function(){
		var bullet = this.add.sprite(this.player.x +20, this.player.y ,'bulletRight');
		bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.body.velocity.x = +500;
		this.bullets.push(bullet);
	},
	enemyHit: function(bullet, enemy){
		bullet.kill();
		enemy.kill();
	},
	playerHit: function(player, enemy){
		enemy.kill();
		player.hp = player.hp - 1;
		if(player.hp <= 0){
			player.kill();
		}
	},
	enemyHitBaseballBat: function(enemy){
		enemy.kill();
	},
	spawnEnemy: function(){
		if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
			
			
      		this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemies.getFirstExists(false);
      		enemy.reset(this.rnd.integerInRange(1,window.innerWidth),this.rnd.integerInRange(1,window.innerHeight));
      		enemy.scale.setTo(this.rnd.integerInRange(3,6));
      		enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
      		enemy.play('fly');
			
    	}
		
	},
	collectWeapon: function(player, weapon){
		player.addChild(weapon);
		this.baseballBatEquiped = true;
		this.player.inventar[0] = weapon;
		weapon.x = 10;
		weapon.y = 0;		 
	},
	collectItem: function(player, items){
		if(player.hp < player.maxHp){
			
			player.addChild(items);
			
			
			items.x = 0;
			items.y = 10;
			items.animations.play('hitsFromTheBong',5,false, true);
			
			player.hp = player.hp + 1;
			
		}
	}
	
	
	
};