// JavaScript Document
var hesher = hesher || {};

hesher.Game = function() {};


hesher.Game.prototype = {
	create: function(){
		
		/////////////////////////////////////////////WorldAndBackground/////////////////////////////////////////
		//this.game.world.setBounds(0,0,window.innerWidth,window.innerHeight);
		//this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height, 'rock');
		this.worldCreate();
		this.soundSetup();
		this.startPlayList();
		this.burnSetup();
		///////////////////////////////////////////////////////////////////////////////////////////////////////
		
		/////////////////////////////////////////PlayerSetings///////////////////////////////////////////////
		this.playerSetup();
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////ItemsSetting/////////////////////////////////////////////////
		this.bongSetup();
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		
		this.createHUD();
		this.setScoreBoard();
		this.magDisplay();
		//this.skillDisplay();
		
		 
		
		
		//////////////////////////////////////////WeaponsSetting///////////////////////////////////////////
		this.baseballBat();
		this.forg();
		this.magazinSetup();
		
		
		
		
		
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////
		
		
		///////////////////////////////////////////////EnemiesSetting////////////////////////////////////
		this.normalZombie();
		this.betterZombiesSetup();
		this.betterZombiesDownLeftSetup();
		this.betterZombiesRightSetup();
		this.bossZombiesSetup();
		this.spitSetup();
		/////////////////////////////////////////////////////////////////////////////////////////////////
		
		
		/////////////////////////////////////////ControlSettings///////////////////////////////////////////
		this.controlSettings();
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		
		
		
		
	},
	update: function(){
		
		///////////////////////////////Physics///////////////////////////////////////////////////
		this.collision();
		////////////////////////////////////////////////////////////////////////////////////////
		console.log(this.skill);
		///////////////////////EnemySpawn//////////////////////////////////////////////////////
		this.skillHandler();
		this.magCalc();
		
		this.spawnWeapon();
		this.spawnSword();
		this.zombieBehavior();
		this.spawnHandler();
		///////////////////////////////////////////////////////////////////////////////////////
		//this.playListController();
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
		this.playGunShot();
		
	},
	fireDown: function(){
		var bullet = this.add.sprite(this.player.x, this.player.y  +20,'bulletDown');
		bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.body.velocity.y = +500;
		this.bullets.push(bullet);
		this.playGunShot();
		
	},
	fireLeft: function(){
		var bullet = this.add.sprite(this.player.x -20, this.player.y  ,'bulletLeft');
		bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.body.velocity.x = -500;
		this.bullets.push(bullet);
		this.playGunShot();
	},
	fireRight: function(){
		var bullet = this.add.sprite(this.player.x +20, this.player.y ,'bulletRight');
		bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.body.velocity.x = +500;
		this.bullets.push(bullet);
		this.playGunShot();
	},
	spitDelay: function(){
		while(this.time.now >this.betterZombies.spitDelay ){
			this.betterZombies.spit = true;
		}
	},
	spit: function(enemy){
		
		/*
		var delay = 1000;
		this.betterZombies.spitDelay = this.time.now + delay;
		var spitBall = this.add.sprite(enemy.x +20, enemy.y ,'spit');
		
		spitBall.anchor.setTo(0.5, 0.5);
		this.physics.enable(spitBall, Phaser.Physics.ARCADE);
		this.physics.arcade.moveToXY(spitBall, this.player.x,this.player.y, 60);
		//spitBall.body.velocity.y = -150;
		this.spitBalls.push(spitBall);
		*/
		this.betterZombies.forEachAlive(function(enemy){
			
			if(this.time.now > enemy.nextShotAt && this.spitPool.countDead() > 0){
				  var spitBall = this.spitPool.getFirstExists(false);
				  spitBall.reset(enemy.x,enemy.y);
				  this.physics.arcade.moveToXY(spitBall,this.player.x, this.player.y,60);
				  enemy.nextShotAt = this.time.now + this.betterZombies.spitDelay ;
				
			}
		}, this);
		this.betterZombiesRight.forEachAlive(function(enemy){
			
			if(this.time.now > enemy.nextShotAt && this.spitPool.countDead() > 0){
				  var spitBall = this.spitPool.getFirstExists(false);
				  spitBall.reset(enemy.x,enemy.y);
				  this.physics.arcade.moveToXY(spitBall,this.player.x, this.player.y,60);
				  enemy.nextShotAt = this.time.now + this.betterZombies.spitDelay ;
				
			}
		}, this);
		this.betterZombiesDownLeft.forEachAlive(function(enemy){
			
			if(this.time.now > enemy.nextShotAt && this.spitPool.countDead() > 0){
				  var spitBall = this.spitPool.getFirstExists(false);
				  spitBall.reset(enemy.x,enemy.y);
				  this.physics.arcade.moveToXY(spitBall,this.player.x, this.player.y,60);
				  enemy.nextShotAt = this.time.now + this.betterZombies.spitDelay ;
				
			}
		}, this);
		
		
		
		
		
		
		
	},
	spitHit: function(player, spitBall ){
		spitBall.kill();
		this.player.hp = this.player.hp - this.enemies.dmg;
		console.log(this.player.hp);
		if(this.player.hp <=0){
		
			player.kill();
			spitBall.kill();
			this.gameOver();
		}
		
	},
	
	
	enemyHit: function(bullet, enemy){
		var itemChang_ce = this.rnd.integerInRange(1,25)
		if(itemChang_ce == 1 || itemChang_ce == 25){
			this.spawnMag(enemy);
		}
		if(enemy.key == "zombie"){
				var choose = this.rnd.integerInRange(1,4);
				if(choose == 1){
					if(this.amountNormalZombies > 0){
						this.amountNormalZombies --;
					}else if(this.amountNormalZombiesDown > 0){
						this.amountNormalZombiesDown --;
					}else if(this.amountNormalZombiesTopLeft > 0){
						this.amountNormalZombiesTopLeft --;
					}else if(this.amountNormalZombiesTopRight > 0){
						this.amountNormalZombiesTopRight --;
					}
				}
				if(choose == 2){
					if(this.amountNormalZombiesDown > 0){
						this.amountNormalZombiesDown --;
					}else if(this.amountNormalZombies > 0){
						this.amountNormalZombies --;
					}else if(this.amountNormalZombiesTopLeft > 0){
						this.amountNormalZombiesTopLeft --;
					}else if(this.amountNormalZombiesTopRight > 0){
						this.amountNormalZombiesTopRight --;
					}
				}
				if(choose == 3){
					if(this.amountNormalZombiesTopRight > 0){
						this.amountNormalZombiesTopRight --;
					}else if(this.amountNormalZombiesDown > 0){
						this.amountNormalZombiesDown --;
							
					}else if(this.amountNormalZombies > 0){
						this.amountNormalZombies --;
					}else if(this.amountNormalZombiesTopLeft > 0){
						this.amountNormalZombiesTopLeft --;
					}
				}
		}
		if(enemy.key == "spitZombie"){
			if(enemy.isBetterZombie){
				this.amountBetterZombies --;
			}
			if(enemy.isBetterZombieRight){
				this.amountBetterZombiesRight --;
			}
			if(enemy.isBetterZombieDownLeft){
				this.amountBetterZombiesDownLeft --;
			}
		}
		if(enemy.key == "bossDummy"){
				if(enemy.isBossZombie){
					this.amountBossZombies --;
				}
			}
	
		
		
		enemy.kill();
		this.scoreCalc(enemy.reward);
		
	},
	playerHit: function(player, enemy){
		if(enemy.canAttack == true ){
			console.log(enemy.canAttack);
			enemy.canAttack = false;
			this.player.hp = this.player.hp - this.enemies.dmg;
			
			console.log(this.player.hp);
			if(this.player.hp <= 0){
				player.kill();
				this.gameOver();
			
			}
			
			
			this.game.time.events.add(2000, this.zombiesCanAttack, this, enemy);
		}
	},
	enemyHitBaseballBat: function(enemy, weapon){
		
	
		if(enemy.hp > 0){
			enemy.hp = enemy.hp - weapon.dmg;
		}else{
			enemy.kill();	
		}
		
	},
	magazinSetup: function(){
		this.magazin = this.add.group();
		this.magazin.enableBody = true;
		this.magazin.physicsBodyType = Phaser.Physics.ARCADE;
		this.magazin.setAll('anchor.x',0.5);
		this.magazin.setAll('anchor.y', 0.5);
	},
	baseballBat: function(){
		this.weapons = this.add.group();
		this.weapons.enableBody = true;
		this.weapons.physicsBodyType = Phaser.Physics.ARCADE;
		this.weapons.createMultiple(2,'baseballBat');
		
		//this.weapons.setAll('anchor.x',0.5);
		//this.weapons.setAll('anchor.y', 0.5);
		this.nextWeaponAt = 0;
		this.WeaponDelay = 10;
		this.weapons.skill = 0;
		this.weapons.dmg = 5 + this.weapons.skill ;
	},
	forg: function(){
		this.swords = this.add.group();
		this.swords.enableBody = true;
		this.swords.physicsBodyType = Phaser.Physics.ARCADE;
		this.swords.createMultiple(1,'forg');
		//this.swords.setAll('anchor.x',0.5);
		//this.swords.setAll('anchor.y',0.5);
		this.nextSwordAt = 0;
		this.swordDelay = 10;
		this.swords.dmg = 5;
	},
	bongSetup: function(){
		this.items = this.game.add.group();
		this.bong = this.items.create(200, 200, 'bong');
		this.bong.anchor.setTo(0.5, 0.5);
		this.bong.animations.add('hitsFromTheBong', [1,2,3,4,5,6,7,8,9,10,1,12],5, false);
		this.bong.animations.add('bongUnused', [0],5, false);
		this.game.physics.arcade.enable(this.items);
	},
	normalZombie: function(){
		this.enemies = this.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemies.createMultiple(100,'zombie');
		this.enemies.setAll('anchor.x',0.5);
		this.enemies.setAll('anchor.y', 0.5);
		this.enemies.setAll('reward', 10, false, false, 0, true);

		this.enemies.setAll('outOfBoundsKill', true);
		this.enemies.setAll('checkWorldBounds', true);
		this.enemies.forEach(function(enemy){
			enemy.animations.add('fly', [0],5,true);
		});
		
		
		this.nextEnemyAt = 0;
		this.enemyDelay = 10;
		this.enemies.score = 10;
		this.enemies.dmg = 1;
		this.enemies.hp = 10;
		this.amountNormalZombies = 0; // comes from right
		this.amountNormalZombiesDown = 0;
		this.amountNormalZombiesTopRight = 0;
		this.amountNormalZombiesTopLeft = 0;
		this.normalZombiesCap = 10;
		this.normalZombiesDownCap =5;
		this.normalZombiesTopLeftCap = 10;
		this.normalZombiesTopRightCap = 5;
	},
	betterZombiesSetup: function(){
		
		
		this.betterZombies = this.add.group();
		this.betterZombies.enableBody = true;
		this.betterZombies.physicsBodyType = Phaser.Physics.ARCADE;
		this.betterZombies.createMultiple(5,'spitZombie');
		this.betterZombies.setAll('anchor.x',0.5);
		this.betterZombies.setAll('anchor.y',0.5);
		this.betterZombies.setAll('reward',150,false,false,0,true);
		this.betterZombies.setAll('outOfBoundsKill', true);
		this.betterZombies.setAll('checkWorldBounds', true);
		this.nextBetterZombiesAt = 0;
		this.betterZombiesDelay = 10;
		this.betterZombies.score = 50;
		this.betterZombies.dmg = 1;
		this.betterZombies.hp = 100;
		this.spitBalls = [];
		this.betterZombies.spitDelay = 5000;
		this.amountBetterZombies = 0;	

		this.betterZombiesCap = 2;
		
		
		
	},
	betterZombiesRightSetup: function(){
		this.betterZombiesRight = this.add.group();
		this.betterZombiesRight.enableBody = true;
		this.betterZombiesRight.physicsBodyType = Phaser.Physics.ARCADE;
		this.betterZombiesRight.createMultiple(5,'spitZombie');
		this.betterZombiesRight.setAll('anchor.x',0.5);
		this.betterZombiesRight.setAll('anchor.y',0.5);
		this.betterZombiesRight.setAll('reward',150,false,false,0,true);
		this.betterZombiesRight.setAll('checkWorldBounds', true);
		this.betterZombiesRight.setAll('outOfBoundsKill', true);
		this.nextBetterZombiesRightAt = 0;
		this.betterZombiesRightDelay = 10;
		this.betterZombiesRight.score = 50;
		this.betterZombiesRight.dmg = 1;
		this.betterZombiesRight.hp = 100;
		this.spitBalls = [];
		this.betterZombiesRight.spitDelay = 5000;
		this.amountBetterZombiesRight = 0;
	
		this.betterZombiesRightCap = 3;
		
		
	},
	betterZombiesDownLeftSetup: function(){
		this.betterZombiesDownLeft = this.add.group();
		this.betterZombiesDownLeft.enableBody = true;
		this.betterZombiesDownLeft.physicsBodyType = Phaser.Physics.ARCADE;
		this.betterZombiesDownLeft.createMultiple(5,'spitZombie');
		this.betterZombiesDownLeft.setAll('anchor.x',0.5);
		this.betterZombiesDownLeft.setAll('anchor.y',0.5);
		this.betterZombiesDownLeft.setAll('reward',150,false,false,0,true);
		this.betterZombiesDownLeft.setAll('checkWorldBounds', true);
		this.betterZombiesDownLeft.setAll('outOfBoundsKill', true);
		this.nextBetterZombiesDownLeftAt = 0;
		this.betterZombiesDownLeftDelay = 10;
		this.betterZombiesDownLeft.score = 50;
		this.betterZombiesDownLeft.dmg = 1;
		this.betterZombiesDownLeft.hp = 100;
		this.spitBalls = [];
		this.betterZombiesDownLeft.spitDelay = 5000;
		this.amountBetterZombiesDownLeft = 0;
		this.betterZombiesdownLeftCap = 1;
	},
	bossZombiesSetup: function(){
		this.bossZombies = this.add.group();
		this.bossZombies.enableBody = true;
		this.bossZombies.physicsBodyType = Phaser.Physics.ARCADE;
		this.bossZombies.createMultiple(10,'bossDummy');
		this.bossZombies.setAll('anchor.x',0.5);
		this.bossZombies.setAll('anchor.y',0.5);
		this.bossZombies.setAll('reward',500,false,false,0,true);
		this.bossZombies.setAll('checkWorldBounds', true);
		
		this.nextBossZombiesAt = 0;
		this.bossZombiesDelay = 10;
		this.bossZombies.score = 666;
		this.bossZombies.dmg = 1;
		this.bossZombies.hp = 500;
		this.amountBossZombies = 0; 
		this.bossZombiesCap = 1;
	},
	
	spawnEnemy: function(){
		if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
			
			
      		this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemies.getFirstExists(false);
      		enemy.reset(/*this.rnd.integerInRange(,1)*/896,this.rnd.integerInRange(100,370),this.enemies.hp);
      		//enemy.scale.setTo(this.rnd.integerInRange(3,6));
      		//enemy.body.velocity.x -= this.rnd.integerInRange(10,20);
      		enemy.play('fly');
			enemy.posX = enemy.x;
			enemy.posY = enemy.y;
			enemy.canAttack = true;
			if(enemy.body.velocity.x == 0 && enemy.body.velocity.y == 0){
				
				this.physics.arcade.moveToXY(enemy, this.rnd.integerInRange(1,896), this.rnd.integerInRange(1,544), 10);
			}
			
			
			
    	}
		
	},
	spawnNormalZombiesDown: function(){
		if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
			
			
      		this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemies.getFirstExists(false);
      		enemy.reset(this.rnd.integerInRange(550,735),544,this.enemies.hp);
      		//enemy.scale.setTo(this.rnd.integerInRange(3,6));
      		//enemy.body.velocity.x -= this.rnd.integerInRange(10,20);
      		enemy.play('fly');
			enemy.posX = enemy.x;
			enemy.posY = enemy.y;
			enemy.canAttack = true;
			if(enemy.body.velocity.x == 0 && enemy.body.velocity.y == 0){
				
				this.physics.arcade.moveToXY(enemy, this.rnd.integerInRange(1,896), this.rnd.integerInRange(1,544), 10);
			}
			
			
			
    	}
		
	},
	spawnNormalZombiesTopRight: function(){
		if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
			
			
      		this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemies.getFirstExists(false);
      		enemy.reset(this.rnd.integerInRange(100,250),64,this.enemies.hp);
      		//enemy.scale.setTo(this.rnd.integerInRange(3,6));
      		//enemy.body.velocity.x -= this.rnd.integerInRange(10,20);
      		enemy.play('fly');
			enemy.posX = enemy.x;
			enemy.posY = enemy.y;
			enemy.canAttack = true;
			if(enemy.body.velocity.x == 0 && enemy.body.velocity.y == 0){
				
				this.physics.arcade.moveToXY(enemy, this.rnd.integerInRange(1,896), this.rnd.integerInRange(1,544), 10);
			}
			
			
			
    	}
		
		
	},
	spawnNormalZombiesTopLeft: function(){
		if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
			
			
      		this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemies.getFirstExists(false);
      		enemy.reset(this.rnd.integerInRange(500,650),64,this.enemies.hp);
      		//enemy.scale.setTo(this.rnd.integerInRange(3,6));
      		//enemy.body.velocity.x -= this.rnd.integerInRange(10,20);
      		enemy.play('fly');
			enemy.posX = enemy.x;
			enemy.posY = enemy.y;
			enemy.canAttack = true;
			if(enemy.body.velocity.x == 0 && enemy.body.velocity.y == 0){
				
				this.physics.arcade.moveToXY(enemy, this.rnd.integerInRange(1,896), this.rnd.integerInRange(1,544), 10);
			}
			
			
			
    	}
	},
	spawnEnemyDown: function(){
		if (this.nextBetterZombiesAt < this.time.now && this.betterZombies.countDead() > 0) {
			
			
      		this.nextBetterZombiesAt = this.time.now + this.betterZombiesDelay;
			var enemy = this.betterZombies.getFirstExists(false);
      		enemy.reset(this.rnd.integerInRange(576,700),540,this.betterZombies.hp);
      		
			enemy.nextShotAt = 0;
			enemy.isBetterZombie = true;
			enemy.canAttack = true;
    	}
	},
	spawnBetterZombiesRight: function(){
		if (this.nextBetterZombiesRightAt < this.time.now && this.betterZombiesRight.countDead() > 0) {
			
			
      		this.nextBetterZombiesRightAt = this.time.now + this.betterZombiesRightDelay;
			var enemy = this.betterZombiesRight.getFirstExists(false);
      		enemy.reset(896,this.rnd.integerInRange(100,370),this.betterZombiesRight.hp);
      		
			enemy.nextShotAt = 0;
			enemy.isBetterZombieRight = true;
			enemy.canAttack = true;
    	}
		
		
		
	},
	spawnBetterZombiesDownLeft: function(){
		if (this.nextBetterZombiesDownLeftAt < this.time.now && this.betterZombiesDownLeft.countDead() > 0) {
			
			
      		this.nextBetterZombiesDownLeftAt = this.time.now + this.betterZombiesDownLeftDelay;
			var enemy = this.betterZombiesDownLeft.getFirstExists(false);
      		enemy.reset(this.rnd.integerInRange(50,100),510,this.betterZombiesDownLeft.hp);
      		
			enemy.nextShotAt = 0;
			enemy.isBetterZombieDownLeft = true;
			enemy.canAttack = true;
    	}
		
	},
	spawnBossZombie: function(){
		if (this.nextBossZombiesAt < this.time.now && this.bossZombies.countDead() > 0) {
			
			
      		this.nextBossZombiesAt = this.time.now + this.bossZombiesDelay;
			var enemy = this.bossZombies.getFirstExists(false);
      		enemy.reset(896,this.rnd.integerInRange(100,370),this.bossZombies.hp);
			enemy.isBossZombie = true;
			enemy.canAttack = true;
			if(enemy.body.velocity.x == 0 && enemy.body.velocity.y == 0){
				
				this.physics.arcade.moveToXY(enemy, this.rnd.integerInRange(1,896), this.rnd.integerInRange(1,544), 10);
			}
		}
		
	},

	spawnHandler: function(){
		
		
		if(this.amountNormalZombies < this.normalZombiesCap){
			this.spawnEnemy();
			this.amountNormalZombies ++;
			
		}
		
		
		
		
		if(this.score > 100){
			
			if(this.amountBetterZombies < this.betterZombiesCap){
				this.spawnEnemyDown();
				this.amountBetterZombies ++;
			}
			
		}
		if(this.score > 200){
			if(this.amountNormalZombiesDown < this.normalZombiesDownCap){
				this.spawnNormalZombiesDown();
				this.amountNormalZombiesDown ++;
			}
			
		}
		if(this.score > 500){
			if(this.amountBetterZombiesRight < this.betterZombiesRightCap){
				this.spawnBetterZombiesRight();
				this.amountBetterZombiesRight ++;
			}
			
			if(this.amountNormalZombiesTopRight < this.normalZombiesTopRightCap){
				this.spawnNormalZombiesTopRight();
				this.amountNormalZombiesTopRight ++;
			}
			
			
				
			
		}
		if(this.score > 600){
			if(this.amountNormalZombiesTopLeft < this.normalZombiesTopLeftCap){
				this.spawnNormalZombiesTopLeft();
				this.amountNormalZombiesTopLeft ++;
			}
			if(this.amountBetterZombiesDownLeft < this.betterZombiesDownLeftCap){
				this.spawnBetterZombiesDownLeft();
				this.amountBetterZombiesDownLeft ++;
			}
		}
		if(this.score > 2000){
			this.normalZombiesCap = 20;
			this.normalZombiesDownCap =10;
			this.normalZombiesTopLeftCap = 15;
			this.normalZombiesTopRightCap = 10;
			this.betterZombiesCap = 4;
			this.betterZombiesRightCap = 6;
			this.betterZombiesDownLeftCap = 2;
			
			
		}
		if(this.score > 5000){
			this.normalZombiesCap = 25;
			this.normalZombiesDownCap =15;
			this.normalZombiesTopLeftCap = 20;
			this.normalZombiesTopRightCap = 15;
			this.betterZombiesCap = 5;
			this.betterZombiesRightCap = 7;
			this.betterZombiesDownLeftCap = 3;
			
		}
		if(this.score > 50000){
			if(this.amountBossZombies < this.bossZombiesCap){
				this.spawnBossZombie();
				this.amountBossZomies ++;
			}
		}
		
	},
	spawnWeapon: function(){
		if (this.nextWeaponAt < this.time.now && this.weapons.countDead() > 0) {
			this.nextWeaponAt = this.time.now + this.weaponDelay;
			var weapon = this.weapons.getFirstExists(false);
			weapon.reset(100,100);
			
		}
	},
	spawnSword: function(){
		if (this.nextSwordAt < this.time.now && this.swords.countDead() > 0) {
			this.nextSwordAt = this.time.now + this.swordDelay;
			var sword = this.swords.getFirstExists(false);
			sword.reset(500,350);
			
		}
	},
	collectWeapon: function(player, weapon){
		
		if(this.player.inventar[0] == null){
			if(weapon.key == "baseballBat"){
			
				this.weaponSlot.addChild(weapon);
				this.weaponEquiped = true;
				this.player.inventar[0] = weapon;
				weapon.scale.setTo(3);
				weapon.x = +15;
				weapon.y = +10;
			}
			if(weapon.key == "forg"){
				this.weaponSlot.addChild(weapon);
				this.forgEquiped = true;
				this.player.inventar[0] = weapon;
				//weapon.scale.setTo(3);
				weapon.x = +50;
				weapon.y = +10;
			}
		}
		
	},
	collectItem: function(player, items){
		
		
	
		
		if(player.hp < player.maxHp){
			
			player.addChild(items);
			
			
			items.x = 0;
			items.y = 10;
			this.playBongHit();
			items.animations.play('hitsFromTheBong',5,false, true);
			
			player.hp = player.hp + 1;
			
		}
	
	},
	dropWeapon: function(){
		if(this.hitButton.justPressed(1)&& this.weaponEquiped == true){
			
			this.drop();
		}
		if(this.hitButton.justPressed(1)&& this.forgEquiped == true){
			this.drop();
		}
		
	},
	drop: function(){
		if(this.player.inventar[0].key == "baseballBat"){
				var dropedWeapon = this.weapons; 
				this.player.inventar[0].kill();
				this.player.inventar[0] = null;
			
				dropedWeapon.create(this.player.x -50,this.player.y -15 ,'baseballBat');
				this.weaponEquiped = false;
			}else if(this.player.inventar[0].key == "forg"){
				var dropedWeapon = this.swords; 
				this.player.inventar[0].kill();
				this.player.inventar[0] = null;
			
				dropedWeapon.create(this.player.x -50,this.player.y -15 ,'forg');
				this.forgEquiped = false;
			}
		
	},
	attack: function(){
		
		if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingRight == true){
			
			this.rightAttack();
			
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingLeft == true){
			this.leftAttack();
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingUp == true){
			this.upAttack();
			
			
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingDown == true){
			this.downAttack();
			
		}
		
		if(this.attackButton.justPressed(1)&& this.forgEquiped == true && this.player.lookingRight == true){
			this.forgAttackRight();
		}
		else if(this.attackButton.justPressed(1)&& this.forgEquiped == true && this.player.lookingLeft == true){
			this.forgAttackLeft();
		}
		else if(this.attackButton.justPressed(1)&& this.forgEquiped == true && this.player.lookingUp == true){
			this.forgAttackUp();
			
			
		}
		else if(this.attackButton.justPressed(1)&& this.forgEquiped == true && this.player.lookingDown == true){
			this.forgAttackDown();
			
		}
	},
	stopMoving: function(){
		
			this.player.body.velocity.y = 0;
    		this.player.body.velocity.x = 0;
		
		
	},

	rightAttack: function(){
		
		
		var attackAnimation = this.add.sprite(this.player.x , this.player.y -40  ,'hitAnimationRight');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			
		attackAnimation.animations.add('hit',[0,1,2,3,4],5,false);
		attackAnimation.animations.play('hit',20,false, true);
		
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
			
				this.damageEnemy(enemy,this.weapons.dmg);
				this.playBaseballSwing();
					
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
			//this.game.debug.body(attackAnimation);	
			
	},
	leftAttack: function(){
		var attackAnimation = this.add.sprite(this.player.x -35 , this.player.y -40  ,'hitAnimationLeft');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
		attackAnimation.animations.add('hit',[0,1,2,3,4],5,false);
		attackAnimation.animations.play('hit',20,false, true);
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.weapons.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
			//this.game.debug.body(attackAnimation);
	},
	upAttack: function(){
		var attackAnimation = this.add.sprite(this.player.x -50, this.player.y -40  ,'hitAnimationUp');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
		attackAnimation.animations.add('hit',[0,1,2,3,4],3,false);
		attackAnimation.animations.play('hit',20,false, true);
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.weapons.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
			//this.game.debug.body(attackAnimation);
	},
	downAttack: function(){
		var attackAnimation = this.add.sprite(this.player.x -45 , this.player.y +18  ,'hitAnimationDown');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
		attackAnimation.animations.add('hit',[4,3,2,1,0],5,false);
		attackAnimation.animations.play('hit',20,false, true);
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.weapons.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playBaseballSwing();
		}, null, this);
			//this.game.debug.body(attackAnimation);
	},
	forgAttackUp: function(){
		var attackAnimation = this.add.sprite(this.player.x , this.player.y -80  ,'forgAttackUp');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
		attackAnimation.animations.add('hit',[0,1,2,3],3,false);
		attackAnimation.animations.play('hit',20,false, true);
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		
	},
	forgAttackDown: function(){
		var attackAnimation = this.add.sprite(this.player.x -30, this.player.y   ,'forgAttackDown');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
		attackAnimation.animations.add('hit',[3,2,1,0],3,false);
		attackAnimation.animations.play('hit',20,false, true);
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
	},
	forgAttackLeft: function(){
		var attackAnimation = this.add.sprite(this.player.x  -90, this.player.y -10  ,'forgAttackLeft');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
		attackAnimation.animations.add('hit',[0,1,2,3],3,false);
		attackAnimation.animations.play('hit',20,false, true);
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		
	},forgAttackRight: function(){
		var attackAnimation = this.add.sprite(this.player.x , this.player.y -10 ,'forgAttackRight');
			
			
		this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
		attackAnimation.animations.add('hit',[0,1,2,3],3,false);
		attackAnimation.animations.play('hit',20,false, true);
		this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombies, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesRight, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		this.physics.arcade.overlap(attackAnimation, this.betterZombiesDownLeft, function(attackAnimation, enemy){
				
			this.damageEnemy(enemy,this.swords.dmg);
			this.playForgStab();
		}, null, this);
		
	},
	fireDirection: function(){
		if(this.gunButton.justPressed(1) && this.gunEquiped == true && this.player.lookingUp == true && this.mag > 0){
			this.fireUp();
			this.lowerRound();
		}else if(this.gunButton.justPressed(1) && this.gunEquiped == true && this.player.lookingDown == true && this.mag > 0 ){
			this.fireDown();
			this.lowerRound();
		};
		
		if(this.gunButton.justPressed(1) && this.gunEquiped == true && this.player.lookingRight == true && this.mag > 0){
			this.fireRight();
			this.lowerRound();
		}else if(this.gunButton.justPressed(1) && this.gunEquiped == true && this.player.lookingLeft == true && this.mag > 0){
			this.fireLeft();
			this.lowerRound();
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
		
		
		this.weaponSlot = this.game.add.image(750,400,'weaponSlot');
		//this.skillSlot = this.game.add.image(750,300,'skillDisplay');
		this.gunSlot = this.game.add.image(0,0,'gunSlot');
		this.scoreDisplay = this.game.add.image(448,32,'scoreDisplay');
		this.scoreDisplay.anchor.setTo(0.5, 0.5);
		
	},
	scoreCalc: function(score){
		this.score = this.score + score;
		this.scoreText.text = this.score;
	},
	magCalc: function(){
		this.magText.text = this.mag;
	},
	zombieBehavior: function(){
		
		
		this.enemies.forEach( function(enemy) {
			
			var distance = this.physics.arcade.distanceBetween(enemy, this.player);
			
			
			if(enemy.body.velocity.x == 0){
				this.physics.arcade.moveToXY(enemy, enemy.x, enemy.y + this.rnd.integerInRange(-1,1), 10);
			}
			if(enemy.body.velocity.y == 0){
				this.physics.arcade.moveToXY(enemy, enemy.x + this.rnd.integerInRange(-1,1), enemy.y , 10);
			}
			if(distance <= 500){
				//this.playZombieMoan();
			}
			
			if(distance > 200){
				if(enemy.posX == enemy.x && enemy.poxY == enemy.y){
					enemy.posX = enemy.x + this.rnd.integerInRange(-10,10);
					enemy.posY = enemy.y + this.rnd.integerInRange(-10,10);
					this.physics.arcade.moveToXY(enemy, enemy.posX, enemy.posY, 10);
				}
			}
			
			
			if(distance > 100 && distance < 200){
        		this.physics.arcade.moveToObject(enemy, this.player, this.rnd.integerInRange(10,30));
			}
			if(distance < 100){
				this.physics.arcade.moveToObject(enemy, this.player, 100);
			}
      	},this);
		
		this.betterZombies.forEach( function(enemy) {
			
			var distance = this.physics.arcade.distanceBetween(enemy, this.player);
        	if(distance > 250){
				this.physics.arcade.moveToObject(enemy, this.player, this.rnd.integerInRange(10,30));
			}
			if(distance < 200){
				if(this.player.lookingUp == true){
					enemy.body.velocity.y == -10;
				}
				if(this.player.lookingDown == true){
					enemy.body.velocity.y = +10;
				}
				if(this.player.lookingLeft == true){
					enemy.body.velocity.x = -10;
				}
				if(this.player.lookingRight == true){
					enemy.body.velocity.x = +10;
				}
				
				
			}
			if(distance >= 200 && distance <= 250){
				
				this.spit(enemy);
			}
			if(distance <= 100){
				//this.playZombieMoan();
			}
			
			
      	},this);
		this.betterZombiesRight.forEach( function(enemy) {
			
			var distance = this.physics.arcade.distanceBetween(enemy, this.player);
        	if(distance > 250){
				this.physics.arcade.moveToObject(enemy, this.player, this.rnd.integerInRange(10,30));
			}
			if(distance < 200){
				if(this.player.lookingUp == true){
					enemy.body.velocity.y == -10;
				}
				if(this.player.lookingDown == true){
					enemy.body.velocity.y = +10;
				}
				if(this.player.lookingLeft == true){
					enemy.body.velocity.x = -10;
				}
				if(this.player.lookingRight == true){
					enemy.body.velocity.x = +10;
				}
				
				
			}
			if(distance >= 200 && distance <= 250){
				
				this.spit(enemy);
			}
			if(distance <= 100){
				//this.playZombieMoan();
			}
			
			
      	},this);
		this.betterZombiesDownLeft.forEach( function(enemy) {
			
			var distance = this.physics.arcade.distanceBetween(enemy, this.player);
        	if(distance > 250){
				this.physics.arcade.moveToObject(enemy, this.player, this.rnd.integerInRange(10,30));
			}
			if(distance < 200){
				if(this.player.lookingUp == true){
					enemy.body.velocity.y == -10;
				}
				if(this.player.lookingDown == true){
					enemy.body.velocity.y = +10;
				}
				if(this.player.lookingLeft == true){
					enemy.body.velocity.x = -10;
				}
				if(this.player.lookingRight == true){
					enemy.body.velocity.x = +10;
				}
				
				
			}
			if(distance >= 200 && distance <= 250){
				
				this.spit(enemy);
			}
			if(distance <= 100){
				//this.playZombieMoan();
			}
			
			
      	},this);
		this.bossZombies.forEach(function(enemy){
			
			if(enemy.body.velocity.x == 0){
				this.physics.arcade.moveToXY(enemy, enemy.x, enemy.y + this.rnd.integerInRange(-1,1), 10);
			}
			if(enemy.body.velocity.y == 0){
				this.physics.arcade.moveToXY(enemy, enemy.x + this.rnd.integerInRange(-1,1), enemy.y , 10);
			}
			
			
        	this.physics.arcade.moveToObject(enemy, this.player, this.rnd.integerInRange(10,30));
			
			
			
			
			
			
		},this);
		
		
		
		
	},
	lowerRound: function(){
		
		this.mag = this.mag -1;
	
		
	},
	getRound: function(){
		
		this.mag = this.mag + 1;
		
	},
	
	damageEnemy: function(enemy, dmg){
		enemy.damage(dmg);
		if(!enemy.alive){
			
			if(enemy.key == "zombie"){
				var choose = this.rnd.integerInRange(1,4);
				if(choose == 1){
					if(this.amountNormalZombies > 0){
						this.amountNormalZombies --;
					}else if(this.amountNormalZombiesDown > 0){
						this.amountNormalZombiesDown --;
					}else if(this.amountNormalZombiesTopLeft > 0){
						this.amountNormalZombiesTopLeft --;
					}else if(this.amountNormalZombiesTopRight > 0){
						this.amountNormalZombiesTopRight --;
					}
				}
				if(choose == 2){
					if(this.amountNormalZombiesDown > 0){
						this.amountNormalZombiesDown --;
					}else if(this.amountNormalZombies > 0){
						this.amountNormalZombies --;
					}else if(this.amountNormalZombiesTopLeft > 0){
						this.amountNormalZombiesTopLeft --;
					}else if(this.amountNormalZombiesTopRight > 0){
						this.amountNormalZombiesTopRight --;
					}
				}
				if(choose == 3){
					if(this.amountNormalZombiesTopRight > 0){
						this.amountNormalZombiesTopRight --;
					}else if(this.amountNormalZombiesDown > 0){
						this.amountNormalZombiesDown --;
							
					}else if(this.amountNormalZombies > 0){
						this.amountNormalZombies --;
					}else if(this.amountNormalZombiesTopLeft > 0){
						this.amountNormalZombiesTopLeft --;
					}
				}
				if(choose == 4){
					if(this.amountNormalZombiesTopLeft > 0){
						this.amountNormalZombiesTopLeft --;
					}else if(this.amountNormalZombies > 0){
						this.amountNormalZombies --;
					}else if(this.amountNormalZombiesTopRight > 0){
						this.amountNormalZombiesTopRight --;
					}else if(this.amountNormalZombiesDown > 0){
						this.amountNormalZombiesDown --;
					}
				}
			}
			
			if(enemy.key == "spitZombie"){
				if(enemy.isBetterZombie){
					this.amountBetterZombies --;
					
				}
				if(enemy.isBetterZombieRight){
					this.amountBetterZombiesRight --;
				}
				if(enemy.isBetterZombieDownLeft){
					this.amountBetterZombiesDownLeft --;
				}
			}
			if(enemy.key == "bossDummy"){
				if(enemy.isBossZombie){
					this.amountBossZombies --;
				}
			}
			
			
			
			
			var itemChang_ce = this.rnd.integerInRange(1,25)
			if(itemChang_ce == 1 || itemChang_ce == 25){
				this.spawnMag(enemy);
			}
			var lvlUpChang_ceNormalZombie = this.rnd.integerInRange(1,2);
			if(enemy.key == "zombie" && lvlUpChang_ceNormalZombie == 1){
				this.skill = this.skill + 1;
				
			}
			
			var lvlUpChang_ceSpitZombies = this.rnd.integerInRange(1,10);
			if(enemy.key == "spitZombie" && lvlUpChang_ceSpitZombies == 1){
				this.skill = this.skill + 5;
			}
			
			var lvlUpChang_ceBossZombies = this.rnd.integerInRange(1,10);
			if(enemy.key == "bossDummy" && lvlUpChang_ceBossZombies == 1){
				this.skill = this.skill + 50;
			}
			
			this.scoreCalc(enemy.reward);
		}
		
		
	},
	skillHandler: function(){
		if(this.skill >= 10){
			this.weapons.dmg += 10;
			this.swords.dmg += 10;
			this.skill = 0;
		}
		
	},
	collectMag: function(player, magazin){
		if(this.mag < this.magCapacity){
			magazin.kill();
		
			this.getRound();
			this.playGunReload();
		}
	},
	spawnMag: function(enemy){
		var mag =  this.magazin.create(enemy.x, enemy.y, 'bulletUp');
		
	},
	setScoreBoard: function(){
	    this.score = 0;
    	this.scoreText = this.add.text(
     		this.game.width / 2, 28, '' + this.score, 
      		{ font: '20px monospace', fill: '#000000', align: 'center' }
    	);
    	this.scoreText.anchor.setTo(0.5, 0.5);

	},
	skillDisplay: function(){
		this.skillInfo = this.skill;
		this.skillText = this.add.text(
     		750, 300, '' + this.score, 
      		{ font: '20px monospace', fill: '#000000', align: 'center' }
    	);
    	this.scoreText.anchor.setTo(0.5, 0.5);

		
	},
	magDisplay: function(){
		
		this.gun = this.game.add.sprite(30,28, 'gun');
		this.gun.anchor.setTo(0.5,0.5);
		this.magText = this.add.text(
		45,45,'' + this.mag,
		{font: '20px monospace', fill: '#000000', align: 'center'}
		);
		this.magText.anchor.setTo(0.5,0.5);
	},
	ramming: function(bossZombie, enemy){
		
		if(bossZombie.body.velocity.x > 0){
			this.physics.arcade.moveToXY(enemy, bossZombie.x, bossZombie.y + 50 , 300);
		}
		if(bossZombie.body.velocity.x < 0){
			this.physics.arcade.moveToXY(enemy, bossZombie.x, bossZombie.y - 50 , 300);
		}
		if(bossZombie.body.velocity.x > 0){
			this.physics.arcade.moveToXY(enemy, bossZombie.x + 50, bossZombie.y , 300);
		}
		if(bossZombie.body.velocity.x < 0){
			this.physics.arcade.moveToXY(enemy, bossZombie.x + 50, bossZombie.y , 300);
		}
		
	},
	
	collision: function(){
			/*
		Überprüft Kollision zwischen Kugeln und Gegnern
		und führt dann die enemyHit function aus.
		*/
		for (var i = 0; i < this.bullets.length; i++) {
     		 this.physics.arcade.overlap(this.bullets[i], this.enemies, this.enemyHit, null, this);
    	};
		for (var i = 0; i < this.bullets.length; i++) {
     		 this.physics.arcade.overlap(this.bullets[i], this.betterZombies, this.enemyHit, null, this);
    	};
		for (var i = 0; i < this.bullets.length; i++) {
     		 this.physics.arcade.overlap(this.bullets[i], this.betterZombiesRight, this.enemyHit, null, this);
    	};
		for (var i = 0; i < this.bullets.length; i++) {
     		 this.physics.arcade.overlap(this.bullets[i], this.betterZombiesDownLeft, this.enemyHit, null, this);
    	};
		for (var i = 0; i < this.bullets.length; i++) {
     		 this.physics.arcade.overlap(this.bullets[i], this.bossZombies, this.enemyHit, null, this);
    	};
		
		/*
		for (var i = 0; i < this.bullets.length; i++) {
     		 this.physics.arcade.overlap(this.spitBalls[i],this.player , this.spitHit, null, this);
    	};
		*/
		this.physics.arcade.overlap(this.player, this.spitPool , this.spitHit, null, this);
		//Überprüft Kollision zwischen Gegnern und Baseballschläger.!!!!!!!!!!!!!Fehlerhaft.
		//this.physics.arcade.overlap(this.enemies, this.weapons , this.enemyHitBaseballBat, null, this);
		
		/*
		Überprüft Kollision zwischen dem Spieler und den Gegnern
		und führt die playerHit function aus.
		*/
		this.physics.arcade.overlap(this.player, this.betterZombies, this.playerHit, null, this);
		this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
		this.physics.arcade.overlap(this.player, this.betterZombiesRight, this.playerHit, null, this);
		this.physics.arcade.overlap(this.player, this.betterZombiesDownLeft, this.playerHit, null, this);
		this.physics.arcade.overlap(this.player, this.bossZombies, this.playerHit, null, this);
		this.game.physics.arcade.collide(this.betterZombies, this.betterZombies);
		this.game.physics.arcade.collide(this.betterZombiesDownLeft, this.betterZombiesDownLeft);
		this.game.physics.arcade.collide(this.betterZombiesRight, this.betterZombiesRight);
		this.game.physics.arcade.collide(this.enemies, this.enemies);
		this.game.physics.arcade.collide(this.player, this.enemies);
		this.game.physics.arcade.collide(this.player, this.betterZombies);
		this.game.physics.arcade.collide(this.player, this.betterZombiesRight);
		this.game.physics.arcade.collide(this.player, this.betterZombiesDownLeft);
		
		this.game.physics.arcade.collide(this.player, this.blocklayer);
		this.game.physics.arcade.collide(this.enemies, this.blocklayer);
		this.game.physics.arcade.collide(this.betterZombies, this.blocklayer);
		this.game.physics.arcade.collide(this.betterZombiesRight, this.blocklayer);
		this.game.physics.arcade.collide(this.betterZombiesDownLeft, this.blocklayer);
		this.game.physics.arcade.collide(this.bossZombies, this.blocklayer);
		this.game.physics.arcade.collide(this.bossZombies, this.player, this.ramming, null, this);
		//this.game.physics.arcade.collide(this.bossZombies, this.betterZombies);
		
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
		this.physics.arcade.overlap(this.player, this.magazin , this.collectMag, null, this);
	},
	controlSettings: function(){
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.walkUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.walkDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.walkLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.walkRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.hitButton = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.attackButton = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
		this.gunButton = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
		
	},
	playerSetup: function(){
		var player = null;
		this.player = this.game.add.sprite(/*this.game.world.centerX, this.game.world.centerY*/200,300, 'hesher');
		this.player.anchor.setTo(0.5,0.5)
		this.player.inventar = [null];
		this.player.hp = 3;
		//this.player.scale.setTo(2);
		this.player.maxHp = 3;
		this.player.animations.add('up',[4,5],5, true);
		this.player.animations.add('down',[1,2],5, true);
		this.player.animations.add('right',[6,7],5, true);
		this.player.animations.add('left',[8,9],5, true);
		this.player.animations.add('wait',[0],5, true);
		this.game.physics.arcade.enable(this.player);
		this.player.speed = 120;
		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(22,12,0,12);
		
		this.game.camera.follow(this.player);
		this.weaponEquiped = false;
		this.gunEquiped = true;
		this.player.lookingUp = false;
		this.player.lookingDown = false;
		this.player.lookingRight = false;
		this.player.lookingLeft = false;
		this.player.score = 0;
		this.mag = 1;
		this.magCapacity = 9;
		this.forgEquiped = false;
		this.bullets = [];
		this.collectedItem = false;
		this.skill = 0;
	},
	worldCreate: function(){
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('mytilemap', 'gameTiles');

		this.background = this.map.createLayer('background');
    	this.blocklayer = this.map.createLayer('blocklayer');
		this.map.setCollisionBetween(1, 100000, true, 'blocklayer');
		this.background.resizeWorld();
	},
	spitSetup: function(){
	  	this.spitPool = this.add.group();
	  	this.spitPool.enableBody = true;
	  	this.spitPool.physicsBodyType = Phaser.Physics.ARCADE;
	  	this.spitPool.createMultiple(100,'spit');
	  
	  	this.spitPool.setAll('anchor.x', 0.5);
      	this.spitPool.setAll('anchor.y', 0.5);
      	this.spitPool.setAll('outOfBoundsKill', true);
      	this.spitPool.setAll('checkWorldBounds', true);
      	this.spitPool.setAll('reward', 0, false, false, 0, true);
	  
	  	this.spitall = this.add.group();
	  
	  

	},
	soundSetup: function(){
		
		this.playList = [];
		this.playList[0] = this.game.add.audio('track1');
		//this.playList[1] = this.game.add.audio('track2');
		
		/*
		this.playList[2] = this.game.add.audio('track3');
		this.playList[3] = this.game.add.audio('track4');
		this.playList[4] = this.game.add.audio('track5');
		this.playList[5] = this.game.add.audio('track6');
		*/
		
		this.playList[0].addMarker('cursor0',0,309);
		//this.playList[1].addMarker('cursor1',0,264);
		
		this.baseballSwing = this.game.add.audio('baseballSwing');
		this.forgStab = this.game.add.audio('forgStab');
		this.gunReload = this.game.add.audio('gunReload');
		this.gunShot = this.game.add.audio('gunShot');
		this.zombieDies = this.game.add.audio('zombieDies');
		this.zombieMoan = this.game.add.audio('zombieMoan');
		this.bongHit = this.game.add.audio('bongHit');
		this.bongHit.addMarker('bongC',2,4);
	},
	playListController: function(){
		
		
		this.playList[0].onMarkerComplete.addOnce(function(){
			
			this.playList[1].play('cursor1');
		},this,9);	
			
			
			
		
		/*
		if(this.playList[1].totalDuration == this.playList[1].duration){
			this.playList[2].play();
		}
		if(this.playList[2].totalDuration == this.playList[2].duration){
			this.playList[3].play();
		}
		if(this.playList[3].totalDuration == this.playList[3].duration){
			this.playList[4].play();
		}
		if(this.playList[4].totalDuration == this.playList[4].duration){
			this.playList[5].play();
		}
		if(this.playList[5].totalDuration == this.playList[5].duration){
			this.playList[0].play();
		}
		*/
	},
	gameOver: function(){
		console.log("stop");
		this.playList[0].fadeOut(2000);
		/*
		this.playList[0].onPlay.addOnce(function(){
			this.playList[0].stop();
		},this,9);
		this.playList[1].onPlay.addOnce(function(){
			this.playList[1].stop();
		},this,9);
		this.baseballSwing.onPlay.addOnce(function(){
			this.baseballSwing.stop();
		},this,9);
		this.forgStab.onPlay.addOnce(function(){
			this.forgStab.stop();
		},this,9);
		this.gunReload.onPlay.addOnce(function(){
			this.gunReload.stop();
		},this,9);
		this.gunShot.onPlay.addOnce(function(){
			this.gunShot.stop();
		},this,9);
		this.zombieDies.onPlay.addOnce(function(){
			this.zombieDies.stop();
		},this,9);
		this.zombieMoan.onPlay.addOnce(function(){
			this.zombieMoan.stop();
		},this,9);
		this.bongHit.onPlay.addOnce(function(){
			this.bongHit.stop();
		},this,9);
		*/
		this.weaponEquiped = false;
		this.forgEquiped = false;
		this.gunEquiped = false;
		this.game.time.events.add(2000, function(){
			this.game.state.start('MainMenu', true, false, this.score);
		}, this);
		
		
		
		
		
		
		
	
		
	},
	zombiesCanAttack: function(enemy){
		enemy.canAttack = true;
		
	},
	startPlayList: function(){
		
		this.playList[0].play('cursor0',0,1,true);
	},
	playBongHit: function(){
		this.bongHit.play('bongC');
	},
	playBaseballSwing: function(){
		this.baseballSwing.play();
	},
	playForgStab: function(){
		this.forgStab.play();
	},
	playGunReload: function(){
		this.gunReload.play();
	},
	playGunShot: function(){
		this.gunShot.play();
	},
	playZombieDies: function(){
		this.zombieDies.play();
	},
	playZombieMoan: function(){
		this.zombieMoan.play('',0,1,true);
	},
	burnSetup: function(){
		this.burn = this.game.add.sprite(290,105,'fire');
		this.burn.scale.setTo(2);
		this.burn.animations.add('burn', [0,1,2,3,4],5, false);
		this.burn.animations.play('burn',null,true);
		this.burn2 = this.game.add.sprite(320,105,'fire');
		this.burn2.scale.setTo(2);
		this.burn2.animations.add('burn', [0,1,2,3,4],5, false);
		this.burn2.animations.play('burn',null,true);
	}
	
	
};