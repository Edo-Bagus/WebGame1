//declare canvas
let canvas = document.getElementById('canvas');
canvas.width = 512;
canvas.height = 512;
let context = canvas.getContext('2d');

//background
let backgroundImg = new Image();
backgroundImg.src = "assets/background/grass.png"
let backgroundSize = 512;

//variables for moving entities
let mouseX = 0;
let mouseY = 0;
let moveVertical = 0;
let moveCharacterX = 0;
let moveCharacterY = 0;
let backgroundX = 0;
let backgroundY = 0;

// player character properties
let playerWidth = 50;
let playerHeight = 37;
let playerX = canvas.width/2 - playerWidth/2;
let playerY= canvas.height/2 - playerHeight/2;
let playerImage
let charImg = new Image();
charImg.src = "assets/characters/heroes/hero.png";
let player = {
    img: charImg,
    x : playerX,
    y : playerY,
    speed: 0,
    width : playerWidth,
    height : playerHeight
}
let playerHitBox = {
    x: playerX + 22,
    y: playerY + 10,
    width: playerWidth - 44,
    height: playerHeight - 20
    
}

//attack properties
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
    width : attackWidth - 10,
    height : attackHeight - 20
}

//enemies properties
let enemiesArray = [];
let enemiesWidth = 22;
let enemiesHeight = 33;
let enemiesImg = new Image();
enemiesImg.src = "assets/characters/enemies/enemy.png";
class Enemy {
    constructor(spawnX, spawnY) {
        this.img = enemiesImg;
        this.x = spawnX;
        this.y = spawnY; 
        this.width = enemiesWidth; 
        this.height = enemiesHeight;
    }
}
let timer = 0;

//frame properties for animation
let frameHeroIndex = 0;
let frameAttIndex = 0;
let frameEnemyIndex = 0;
let framesHeroPerCol = 30;
let framesAttPerCol = 30;
let framesEnemyPerCol = 65;
let animationHeroPerCol = framesHeroPerCol / 4;
let animationAttPerCol = framesAttPerCol / 6;
let animationEnemyPerCol = framesEnemyPerCol / 13;

let gameOver = true;

//text style in canvas
context.fillStyle = "black";
context.font = "16px sans-serif";
context.textAlign = "center";

window.onload = function() {
    document,addEventListener("mousemove", characterMove);
    document.addEventListener("keydown", restartGame);
    if(!gameOver){
        makeEnemies();
        requestAnimationFrame(update);
    } else {
        //initial display before play
        context.drawImage(backgroundImg, 0, 0, backgroundSize, backgroundSize);
        context.fillText("Press 'Space' to Play", canvas.width/2, canvas.height/2);
    }
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
    
    backgroundX -= mouseX / player.speed;
    backgroundY -= mouseY / player.speed;
    moveCharacterX -= mouseX /player.speed;
    moveCharacterY -= mouseY / player.speed;
    
    if (timer == 60) {
        makeEnemies();
        timer = 0;
    }

    //move logic for enemy
    for(let i = 0; i < enemiesArray.length; i++){
        let enemy = enemiesArray[i];
        enemy.x += moveCharacterX;
        enemy.y += moveCharacterY;
        enemy.directionX = (player.x - enemy.x);
        enemy.directionY = (player.y - enemy.y);
        enemy.speed = pythagoras(enemy.directionX, enemy.directionY);
        enemy.x += enemy.directionX / enemy.speed;
        enemy.y += enemy.directionY / enemy.speed;
        
        if(detectCollision(playerHitBox, enemy)){
            gameOver = true;
        }
        
        if(detectCollision(attackHitbox, enemy) && (attCol == 1 || attCol == 2)){
            enemiesArray.splice(i, 1);
        }
        else {
            context.drawImage(enemy.img, enemyCol * enemy.width, 0, enemy.width, enemy.height, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
    moveCharacterX = 0;
    moveCharacterY = 0;
    
    //draw enemy
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
    
    //incrementing frame index
    frameHeroIndex = (frameHeroIndex + 1) % (framesHeroPerCol);
    frameAttIndex = (frameAttIndex + 1) % (framesAttPerCol);
    frameEnemyIndex = (frameEnemyIndex + 1) % (framesEnemyPerCol);
    
    if(!gameOver){
        requestAnimationFrame(update);
    } else {
        context.fillText("Game Over: Press 'Space' to Restart", canvas.width/2, canvas.height/2 + 50 );
    }
}

function restartGame(e) {
    if(e.code == "Space" && gameOver){
        gameOver = false;
        enemiesArray = [];
        backgroundX = 0;
        backgroundY = 0;
        requestAnimationFrame(update);
    }
}

function characterMove(e) {
    let rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left - rect.width / 2;
    mouseY = e.clientY - rect.top - rect.height / 2;
    player.speed = pythagoras(mouseX, mouseY) / 2;
    // Get the mouse coordinates relative to the canvas
}

function makeEnemies() {
    for(let i = 0; i < 4; i++){
        let randomPair = EnemySpawner()
        let enemy = new Enemy(randomPair[0], randomPair[1]);
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

function EnemySpawner() {
    let randomX = getRandomNumber(-600, 600);
    let randomY;
    if(randomX < 0 || randomX > 512){
        randomY = getRandomNumber(-600, 600);
    } else {
    const lowerRange1 = -100;
    const upperRange1 = -50;

    const lowerRange2 = 550;
    const upperRange2 = 600;

    // Generate a random boolean value (true or false)
    const shouldUseFirstRange = Math.random() < 0.5;

    // Use the appropriate range based on the boolean value
    randomY = shouldUseFirstRange
        ? Math.floor(Math.random() * (upperRange1 - lowerRange1 + 1)) + lowerRange1
        : Math.floor(Math.random() * (upperRange2 - lowerRange2 + 1)) + lowerRange2;
    }

    return [randomX, randomY];
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}