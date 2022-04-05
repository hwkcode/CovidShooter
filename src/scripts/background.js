import artery from "../images/artery.jpg";

export function drawBackground(ctx) {
    let backgroundImage = new Image();
    backgroundImage.onload = () => {
        ctx.save();
        ctx.drawImage(backgroundImage, 0, 0, 800, 600);
        ctx.restore();
    };
    backgroundImage.src = artery;
}