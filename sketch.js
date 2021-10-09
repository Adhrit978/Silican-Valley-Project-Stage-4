const Engine=Matter.Engine;
const World=Matter.World;
const Body=Matter.Body;
const Bodies=Matter.Bodies;

let engine;
let world;

var computer;

var player;

var wall1;
var wall2;
var wall3;
var wall4;
var wall5;

var backgroundImg;
var backgroundWinImg;
var backgroundLoseImg;
var backgroundDrawImg;

var obstacleImg;
var obstacles=[];

var plusLifeImg;
var plusLifes=[];
var plusLifeCollectedSound;

var canW;
var canH;

var missileLaunchingSound;
var missileAbsorbedSound;
var winSound;
var winSoundPlaying=false;
var loseSound;
var loseSoundPlaying=false;
var explosionSound;

var gameState="play";

function preload() {
  backgroundImg=loadImage("background.jpeg");
  backgroundWinImg=loadImage("backgroundWin.jpg");
  backgroundLoseImg=loadImage("backgroundLose.jpg");
  backgroundDrawImg=loadImage("backgroundDraw.jpg");
  
  obstacleImg=loadImage("obstacle.png");
  plusLifeImg=loadImage("plusLife.png");

  missileLaunchingSound=loadSound("missileLaunching.mp3");
  missileAbsorbedSound=loadSound("missileAbsorbed.mp3");
  winSound=loadSound("win.mp3");
  loseSound=loadSound("lose.wav");
  explosionSound=loadSound("explosion.mp3");
  plusLifeCollectedSound=loadSound("plusLifeCollected.wav");
}

function setup() {
  canW=windowWidth;
  canH=windowHeight;
  createCanvas(canW, canH);

  console.log(canW, canH);

  engine=Engine.create();
  world=engine.world;

  player=new Player(200, canH/2, 10, 10, canW, canH);
  
  computer=new Computer(canW-400, canH/2, 10, 10, canW, canH);
  createComputerHomingMissiles();

  //Creating 4 walls to keep the submarines from colliding or going off-screen, and making them all invisible
  wall1=createSprite(0, canH/2, 1, canH*2);
  wall2=createSprite(canW/2, canH/2, 1, canH*2);
  wall3=createSprite(canW/2, 0, canW*2, 1);
  wall4=createSprite(canW/2, canH, canW*2, 1);
  wall5=createSprite(canW, canH/2, 1, canH*2);
  wall1.visible=false;
  wall2.visible=false;
  wall3.visible=false;
  wall4.visible=false;
  wall5.visible=false;
}

function draw() {
  Engine.update(engine);

  background(backgroundImg);

  if (gameState=="play") {
    createObstacles();
    handleObstacleCollision(player.missiles);
    handleObstacleCollision(player.homingMissiles);
    handleObstacleCollision(computer.obstacleMissiles);

    createPlusLifes();
    handlePlusLifeCollision(player.missiles);
    handlePlusLifeCollision(player.homingMissiles);
    player.controls(wall1, wall2, wall3, wall4, wall5);
    player.handleMissiles();
    player.handleHomingMissiles(computer.sprite);
    player.handleMissileCollision(computer.missiles);
    player.handleMissileCollision(computer.homingMissiles);
    player.handleLife();

    computer.controls(wall1, wall2, wall3, wall4, wall5);
    computer.handleMissiles();
    computer.handleHomingMissiles(player.sprite);
    computer.handleMissileCollision(player.missiles);
    computer.handleMissileCollision(player.homingMissiles);
    computer.handleLife();

    drawSprites();
    
    player.handleLauncher();
    computer.handleLauncher();

    if (player.gamePassed==true) {
      gameState="pass";
    }
    if (player.gameFailed==true) {
      gameState="fail";
    }
    if (player.nMissiles>=65&&player.nHomingMissiles>=10&&computer.nMissiles>=65&&computer.nHomingMissiles>=10) {
      player.gameDraw();
      gameState="draw";
    }
  }

  if (gameState=="fail") {
    background(backgroundLoseImg);
    missileAbsorbedSound.stop();
    missileLaunchingSound.stop();
    explosionSound.stop();
    if (loseSoundPlaying==false) {
      loseSound.play();
      loseSoundPlaying=true;
    }
  }

  if (gameState=="pass") {
    background(backgroundWinImg);
    missileAbsorbedSound.stop();
    missileLaunchingSound.stop();
    explosionSound.stop();
    if (winSoundPlaying==false) {
      winSound.play();
      winSoundPlaying=true;
    }
  }

  if (gameState=="draw") {
    background(backgroundDrawImg);
  }
}

function createComputerHomingMissiles() {
  var interval=Math.round(random(5000, 10000));
  setInterval(function() {
    computer.createHomingMissiles();
  }, interval);
}

function createObstacles() {
  if (frameCount%40==0) {
    var obstacle=createSprite(random(canW/2-30, canW/2+30), random(100, canH-100), 82, 126);
    obstacle.addImage(obstacleImg);
    obstacle.lifetime=60;

    obstacles.push(obstacle);
  }
}

function handleObstacleCollision(missilesArray) {
  for(let i=0; i<missilesArray.length; i++) {
    var loopBreak=false;
    for (let j=0; j<obstacles.length; j++) {
      if(missilesArray[i]!=null&&obstacles[j]!=null&&obstacles[j].isTouching(missilesArray[i].sprite)) {
        Matter.World.remove(world, missilesArray[i].body);
        missilesArray[i].sprite.destroy();
        missilesArray.splice(i, 1);
        missileAbsorbedSound.play();
        if (missilesArray[i]==null) {
          break;
        }
      }
    }
    if (loopBreak==true) {
      break;
    }
  }
}

function createPlusLifes() {
  if (frameCount%120==0) {
    var plusLife=createSprite(random(canW/2+60, canW/2+300), random(150, canH-150), 126, 82);
    plusLife.addImage(plusLifeImg);
    plusLife.scale=0.4;
    plusLife.setCollider("rectangle", 0, 0, 120, 70);
    plusLife.lifetime=50;

    plusLifes.push(plusLife); 
  }
}

function handlePlusLifeCollision(missilesArray) {
  for (let i=0; i<missilesArray.length; i++) {
    var loopBreak=false;
    for(let j=0; j<plusLifes.length; j++) {
      if (missilesArray[i]!=null&&plusLifes[i]!=null&&plusLifes[j].isTouching(missilesArray[i].sprite)) {
        plusLifeCollectedSound.play();

        if (player.life<=180) {
          player.life+=20;
        }
        else {
          player.life=200;
        }

        Matter.World.remove(world, missilesArray[i].body);
        missilesArray[i].sprite.destroy();
        missilesArray.splice(i, 1);
        plusLifes[j].destroy();

        if (plusLifes[j]==null||missilesArray[i]==null) {
          loopBreak=true;
          break;
        }
      }
    }
    if (loopBreak==true) {
      break;
    }
  }
}

function keyPressed() {
  if (gameState=="play") {
    if (keyCode==32) {
      player.createMissiles();
    }

    if (keyCode==83) {
      player.createHomingMissiles();
    }
  }

  if (gameState=="fail") {
    if (keyCode==32) {
      player.gameFail();
    }
  }
  if (gameState=="pass") {
    if (keyCode==32) {
      player.gamePass();
    }
  }
}