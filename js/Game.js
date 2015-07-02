// JavaScript Document
var hesher = hesher || {};

hesher.Game = function() {};


hesher.Game.prototype = {
	create: function(){
		
		/////////////////////////////////////////////WorldAndBackground/////////////////////////////////////////
		//this.game.world.setBounds(0,0,window.innerWidth,window.innerHeight);
		//this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height, 'rock');
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('mytilemap', 'gameTiles');

		this.background = this.map.createLayer('background');
    	this.blocklayer = this.map.createLayer('blocklayer');
		this.map.setCollisionBetween(1, 100000, true, 'blocklayer');
		this.background.resizeWorld();
		
		///////////////////////////////////////////////////////////////////////////////////////////////////////
		this.scoreboard = 0;
		/////////////////////////////////////////PlayerSetings///////////////////////////////////////////////
		this.player = this.game.add.sprite(/*this.game.world.centerX, this.game.world.centerY*/200,200, 'hesher');
		this.player.anchor.setTo(0.5,0.5)
		this.player.inventar = [null];
		this.player.hp = 1;
		//this.player.scale.setTo(2);
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
		this.weaponEquiped = false;
		this.player.lookingUp = false;
		this.player.lookingDown = false;
		this.player.lookingRight = false;
		this.player.lookingLeft = false;
		this.player.score = 0;
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
		this.weaponSlot;
		this.createHUD();
	
		
		
		
		//////////////////////////////////////////WeaponsSetting///////////////////////////////////////////
		this.weapons = this.add.group();
		this.weapons.enableBody = true;
		this.weapons.physicsBodyType = Phaser.Physics.ARCADE;
		this.weapons.createMultiple(2,'baseballBat');
		this.weapons.setAll('anchor.x',0.5);
		this.weapons.setAll('anchor.y', 0.5);
		this.nextWeaponAt = 0;
		this.WeaponDelay = 10;
		
		this.swords = this.add.group();
		this.swords.enableBody = true;
		this.swords.physicsBodyType = Phaser.Physics.ARCADE;
		this.swords.createMultiple(2,'testSword');
		this.swords.setAll('anchor.x',0.5);
		this.swords.setAll('anchor.y',0.5);
		this.nextSwordAt = 0;
		this.swordDelay = 10;
		
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////
		
		
		///////////////////////////////////////////////EnemiesSetting////////////////////////////////////
		this.enemies = this.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemies.createMultiple(100,'zombie');
		this.enemies.setAll('anchor.x',0.5);
		this.enemies.setAll('anchor.y', 0.5);
		this.enemies.setAll('outOfBoundsKill', true);
		this.enemies.setAll('checkWorldBounds', true);
		this.enemies.forEach(function(enemy){
			enemy.animations.add('fly', [0],5,true);
		});
		this.nextEnemyAt = 0;
		this.enemyDelay = 10;
		this.enemies.score = 1;
		this.enemies.dmg = 1;
		/////////////////////////////////////////////////////////////////////////////////////////////////
		this.bullets = [];
		
		/////////////////////////////////////////ControlSettings///////////////////////////////////////////
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.walkUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.walkDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.walkLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.walkRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.hitButton = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.attackButton = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
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
		this.physics.arcade.overlap(this.enemies, this.weapons , this.enemyHitBaseballBat, null, this);
		/*
		Überprüft Kollision zwischen dem Spieler und den Gegnern
		und führt die playerHit function aus.
		*/
		this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
		this.game.physics.arcade.collide(this.player, this.blocklayer);
		/*
		Überprüft Kollision zwischen dem Spieler und Waffenobjekten
		und führt die collectWeapon function aus.
		*/
		this.physics.arcade.overlap(this.player, this.weapons, this.collectWeapon, null, this);
		this.physics.arcade.overlap(this.player, this.swords, this.collectWeapon, null, this);
		/*
		Überprüft Kollision zwischen dem Spieler und Itemobjekten
		und führt die collectItem function aus.
		*/
		this.physics.arcade.overlap(this.player, this.items, this.collectItem, null, this);
		////////////////////////////////////////////////////////////////////////////////////////
		
		///////////////////////EnemySpawn//////////////////////////////////////////////////////
		
		this.spawnEnemy();
		this.spawnWeapon();
		//this.spawnSword();
		
		///////////////////////////////////////////////////////////////////////////////////////
		
		/////////////////////////////FireDirection///////////////////////////////////////////////
		
		this.fireDirection();
		////////////////////////////////////////////////////////////////////////////////////////
		this.attack();
		//////////////////////PlayerMovement////////////////////////////////////////////////////
		
		//Setzt die Geschwindigkeit auf 0 wenn kein Input getätigt wird.
		
		this.stopMoving();
		this.walk();
		//////////////////////////////////DropWeapon///////////////////////////////////////////////////
		this.dropWeapon();
		/////////////////////////////////////////////////////////////////////////////////////////////////
		
	},
	render: function(){
		this.game.debug.body(this.weapons);
		//this.game.debug.body(this.player);
		this.game.debug.body(this.enemies);
		
	},
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
		this.scoreCalc(enemy);
		enemy.kill();
		player.hp = player.hp - this.enemies.dmg;
		if(player.hp <= 0){
			player.kill();
		}
	},
	enemyHitBaseballBat: function(enemy, weapon){
		
		console.log(enemy);
		console.log(weapon);
		enemy.kill();
	},
	spawnEnemy: function(){
		if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
			
			
      		this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemies.getFirstExists(false);
      		enemy.reset(/*this.rnd.integerInRange(,1)*/896,this.rnd.integerInRange(100,370));
      		//enemy.scale.setTo(this.rnd.integerInRange(3,6));
      		enemy.body.velocity.x -= this.rnd.integerInRange(10,20);
      		enemy.play('fly');
			
    	}
		
	},
	spawnWeapon: function(){
		if (this.nextWeaponAt < this.time.now && this.weapons.countDead() > 0) {
			this.nextWeaponAt = this.time.now + this.weaponDelay;
			var weapon = this.weapons.getFirstExists(false);
			weapon.reset(100,100);
			console.log(weapon);
		}
	},
	spawnSword: function(){
		if (this.nextSwordAt < this.time.now && this.swords.countDead() > 0) {
			this.nextSwordAt = this.time.now + this.swordDelay;
			var sword = this.swords.getFirstExists(false);
			sword.reset(500,500);
			console.log(sword);
		}
	},
	collectWeapon: function(player, weapon){
		//if(this.player.inventar[0] = null){
			this.weaponSlot.addChild(weapon);
			this.weaponEquiped = true;
			this.player.inventar[0] = weapon;
				
		/*	
		}else {
			//this.drop();
			//player.addChild(weapon);
			//this.weaponEquiped = true;
			//this.player.inventar[0] = weapon;
			//this.player.inventar[0].x = 10;
			//this.player.inventar[0].y = 0;	
			//console.log(this.player.inventar[0].y);
		}
		*/
	},
	collectItem: function(player, items){
		if(player.hp < player.maxHp){
			
			player.addChild(items);
			
			
			items.x = 0;
			items.y = 10;
			items.animations.play('hitsFromTheBong',5,false, true);
			
			player.hp = player.hp + 1;
			
		}
	
	},
	dropWeapon: function(){
		if(this.hitButton.justPressed(1)&& this.weaponEquiped == true){
			console.log(this.weapons);
			console.log(this.swords);
			console.log(this.player.inventar[0]);
			this.drop();
			
			
			
		}
		
	},
	drop: function(){
		if(this.player.inventar[0].key == 'baseballBat'){
				var dropedWeapon = this.weapons; 
				this.player.inventar[0].kill();
				this.player.inventar[0] = null;
			
				dropedWeapon.create(this.player.x -50,this.player.y -15 ,'baseballBat');
				this.weaponEquiped = false;
			}else if(this.player.inventar[0].key == 'testSword'){
				var dropedWeapon = this.swords; 
				this.player.inventar[0].kill();
				this.player.inventar[0] = null;
			
				dropedWeapon.create(this.player.x -15,this.player.y +5 ,'testSword');
				this.weaponEquiped = false;
			}
		
	},
	attack: function(){
		
		if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingRight == true){
			var attackAnimation = this.add.sprite(this.player.x +35, this.player.y +5  ,'hitAnimationRight');
			attackAnimation.anchor.setTo(0.5, 0.5);
			attackAnimation.scale.setTo(2);
			
			//attackAnimation.body.hitarea = new Phaser.Rectangle(0, 0, 100, 100);
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			attackAnimation.animations.add('hit',[0,1,2,3,4],5,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				enemy.kill();
				}, null, this);
			this.game.debug.body(attackAnimation);
			
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingLeft == true){
			var attackAnimation = this.add.sprite(this.player.x -35 , this.player.y  ,'hitAnimationLeft');
			attackAnimation.anchor.setTo(0.5, 0.5);
			//attackAnimation.scale.setTo(2);
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			attackAnimation.animations.add('hit',[0,1,2,3,4],5,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				enemy.kill();
				}, null, this);
			this.game.debug.body(attackAnimation);
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingUp == true){
			
			var attackAnimation = this.add.sprite(this.player.x , this.player.y -30  ,'hitAnimationUp');
			attackAnimation.anchor.setTo(0.5, 0.5);
			//attackAnimation.scale.setTo(2);
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			attackAnimation.animations.add('hit',[0,1,2,3,4],3,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				enemy.kill();
				}, null, this);
			this.game.debug.body(attackAnimation);
			
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingDown == true){
			var attackAnimation = this.add.sprite(this.player.x , this.player.y +40 ,'hitAnimationDown');
			attackAnimation.anchor.setTo(0.5, 0.5);
			//attackAnimation.scale.setTo(2);
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			attackAnimation.animations.add('hit',[4,3,2,1,0],5,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				enemy.kill();
				}, null, this);
			this.game.debug.body(attackAnimation);
			
		}
	},
	stopMoving: function(){
		
			this.player.body.velocity.y = 0;
    		this.player.body.velocity.x = 0;
		
		
	},
	fireDirection: function(){
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
		
	},
	walk: function(){
	
		
		/*
		Beschreibt bei welcher Walktaste (WASD) welche Animations abgespielt wird.
		Und korregiert die Position der Waffe.
		*/
			if(this.walkUp.isDown){
				this.player.body.velocity.y -= this.player.speed;
				this.player.animations.play('up');
				this.player.lookingUp = true;
				this.player.lookingDown = false;
				this.player.lookingRight = false;
				this.player.lookingLeft = false;
				
			
			}
			else if(this.walkDown.isDown){
				this.player.body.velocity.y += this.player.speed;
				this.player.animations.play('down');
				this.player.lookingUp = false;
				this.player.lookingDown = true;
				this.player.lookingRight = false;
				this.player.lookingLeft = false;
				
			}
		
			else if(this.walkRight.isDown){
				this.player.body.velocity.x += this.player.speed;
				this.player.lookingUp = false;
				this.player.lookingDown = false;
				this.player.lookingRight = true;
				this.player.lookingLeft = false;
				
				
				this.player.animations.play('right');
				if(this.walkRight.isUp){
					this.player.animations.stop();
					
				}
			}
			else if(this.walkLeft.isDown){
				this.player.body.velocity.x -= this.player.speed;
				this.player.lookingUp = false;
				this.player.lookingDown = false;
				this.player.lookingRight = false;
				this.player.lookingLeft = true;
				
				this.player.animations.play('left');
				if(this.walkLeft.isUp){
				this.player.animations.stop();
				
				}
			
		};
		
		
		
		
	},
	createHUD: function(){
		
		
		this.weaponSlot = this.game.add.image(900,400,'menu');
		this.weaponSlot.fixedToCamera = true;
		
		
		
	},
	scoreCalc: function(enemy){
		this.player.score = this.player.score + enemy.score;
	}
	
	
	
};