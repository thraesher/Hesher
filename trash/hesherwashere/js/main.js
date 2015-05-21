// JavaScript Document

var hesherWasHere = hesherWasHere || {};

hesherWasHere.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO,'');

hesherWasHere.game.state.add('Boot', hesherWasHere.Boot);
//uncomment these as we create them through the tutorial
hesherWasHere.game.state.add('Preload', hesherWasHere.Preload);
hesherWasHere.game.state.add('MainMenu', hesherWasHere.MainMenu);
hesherWasHere.game.state.add('Game', hesherWasHere.Game);

hesherWasHere.game.state.start('Boot');