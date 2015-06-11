// JavaScript Document
var hesher = hesher||{};

hesher.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO,'');

hesher.game.state.add('Boot',hesher.Boot);
hesher.game.state.add('Preload', hesher.Preload);
hesher.game.state.add('Game', hesher.Game);

hesher.game.state.start('Boot');