import Game from './scripts/game';

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;
    // const ctx = canvas.getContext('2d');
    const game = new Game(canvas);
});

