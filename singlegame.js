var matrix = [];
var menu;
var tempNumber = 0;
class GameSinglePlayer extends Phaser.Scene {
    constructor() {
        super('gameSinglePlayer')
    }

    changecolor;
    zones = {}
    counter;
    mosse;
    vincitore;
    turnof;
    imgturnof;
    catKey;
    turnKey;
    restart;

    createArr() {
        for (let a = 0; a < 3; a++) {
            matrix[a] = [0, 0, 0]
        }
    }

    preload() {
        this.createArr();
        this.load.image('background', 'cose/background.png');
        this.load.image('white-cat', 'cose/white-cat.png');
        this.load.image('linea', 'cose/line1.png');
        this.load.image('black-cat', 'cose/black-cat.png');
        this.load.image('menu', 'cose/Menu.png');
        this.load.image('whitecatturn', 'cose/WHITE CAT TURN.png');
        this.load.image('blackcatturn', 'cose/BLACK CAT TURN.png' );
        this.load.image('restart', 'cose/RESTART.png');
    }
    create() {
        this.reset();
        this.add.image(300, 288, 'background');
        menu = this.add.image(80, 50, 'menu').setInteractive().setScale(0.7);
        menu.on('pointerdown', () => this.scene.start('preloadscene'));
        this.turnof = this.add.image(125, 120, this.turnKey);
        this.imgturnof = this.add.image(100, 200, this.catKey).setScale(0.2);
        this.restart = this.add.image(125,530, 'restart').setInteractive();
        this.restart.on('pointerdown', () => {
            this.restartButton();
        } )
        this.add.image(500, 220, 'linea').setScale(0.9,1);        
        this.add.image(500, 370, 'linea').setScale(0.9,1);
        this.add.image(420, 300, 'linea').setScale(0.9,1).angle = 90;
        this.add.image(570, 300, 'linea').setScale(0.9,1).angle = 90;

        this.zones = this.add.group();


        var zone0 = this.add.zone(290, 100, 120, 120).setOrigin(0).setInteractive().setName(0);
        var zone1 = this.add.zone(440, 100, 120, 120).setOrigin(0).setInteractive().setName(1);
        var zone2 = this.add.zone(590, 100, 120, 120).setOrigin(0).setInteractive().setName(2);

        var zone3 = this.add.zone(290, 250, 120, 120).setOrigin(0).setInteractive().setName(3);
        var zone4 = this.add.zone(440, 250, 120, 120).setOrigin(0).setInteractive().setName(4);
        var zone5 = this.add.zone(590, 250, 120, 120).setOrigin(0).setInteractive().setName(5);

        var zone6 = this.add.zone(290, 380, 120, 120).setOrigin(0).setInteractive().setName(6);
        var zone7 = this.add.zone(440, 380, 120, 120).setOrigin(0).setInteractive().setName(7);
        var zone8 = this.add.zone(590, 380, 120, 120).setOrigin(0).setInteractive().setName(8);

        this.zones.add(zone0);
        this.zones.add(zone1);
        this.zones.add(zone2);
        this.zones.add(zone3);
        this.zones.add(zone4);
        this.zones.add(zone5);
        this.zones.add(zone6);
        this.zones.add(zone7);
        this.zones.add(zone8);

        this.zones.children.entries.forEach( ( zone ) => {
            zone.input.enabled = true;
        })

        this.clickBox();
        this.changeCat();
    }

    computerTurn() {
        var computerTurn = true;
        while(computerTurn) {
            var randomZone = this.zones.children.entries[this.tempNumber]
            if(randomZone.input.enabled && this.mosse <= 9) {
                this.add.image((randomZone.x + 60),(randomZone.y + 60), "black-cat").setScale(0.15);
                this.container[randomZone.name] = -1;
                randomZone.input.enabled = false;
                computerTurn = false;
                this.tempNumber++;
                this.mosse++
                this.changeCat();

                //riempimento matrice
            //riga0
            matrix[0][0] = this.container[0];
            matrix[0][1] = this.container[1];
            matrix[0][2] = this.container[2];
            //riga1
            matrix[1][0] = this.container[3];
            matrix[1][1] = this.container[4];
            matrix[1][2] = this.container[5];
            //riga2
            matrix[2][0] = this.container[6];
            matrix[2][1] = this.container[7];
            matrix[2][2] = this.container[8];

            this.checkRows();
            this.checkCols();
            this.checkDiag1();
            this.checkDiag2();
            this.noWinner();
            }
            else if ( this.vincitore == true ){
                computerTurn = false;
            }
        }
    }

