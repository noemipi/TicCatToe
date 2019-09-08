class WinnerScene extends Phaser.Scene {
    constructor() {
        super('winnerscene')
    }
    cat;

    preload() {
        this.load.image('background1', 'assets/background.png');
        this.load.image('gamename', 'assets/TicCatToe.png');
        this.load.image('menu', 'assets/Menu.png');
        this.load.image('winneris', 'assets/Thewinneris.png');
        this.load.image('nowinner', 'assets/No Winner!.png');
        this.load.audio('click', 'assets/startclick.mp3')
    }
    create(data) {
        this.sound.add('click')
        this.add.image(300, 288, 'background1');
        this.add.image(250, 100, 'gamename').setScale(0.8);
        var menu = this.add.image(670, 520, 'menu').setInteractive();
        menu.on('pointerdown', () => {
            this.sound.play('click')
            this.scene.start('preloadscene')
        });
        /**
         * Genera viste diverse in base a chi è il vincitore
         */
        if (data.isWinner == true) {
            this.winner = this.add.image(400, 200, 'winneris').setScale(0);
            this.cat = this.add.image(-200, 400, data.key).setScale(0.5);
            this.tweens.add({
                targets: this.cat,
                x: 380,
                y: 400,
                alpha: 1,
                ease: 'Linear',
                delay: 1500,
                duration: 1000,
                angle: 360,
                repeat: 0,
                yoyo: false
            });
            this.tweens.add({
                targets: this.winner,
                x: 400,
                y: 200,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                angle: 1080,
                ease: 'Linear',
                delay: 500,
                duration: 1000,
                repeat: 0,
                yoyo: false
            })

        }
        /**
         * Se non c'è alcun vincitore, genera un'altra vista
         */
        if (data.isWinner == false) {
            this.add.image(400, 320, 'nowinner').setScale(0.7);
            this.blackcat = this.add.image(160, 300, data.keyBlack).setScale(0.4);
            this.whitecat = this.add.image(630, 310, data.keyWhite).setScale(0.12);
            this.tweens.add({
                targets: this.blackcat,
                x: 160,
                y: 300,
                scaleX:0.15,
                scaleY:0.15,
                ease: 'Linear',
                duration: 800,
                repeat: -1,
                yoyo: true
            });
            this.tweens.add({
                targets: this.whitecat,
                x: 630,
                y: 310,
                scaleX:0.35,
                scaleY:0.35,
                ease: 'Linear',
                duration: 800,
                repeat: -1,
                yoyo: true
            });
        }
    }

}
export default WinnerScene

