/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/
let NUM_OF_PARTICLES = 100; // Decide the initial number of particles.

let particles = [];
let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new SandraDancer(width / 2, height / 2);
    // generate particles
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle(width*0.75, height * 0.85);
  }
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  //confettis.push(new Confetti(width/2, height/2));

  // update and display
  for(let i = 0; i < particles.length; i++){
    particles[i].update();
    particles[i].display();
  }
  fill(255)
  // text(confettis.length,20,20)

  dancer.update();
  dancer.display();
   
}

class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties (variables): particle's characteristics
    this.fireX = startX;
    this.fireY = startY;
    this.x = this.fireX + random(-100,100)
    this.y = this.fireY -random(0,200)
    this.width = 27;
    this.height = 27;
    this.col = color(255, 0, 0);
     this.dist = 0;
  } 
 
  update() {
    // every 10 frames
    if(frameCount%10 == 0){
      this.x = this.fireX + randomGaussian(0,60)
      this.y = this.fireY -abs(randomGaussian(0,100))
    
  }
   
  

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
  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    fill(this.col);
    noStroke()

    rect(0, 0, this.width, this.height);
  
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
  // this.hatLooseOffset    = 0;          
  // this.hatLooseAmp       = 8;          
  // this.hatLooseSpeed     = 0.3;
  this.timeOfWink     = -Infinity;
  this.winkDuration   = 15;    
  this.isWinking      = false;


  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
     // how many frames 
    let elapsed = frameCount - this.timeOfKeyEvent;

    // base bend (0→max→0)
    let baseBend = abs(sin(frameCount * this.speed)) * this.maxBend;

    if (elapsed < this.effectDuration) {
      this.squatAngle = -baseBend * 2;
    } else {
      // normal looping squat:
      this.squatAngle = -baseBend;
    }

    
    // this.squatAngle = -abs(sin(frameCount * speed)*maxBend)
    // //map(this.squatAngle, -1,1,0,maxBend)
    this.headOffset = map(this.squatAngle, 0, this.maxBend, 0, -10);

    let elapsed2 = frameCount - this.timeOfKeyEvent;
 
  if (elapsed2 < this.hatEffectDuration) {

    let t = elapsed2 / this.hatEffectDuration;
    this.hatOffsetY     = -sin(t * PI) * this.hatJumpHeight;
   
    // this.hatLooseOffset = sin(frameCount * this.hatLooseSpeed)
    //                      * this.hatLooseAmp
    //                      * (1 - t);
  } else {
    this.hatOffsetY     = 0;
    //this.hatLooseOffset = 0;
  }
  this.isWinking = (frameCount - this.timeOfWink) < this.winkDuration;



  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);
    // ******** //
    // ⬇️ draw your dancer from here ⬇
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
  

    //circle(-20,-10,13)
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


  



//  push();
//   fill("yellow")
//   translate(0, this.hatOffsetY+this.headOffset);

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
  //pop();



    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    //this.drawReferenceShapes()

    pop();
  }
  triggerA(){
    // this function will be called when the "a" key is pressed.
    // your dancer should perform some kind of reaction (i.e. make a special move or gesture) 
    this.timeOfKeyEvent = frameCount;


  }
  triggerD(){
    // this function will be called when the "d" key is pressed.
    // your dancer should perform some kind of reaction (i.e. make a special move or gesture) 
    this.timeOfWink = frameCount;
     //this.timeOfHatEvent = frameCount;

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
    for (let i = 0; i < 100; i++){
      particles.push(new Particle(width * 0.75, height * 0.85));
    }
  }
}


