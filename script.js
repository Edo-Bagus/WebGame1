let canvas;
let canvasWidth = 500;
let canvasHeight = 500;
let context;

//player character
let playerWidth = 50;
let playerHeight = 50;
let playerX = canvasWidth/2 - playerWidth/2;
let playerY= canvasHeight/2 - playerHeight/2;
let player = {
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}


window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context = canvas.getContext("2d");

    //draw player
    context.fillStyle = "red";
    context.fillRect(player.x, player.y, player.width, player.height);

}