//declare canvas
let canvas = document.getElementById('canvas');
canvas.width = 512;
canvas.height = 512;
let context = canvas.getContext('2d');

//background
let backgroundImg = new Image();
backgroundImg.src = "assets/background/grass.png"
let backgroundSize = 512;

let moveHorizontal = 0;
let moveVertical = 0;
let backgroundX = 0;
let backgroundY = 0;


// player character
let playerWidth = 50;
let playerHeight = 37;
let playerX = canvas.width/2 - playerWidth/2;
let playerY= canvas.height/2 - playerHeight/2;
let playerImage
let player = {
    img: null,
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}
let charImg = new Image();
charImg.src = "assets/characters/heroes/hero1.png";
player.img = charImg;


window.onload = function() {
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveCharacter);
}

function update() {
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top left
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY, backgroundSize, backgroundSize); //center left
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom left
    context.drawImage(backgroundImg, backgroundX, backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top center
    context.drawImage(backgroundImg, backgroundX, backgroundY, backgroundSize, backgroundSize); //center center
    context.drawImage(backgroundImg, backgroundX, backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom center
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top right
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY, backgroundSize, backgroundSize); //center right
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom right

    context.drawImage(player.img, player.x, player.y, player.width, player.height);

    if(backgroundX == 512 || backgroundX == -512){
        backgroundX = 0;
    }
    if(backgroundY == 512 || backgroundY == -512){
        backgroundY = 0;
    }
    
    requestAnimationFrame(update);
}

function moveCharacter(e) {
    if(e.code == "KeyD"){
        moveHorizontal = -4;
    }
    else if(e.code == "KeyA"){
        moveHorizontal = 4;
    }
    if(e.code == "KeyW"){
        moveVertical = 4;
    }
    else if(e.code == "KeyS"){
        moveVertical = -4;
    }
    backgroundX += moveHorizontal;
    backgroundY += moveVertical;
    moveHorizontal = 0;
    moveVertical = 0;
}