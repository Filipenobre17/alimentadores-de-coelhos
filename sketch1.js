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
var corda, fruta, solo;
var corda2;
var corda3;
var fruta_con;
var fruta_con2;
var fruta_con3;

var fundo;
var comida_img;
var coelho_img;

var botao;
var botao2;
var botao3;
var coelho;
var piscar, comer, triste;
var balao;
var mudo;
var tocando = true;
var lagura_tela,altura_tela;

var musica, som_cortar, som_triste, som_mastigar, som_ar;

var link;

function preload() {
  fundo = loadImage('./nivel1/bkg.jpg');
  comida_img = loadImage('./nivel1/melon.png');
  coelho_img = loadImage('./nivel1/Rabbit-01.png');

  musica = loadSound('./nivel1/sound1.mp3');
  som_triste = loadSound("./nivel1/sad.wav")
  som_cortar = loadSound('./nivel1/rope_cut.mp3');
  som_mastigar = loadSound('./nivel1/eating_sound.mp3');
  som_ar = loadSound('./nivel1/air.wav');

  piscar = loadAnimation("./nivel1/blink_1.png", "./nivel1/blink_2.png", "./nivel1/blink_3.png");
  comer = loadAnimation("./nivel1/eat_0.png", "./nivel1/eat_1.png", "./nivel1/eat_2.png", "./nivel1/eat_3.png", "./nivel1/eat_4.png");
  triste = loadAnimation("./nivel1/sad_1.png", "./nivel1/sad_2.png", "./nivel1/sad_3.png");

  piscar.playing = true;
  comer.playing = true;
  triste.playing = true;
  triste.looping = false;
  comer.looping = false;
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    lagura_tela = displayWidth
    altura_tela = displayHeight
    createCanvas(displayWidth + 80, displayHeight)
  } else {
    lagura_tela = windowWidth
    altura_tela = windowHeight
    createCanvas(windowWidth, windowHeight)
  }

  link=createA('index2.html','Próxima Fase!');
  link.position(200,5);
  link.hide();

  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  musica.play();
  musica.setVolume(0.3);

  botao = createImg('./nivel1/cut_btn.png');
  botao.position(20, 30);
  botao.size(50, 50);
  botao.mouseClicked(cair);

  botao2 = createImg('./nivel1/cut_btn.png');
  botao2.position(330, 35);
  botao2.size(50, 50);
  botao2.mouseClicked(cair2);
  
  botao3 = createImg('./nivel1/cut_btn.png');
  botao3.position(360, 200);
  botao3.size(50, 50);
  botao3.mouseClicked(cair3);

  mudo = createImg('./nivel1/mute.png');
  mudo.position(420, 20);
  mudo.size(50, 50);
  mudo.mouseClicked(mutar)
  

  //balao = createImg('./nivel1/balloon.png');
  //balao.position(10,250);
  //balao.size(150,100);
  //balao.mouseClicked(soprar);

  corda = new Corda(8, {x: 40,y: 30});
  corda2 = new Corda(7, {x: 370,y: 40});
  corda3 = new Corda(5, {x: 400,y: 225});
  solo = new Solo(200, altura_tela, 600, 20);

  piscar.frameDelay = 20;
  comer.frameDelay = 20;

  coelho = createSprite(170, altura_tela - 80, 100, 100);
  coelho.scale = 0.2;

  coelho.addAnimation('piscando', piscar);
  coelho.addAnimation('comendo', comer);
  coelho.addAnimation('chorando', triste);
  coelho.changeAnimation('piscando');

  fruta = Bodies.circle(300, 300, 20);
  Matter.Composite.add(corda.body, fruta);

  fruta_con = new Link(corda, fruta);
  fruta_con2 = new Link(corda2, fruta);
  fruta_con3 = new Link(corda3, fruta);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() {
  background(51);
  image(fundo, 0, 0, displayWidth + 80, displayHeight);

  push();
  imageMode(CENTER);
  if (fruta != null) {
    image(comida_img, fruta.position.x, fruta.position.y, 70, 70);
  }
  pop();

  corda.mostrar();
  corda2.mostrar();
  corda3.mostrar();
  Engine.update(engine);
  solo.mostrar();

  drawSprites();

  if (colisao(fruta, coelho) == true) {
    coelho.changeAnimation('comendo');
    som_mastigar.play()
    link.show();
  }


  if (fruta != null && fruta.position.y >= 650) {
    World.remove(engine.world, fruta);
    fruta = null;
    coelho.changeAnimation('chorando');
    musica.stop();
    som_triste.play();
  }
  
}

function cair() {
  som_cortar.play();
  corda.cortar();
  fruta_con.soltar();
  fruta_con = null;
}

function cair2() {
  som_cortar.play();
  corda2.cortar();
  fruta_con2.soltar();
  fruta_con2 = null;
}

function cair3() {
  som_cortar.play();
  corda3.cortar();
  fruta_con3.soltar();
  fruta_con3 = null;
}

function colisao(corpo, sprite) {
  if (corpo != null) {
    var d = dist(corpo.position.x, corpo.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(engine.world, fruta);
      fruta = null;
      return true;
    } else {
      return false;
    }
  }
}

function soprar() {
  Matter.Body.applyForce(fruta, {x:0,y:0}, {x:0.03, y:0})
  som_ar.play()
}

function mutar() {
  if (fruta!=null) {
    if (musica.isPlaying()) {
      musica.stop()
    } else {
      musica.play()
    }
  }
}
