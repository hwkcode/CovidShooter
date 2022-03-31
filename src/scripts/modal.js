export function gameModal(ctx, startModal, pauseModal, endModal) {
    if (!started) {
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, 800, 600);
        this.ctx.font = "30px Bangers";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Covid Shooter", 15, 35)
        this.ctx.font = "20px Bangers";
        this.ctx.fillText("Click at the incoming coronaviruses", 15, 50)
        this.ctx.fillText("to shoot vaccine shots!", 15, 50)

    } else if (paused) {

    } else (gameOver) {

    }
}

