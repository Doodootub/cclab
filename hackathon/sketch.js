//particles

let heartImages = {}

let hurtSound;
let tama
const thresholds = [10, 8, 6, 4, 2, 0]

let leveltest
//let frameCount
let prevHealth;

let r
let b
let g

// arduino
let port;
let connectBtn;
let str; //string from arduino
let val; // array with sensor values


function preload() {
  thresholds.forEach(t => {
    heartImages[t] = loadImage(`assets/heart-${t}.jpg`);
  });
  hurtSound = loadSound('assets/hurt.mp3'); 
  deadSound = loadSound('assets/creepy-envSounds.mp3') 
  crySound = loadSound('assets/crying.mp3'); 
  backoffSound = loadSound('assets/backoff.mp3'); 
  
  angryMarkImg = loadImage('assets/angry_mark.png');
  deadEyeImg    = loadImage('assets/deadeye.png');
  deadMouthImg  = loadImage('assets/deadmouth.png');
  
  

}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");
  angleMode(DEGREES);  

  tama = new Tamagotchi(width/2, height/2)
  bar = new AwkBar(leveltest);


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

  str = port.readUntil("\n");
  //str = trim(str); //remove any empty space

  if (str.length > 0) {
    val = int(str.split(",")); //split the values if there is a comma in between and convert them into numbers
    console.log(val)
    // you receive three values from arduino that are stored
    // in the array called val
    // the first value is a range, see it like this
    fill(255)
    text(val[0], 20, 20)
    // the second and third value are either 0 or 1 and will most likely
    // trigger your dancer's two special motions
     if (val[2] == 60) {
      tama.setHeart(10);
      //prevHealth = 70;
      r = 250
      g = 224
      b = 140
      tama.col = color(255, 176, 219)
      tama.feetCol = color(173, 40, 113)
      leveltest = 10
      
    }
    else if(val[2]== 48){
      tama.setHeart(8);
      //prevHealth = 60
      r = 255
      g = 149
      b = 135
      tama.col = color(255, 176, 219)
      tama.feetCol = color(173, 40, 113)
      leveltest = 8

    }else if (val[2] == 36){
      tama.setHeart(6)
      //prevHealth = 48
      r = 186
      g = 72
      b = 127
      tama.col = color(255, 176, 219)
      tama.feetCol = color(173, 40, 113)
      leveltest = 6

    }else if (val[2] == 24){
     tama.setHeart(4)
     r = 85
     g = 88
     b = 121
     tama.col = color(255, 176, 219)
     tama.feetCol = color(173, 40, 113)
     leveltest = 4

    }else if (val[2] == 12){
     tama.setHeart(2)
     r = 152
     g = 161
     b = 188
     tama.col = color(255, 176, 219)
     tama.feetCol = color(173, 40, 113)
     leveltest = 2

    }else if (val[2] == 0 && frameCount > 100){
     tama.setHeart(0)
     r = 244
     g = 235
     b = 211
     leveltest = 0
    }
    
    if (val[1] <60 && val[1]> 0 && !backoffSound.isPlaying() ){
  
    backoffSound.play()

    }

    

    
  }

  


  fill(r,g,b)
  background(r,g,b)
  // background(220);

  
  tama.update();
  tama.display();

  bar.update();
  bar.display();


}

class AwkBar{
  constructor(levels){
    this.x = windowWidth*2/3 + 50;
    this.y = 50;
    this.w = 2250
    this.h = 200;
    this.level = levels;
  } 
 
  update(){
    this.level = tama.currentHeart;
   
  }
 
  display(){
   //base bar
    noStroke();
    fill(50);
    rect(this.x, this.y, this.w, this.h, 4);

    // separation
    stroke(200);
    for (let i = 1; i < 10; i++) {
      let sx = this.x + (this.w / 10) * i;
      line(sx, this.y, sx, this.y + this.h);
    }
     // process
    let pct = this.level/10; 
    fill('limegreen');
    rect(this.x, this.y, this.w * pct, this.h, 4);
  }
   
    // //bar base
    // fill(0)
    // rect(this.x,this.y, this.w, this.h);
   
    // for(let i = 600; i < this.level *225 +10; i++ ){
    //   console.log(this.x +i -560)
    //   fill(0 + i /10, 255 - i/10, 0)
    //   rect(this.x +i -1000, this.y + 30, 1,120)
      
    // }
  //}
 
}


class Tamagotchi{
  constructor(startX,startY){
    this.x = startX
    this.y = startY

    this.currentHeart = 10
    this.happy = false
    this.isAnimatingA = false
    this.showButt = false
    this.showEyeMove = false
    this.showFrown = false
    this.showCrying = false
    this.angryMarkImg = false
    this.showDead = false
    this.cryDrops = []

    this.walkFrame = 0
    this.eyeFrame  = 0

    this.mouthOpen = 20;    
    this.armAngle  = 0; 
    
    this.leftButtY = 0
    this.rightButtY = 0
    this.eyeOffsetX  = 0
    this.eyeOffsetY = 0

    this.stepSize  = 2;     
    this.col = color(255, 176, 219)
    this.feetCol = color(173, 40, 113)

  }


