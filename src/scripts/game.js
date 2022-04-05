import Player from './player';
import Vaccine from './vaccine';
import Virus from './virus';
import Explosion from './explosion';
import { drawBackground } from './background';
import music from '../audio/backgroundmusic.mp3';
import zap from '../audio/zap.wav';
import explode from '../audio/explode.wav';
import retrogameover from '../audio/gameover.mp3';

let player = new Player();
let vaccines = [];
let viruses = [];
let explosions = [];
let score = 0;
let animationId;
let difficulty = 1;

const backgroundMusic = document.createElement('audio');
backgroundMusic.src = music;
backgroundMusic.volume = 0.3;

const shootSound = document.createElement('audio');
shootSound.src = zap;
shootSound.volume = 0.4;

const explodeSound = document.createElement('audio');
explodeSound.src = explode;
explodeSound.volume = 0.05;

const gameoverSound = document.createElement('audio');
gameoverSound.src = retrogameover;
gameoverSound.volume = 0.2;


export default class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gameHasEnded = false;
        this.init();
    }

    init() {
        this.gameHasEnded = false;
        player = new Player();
        vaccines = [];
        viruses = [];
        explosions = [];
        difficulty = 1;
        score = 0;
        // animationId;
        // console.log(viruses);
        this.shoot();
        this.animate();
        this.spawnViruses();
        backgroundMusic.play();

        const gameOver = document.getElementById('game-over');
        if (gameOver.style.display != 'none') {
            gameOver.style.display = 'none';
        }

    }

    animate() {
        if (this.gameHasEnded) {
            return;
        }
        animationId = requestAnimationFrame(() => this.animate());
        drawBackground(this.ctx);
        player.draw(this.ctx);
        this.score();
        explosions.forEach((explosion, index) => {
            if (explosion.alpha <= 0) {
                explosions.splice(index, 1);
            } else {
                explosion.update(this.ctx);
            }
        });
        vaccines.forEach((vaccine, vaccineIndex) => {
            vaccine.update(this.ctx);
            if (vaccine.x + vaccine.radius < 0 ||
                vaccine.x - vaccine.radius > this.canvas.width ||
                vaccine.y + vaccine.radius < 0 ||
                vaccine.y - vaccine.radius > this.canvas.height
            ) {
                setTimeout(() => {
                    vaccines.splice(vaccineIndex, 1);
                }, 0);
            }
        });
        viruses.forEach((virus, virusIndex) => {
            virus.update(this.ctx);
            // console.log(virus, virusIndex);
            let distX = Math.abs(virus.x - player.x - player.width / 2);
            let distY = Math.abs(virus.y - player.y - player.height / 2);

            if ((distX <= player.width / 2) && distY <= player.height / 2) {
                this.endgame();
            }

            vaccines.forEach((vaccine, vaccineIndex) => {
                const dist = Math.hypot(vaccine.x - virus.x, vaccine.y - virus.y);
                if (dist - virus.width / 2 - vaccine.radius < 1) {
                    score += 10;
                    explodeSound.currentTime = 0;
                    explodeSound.play();
                    for (let i = 0; i < virus.width * 2; i++) {
                        explosions.push(new Explosion(vaccine.x, vaccine.y, Math.random() * 2, "red",
                            { x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8) }));
                    }
                    if (virus.width - 40 > 40) {
                        explodeSound.currentTime = 0;
                        explodeSound.play();
                        virus.width -= 40;
                        virus.height -= 40;
                        setTimeout(() => {
                            vaccines.splice(vaccineIndex, 1);
                        }, 0);
                    } else {
                        setTimeout(() => {
                            viruses.splice(virusIndex, 1);
                            vaccines.splice(vaccineIndex, 1);
                        }, 0);
                    }
                }
            });
        });
    }

    spawnViruses() {
        const spawn = setInterval(() => {
            if (this.gameHasEnded) {
                clearInterval(spawn);
                return;
            }
            const width = Math.random() * (100 - 50) + 50;
            const height = width;
            let x;
            let y;

            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - width : this.canvas.width + width;
                y = Math.random() * this.canvas.height;
            } else {
                x = Math.random() * this.canvas.width;
                y = Math.random() < 0.5 ? 0 - width : this.canvas.height + width;
            }
            const angle = Math.atan2(300 - y, 400 - x);

            const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
            viruses.push(new Virus(x, y, velocity, width, height, difficulty += 0.10));
            console.log(difficulty);
            console.log(viruses);
            console.log(score);
            // console.log(vaccines);
        }, 1000);
    }

    shoot() {
        if (this.gameHasEnded) {
            return;
        }
        (this.canvas).addEventListener('click', (event) => {
            shootSound.currentTime = 0;
            shootSound.play();
            const bounds = event.target.getBoundingClientRect();
            const angle = Math.atan2(event.clientY - bounds.top - 237.1, event.clientX - bounds.left - 400);
            const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
            vaccines.push(new Vaccine(400, 237.1, 3, 'white', velocity));
        });
    }

    score() {
        this.ctx.font = "50px Bangers";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score: " + score, 15, 50);
    }

    endgame() {
        cancelAnimationFrame(animationId);
        this.gameHasEnded = true;
        console.log(this.gameHasEnded);
        gameoverSound.play();
        backgroundMusic.pause();
        shootSound.pause();
        const gameScore = document.getElementById('game-score');
        gameScore.innerHTML = score;
        const gameOver = document.getElementById('game-over');
        gameOver.style.display = 'flex';
        // vaccines = [];
        // viruses = [];
        // explosions = [];

        // this.restartButton();
    }

    // restartButton() {
    //     const restartGameButton = document.getElementById('restart-game-button');
    //     restartGameButton.addEventListener("click", () => {
    //         new Game(this.ctx, this.canvas);
    //     });
    // }
}

