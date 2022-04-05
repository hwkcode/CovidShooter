import Game from './scripts/game';
// import music from './audio/backgroundmusic.mp3';
// export { backgroundMusic };
// const backgroundMusic = document.createElement('audio');
// backgroundMusic.src = music;

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

    startGameButton.addEventListener("click", handleGameStart.bind(this)
        // startGame.style.display = 'none';
        // gameOver.style.display = 'none';
        // canvas.style.display = 'flex';
        // canvas.width = 800;
        // canvas.height = 600;
        // const ctx = canvas.getContext('2d');
        // const game = new Game(ctx, canvas);

    );

    restartGameButton.addEventListener("click", handleGameRestart.bind(this)
        // gameOver.style.display = 'none';
        // // const canvas = document.getElementById('game-canvas');
        // // Game.init();
        // // startGame.style.display = 'flex';
        // // canvas.style.display = 'flex';
        // const ctx = canvas.getContext('2d');
        // const game = new Game(ctx, canvas);
        // // startGame.style.display = 'none';
        // // // gameOver.style.display = 'none';
        // // canvas.style.display = 'flex';
        // // canvas.width = 800;
        // // canvas.height = 600;
        // // const game = new Game(ctx, canvas);
        // // document.location.reload();
    );
});