  setHeart(value) {
  if(value == 10){
    this.currentHeart = 10
    this.happy = true
    this.isAnimatingA = true;
    this.walkFrame = 0;
    this.showButt = false
    this.showDead = false;
  }else if(value == 8 ){

    if(!hurtSound.isPlaying()){
      hurtSound.play();
    }
  
    this.currentHeart = value;
    this.showButt = true
    this.isAnimatingA = false
    this.happy = false
   
  }else if (value === 6) {
     if(!hurtSound.isPlaying()){
      hurtSound.play();
    }
  
      this.currentHeart = 6
      this.showEyeMove = true;
      this.isAnimatingA= false;
      this.happy = false
      this.showButt    = false;
      this.eyeFrame    = 0;
      this.currentHeart = 6;
  }else if (value === 4) {
       if(!hurtSound.isPlaying()){
      hurtSound.play();
    }
  
      this.currentHeart = 4;
      this.showFrown    = true;
      this.isAnimatingA = false;
      this.happy = false
      this.showButt     = false;
      this.showEyeMove  = false;
 
  }else if (value == 2) {
       if(!hurtSound.isPlaying()){
      hurtSound.play();
    }
  
      this.currentHeart  = 2;
      this.showCrying    = true;
      this.showFrown     = false;
      this.showEyeMove   = false;
      this.showButt      = false;
      this.isAnimatingA  = false;
      this.happy = false
      this.cryDrops = [];
      if(!crySound.isPlaying()){
        crySound.play()
      }
      
      
  }else if (value == 0){
     if(!hurtSound.isPlaying()){
      hurtSound.play();
    }
  
    this.currentHeart = value;
    this.showCrying    = false;
    this.showFrown     = false;
    this.showEyeMove   = false;
    this.showButt      = false;
    this.isAnimatingA  = false;
    this.happy = false
    this.showDead = true;
    this.col = color(150);
    this.feetCol = color(125)
    if(!deadSound.isPlaying()){
     deadSound.play() 
    }
  }
 
}

  update(){
     if (this.currentHeart === 10 && this.isAnimatingA) {
      //this.happy = true
      this.walkFrame++;

      this.mouthOpen = map(sin(this.walkFrame * 0.8),-1, 1, 10,  40);

      this.armAngle = map(sin(this.walkFrame * 0.8),-1, 1, -40, 40);

      // this.x += this.stepSize;
      // if (this.x > width + 200) {
      //   this.x = -200;
      // }
    }

    if (this.currentHeart == 8 && this.showButt){
    
      let offset = map(noise(frameCount * 0.05),0, 1,-20, 20);
      this.leftButtY  = offset;
      this.rightButtY = -offset;  
    }

    if (this.currentHeart == 6 && this.showEyeMove ){
      this.eyeFrame++;
      this.eyeOffsetX = map(sin(this.eyeFrame * 0.3), -1, 1, -30, 30);
      this.eyeOffsetY = map(cos(this.eyeFrame * 0.3), -1, 1, -10, 10);
    }

    if (this.currentHeart == 2 && this.showCrying){
      const dropsPerEye = 10;
      for (let i = 0; i < dropsPerEye; i++) {
        let eyeX;
        if (i < dropsPerEye / 2) {
          eyeX = random(-70, -30);
        } else {
          eyeX = random(30, 70);
        }

        let eyeY = random(-40, -10);
        this.cryDrops.push({
          x: eyeX, y: eyeY, size: random(5, 20)
        });
      }
    }


    }
  

   
 
