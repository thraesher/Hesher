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
		
		/////////////////////////////////////////PlayerSetings///////////////////////////////////////////////
		var player = null;
		this.player = this.game.add.sprite(/*this.game.world.centerX, this.game.world.centerY*/200,300, 'hesher');
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
		this.player.body.setSize(22,12,0,12);
		
		this.game.camera.follow(this.player);
		this.weaponEquiped = false;
		this.gunEquiped = true;
		this.player.lookingUp = false;
		this.player.lookingDown = false;
		this.player.lookingRight = false;
		this.player.lookingLeft = false;
		this.player.score = 0;
		this.mag = 9;
		this.magCapacity = 9;
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
		this.setScoreBoard();
		this.magDisplay();
	
		
		
		
		//////////////////////////////////////////WeaponsSetting///////////////////////////////////////////
		this.weapons = this.add.group();
		this.weapons.enableBody = true;
		this.weapons.physicsBodyType = Phaser.Physics.ARCADE;
		this.weapons.createMultiple(2,'baseballBat');
		this.weapons.setAll('anchor.x',0.5);
		this.weapons.setAll('anchor.y', 0.5);
		this.nextWeaponAt = 0;
		this.WeaponDelay = 10;
		this.weapons.dmg = 5;
		
		this.magazin = this.add.group();
		this.magazin.enableBody = true;
		this.magazin.physicsBodyType = Phaser.Physics.ARCADE;
		//this.magazin.createMultiple(1,'bulletUp');
		this.magazin.setAll('anchor.x',0.5);
		this.magazin.setAll('anchor.y', 0.5);
		
		
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
		this.enemies.createMultiple(1,'zombie');
		this.enemies.setAll('anchor.x',0.5);
		this.enemies.setAll('anchor.y', 0.5);
		this.enemies.setAll('reward', 10, false, false, 0, true);

		//this.enemies.setAll('outOfBoundsKill', true);
		//this.enemies.setAll('checkWorldBounds', true);
		this.enemies.forEach(function(enemy){
			enemy.animations.add('fly', [0],5,true);
		});
		
		
		this.nextEnemyAt = 0;
		this.enemyDelay = 10;
		this.enemies.score = 1;
		this.enemies.dmg = 1;
		this.enemies.hp = 10;
		
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
		this.gunButton = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		
		
		
		
	},
	update: function(){
		
		///////////////////////////////Physics///////////////////////////////////////////////////
		this.collision();
		////////////////////////////////////////////////////////////////////////////////////////
		
		///////////////////////EnemySpawn//////////////////////////////////////////////////////
		
		this.magCalc();
		this.spawnEnemy();
		
		this.spawnWeapon();
		//this.spawnSword();
		this.zombieBehavior();
		
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
		var chang_ce = this.rnd.integerInRange(1,6)
		if(chang_ce == 1 || chang_ce == 6){
			this.spawnMag(enemy);
		}
		
		bullet.kill();
		enemy.kill();
		this.scoreCalc(enemy.reward);
		
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
		
	
		if(enemy.hp > 0){
			enemy.hp = enemy.hp - weapon.dmg;
		}else{
			enemy.kill();	
		}
		
	},
	spawnEnemy: function(){
		if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
			
			
      		this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemies.getFirstExists(false);
      		enemy.reset(/*this.rnd.integerInRange(,1)*/896,this.rnd.integerInRange(100,370),10);
      		//enemy.scale.setTo(this.rnd.integerInRange(3,6));
      		//enemy.body.velocity.x -= this.rnd.integerInRange(10,20);
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
			weapon.scale.setTo(3);
			weapon.x = +65;
			weapon.y = +55;
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
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			//attackAnimation.body.offset(-10,-40);
			//attackAnimation.body.setSize(32,96,-10,-150);
			attackAnimation.animations.add('hit',[0,1,2,3,4],5,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
			
					this.damageEnemy(enemy,this.weapons.dmg);
					
				}, null, this);
				
			this.game.debug.body(attackAnimation);
			
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingLeft == true){
			var attackAnimation = this.add.sprite(this.player.x -35 , this.player.y  ,'hitAnimationLeft');
			attackAnimation.anchor.setTo(0.5, 0.5);
			
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			attackAnimation.animations.add('hit',[0,1,2,3,4],5,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
				this.damageEnemy(enemy,this.weapons.dmg);
				
				}, null, this);
			this.game.debug.body(attackAnimation);
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingUp == true){
			
			var attackAnimation = this.add.sprite(this.player.x , this.player.y -30  ,'hitAnimationUp');
			attackAnimation.anchor.setTo(0.5, 0.5);
			
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			attackAnimation.animations.add('hit',[0,1,2,3,4],3,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
				this.damageEnemy(enemy,this.weapons.dmg);
				}, null, this);
			this.game.debug.body(attackAnimation);
			
		}
		else if(this.attackButton.justPressed(1)&& this.weaponEquiped == true && this.player.lookingDown == true){
			var attackAnimation = this.add.sprite(this.player.x , this.player.y +40 ,'hitAnimationDown');
			attackAnimation.anchor.setTo(0.5, 0.5);
			
		  	this.physics.enable(attackAnimation, Phaser.Physics.ARCADE);
			attackAnimation.animations.add('hit',[4,3,2,1,0],5,false);
			attackAnimation.animations.play('hit',20,false, true);
			this.physics.arcade.overlap(attackAnimation, this.enemies, function(attackAnimation, enemy){
				
				this.damageEnemy(enemy,this.weapons.dmg);
				}, null, this);
			this.game.debug.body(attackAnimation);
			
		}
	},
	stopMoving: function(){
		
			this.player.body.velocity.y = 0;
    		this.player.body.velocity.x = 0;
		
		
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
			
			var chang_ce = this.rnd.integerInRange(1,6)
			if(chang_ce == 1 || chang_ce == 6){
				this.spawnMag(enemy);
			}
			this.scoreCalc(enemy.reward);
		}
		
	},
	collectMag: function(player, magazin){
		if(this.mag < this.magCapacity){
			magazin.kill();
		
			this.getRound();
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
	magDisplay: function(){
		
		this.gun = this.game.add.sprite(30,28, 'gun');
		this.gun.anchor.setTo(0.5,0.5);
		this.magText = this.add.text(
		45,45,'' + this.mag,
		{font: '20px monospace', fill: '#000000', align: 'center'}
		);
		this.magText.anchor.setTo(0.5,0.5);
	},
	
	collision: function(){
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
		this.game.physics.arcade.collide(this.enemies, this.blocklayer);
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
	}
	
	
	
};