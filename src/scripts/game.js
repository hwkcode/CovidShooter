import Player from './player';
import Vaccine from './vaccine';
import Virus from './virus';
import Explosion from './explosion';
import { drawBackground } from './background';
import music from '../audio/backgroundmusic.mp3';
import zap from '../audio/zap.wav';
import explode from '../audio/explode.wav';
import retrogameover from '../audio/gameover.mp3';
import { v4 as uuidv4 } from 'uuid';

let player = new Player();
let vaccines = {};
let viruses = {};
let explosions = {};
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
        this.addEventListeners();
    }

    addEventListeners() {
        this.alias = this.handleShoot.bind(this);
        this.canvas.addEventListener('click', this.alias);
    }
    
    handleShoot = (event) => {
        shootSound.currentTime = 0;
        shootSound.play();
        const bounds = event.target.getBoundingClientRect();
        const angle = Math.atan2(event.clientY - bounds.top - 237.1, event.clientX - bounds.left - 400);
        const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
        vaccines[uuidv4()] = new Vaccine(400, 237.1, 3, 'white', velocity);
    };

    init() {
        this.gameHasEnded = false;
        player = new Player();
        vaccines = [];
        viruses = [];
        explosions = [];
        difficulty = 1;
        score = 0;
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
        for (let [explosionkey, explosion] of Object.entries(explosions)) {
            if (explosion.alpha <= 0) {
                delete explosions[explosionkey];
            } else {
                explosion.update(this.ctx);
            }
        };

        for (let [key, vaccine] of Object.entries(vaccines)) {
            vaccine.update(this.ctx);
            if (vaccine.x + vaccine.radius < 0 ||
                vaccine.x - vaccine.radius > this.canvas.width ||
                vaccine.y + vaccine.radius < 0 ||
                vaccine.y - vaccine.radius > this.canvas.height
            ) {
                setTimeout(() => {
                    delete vaccines[key];
                }, 0);
            }
        };

        for (let [viruskey, virus] of Object.entries(viruses)) {
            virus.update(this.ctx);
            let distX = Math.abs(virus.x - player.x - player.width / 2);
            let distY = Math.abs(virus.y - player.y - player.height / 2);

            if ((distX <= player.width / 2) && distY <= player.height / 2) {
                this.endgame();
            }

            for (let [vaccinekey, vaccine] of Object.entries(vaccines)) {          
                const dist = Math.hypot(vaccine.x - virus.x, vaccine.y - virus.y);
                if (dist - virus.width / 2 - vaccine.radius < 1) {
                    score += 10;
                    explodeSound.currentTime = 0;
                    explodeSound.play();
                    for (let i = 0; i < virus.width * 2; i++) {
                        explosions[uuidv4()] = new Explosion(vaccine.x, vaccine.y, Math.random() * 2, "red",
                            { x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8) });
                    }
                    if (virus.width - 40 > 40) {
                        explodeSound.currentTime = 0;
                        explodeSound.play();
                        virus.width -= 40;
                        virus.height -= 40;
                        delete vaccines[vaccinekey];
                    } else {
                        delete viruses[viruskey];
                        delete vaccines[vaccinekey];
                    }
                }
            };
        } 
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
            viruses[uuidv4()] = new Virus(x, y, velocity, width, height, difficulty += 0.10);
        }, 1250);
    }

    score() {
        this.ctx.font = "50px Bangers";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score: " + score, 15, 50);
    }


    endgame() {
        cancelAnimationFrame(animationId);
        this.canvas.removeEventListener('click', this.alias);
        this.gameHasEnded = true;
        vaccines = [];
        viruses = [];
        explosions = [];
        gameoverSound.play();
        backgroundMusic.pause();
        shootSound.pause();
        const gameScore = document.getElementById('game-score');
        gameScore.innerHTML = score;
        const gameOver = document.getElementById('game-over');
        gameOver.style.display = 'flex';
    }

}
