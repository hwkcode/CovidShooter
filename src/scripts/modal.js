export function gameModal(ctx, started, paused, gameOver) {
    if (!started) {
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, 800, 600);
        ctx.font = "30px Bangers";
        ctx.fillStyle = "white";
        ctx.fillText("Covid Shooter", 15, 35);
        ctx.font = "20px Bangers";
        ctx.fillText("Click at the incoming coronaviruses", 15, 50);
        ctx.fillText("to shoot vaccine shots!", 15, 50);
    } else if (paused) {
        console.log("Paused");
    } else if (gameOver) {
        console.log("Game Over");
    };
}

