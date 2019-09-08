class GameScene extends Phaser.Scene {
    constructor() {
        super('game')
    }

    whiteTurn;
    matrix=[];
    menu;
    zones;
    counter;
    mosse;
    vincitore;
    turnof;
    imgturnof;
    catKey;
    turnKey;
    restart;

    /**
     * inizializzazione matrice
     */
    createMatrix() {
        for (let i = 0; i < 3; i++) {
            this.matrix[i] = [0, 0, 0]
        }
    }

    preload() {
        this.createMatrix();
        this.load.image('background', 'assets/background.png')
        this.load.image('linea', 'assets/line1.png')
        this.load.image('menu', 'assets/Menu.png')
        this.load.image('itsturnof', 'assets/itsturnof.png')
        this.load.image('restart', 'assets/RESTART.png')
        this.load.audio('click', 'assets/startclick.mp3')

    }
    create() {
        this.reset() //reset dei dati
        this.sound.add('click')
        this.add.image(300, 288, 'background');
        this.menu = this.add.image(80, 50, 'menu').setInteractive().setScale(0.7)
        this.menu.on('pointerdown', () => {
            this.sound.play('click')
            this.scene.start('preloadscene')
        });
        this.turnof = this.add.image(125, 120, 'itsturnof');
        this.imgturnof = this.add.image(100, 200, this.catKey).setScale(0.2);
        this.restart = this.add.image(125, 530, 'restart').setInteractive();
        this.restart.on('pointerdown', () => {
            this.sound.play('click')
            this.restartButton();
        })
        this.add.image(500, 220, 'linea').setScale(0.9, 1);
        this.add.image(500, 370, 'linea').setScale(0.9, 1);
        this.add.image(420, 300, 'linea').setScale(0.9, 1).angle = 90;
        this.add.image(570, 300, 'linea').setScale(0.9, 1).angle = 90;

        this.zones = [];

        var zone0 = this.add.zone(285, 90, 120, 120).setOrigin(0).setInteractive().setName(0);
        var zone1 = this.add.zone(430, 90, 120, 120).setOrigin(0).setInteractive().setName(1);
        var zone2 = this.add.zone(580, 90, 120, 120).setOrigin(0).setInteractive().setName(2);

        var zone3 = this.add.zone(285, 230, 120, 120).setOrigin(0).setInteractive().setName(3);
        var zone4 = this.add.zone(430, 230, 120, 120).setOrigin(0).setInteractive().setName(4);
        var zone5 = this.add.zone(580, 230, 120, 120).setOrigin(0).setInteractive().setName(5);

        var zone6 = this.add.zone(285, 380, 120, 120).setOrigin(0).setInteractive().setName(6);
        var zone7 = this.add.zone(430, 380, 120, 120).setOrigin(0).setInteractive().setName(7);
        var zone8 = this.add.zone(580, 380, 120, 120).setOrigin(0).setInteractive().setName(8);

        this.zones.push(zone0);
        this.zones.push(zone1);
        this.zones.push(zone2);
        this.zones.push(zone3);
        this.zones.push(zone4);
        this.zones.push(zone5);
        this.zones.push(zone6);
        this.zones.push(zone7);
        this.zones.push(zone8);

        this.clickBox();
        this.changeCat();
    }
    
    /**
     * Prima controlla se l'oggetto cliccato corrisponde ad una delle zone
     * e lo salva in una variabile; in seguito verifica se l'oggetto cliccato è
     * una zona, verifica di chi è il turno, aggiunge l'immagine, valorizza
     * la matrice, disabilita il click in quella zona, cambia il turno e 
     * aggiorna il turno attuale.
     * Infine va a controllare se c'è un vincitore.
     * 
     */
    clickBox() {
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            var clickedzone = this.zones.find((zone) => {
                return gameObject == zone
            })

            if (clickedzone) {
                if (this.whiteTurn) {
                    this.fallingCat = this.add.image((gameObject.x + 70), -200, 'white-cat').setScale(0.15);
                    this.container[gameObject.name] = 1
                    this.whiteTurn = false;
                    gameObject.input.enabled = false;
                    this.tweens.add({
                        targets: this.fallingCat,
                        x: gameObject.x + 70,
                        y: gameObject.y + 70,
                        alpha: 1,
                        ease: 'Linear',
                        duration: 700,
                        repeat: 0,
                        yoyo: false
                    });
                }

                else if (!this.whiteTurn) {
                    this.fallingBlackCat = this.add.image((gameObject.x + 70), -200, 'black-cat').setScale(0.17);
                    this.container[gameObject.name] = -1;
                    this.whiteTurn = true;
                    gameObject.input.enabled = false;
                    this.tweens.add({
                        targets: this.fallingBlackCat,
                        x: gameObject.x + 70,
                        y: gameObject.y + 70,
                        alpha: 1,
                        ease: 'Linear',
                        duration: 700,
                        repeat: 0,
                        yoyo: false
                    });
                }
                this.changeCat();
            }
            

            //riempimento matrice
            //riga0
            this.matrix[0][0] = this.container[0];
            this.matrix[0][1] = this.container[1];
            this.matrix[0][2] = this.container[2];
            //riga1
            this.matrix[1][0] = this.container[3];
            this.matrix[1][1] = this.container[4];
            this.matrix[1][2] = this.container[5];
            //riga2
            this.matrix[2][0] = this.container[6];
            this.matrix[2][1] = this.container[7];
            this.matrix[2][2] = this.container[8];

            this.checkRows();
            this.checkCols();
            this.checkDiag1();
            this.checkDiag2();
            setTimeout(() => {  //è stato aggiunti un setTimeout per attendere la caduta dell'immagine
                this.mosse++
            }, 1000)
            this.noWinner();

        });
    }

    /**
     * Aggiorna il turno attuale
     */
    changeCat = () => {
        if (this.whiteTurn) {
            this.catKey = 'white-cat';
        }
        else {
            this.catKey = 'black-cat';
        }
        this.imgturnof.destroy();
        this.imgturnof = this.add.image(100, 200, this.catKey).setScale(0.2);
    }
    /**
     * va a controllare se lungo le colonne è stato effettuato un tris
     */
    checkCols() {
        for (let j = 0; j < 3; j++) {
            var counter = 0;
            for (let i = 0; i < 3; i++) {
                counter += this.matrix[i][j];
            }
            this.whosTheWinner(counter);
        }
    }

    /**
     * va a controllare se lungo le righe è stato effettuato un tris
     */
    checkRows() {
        for (let i = 0; i < 3; i++) {
            var counter = 0;
            for (let j = 0; j < 3; j++) {
                counter += this.matrix[i][j];
            }
            this.whosTheWinner(counter);
        }
    }
     /**
     * va a controllare se lungo la diagonale primaria è stato effettuato un tris
     */
    checkDiag1() {
        var counter = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i == j) {
                    counter += this.matrix[i][j];
                }
            }
        }
        this.whosTheWinner(counter);
    }
    /**
     * va a controllare se lungo la diagonale secondaria è stato effettuato un tris
     */
    checkDiag2() {
        var counter = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (j == (this.matrix.length) - i - 1) {
                    counter += this.matrix[i][j];
                }
            }
        }
        this.whosTheWinner(counter);
    }
    /**
     * Verifica chi è il vincitore e porta alla scena successiva
     */
    whosTheWinner = (counter) => {
        if (counter == 3) {
            this.vincitore = true;
            this.zones.forEach((zone) => {
                zone.input.enabled = false;
            });
            setTimeout(() => {
                this.turnof.destroy();
                this.imgturnof.destroy();
                this.scene.start('winnerscene', { key: 'white-cat', isWinner: true });
            },1000)
        }

        if (counter == -3) {
            this.vincitore = true;
            this.zones.forEach((zone) => {
                zone.input.enabled = false;
            });

            setTimeout(() => {
                this.turnof.destroy();
                this.imgturnof.destroy();
                this.scene.start('winnerscene', { key: 'black-cat', isWinner: true });
            }, 1000)
        }
    }

        /**
         * verifica se c'è stato un pareggio e porta alla scena successiva
         */
        noWinner = () => {
            setTimeout(() => {
                if (!this.vincitore && this.mosse == 9) {
                    this.turnof.destroy();
                    this.imgturnof.destroy();
                    this.scene.start('winnerscene', { keyBlack: 'black-cat', keyWhite: 'white-cat', isWinner: false });
                }
            }, 1000)

        }
        /**
         * Funzione richiamata all'inizio che effettua il reset dei dati
         */
        reset = () => {
            this.whiteTurn = true;
            this.counter = 0;
            this.container = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.mosse = 0;
            this.vincitore = false;
            this.catKey = 'white-cat';
            this.turnKey = 'whitecatturn';
        }
        /**
         * Reset dei dati e restart della scena
         */
        restartButton = () => {
            this.reset();
            this.scene.start('game');
        }

    }

    export default GameScene;