    clickBox() {
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            var clickedzone = this.zones.children.entries.find((zone) => {
                return zone == gameObject
            })
            if (clickedzone) {
                this.add.image((gameObject.x + 60), (gameObject.y + 60), 'white-cat').setScale(0.15);
                this.container[gameObject.name] = 1;
                gameObject.input.enabled = false;
                this.mosse++;
                this.changeCat();
            }

            //riempimento matrice
            //riga0
            matrix[0][0] = this.container[0];
            matrix[0][1] = this.container[1];
            matrix[0][2] = this.container[2];
            //riga1
            matrix[1][0] = this.container[3];
            matrix[1][1] = this.container[4];
            matrix[1][2] = this.container[5];
            //riga2
            matrix[2][0] = this.container[6];
            matrix[2][1] = this.container[7];
            matrix[2][2] = this.container[8];



            this.computerTurn();
            this.checkRows();
            this.checkCols();
            this.checkDiag1();
            this.checkDiag2();
            this.noWinner();
            console.log("Numero mosse" + this.mosse)

        });
    }
    checkCols() {
        //controllo colonne
        for (let j = 0; j < 3; j++) {
            this.counter = 0;
            for (let i = 0; i < 3; i++) {
                this.counter += matrix[i][j];
            }
            this.whosTheWinner(this.counter);
        }
    }

    checkRows() {
        //controllo righe
        for (let i = 0; i < 3; i++) {
            this.counter = 0;
            for (let j = 0; j < 3; j++) {
                this.counter += matrix[i][j];
            }
            this.whosTheWinner(this.counter);
        }
    }
    checkDiag1() {
        //controllo diagonale primaria
        this.counter = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i == j) {
                    this.counter += matrix[i][j];
                }
            }
        }
        this.whosTheWinner(this.counter);
    }
    checkDiag2() {
        this.counter = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (j == (matrix.length) - i - 1) {
                    this.counter += matrix[i][j];
                }
            }
        }
        this.whosTheWinner(this.counter);
    }
    whosTheWinner = (counter) => {
        if (this.counter == 3) {
            this.vincitore = true;
            this.turnof.destroy();
            this.imgturnof.destroy();
            this.zones.children.iterate((zone) => {
                zone.input.enabled = false;
            });
            this.scene.start('winnerscene', {key: 'white-cat', isWinner: true});
        }
        if (this.counter == -3) {
            this.vincitore = true;
            this.turnof.destroy();
            this.imgturnof.destroy();
            this.zones.children.iterate((zone) => {
                zone.input.enabled = false;
            });
            this.scene.start('winnerscene', {key: 'black-cat', isWinner: true});

        }

    }
    noWinner = () => {
        if (!this.vincitore && this.mosse == 9) {
            this.turnof.destroy();
            this.imgturnof.destroy();
            this.add.text(300, 250, 'Pareggio.', { fill: '#ffffff', font: '30pt Arial' });
            this.scene.start('winnerscene', {key1: 'black-cat', key2:'white-cat', isWinner: false});
            
        }
    }
    changeCat = () => {
        if (this.changecolor) {
            this.turnKey = 'whitecatturn';
            this.catKey = 'white-cat';
        }
        else {
            this.turnKey = 'blackcatturn';
            this.catKey = 'black-cat';
        }
        this.imgturnof.destroy();
        this.turnof.destroy();
        this.imgturnof = this.add.image(100, 200, this.catKey).setScale(0.2);
        this.turnof = this.add.image(125, 120, this.turnKey);
    }
    reset = () => {
        this.changecolor = true;
        this.tempNumber = 0;
        this.counter = 0;
        this.container = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.mosse = 0;
        this.vincitore = false;
        this.catKey = 'white-cat';
        this.turnKey = 'whitecatturn';
        //riga0
        matrix[0][0] = this.container[0];
        matrix[0][1] = this.container[1];
        matrix[0][2] = this.container[2];
        //riga1
        matrix[1][0] = this.container[3];
        matrix[1][1] = this.container[4];
        matrix[1][2] = this.container[5];
        //riga2
        matrix[2][0] = this.container[6];
        matrix[2][1] = this.container[7];
        matrix[2][2] = this.container[8];
    }
    restartButton = () => {
        this.reset();
        this.scene.start('game');
    }

    update() { }

}

export default GameSinglePlayer;
