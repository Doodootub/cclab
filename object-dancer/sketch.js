
let numOfParticles = 200;

let particles = [];
let dancer;

let winkSound

const shiverThreshold= 800

// arduino
let port;
let connectBtn;
let str; //string from arduino
let val; // array with sensor values

function preload(){
  winkSound = loadSound('lib/beat.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  dancer = new SandraDancer(width / 2, height / 2);

  // for (let i = 0; i < NUM_OF_PARTICLES; i++) {
  //   particles[i] = new Particle(width*0.75, height * 0.85);
  // }

  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 370);
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  background(0);
  drawFloor(); // for reference only

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    if (p.dead) {
      particles.splice(i, 1);
    } else {
      p.display();
    }
  }
  if (particles.length > shiverThreshold) {
    dancer.startShiver();
  }

  dancer.update();
  dancer.display();

  str = port.readUntil("\n");
  //str = trim(str); //remove any empty space

  if (str.length > 0) {
    val = int(str.split(",")); //split the values if there is a comma in between and convert them into numbers

    // you receive three values from arduino that are stored
    // in the array called val
    // the first value is a range, see it like this
    fill(255)
    text(val[0], 20, 20)
    // the second and third value are either 0 or 1 and will most likely
    // trigger your dancer's two special motions
  
    if (val[0] > 500) {
      // trigger your particles, you will have to adjust the threshold in the if statements
    }
    if (val[1] == 1) {
      dancer.triggerA() 
    }
    if (val[2] == 1) {
      dancer.triggerD()
    }
  }
   
}

class Particle {
  // constructor function
  constructor(startX, startY) {
    this.fireX = startX;
    this.fireY = startY;
    this.x = this.fireX + random(-100,100)
    this.y = this.fireY -random(0,200)
    // this.width = 27;
    // this.height = 27;
    this.col = color(255, 0, 0);
    this.dist = 0;
    this.initialSize = 27;
    this.size = this.initialSize;
    this.birthFrame = frameCount;
    this.lifeSpan   = 240;   
    this.dead = false;
  } 
 
  update() {
    if(frameCount%10 == 0){
      this.x = this.fireX + randomGaussian(0,60)
      this.y = this.fireY -abs(randomGaussian(0,100))
    
  }
  //color distribution
    this.dist = dist(this.fireX, this.fireY, this.x,this.y);
  if (this.dist < 50) {
    this.col = color(255, 235, 82);
  } else if (this.dist < 100) {
    this.col = color(189, 134, 8);
  } else if (this.dist < 150) {
    this.col = color(194, 86, 23);
  } else{
    this.col = color(191, 32, 4);
  }
  //age of fire
  let age = frameCount - this.birthFrame;
  if (age >= this.lifeSpan) {
    this.dead = true;
  } else {
      let t = age / this.lifeSpan;      
      this.size = this.initialSize * (1 - t);
    }
  
  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
                                //top of the fire      //bottom               
    let scaleFactor = map(this.y, this.fireY - 200,     this.fireY +  50, 0.2, 2, true);
    let s = this.size * scaleFactor;
    fill(this.col);
    noStroke();
    rect(0, 0, s, s);


    // noStroke()
    // rect(0, 0, this.size, this.size);
    pop();

    // show the fire center
    fill(255);
    circle(this.fireX, this.fire, 10)

  }

}



class SandraDancer {
  constructor(startX, startY) {
    // add properties for your dancer here:
    this.x = startX;
    this.y = startY;
    this.headX =0
    this.headY = 0
    this.headOffset = 0

    this.col = color(207,42,42)
    this.squatAngle = 0
    this.speed = 0.05
    this.maxBend = PI/7
    this.timeOfBend = -Infinity
    this.effectDuration = 200

    this.timeOfHatEvent    = -Infinity; 
   this.hatEffectDuration = 60;         
   this.hatJumpHeight     = 40;  //max jump range    
   this.hatOffsetY        = 0;          
   this.timeOfWink     = -Infinity;
   this.winkDuration   = 15;    
   this.isWinking      = false;
  
   this.shiverStart     = -Infinity;
   this.shiverDuration  = 120;      
   this.shiverAmp       = 5;        
   this.shiverOffsetX   = 0;
   this.shiverOffsetY   = 0;

  }
  startShiver() {
    this.shiverStart = frameCount;
  }

