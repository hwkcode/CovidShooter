import corona from '../images/coronavirus.png';

export function gameModal(ctx, started, paused, ended) {
    if (!started) {
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, 800, 600);
        ctx.font = "100px Bangers";
        ctx.fillStyle = "yellow";
        ctx.fillText("Covid Shooter", 150, 175);
        ctx.font = "35px Bangers";
        ctx.fillText("Click at the incoming coronaviruses", 175, 250);
        ctx.fillText("with vaccine shots!", 275, 300);

        const coronaVirus = new Image();
        coronaVirus.src = corona;
        // need to bind the onload event listener to start passing image data to the canvas AFTER the loading has finished
        coronaVirus.onload = function () {
            ctx.drawImage(coronaVirus, 325, 315, 150, 150);
        };
    } else if (paused) {
        console.log("Paused");
    } else if (ended) {
        console.log("Game Over");
    };
}

