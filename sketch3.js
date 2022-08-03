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
var corda, corda2, fruta, solo;
var fruta_con, fruta_con2;
var coelho;
var estrela_img, estrela1_img, estrela2_img, estrelas_vazias_img, estrela_vazia_img;
var estrela1, estrela2;
var pontos=0;
var colisao1=false;
var colisao2=false;
var placar;

var fundo, fruta_img, coelho_img;

var botao, botao2,botao_mudo;
var piscar, comer, triste;

var musica, som_corte, som_triste, som_mastigar, som_ar;

function preload() {
  fundo = loadImage('./nivel3/background.png');
  fruta_img = loadImage('./nivel3/melon.png');
  coelho_img = loadImage('./nivel3/Rabbit-01.png');
  estrela_img = loadImage('./nivel3/star.png');
  estrela1_img = loadImage('./nivel3/one_star.png');
  estrela2_img = loadImage('./nivel3/stars.png');
  estrela_vazia_img = loadImage('./nivel3/g_star1.png');
  estrelas_vazias_img = loadImage('./nivel3/empty.png');

  musica = loadSound('./nivel3/sound1.mp3');
  som_triste = loadSound("./nivel3/sad.wav")
  som_corte = loadSound('./nivel3/rope_cut.mp3');
  som_mastigar = loadSound('./nivel3/eating_sound.mp3');
  som_ar = loadSound('./nivel3/air.wav');

  piscar = loadAnimation("./nivel3/blink_1.png", "./nivel3/blink_2.png", "./nivel3/blink_3.png");
  comer = loadAnimation("./nivel3/eat_0.png", "./nivel3/eat_1.png", "./nivel3/eat_2.png", "./nivel3/eat_3.png", "./nivel3/eat_4.png");
  triste = loadAnimation("./nivel3/sad_1.png", "./nivel3/sad_2.png", "./nivel3/sad_3.png");


  piscar.playing = true;
  comer.playing = true;
  triste.playing = true;
  triste.looping = false;
  comer.looping = false;
}

function setup() {
  createCanvas(600, 700);
  frameRate(80);

  musica.play();
  musica.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //botão 1
  botao = createImg('./nivel3/cut_btn.png');
  botao.position(100, 90);
  botao.size(50, 50);
  botao.mouseClicked(cair);

  //botão 2
  botao2 = createImg('./nivel3/cut_btn.png');
  botao2.position(450, 90);
  botao2.size(50, 50);
  botao2.mouseClicked(cair2);

  corda = new Corda(7, {x: 120,y: 90});
  corda2 = new Corda(7, {x: 490,y: 90});

  balao = createImg('./nivel3/baloon2.png');
  balao.position(260,370);
  balao.size(120,120);
  balao.mouseClicked(soprar);

  botao_mudo = createImg('./nivel3/mute.png');
  botao_mudo.position(width - 50, 20);
  botao_mudo.size(50, 50);
  botao_mudo.mouseClicked(mutar);

  estrela1 = createSprite(320,50);
  estrela1.addImage(estrela_img);
  estrela1.scale=0.02;
  estrela2 = createSprite(50,370);
  estrela2.addImage(estrela_img);
  estrela2.scale=0.02;

  placar=createSprite(50,20);
  placar.scale=0.2;
  placar.addImage(estrelas_vazias_img)

  solo = new Solo(300, height, width, 20);
  piscar.frameDelay = 20;
  comer.frameDelay = 20;

  coelho = createSprite(120, 620, 100, 100);
  coelho.scale = 0.2;

  coelho.addAnimation('blinking', piscar);
  coelho.addAnimation('eating', comer);
  coelho.addAnimation('crying', triste);
  coelho.changeAnimation('blinking');


  fruta = Bodies.circle(350, 200, 20);
  Matter.Composite.add(corda.body, fruta);

  fruta_con = new Link(corda, fruta);
  fruta_con2 = new Link(corda2, fruta);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

}

function draw() {
  background(51);
  image(fundo, 0, 0, width, height);

  push();
  imageMode(CENTER);
  if (fruta != null) {
    image(fruta_img, fruta.position.x, fruta.position.y, 70, 70);
  }
  pop();

  corda.mostrar();
  corda2.mostrar();

  Engine.update(engine);
  solo.mostrar();

  drawSprites();

  if (colisao(fruta, coelho, 80) == true) {
    World.remove(engine.world, fruta);
    fruta = null;
    coelho.changeAnimation('eating');
    som_mastigar.play();
  }

  if (fruta != null && fruta.position.y >= 650) {
    coelho.changeAnimation('crying');
    musica.stop();
    som_triste.play();
    fruta = null;
  }

  if (colisao(fruta, estrela1,20 ) && colisao1==false){
    estrela1.visible=false
    pontos++
    colisao1=true
  }
  if (colisao(fruta, estrela2,20 ) && colisao2==false) {
    estrela2.visible=false
    pontos++
    colisao2=true
  }

  if (pontos==1) {
    placar.addImage(estrela1_img)
  } else if(pontos==2){
    placar.addImage(estrela2_img)
  }
}

function cair() {
  som_corte.play();
  corda.cortar();
  fruta_con.soltar();
  fruta_con = null;
}

function cair2() {
  som_corte.play();
  corda2.cortar();
  fruta_con2.soltar();
  fruta_con2 = null;
}

function colisao(body, sprite, distancia) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= distancia) {
      return true;
    } else {
      return false;
    }
  }
}

function soprar() {
  Matter.Body.applyForce(fruta, {x:0,y:0}, {x:0, y:-0.03})
  som_ar.play()
}

function mutar() {
  if (musica.isPlaying()) {
    musica.stop();
  } else {
    musica.play();
  }
}