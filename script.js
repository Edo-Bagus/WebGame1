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

class Enemy {
    constructor() {
        this.img = enemiesImg;
        this.x = generateRandomNumber();
        this.y = generateRandomNumber(); 
        this.width = enemiesWidth; 
        this.height = enemiesHeight;
    }
}

let enemy = new Enemy();
let timer = 0;


window.onload = function() {
    requestAnimationFrame(update);
    makeEnemies();
    document.addEventListener("keydown", moveCharacter);
}

function update() {
    //draw background
    timer += 1;
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top left
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY, backgroundSize, backgroundSize); //center left
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom left
    context.drawImage(backgroundImg, backgroundX, backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top center
    context.drawImage(backgroundImg, backgroundX, backgroundY, backgroundSize, backgroundSize); //center center
    context.drawImage(backgroundImg, backgroundX, backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom center
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top right
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY, backgroundSize, backgroundSize); //center right
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom right

    if (timer == 120 && enemiesArray.length > 0) {
        makeEnemies();
        timer = 0;
    }

    for(let i = 0; i < enemiesArray.length; i++){
        let enemy = enemiesArray[i];
        //move logic for enemy
        enemy.x += moveCharacterX;
        enemy.y += moveCharacterY;
        enemy.directionX = (player.x - enemy.x);
        enemy.directionY = (player.y - enemy.y);
        enemy.speed = pythagoras(enemy.directionX, enemy.directionY);
        enemy.x += enemy.directionX / enemy.speed;
        enemy.y += enemy.directionY / enemy.speed;
        context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    }
    moveCharacterX = 0;
    moveCharacterY = 0;


    //draw player
    context.drawImage(player.img, player.x, player.y, player.width, player.height);

    if(backgroundX > 512 || backgroundX < -512){
        backgroundX = 0;
    }
    if(backgroundY > 512 || backgroundY < -512){
        backgroundY = 0;
    }
    
    requestAnimationFrame(update);
}

function moveCharacter(e) {
    if(e.code == "KeyD"){
        moveHorizontal = -6;
    }
    if(e.code == "KeyA"){
        moveHorizontal = 6;
    }
    if(e.code == "KeyW"){
        moveVertical = 6;
    }
    if(e.code == "KeyS"){
        moveVertical = -6;
    }
    backgroundX += moveHorizontal;
    backgroundY += moveVertical;
    moveCharacterX += moveHorizontal;
    moveCharacterY += moveVertical;
    moveHorizontal = 0;
    moveVertical = 0;
}

function makeEnemies() {
    for(let i = 0; i < 4; i++){
        let enemy = new Enemy();
        enemiesArray.push(enemy);
    }
}

function pythagoras(a, b){
    return Math.sqrt(a*a + b*b);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function generateRandomNumber() {
    const lowerRange1 = -100;
    const upperRange1 = -50;

    const lowerRange2 = 550;
    const upperRange2 = 600;

    // Generate a random boolean value (true or false)
    const shouldUseFirstRange = Math.random() < 0.5;

    // Use the appropriate range based on the boolean value
    const randomNumber = shouldUseFirstRange
        ? Math.floor(Math.random() * (upperRange1 - lowerRange1 + 1)) + lowerRange1
        : Math.floor(Math.random() * (upperRange2 - lowerRange2 + 1)) + lowerRange2;

    return randomNumber;
}