  display(){

    this.update(); 

    push();
    translate(this.x, this.y);
   
    //arms
    push() //right
    translate(200,10)
    rotate(this.armAngle-45)
    fill(this.col)
    ellipse(0,0,100,200)
    pop()

    push() //left
    translate(-200,10)
    rotate(-this.armAngle + 45)
    fill(this.col)
    ellipse(0,0,100,200)
    pop()


    //feet
    push()
    translate(150,200)
    fill(this.feetCol)
    rotate(0)
    ellipse(0,0,220,120)
    pop()

    push()
    translate(-150,200)
    fill(this.feetCol)
    rotate(0)
    ellipse(0,0,220,120)
    pop()
    
    //head+body
    fill(this.col)
    circle(0,0,450)

    //butt
    if (this.showButt) {

      stroke(0)
      arc(50,50+this.rightButtY,200,200,90,290);

      noStroke()
      circle(50,50+this.rightButtY,200)
      
      fill(this.col)
      circle(-50,50+this.leftButtY,200)
  
      noFill()
      stroke(0)
      
      arc(-50,50+this.leftButtY,200,200,250,90);

} else if (this.showEyeMove){
    let ex = this.eyeOffsetX
    let ey = this.eyeOffsetY

    //eyes
    fill(0)
    ellipse(50 + ex,-50 + ey,40,90)
    ellipse(-50 + ex,-50 + ey,40,90)

    //highlight of eye
    fill(73, 81, 235)
    ellipse(50 + ex,-50 + ey,25,75)
    ellipse(-50 + ex,-50 + ey,25,75)
    fill(0)
    ellipse(50 + ex,-60 + ey,30,60)
    ellipse(-50 + ex,-60 + ey,30,60)
    fill(255)
    ellipse(50 + ex,-70 + ey,20,35)
    ellipse(-50 + ex,-70 + ey,20,35)

     //blush
    fill(227, 118, 177)
    ellipse(100,10,50,20)
    ellipse(-100,10,50,20)

    //mouth
    stroke(0)
    fill(252, 96, 114)
    arc(0,40,50,this.mouthOpen,0,180)
    
}else if (this.showFrown){
    //angry mark
    // push();
    // //imageMode(CENTER);
    // pop();
    
    //eyes
    fill(0)
    ellipse(50 ,-50,40,90)
    ellipse(-50,-50,40,90)

    //highlight of eye
    fill(73, 81, 235)
    ellipse(50,-50,25,75)
    ellipse(-50,-50,25,75)
    fill(0)
    ellipse(50,-60,30,60)
    ellipse(-50,-60 ,30,60)
    fill(255)
    ellipse(50,-70,10,25)
    ellipse(-50,-70,10,25)
    //eye brow
    stroke(0);
    strokeWeight(8);
    line(-70, -90, -30, -100);
    line( 70, -90,  30, -100);
    //blush
    fill(227, 118, 177)
    noStroke()
    ellipse(100,10,50,20)
    ellipse(-100,10,50,20)

    //mouth
    stroke(0)
    strokeWeight(8)
    line(25,40,-25,40)
    
    scale(0.3)
    //mageMode(CENTER);
    image(angryMarkImg, 300, -600);
    

}else if (this.showCrying) {
    //eyes
    fill(0);
    noStroke();
    ellipse(50, -50, 50, 20);
    ellipse(-50, -50, 50, 20);
      
    noStroke();
    fill(100, 149, 237);
    for (let drop of this.cryDrops) {
    ellipse(drop.x,drop.y,drop.size,drop.size * 1.2);
    }

    //mouth
    noFill()
    strokeWeight(8)
    stroke(0)
    beginShape()
    curveVertex(25,40)
    curveVertex(25,40)

    curveVertex(10,20)
    curveVertex(10,20)

    curveVertex(-25,40)
    curveVertex(-25,40)
    endShape()


}else if (this.showDead){
  imageMode(CENTER);
  image(deadEyeImg, 0, -50, 100, 100);
  image(deadMouthImg, 0, 40, 150, 80);

}else if (this.happy){
  //eyes
    fill(0)
    ellipse(50 ,-50,40,90)
    ellipse(-50,-50,40,90)

    //highlight of eye
    fill(73, 81, 235)
    ellipse(50,-50,25,75)
    ellipse(-50,-50,25,75)
    fill(0)
    ellipse(50,-60,30,60)
    ellipse(-50,-60 ,30,60)
    fill(255)
    ellipse(50,-70,20,35)
    ellipse(-50,-70,20,35)

      //blush
    fill(227, 118, 177)
    ellipse(100,10,50,20)
    ellipse(-100,10,50,20)

    //mouth
    stroke(0)
    fill(252, 96, 114)
    arc(0,40,50,this.mouthOpen,0,180)
}
//   if (this.showFrown) {
//   imageMode(CENTER);
//   image(this.angryMarkImg, 0, -300, 100, 100);
// }

    pop()



    scale(0.3)
    imageMode(CENTER);
    let img = heartImages[this.currentHeart];
    image(img, this.x, this.y - 200);

  }
}


function keyPressed() {
  if (key == 'a') {
     tama.setHeart(10);
     r = 250
     g = 224
     b = 140
     tama.col = color(255, 176, 219)
     tama.feetCol = color(173, 40, 113)
     leveltest = 10
  }else if (key == 's') {
    tama.setHeart(8);
     r = 255
     g = 149
     b = 135
     tama.col = color(255, 176, 219)
     tama.feetCol = color(173, 40, 113)
     leveltest = 8
  }else if (key == 'd') {tama.setHeart(6);
     r = 186
     g = 72
     b = 127
     tama.col = color(255, 176, 219)
     tama.feetCol = color(173, 40, 113)
     leveltest = 6
  }else if (key == 'f') {tama.setHeart(4);
     r = 85
     g = 88
     b = 121
     tama.col = color(255, 176, 219)
     tama.feetCol = color(173, 40, 113)
     leveltest = 4
  }else if (key == 'g') {tama.setHeart(2);
     r = 152
     g = 161
     b = 188
     tama.col = color(255, 176, 219)
     tama.feetCol = color(173, 40, 113)
     leveltest = 2
  }else if (key == 'h') {tama.setHeart(0);
     r = 244
     g = 235
     b = 211
     leveltest = 0
  }
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open("Arduino", 57600);
  } else {
    port.close();
  }
}