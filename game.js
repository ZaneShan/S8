class start extends Phaser.Scene {
    constructor() {
        super('start')
    }
    preload() {
        this.load.image('rolypoly', 'roly.png');
        this.load.image('floor', 'floor.png');
        this.load.image('slug', 'slug.png');
    }
    create() {
        this.cameras.main.setBackgroundColor('#00FF00');

        const platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 500; i++) {
            platforms.create(Math.random() * 2000, 1000, 'floor');
        } //ground

        this.player = this.physics.add.sprite(this.cameras.main.width / 3, 850, 'rolypoly');
        this.player.setScale(0.5);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(20, 20);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, platforms);

        // enemy
        this.blocks = this.physics.add.group({
            allowGravity: false
        });

        // shoot timer
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 3000), // Random delay 
            callback: () => {
                const block = this.blocks.create(this.cameras.main.width, Phaser.Math.Between(500, 850), 'slug');
                block.setScale(0.3);
                block.setVelocityX(-300);
            },
            loop: true,
        });

        // block collision
        this.physics.add.collider(this.player, this.blocks, (player, block) => {
            block.destroy(); 
            this.scene.start(`death`)
        });

        this.add.text(1500, 25, 'Press up arrow key to jump', {
            fontSize: '20px',
            fill: 0xFFFFFF
        });

    }

    update ()
    {
        const {up} = this.cursors;
        
        if (up.isDown && this.player.body.touching.down)
        {
            this.player.body.setVelocityY(-500);
        }

    } //controls
}

class death extends Phaser.Scene {
    constructor() {
        super('death');
    }
    create() {
        this.cameras.main.setBackgroundColor('#0x000000');
        
        const cont = this.add.text(0, 0, 'Retry?', {
            font: 'bold 50px Arial Black',
            fill: '#FFFFFF',
        });
        cont.setOrigin(0.5, 1.0);
        cont.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
        cont.setInteractive();
        cont.on('pointerover', () => {
            this.tweens.add({
            targets: cont,
            scale: 1.2,
            duration: 200,
            ease: 'Power1',
            });
        });
        cont.on('pointerout', () => {
            this.tweens.add({
            targets: cont,
            scale: 1,
            duration: 200,
            ease: 'Power1',
            });
        });
        cont.on('pointerdown', () => {
            this.tweens.add({
                targets: cont,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 50,
                yoyo: true,
                ease: 'Power1',
                onComplete: () => {
                    this.cameras.main.fade(1000, 0, 0, 0);
                    this.time.delayedCall(1000, () => this.scene.start(`start`));
                },
            });
        });
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [start, death],
    title: "rolypoly",
    background: "#00000",
});
