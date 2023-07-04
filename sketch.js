var tRex, grounds, invGround, clouds, obstacles, gameOverScr;
var aniTRexRun, aniTRexCollided, aniGround, aniCloud, aniObstacles, aniGameOver;
const groundSpeed = -4;
var gameStart, gameOver, score, highScore;

const tRexX = 50;

function preload() {
    aniTRexRun = loadAni(
        "./assets/trex1.png",
        "./assets/trex3.png",
        "./assets/trex4.png"
    );
    aniTRexCollided = loadAni("./assets/trex_collided.png");
    aniGround = loadAni("./assets/ground2.png");
    aniCloud = loadAni("./assets/cloud.png");
    aniObstacles = loadAni(
        "./assets/obstacle1.png",
        "./assets/obstacle2.png",
        "./assets/obstacle3.png",
        "./assets/obstacle4.png",
        "./assets/obstacle5.png",
        "./assets/obstacle6.png"
    );
    aniGameOver = loadAni("./assets/gameOver.png");
}

function setup() {
    new Canvas(600, 200);

    gameStart = false;
    gameOver = false;
    score = 0;
    highScore = 0;

    world.gravity.y = 30;

    tRex = new Sprite(tRexX, 160, 20, 50);
    tRex.addAni("running", aniTRexRun);
    tRex.addAni("collided", aniTRexCollided);
    tRex.ani = "running";
    tRex.ani.scale = 0.5;
    tRex.bounciness = 0;
    tRex.friction = 0;
    tRex.rotationLock = true;

    grounds = new Group();
    grounds.addAni("grounds", aniGround);
    grounds.w = aniGround.w;
    grounds.h = aniGround.h;
    grounds.y = height - aniGround.h - 10;
    grounds.collider = 'none';
    grounds.vel.x = groundSpeed

    for (let i = 0; i < 2; i++) {
        let ground = new grounds.Sprite();
        ground.x = i * aniGround.w
    }

    invGround = new Sprite(width / 2, height, width * 4, 20, 'static');
    invGround.visible = false;
    invGround.bounciness = 0;
    invGround.friction = 0;

    obstacles = new Group();
    obstacles.x = width + random(30,100);
    obstacles.y = invGround.y - 20;
    obstacles.w = 10;
    obstacles.h = 50;
    obstacles.vel.x = groundSpeed;
    obstacles.addAni("obstacles", aniObstacles);
    obstacles.ani.stop();
    obstacles.bounciness = 0;
    obstacles.friction = 0;
    obstacles.rotationLock = true;
    obstacles.life = width;

    clouds = new Group();
    // clouds.x = width + random(30, 100);
    // clouds.y = random(10, 130);
    clouds.w = 50;
    clouds.h = 10;
    clouds.collider = 'none';
    clouds.vel.x = groundSpeed + 1;
    clouds.addAni("cloud", aniCloud);
    clouds.life = width;
    // clouds.ani.scale = 0.6;

    gameOverScr = new Sprite(width / 2, height / 2);
    gameOverScr.collider = 'none';
    gameOverScr.addAni("gameOverScr", aniGameOver);
    gameOverScr.visible = false;

    noCursor();
    textAlign(RIGHT, TOP);
    textSize(20);
    textFont('Tahoma');
}

function draw() {
    background(255);

    tRex.debug = mouse.pressing();

    for (i = 0; i < grounds.length; i++) {
        let ground = grounds[i];
        if (ground.x <= -aniGround.w) {
            ground.x = aniGround.w - 4;
        }
    }
    
    if(kb.presses('space')) {
        if (gameStart && !gameOver && tRex.y >= 160) {
            tRex.vel.y = -10;
        } else if (!gameStart && !gameOver) {
            startGame();
        } else if (!gameStart && gameOver) {
            resetStuff();
            startGame();
        }
    }
    // tRex.vel.y += 0.8;

    if (tRex.collides(obstacles)) {
        loseGame();
    }

     if (gameStart && !gameOver){
        drawObstacles();
        drawClouds();
        score++;
        if (score > highScore) {
            highScore = score;
        }
    }

    text("HI " + highScore + " " + score, width - 20, 20);
}

function drawClouds() {
    if (frameCount % 60 === 0) {
        let cloud = new clouds.Sprite();
        cloud.x = width + random(30, 100);
        cloud.y = random(10, 100);
        cloud.ani.scale = random(0.6, 1);
        
        cloud.layer = tRex.layer;
        tRex.layer++;
    }
}

function drawObstacles() {
    if (frameCount % 100 === 0) {
        let obstacle = new obstacles.Sprite();
        const dice = floor(random(obstacles.ani.length));
        obstacle.ani.frame = dice;
        // obstacles.ani.frame = 0;
        switch (obstacle.ani.frame) {
            case 0:
                obstacle.ani.scale = 0.8;
                break;
            case 1:
                obstacle.ani.scale = 0.7;
                break;
            case 2:
                obstacle.ani.scale = 0.6;
                break;
            case 3:
                obstacle.ani.scale = 0.5;
                break;
            case 4:
                obstacle.ani.scale = 0.5;
                break;
            case 5:
                obstacle.ani.scale = 0.5;
                break;
        }
        // console.log(obstacle.ani)
        obstacle.w = obstacle.ani.w * obstacle.ani.scale;
        obstacle.h = obstacle.ani.h * obstacle.ani.scale;
    }
}

function startGame() {
    gameStart = true;
    score = 0;
}

function resetStuff() {
    tRex.ani = "running";
    gameOver = false;
    gameOverScr.visible = false;
    obstacles.remove();
    obstacles.vel.x = groundSpeed;
    obstacles.life = width;
    grounds.vel.x = groundSpeed;
    clouds.vel.x = groundSpeed + 1;
    clouds.life = width;
}

function loseGame() {
    gameOver = true;
    gameStart = false;
    tRex.vel.x = 0;
    tRex.x = tRexX;
    tRex.ani = "collided"
    tRex.ani.scale = 0.5;
    obstacles.vel.x = 0;
    obstacles.life = Infinity;
    grounds.vel.x = 0;
    clouds.vel.x = 0;
    clouds.life = Infinity;
    gameOverScr.visible = true;
    gameOverScr.layer = tRex.layer + 1;
    score = 0;
}