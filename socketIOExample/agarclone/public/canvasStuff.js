// ===========================================
// =================DRAWINING=================
// ===========================================

player.locX = Math.floor(500 * Math.random() + 300);
player.locY = Math.floor(500 * Math.random() + 200);
function draw() {
     //reset the translation back to the default
     context.setTransform(1, 0, 0, 1, 0, 0);
    //clear out the screen so that old stuff gone from the last frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    //clamp the camera to the player
    const campX = -player.locX + canvas.width/2;
    const campY = -player.locY + canvas.height/2;
    // translate allows us to move the canvas around us
    context.translate(campX, campY);

    context.beginPath();
    context.fillStyle = "rgb(255,230,230)";
    // 1st 2 args is center of circle, 3rd is radius, 4th one is where to start from circle and 5th is where to stop
    context.arc(player.locX, player.locY, 10, 0, Math.PI * 2);
    // context.arc(200, 200, 10, 0, 2 * Math.PI);
    context.fill();
    context.lineWidth = 3;
    context.stokeStyle = 'rgb(0, 255, 0)';
    context.stroke();

    orbs.forEach((orb) => {
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
        context.fill();
    })
    requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (event) => {
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height / 2), mousePosition.x - (canvas.width / 2)) * 180 / Math.PI;
    if (angleDeg >= 0 && angleDeg < 90) {
        //console.log('mouse is in the lower right quard');
        xVector = 1 - (angleDeg / 90);
        yVector = -(angleDeg / 90);
    } else if (angleDeg >= 90 && angleDeg <= 180) {
        //console.log('mouse is in the lower left quard');
        xVector = -(angleDeg - 90) / 90;
        yVector = -(1 - ((angleDeg - 90) / 90));
    } else if (angleDeg >= -180 && angleDeg < -90) {
        //console.log('mouse is in the upper left quard');
        xVector = (angleDeg + 90) / 90;
        yVector = (1 + ((angleDeg + 90) / 90));
    } else if (angleDeg < 0 && angleDeg >= -90) {
       // console.log('mouse is in the upper right quard');
        xVector = (angleDeg + 90) / 90;
        yVector = (1 - ((angleDeg + 90) / 90));
    }

    speed = 10
    xV = xVector;
    yV = yVector;

    if ((player.locX < 5 && player.xVector < 0) || (player.locX > 500) && (xV > 0)) {
        player.locY -= speed * yV;
    } else if ((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)) {
        player.locX += speed * xV;
    } else {
        player.locX += speed * xV;
        player.locY -= speed * yV;
    }
});