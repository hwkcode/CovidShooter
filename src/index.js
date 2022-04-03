import Game from './scripts/game';

document.addEventListener("DOMContentLoaded", function () {
    const startGameButton = document.getElementById('start-game-button');
    const startGame = document.getElementById('start-game');
    const canvas = document.getElementById('game-canvas');

    startGameButton.addEventListener("click", () => {
        startGame.style.display = 'none';
        canvas.style.display = 'flex';
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        const game = new Game(ctx, canvas);
        // new Game(canvas);

    });





});



