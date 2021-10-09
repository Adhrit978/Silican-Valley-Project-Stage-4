const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var rope3;

var bg_img;
var food;
var rabbit;

var button,button2,button3;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;
var canW;
var canH;
var isphone;
var star0;
var star1;
var star2;
var score;
var prize1;
var prizeimg;
var prize2;
var baloon;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  star0=loadAnimation("empty.png");
  star1=loadAnimation("one_star.png");
  star2=loadAnimation("stars.png");
  prizeimg=loadAnimation("star.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false;
}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canW=displayWidth;
    canW=displayHeight;
    createCanvas(displayWidth+80, displayHeight);
  }
  else {
    canW=windowWidth;
    canW=windowHeight;
    createCanvas(windowWidth, windowHeight);
  }
  
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //btn 1
  button = createImg('cut_btn.png');
  button.position(120,30);
  button.size(50,50);
  button.mouseClicked(drop);

  //btn 2
  button2 = createImg('cut_btn.png');
  button2.position(530,35);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  
  rope = new Rope(8,{x:140,y:40});
  rope2 = new Rope(7,{x:570,y:40});

  ground = new Ground(200, canH, 600, 20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(170,height-80,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(300,250,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  mutebtn=createImg('mute.png');
  mutebtn.position(620, 80);
  mutebtn.size(50, 50);
  mutebtn.mouseClicked(stopmusic);

  startbtn=createImg('start.png');
  startbtn.position(620, 20);
  startbtn.size(50, 50);
  startbtn.mouseClicked(startmusic);

  score=createSprite(50, 20, 30, 30);
  score.addAnimation('0', star0);
  score.addAnimation('1', star1);
  score.addAnimation('2', star2);
  score.changeAnimation('0');
  score.scale=0.2;

  prize1=createSprite(360, 50, 20, 20);
  prize1.addAnimation('a', prizeimg);
  prize1.scale=0.02;

  prize2=createSprite(50, 330, 20, 20);
  prize2.addAnimation('b', prizeimg);
  prize2.scale=0.02;

  baloon=createImg('baloon2.png');
  baloon.position(300, 370);
  baloon.size(120, 120);
  baloon.mouseClicked(blow);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  image(bg_img, 0, 0, displayWidth+80, displayHeight);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();

  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit,bunny, 80)==true)
  {
    bunny.changeAnimation('eating');
    eating_sound.play();

    restart=createImg('reload.png');
    restart.position(200, 100);
    restart.size(50, 50);
    restart.mouseClicked(reload);
  }

  if(fruit!=null && fruit.position.y>=height-50)
  {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit=null;
     
    restart=createImg('reload.png');
    restart.position(200, 100);
    restart.size(50, 50);
    restart.mouseClicked(reload);
   }

   if (collide1(fruit, prize1)==true) {
     prize1.destroy();
     score.changeAnimation('1');
   }

   if (collide1(fruit, prize2)==true) {
     prize2.destroy();
     score.changeAnimation('2');
   }
}

function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
}

function drop2()
{
  cut_sound.play();
  rope2.break();
  fruit_con_2.detach();
  fruit_con_2 = null;
}


function collide(body,sprite, distance)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=distance)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

function collide1(body, sprite){
  if (body!=null) {
    var d=dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if (d<50) {
      return true;
    }
    else {
      return false;
    }
  }
}

function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}


function stopmusic() {
  if (bk_song.isPlaying())
  bk_song.pause();
}

function startmusic() {
  if (!bk_song.isPlaying())
  bk_song.play();
}

function reload() {
  location.reload();
}

function blow() {
  if (fruit_con!=null, fruit_con_2!=null) {
    Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0, y:-0.03});
    air.play();
  }
}


