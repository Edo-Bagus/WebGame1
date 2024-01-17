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
charImg.src = "assets/characters/heroes/hero.png";
player.img = charImg;

//attack
let attackImg = new Image();
let attackWidth = 65;
let attackHeight = 27;
let attackX = canvas.width/2 + playerWidth/2
let attackY = canvas.height/2 - attackHeight/2
attackImg.src = "assets/effect/effect.png";
let attack = {
    img: attackImg,
    x : attackX,
    y : attackY,
    width : attackWidth,
    height : attackHeight
}
let attackHitbox = {
    x : attackX + 5,
    y : attackY + 10,
    width : attackWidth - 5,
    height : attackHeight - 10
}

let enemiesArray = [];
let enemiesWidth = 22;
let enemiesHeight = 33;
let enemiesImg = new Image();
enemiesImg.src = "assets/characters/enemies/enemy.png";

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

let frameHeroIndex = 0;
let frameAttIndex = 0;
let frameEnemyIndex = 0;
let framesHeroPerCol = 30;
let framesAttPerCol = 30;
let framesEnemyPerCol = 65;
let animationHeroPerCol = framesHeroPerCol / 4;
let animationAttPerCol = framesAttPerCol / 6;
let animationEnemyPerCol = framesEnemyPerCol / 13;

window.onload = function() {
    requestAnimationFrame(update);
    makeEnemies();
    document.addEventListener("keydown", moveCharacter);
}

function update() {
    //draw background
    timer += 1;
    let heroCol = Math.floor(frameHeroIndex / animationHeroPerCol);
    let attCol = Math.floor(frameAttIndex / animationAttPerCol);
    let enemyCol = Math.floor(frameEnemyIndex / animationEnemyPerCol);
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top left
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY, backgroundSize, backgroundSize); //center left
    context.drawImage(backgroundImg, backgroundX + (-1 * backgroundSize), backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom left
    context.drawImage(backgroundImg, backgroundX, backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top center
    context.drawImage(backgroundImg, backgroundX, backgroundY, backgroundSize, backgroundSize); //center center
    context.drawImage(backgroundImg, backgroundX, backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom center
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY + (-1 * backgroundSize), backgroundSize, backgroundSize); //top right
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY, backgroundSize, backgroundSize); //center right
    context.drawImage(backgroundImg, backgroundX + backgroundSize, backgroundY + backgroundSize, backgroundSize, backgroundSize); //bottom right

    
    if (timer == 60 && enemiesArray.length > 0) {
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
        
        if(detectCollision(attackHitbox, enemy) && (attCol == 1 || attCol == 2)){
            enemiesArray.splice(i, 1);
        }
        else {
            context.drawImage(enemy.img, enemyCol * enemy.width, 0, enemy.width, enemy.height, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
    moveCharacterX = 0;
    moveCharacterY = 0;
        
    context.drawImage(attack.img, attCol * attackWidth, 0, attack.width, attack.height, attack.x, attack.y, attack.width, attack.height);
    
    //draw player
    context.drawImage(player.img, heroCol * playerWidth, 0, playerWidth, playerHeight, player.x, player.y, player.width, player.height);

    //make background to center again, enabling infinite background
    if(backgroundX > 512 || backgroundX < -512){
        backgroundX = 0;
    }
    if(backgroundY > 512 || backgroundY < -512){
        backgroundY = 0;
    }

    frameHeroIndex = (frameHeroIndex + 1) % (framesHeroPerCol);
    frameAttIndex = (frameAttIndex + 1) % (framesAttPerCol);
    frameEnemyIndex = (frameEnemyIndex + 1) % (framesEnemyPerCol);
    
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