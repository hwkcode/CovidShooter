import Player from './player';
import Vaccine from './vaccine';
import Virus from './virus';
import Explosion from './explosion';
import { drawBackground } from './background';
import music from '../audio/backgroundmusic.mp3';
import zap from '../audio/zap.wav';
import explode from '../audio/explode.wav';
// import { backgroundMusic } from '../index.js';
// import { gameModal } from './modal';
// const canvas = document.getElementById('game-canvas');

// const player = new Player(400, 300, 30, 'blue');
const player = new Player();
// player.shadowBlur = 10;
// player.shadowColor = "white";
// console.log(player);
const vaccines = [];
const viruses = [];
const explosions = [];
let score = 0;
// let started = false;
// let paused = false;
// let ended = false;

// const startGame = document.getElementById('start-game');
// const gameOver = document.getElementById('game-over');
const backgroundMusic = document.createElement('audio');
backgroundMusic.src = music;
backgroundMusic.volume = 0.3;

const shootSound = document.createElement('audio');
shootSound.src = zap;
shootSound.volume = 0.4;

const explodeSound = document.createElement('audio');
explodeSound.src = explode;
explodeSound.volume = 0.4;
// shootSound.preload = 'auto';
// shootSound.load();

// let bottle = new Image();
// bottle.src = vaccineBottle;

export default class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.init();
        // this.start();
    }

    init() {
        // gameModal(this.ctx, started, paused, ended);
        this.shoot();
        this.animate();
        this.spawnViruses();
        backgroundMusic.play();
    }

    // start() {
    //     gameModal(this.ctx, started, paused, ended);
    //     startGameButton.addEventListener("click", () => {
    //         started = true;
    //         console.log(started);
    //         this.shoot();
    //         this.animate();
    //         this.spawnViruses();
    //     });
    // }

    animate() {
        let animationId;
        animationId = requestAnimationFrame(() => this.animate());
        drawBackground(this.ctx);
        player.draw(this.ctx);
        // console.log(player);
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
            // console.log(viruses);
            // console.log(player.width);
            // const dist = Math.hypot(player.x + player.width / 2 - virus.x, player.y + player.height / 2 - virus.y);
            // const dist = Math.hypot(player.x - virus.x, player.y - virus.y);
            // console.log(virus.radius);
            // console.log(player.width);
            // console.log(player.x); // 330 = 400 (half of width of this.canvas) - 70 (half of width)
            // console.log(player.y); // 210 = 300 (half of height of this.canvas) - 90 (half of height)
            // console.log(dist);
            // console.log(virus.x);
            // console.log(player.x);
            // console.log(virus.y);
            // const playerLeft = player.x - (player.width / 2);
            // console.log(playerLeft);
            // console.log(virus.x);
            // console.log(virus.radius);
            // console.log(virus.y);
            // console.log(virus.radius);
            // const playerRight = player.x + (player.width / 2);
            // const playerTop = player.y - (player.height / 2);
            // const playerBottom = player.y + (player.height / 2);
            // const overlapX = ((playerRight <= (virus.x + virus.radius)) && (playerLeft >= (virus.x - virus.radius))) || ((playerRight <= (virus.x - virus.radius)) && (playerLeft >= (virus.x + virus.radius)));
            // const overlapY = ((playerBottom <= (virus.y + virus.radius)) && (playerTop >= (virus.y - virus.radius))) || ((playerBottom <= (virus.y - virus.radius)) && (playerTop >= (virus.y + virus.radius)));
            // const overlapX = (playerLeft <= (virus.x + virus.radius)) || (playerRight >= (virus.x - virus.radius));
            // const overlapY = (playerTop <= (virus.y + virus.radius)) || (playerBottom >= (virus.y - virus.radius));
            // const isColliding = overlapX && overlapY;
            // if (isColliding) {
            //     cancelAnimationFrame(animationId);
            // }
            // if ((dist - player.width / 2 - virus.radius < 1) || (dist - player.height / 2 - virus.radius < 1))
            // {
            //     cancelAnimationFrame(animationId);
            // }

            let distX = Math.abs(virus.x - player.x - player.width/2);
            let distY = Math.abs(virus.y - player.y - player.height/2);

            if ((distX <= player.width/2) && distY <= player.height/2) {
                cancelAnimationFrame(animationId);
                backgroundMusic.pause();
                shootSound.pause();
                // startGame.style.display = 'none';
                // gameOver.style.display = 'flex';
                // canvas.style.display = 'none';
            }

            vaccines.forEach((vaccine, vaccineIndex) => {
                const dist = Math.hypot(vaccine.x - virus.x, vaccine.y - virus.y);
                // console.log(dist);
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
        setInterval(() => {
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

            // const color = 'green';
            // const bounds = x.getBoundingClientRect();
            // const vaccine = new Vaccine(event.clientX - bounds.left - 15, event.clientY - bounds.top - 15, 5, 'red', null);
            // const angle = Math.atan2(bounds.top - 15 - 300 - y, bounds.left - 15 - 400 - x);
            const angle = Math.atan2(300 - y, 400 - x);
            // console.log(angle);
            const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
            // console.log(Math.cos(angle));
            // console.log(Math.sin(angle));
            viruses.push(new Virus(x, y, velocity, width, height));
            // console.log(viruses);
        }, 1000);
    }

    shoot() {
        (this.canvas).addEventListener('click', (event) => {
            shootSound.currentTime = 0;
            shootSound.play();
            // console.log(vaccines);
            const bounds = event.target.getBoundingClientRect();
            // console.log(bounds);
            // const vaccine = new Vaccine(event.clientX - bounds.left - 15, event.clientY - bounds.top - 15, 5, 'red', null);
            const angle = Math.atan2(event.clientY - bounds.top - 237.1, event.clientX - bounds.left - 400);
            const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
            vaccines.push(new Vaccine(400, 237.1, 3, 'white', velocity));
        });
    }

    score() {
        this.ctx.font = "30px Bangers";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score: " + score, 15, 35);
    }
}

