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
let moveCharacterX = 0;
let moveCharacterY = 0;
let backgroundX = 0;
let backgroundY = 0;


// player character
let playerWidth = 21;
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

let enemiesArray = [];
let enemiesWidth = 22;
let enemiesHeight = 32;
let enemiesImg = new Image();
enemiesImg.src = "assets/characters/enemies/enemy1.png";
let enemy = {
    img: enemiesImg,
    x: 500,
    y: 0,
    width: enemiesWidth,
    height: enemiesHeight,
}
let directionX;
let speed;


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

    enemy.x += moveCharacterX;
    enemy.y += moveCharacterY;
    moveCharacterX = 0;
    moveCharacterY = 0;
    directionX = (player.x - enemy.x);
    directionY = (player.y - enemy.y);
    speed = pythagoras(directionX, directionY) * 2;
    enemy.x += directionX / speed;
    enemy.y += directionY / speed;

    context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
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
    if(e.code == "KeyA"){
        moveHorizontal = 4;
    }
    if(e.code == "KeyW"){
        moveVertical = 4;
    }
    if(e.code == "KeyS"){
        moveVertical = -4;
    }
    backgroundX += moveHorizontal;
    backgroundY += moveVertical;
    moveCharacterX += moveHorizontal;
    moveCharacterY += moveVertical;
    moveHorizontal = 0;
    moveVertical = 0;
}

function pythagoras(a, b){
    return Math.sqrt(a*a + b*b);
}