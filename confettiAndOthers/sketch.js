let confettis = [];
let t;
let walker;
let numConfettis = 50;
let backgroundHue = 0;
// i added a sound in the assets folder, if we have time we can add it
let mic;
let prevLevel;
let timeOfLastBite = 0;

function preload(){
  bite = loadSound("assets/bite.mp3");
  apple = loadImage("assets/apple_720.png")
  pear =  loadImage("assets/pear_720.png")
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  canvas.mousePressed(userStartAudio);
  mic = new p5.AudioIn();
  mic.start();
  colorMode(HSB); // HUE SATURATION BRIGHTNESS
  backgroundHue = random(360);
  t = new Target(200, 200);
  walker = new Eater();
}

function draw() {
  background(backgroundHue, 10, 190);
  // display the target
  t.update();
  t.display();
  t.checkIfEaten();  //by the walker  //mouse hover
  // display the eater
  walker.update();
  walker.display();
  micLevel = mic.getLevel();
  if(micLevel > 0.08 && prevLevel <= 0.08 && millis() - timeOfLastBite > 200){
    //console.log(micLevel);
    walker.turnRight();
  }
  // add confetti sometimes
  // if(frameCount % 200 == 0){
  //   for(let i = 0; i < numConfettis; i++){
  //     confettis.push( new Confetti(500, 100) )
  //   }
  // }
  // if(frameCount % 50 == 0 ){
  //   drawConfetti(600, 100);
  // }
  // display the confetti
  for(let i = 0; i < confettis.length; i++){
    confettis[i].update();
    confettis[i].display();
    confettis[i].checkOnScreen();
  }
  // delete confettis that are not on screen
  // for(let i = 0; i < confettis.length; i++){
  for(let i = confettis.length-1; i >= 0 ; i--){
    if(confettis[i].onScreen == false){
      // this confetti should go
      confettis.splice(i, 1);
    }
  }
  prevLevel = micLevel;
}
  function drawConfetti(x, y){
    for(let i = 0; i < numConfettis; i++){
      confettis.push( new Confetti(x, y) )
    }
  }
class Confetti{
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);
    this.speedX = random(-2, 2);
    this.speedY = random(-1, -3);
    this.c = color(random(360), 255, 255)
    this.onScreen = true;
  }
  update(){
    this.x+=this.speedX;
    this.speedX *= 0.99;
    this.y+=this.speedY;
    this.speedY += 0.1;
  }
  display(){
    push();
    translate(this.x, this.y);
      fill(this.c);
      noStroke();
      circle(0, 0, this.size);
    pop();
  }
  checkOnScreen(){
    if(this.y > height){
      this.onScreen = false;
    }
  }
}
class Target{
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.dia = 40
    this.type = random(["apple","pear"])
    //this.active = true;
  }
  update(){
    // optional: make the target move?
    // or make it move sporadically?
  }
  display(){
    push();
    translate(this.x, this.y);
    if(this.type == "apple"){
    push()
    scale(0.08)
    let halfImageWidth = apple.width/2
    let halfImageHeight = apple.height/2
    image(apple,-halfImageWidth,-halfImageHeight)
    pop()
    }else if(this.type == "pear"){
    push()
    scale(0.08)
    let halfImageWidth = pear.width/2
    let halfImageHeight = pear.height/2
    image(pear,-halfImageWidth,-halfImageHeight-50)
    pop()

    }


    pop();
  }
  checkIfEaten(){
    // get the distance between mouse and the target
    //let d = dist(mouseX, mouseY, this.x, this.y);   //mouse eats
    let d = dist(walker.x, walker.y, this.x, this.y);
    console.log(d);
    // using the distance, find out if the target was found
    //let eatDistance = 5;  //mouse eats
    let eatDistance = this.dia/2 + walker.dia/2
    if(d < eatDistance){
      console.log("EATEN!!!!!!!!!!")
      drawConfetti(this.x, this.y);
      this.x = random(width);
      this.y = random(height);
      bite.play();
      timeOfLastBite = millis();
    }
        // if it was found... change its location?
  }
}
class Eater{
  constructor(){
    this.x = random(width);
    this.y = random(height);
    this.speed = 3;
    this.dia = 50;
    this.c = (backgroundHue + 180) % 360  //get polar opposite hue of background
    this.direction = "RIGHT";
  }
  update(){
    if(this.direction == "RIGHT"){
      this.x += this.speed;
      if(this.x > width){
        this.x = 0;
      }
    } else if(this.direction == "DOWN"){
      this.y += this.speed;
      if(this.y > height){
        this.y = 0;
      }
    } else if(this.direction == "LEFT"){
      this.x -= this.speed;
      if(this.x < 0){
        this.x = width;
      }
    } else if(this.direction == "UP"){
      this.y -= this.speed;
      if(this.y < 0){
        this.y = height;
      }
    }
  }
  turnRight(){
    if(this.direction == "RIGHT"){
      this.direction = "DOWN";
    } else if(this.direction == "DOWN"){
      this.direction = "LEFT";
    } else if(this.direction == "LEFT"){
      this.direction = "UP";
    } else if(this.direction == "UP"){
      this.direction = "RIGHT"
    }
  }
  display(){
    push();
    translate(this.x, this.y);
    fill(this.c, 255,255);
    noStroke();
    circle(0, 0, this.dia);
    pop();
  }
}
function mousePressed(){
  // drawConfetti(mouseX, mouseY);
  //walker.turnRight();
  // t.checkIfEaten();
}