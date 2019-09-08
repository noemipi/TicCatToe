class PreloadScene extends Phaser.Scene {
    constructor(){
        super('preloadscene')
    }

    preload(){
        this.load.image('background1', 'assets/background.png')
        this.load.image('gamename', 'assets/TicCatToe.png')
        this.load.image('start', 'assets/start.png')
        this.load.image('white-cat','assets/white-cat.png')
        this.load.image('black-cat', 'assets/black-cat.png')
        this.load.audio('startclick', 'assets/startclick.mp3')
    }
    create(){
        this.sound.add('startclick')
        this.add.image(300,288, 'background1')
        this.add.image(400, 188, 'gamename').setScale(1.1);
        this.add.image(200,350, 'white-cat').setScale(0.2);
        this.add.image(580,350,'black-cat').setScale(0.23);
        var startButton = this.add.image(400,350,'start');
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.sound.play('startclick')
            this.scene.start('game')
        })
        startButton.on('pointerover', () => startButton.setScale(1.07));
        startButton.on('pointerout', () => startButton.setScale(1));
    }

}

export default PreloadScene;