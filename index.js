import GameScene from "./game.js"
import PreloadScene from "./preloadscene.js";
import WinnerScene from "./winnerscene.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 576,
    scene: [PreloadScene, GameScene, WinnerScene]
}

var game = new Phaser.Game(config)



