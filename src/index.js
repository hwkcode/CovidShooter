import Game from './scripts/game';

document.addEventListener("DOMContentLoaded", function () {
    const startGameButton = document.getElementById('start-game-button');
    const startGame = document.getElementById('start-game');
    const restartGameButton = document.getElementById('restart-game-button');
    const canvas = document.getElementById('game-canvas');
    const gameOver = document.getElementById('game-over');
    let ctx;
    let game;

    const handleGameStart = () => {
        startGame.style.display = 'none';
        gameOver.style.display = 'none';
        canvas.style.display = 'flex';
        canvas.width = 800;
        canvas.height = 600;
        ctx = canvas.getContext('2d');
        game = new Game(ctx, canvas);       
    }

    const handleGameRestart = () => {
        gameOver.style.display = 'none';
        ctx = canvas.getContext('2d');
        game = new Game(ctx, canvas);
    }

    startGameButton.addEventListener("click", handleGameStart.bind(this));

    restartGameButton.addEventListener("click", handleGameRestart.bind(this));
});