  update() {
    let elapsed = frameCount - this.timeOfKeyEvent;
    let baseBend = abs(sin(frameCount * this.speed)) * this.maxBend;

    if (elapsed < this.effectDuration) {
      this.squatAngle = -baseBend * 2;
    } else {
      this.squatAngle = -baseBend;
    }

    this.headOffset = map(this.squatAngle, 0, this.maxBend, 0, -10);
    let elapsed2 = frameCount - this.timeOfKeyEvent;
 
  if (elapsed2 < this.hatEffectDuration) {

    let t = elapsed2 / this.hatEffectDuration;
    this.hatOffsetY     = -sin(t * PI) * this.hatJumpHeight;
  } else {
    this.hatOffsetY     = 0;
  }
  this.isWinking = (frameCount - this.timeOfWink) < this.winkDuration;

  //shiver
  let sElapsed = frameCount - this.shiverStart;
    if (sElapsed < this.shiverDuration) {
      // ramp down amplitude over the duration
      let t = 1 - (sElapsed / this.shiverDuration);    // 1→0
      let amp = this.shiverAmp * t;
      this.shiverOffsetX = random(-amp, amp);
      this.shiverOffsetY = random(-amp, amp);
    } else {
      this.shiverOffsetX = 0;
      this.shiverOffsetY = 0;
    }
  }

  display() {  
    push();
    translate(this.x+ this.shiverOffsetX, this.y+this.hatOffsetY+ this.shiverOffsetY);
    push()
    //head
    translate(0, this.headOffset)
    fill(this.col)
    ellipse(this.headX,this.headY,100,80) 
    //eyes
    fill(0)
    circle(20,-10,13)
    if (!this.isWinking) {
      circle(-20, -10, 13);
    } else {
      stroke(0);
      strokeWeight(2);
      line(-20 - 6, -10, -20 + 6, -10);
      noStroke();
    }
    pop()
    
    //right leg
    push()
      translate(15,30)
      rotate(this.squatAngle)
      noStroke()
      fill(this.col)
      rect(-5, 0, 10, 40);    // thigh
      
      push()
        translate(0, 40);      // move to knee
        rotate(-this.squatAngle * 1.5); // knee bends opposite
        rect(-5, 0, 10, 40);    // shin
        fill("pink") //right knee
        circle(0, 0,10)

        push()
        translate(0,30)
        fill(this.col)
        rect(-5,0,25,10)
        fill("purple")
        circle(0,0,10)

        pop()
      pop()
        //right hip
        fill(this.col)
        circle(0,0,10)    
    pop()

    //left leg
  push()
    translate(-25,30)
    rotate(this.squatAngle)
    noStroke()
    fill(this.col)
    rect(-5, 0, 10, 40);    // thigh
      
      push()
        translate(0, 40);      // move to knee
        rotate(-this.squatAngle * 1.5); // knee bends opposite
        rect(-5, 0, 10, 40);    // shin
        fill("pink") //left knee
        circle(0, 0,10)

        push()
        translate(0,30)
        fill(this.col)
        rect(-5,0,25,10)
        fill("purple")
        circle(0,0,10)

        pop()
    pop()

    //left hip
    fill(this.col)
    circle(0,0,10)
  pop()

    //hat
  for (let i = 0; i <= 50; i += 5) {
    push();
   fill("yellow")
   translate(0, this.hatOffsetY*(0.6+i*0.03)+this.headOffset);

    let angleOffset = map(i, 0, 50, 0, 30);
    let startA = 50 + angleOffset;
    let endA   = 130 - angleOffset;
    arc(0, -60 - i, 80, 60, radians(startA), radians(endA));

    pop()
  }
  

    pop();
  }
  triggerA(){
    this.timeOfKeyEvent = frameCount;


  }
  triggerD(){
    this.timeOfWink = frameCount;
  if (winkSound && winkSound.isLoaded()) {
      winkSound.play();
    }
  }
  // drawReferenceShapes() {
  //   noFill();
  //   line(-5, 0, 5, 0);
  //   line(0, -5, 0, 5);
  //   stroke(255);
  //   rect(-100, -100, 200, 200);
  //   fill(255);
  //   stroke(0);
  // }
}



function keyPressed(){
  if (key === "a"){
    dancer.triggerA();
  } else if (key === "d"){
    dancer.triggerD();
  } else if (key === "p"){
    // start new fire
    let x = random(width);
    let y = random(height/2, height)
     for (let i = 0; i < numOfParticles; i++){
      particles.push(new Particle(x, y));
     }
  }
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open("Arduino", 57600);
  } else {
    port.close();
  }
}

