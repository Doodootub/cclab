let heartImages = {};
let hurtSound;
let tama;
const thresholds = [10, 8, 6, 4, 2, 0];
let leveltest;
let r,g,b;
let gameStarted;
let mic
let preVol = 0
let speaking
let healthIndex = 0;
let prevHealthIdx = -1;

let lastSoundTime = 0;
let decayInterval = 5000; //5sec dying
let healingSounds = [];






function preload() {
  thresholds.forEach(t => {
  heartImages[t] = loadImage(`assets/heart-${t}.png`);
  });
  hurtSound = loadSound('assets/hurt.mp3'); 
  deadSound = loadSound('assets/creepy-envSounds.mp3') 
  crySound = loadSound('assets/crying.mp3'); 
  backoffSound = loadSound('assets/backoff.mp3');
  drinkSound = loadSound('assets/drink.mp3');
  eatSound = loadSound('assets/eating-sounds.mp3');
  chewSound = loadSound('assets/chew.mp3');
  gulpSound = loadSound('assets/gulp.mp3');
  healingSounds = [drinkSound, eatSound,chewSound,gulpSound];
  
  angryMarkImg = loadImage('assets/angry_mark.png');
  deadEyeImg    = loadImage('assets/deadeye.png');
  deadMouthImg  = loadImage('assets/deadmouth.png');
  starImg = loadImage('assets/star.png')

  cuteFont = loadFont('assets/cutefont.ttf');

}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");
  angleMode(DEGREES);
  
  textFont(cuteFont);
  textAlign(CENTER,CENTER);

  mic = new p5.AudioIn();
  healthIndex = 0;
  prevHealthIdx = -1
  lastSoundTime = millis();

  tama = new Tamagotchi(width/2, height/2)
  bar = new AwkBar(leveltest);
  
  gameStarted = false

}

function draw() {
  if (!gameStarted) {
      showStartScreen();
    } else {
      runMicLogic();
      playGame();
    }

}

function showStartScreen() {
  background(0);
  push();
  textSize(64);
  fill(255);
  text("Don't Awkward Kirby!", width / 2, height / 4);
  text("Click to Start!", width / 2, height / 3 * 2);
  pop();
}

function runMicLogic() {
  let vol = mic.getLevel();
  preVol = lerp(preVol, vol, 0.1);
  let now = millis();
  speaking = preVol > 0.08;

  if (speaking) {
    if (now - lastSoundTime > 3000 && healthIndex > 0) {
      healthIndex--;
      lastSoundTime = now;
      let randomSound = random(healingSounds);
      if (!randomSound.isPlaying()) {
        randomSound.play();
      }
    }
  } else {
    if (now - lastSoundTime > decayInterval && healthIndex < thresholds.length - 1) {
      healthIndex++;
      lastSoundTime = now;
    }
  }
}

function playGame() {
  if(leveltest == 10) { 
    r = 184; g = 224; b = 134;
  }
  else if (leveltest == 8) { 
    r = 255; g = 149; b = 135;
  }
  else if (leveltest == 6) {
    r = 186; g =  72; b = 127;
  }
  else if (leveltest == 4) {
    r =  85; g =  88; b = 121;
  }
  else if (leveltest == 2) {
    r = 152; g = 161; b = 188;
  }
  else if (leveltest == 0){
    r = 244; g = 235;b = 210;
    
  }

  background(r, g, b);

  push();
  imageMode(CORNER);
  let img = heartImages[tama.currentHeart];
  if (img) {
    image(img, 20, 20, 70, 70);
  }
  pop();

  tama.update();
  tama.display();

  bar.update();
  bar.display();

    if (healthIndex !== prevHealthIdx) {
    leveltest = thresholds[healthIndex];
    let isHealing = speaking  
    tama.setHeart(leveltest, isHealing);            
    prevHealthIdx = healthIndex;  
  }
}



class AwkBar{
  constructor(){
    this.x = width-350;
    this.y = 50;
    this.w = 300
    this.h = 50;
    this.level = 10
  } 
 
  update(){
    this.level = tama.currentHeart;
   
  }
 
  display(){
    push()
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
    noStroke()
    fill('limegreen');
    rect(this.x, this.y, this.w * pct, this.h, 4);
    pop()
  }
 
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
    this.stars = []

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


  setHeart(value, isHealing = false) {
  this.showButt = false;
  this.showEyeMove = false;
  this.showFrown = false;
  this.showCrying = false;
  this.showDead = false;
  this.isAnimatingA = false;
  this.happy = false;
  this.cryDrops = [];
  this.col = color(255, 176, 219);  
  this.feetCol = color(173, 40, 113);

  if(value == 10){
    this.currentHeart = 10
    this.happy = true
    this.isAnimatingA = true;
    this.walkFrame = 0;
    this.showButt = false
    this.showDead = false;
  }else if(value == 8 ){

    if(!isHealing && !hurtSound.isPlaying()){
      hurtSound.play();
    }
    this.currentHeart = 8;
    this.showButt = true
    this.isAnimatingA = false
    this.happy = false
    this.showEyeMove = false;
    this.eyeOffsetX = 0;
    this.eyeOffsetY = 0;
   
  }else if (value === 6) {
     if(!isHealing && !hurtSound.isPlaying()){
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
       if(!isHealing && !hurtSound.isPlaying()){
      hurtSound.play();
    }
  
      this.currentHeart = 4;
      this.showFrown    = true;
      this.isAnimatingA = false;
      this.happy = false
      this.showButt     = false;
      this.showEyeMove  = false;
 
  }else if (value == 2) {
       if(!isHealing && !hurtSound.isPlaying()){
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
      if(!isHealing && !crySound.isPlaying()){
        crySound.play()
      }
      
      
  }else if (value == 0){
     if(!isHealing && !hurtSound.isPlaying()){
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
    if (this.currentHeart == 10 && this.isAnimatingA) {
      this.walkFrame++;
      this.mouthOpen = map(sin(this.walkFrame * 0.8),-1, 1, 10,  40);
      this.armAngle = map(sin(this.walkFrame),-1, 1, -40, 40);
      if (frameCount % 10 === 0) {
        let newStar = {}
        newStar.x = random(0,windowWidth);
        newStar.y = random(0,windowHeight);
        newStar.size = random(15, 50);
        newStar.birth = frameCount
        this.stars.push(newStar);
      }
    
      for (let i = 0; i < this.stars.length; i++) {
      let star = this.stars[i]
        if (frameCount - star.birth > 60) {
            this.stars.splice(i, 1);
            i = i - 1;
          }
      }

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

        let drop = [];
        drop.x = eyeX;
        drop.y = eyeY;
        drop.size = random(5, 20);

        this.cryDrops.push(drop);
      }
    }


    }
   
 
  display(){

    this.update(); 

    push();
      translate(this.x, this.y);
      if (this.showButt) {
        noStroke()
        this.drawBodyStatic()
        this.drawLimbosStatics()

        stroke(0)
        strokeWeight(8)
        arc(50,40+this.rightButtY,200,200,90,290);

        noStroke()
        circle(50,40+this.rightButtY,200)
        
        fill(this.col)
        circle(-50,40+this.leftButtY,200)
    
        noFill()
        stroke(0)
        strokeWeight(8)
        arc(-50,40+this.leftButtY,200,200,250,90);
      }else if (this.showEyeMove){
        noStroke()
        this.drawLimbosStatics()
        this.drawBodyStatic()
        stroke(0)
        this.drawMouthStatic()
        let ex = this.eyeOffsetX
        let ey = this.eyeOffsetY

        //eyes
        noStroke()
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
      
      }else if (this.showFrown){
        noStroke()
        this.drawLimbosStatics()
        this.drawBodyStatic()  
        this.drawFaceStatic()
        //eye brow
        stroke(0);
        strokeWeight(8);
        line(-70, -90, -30, -100);
        line( 70, -90,  30, -100);
        //mouth
        stroke(0)
        strokeWeight(8)
        line(25,40,-25,40)

         // angry mark 动画
        push();
          let angryScale = map(sin(frameCount * 0.8), -1, 1, 0.15, 0.35); // 0.3左右动态缩放
          translate(100,-230);  // 注意是相对于当前 translate(this.x, this.y) 后的局部坐标
          scale(angryScale);
          imageMode(CENTER);
          image(angryMarkImg, 0, 0);
        pop();
        // //angry mark
        // scale(0.3)
        // image(angryMarkImg, 300, -600); 
      }else if (this.showCrying) {
          noStroke()
          this.drawLimbosStatics()
          this.drawBodyStatic()

          //eyes
          fill(0);
          ellipse(50, -50, 50, 20);
          ellipse(-50, -50, 50, 20);
          
          fill(100, 149, 237);
          for (let i = 0; i < this.cryDrops.length; i++) {
            let drop = this.cryDrops[i];
            ellipse(drop.x, drop.y, drop.size, drop.size * 1.2);
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
        noStroke()
        this.drawLimbosStatics()
        this.drawBodyStatic()
      
        imageMode(CENTER);
        image(deadEyeImg, 0, -50, 100, 100);
        image(deadMouthImg, 0, 40, 150, 80);

      }else if (this.happy){
        noStroke()

        //stars
        for (let i = 0; i < this.stars.length; i++) {
        let star = this.stars[i];
        push();
          imageMode(CENTER);
          image(starImg, star.x-this.x, star.y-this.y, star.size, star.size);
        pop();
      }

        let step = sin(this.walkFrame * 0.8); 
        let footOffset = step * 30;
        let armLift = step * 30;
        //left foot
        push();
        translate(-150, 200 + footOffset);
        fill(this.feetCol);
        ellipse(0, 0, 220, 120);
        pop();

        // right foot
        push();
        translate(150, 200 - footOffset);
        fill(this.feetCol);
        ellipse(0, 0, 220, 120);
        pop();

        // left arm
        push();
        translate(-200, 10 - armLift);
        rotate(-this.armAngle + 45);
        fill(this.col);
        ellipse(0, 0, 100, 200);
        pop();

        // right arm
        push();
        translate(200, 10 + armLift);
        rotate(this.armAngle - 45);
        fill(this.col);
        ellipse(0, 0, 100, 200);
        pop();

        this.drawBodyStatic()
        this.drawFaceStatic()

        // mouth
        stroke(0);
        strokeWeight(3);
        fill(252, 96, 114);
        arc(0, 40, 50, this.mouthOpen, 0, 180);

        }
    pop()
}
    drawLimbosStatics(){
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
    }

    drawMouthStatic() {
      stroke(0);
      strokeWeight(3);
      fill(252, 96, 114);
      arc(0, 40, 50, 20, 0, 180);
    }
    
    drawFaceStatic() {
      // eyes
      fill(0);
      ellipse(50, -50, 40, 90);
      ellipse(-50, -50, 40, 90);
      fill(73, 81, 235);
      ellipse(50, -50, 25, 75);
      ellipse(-50, -50, 25, 75);
      fill(0);
      ellipse(50, -60, 30, 60);
      ellipse(-50, -60, 30, 60);
      fill(255);
      ellipse(50, -70, 20, 35);
      ellipse(-50, -70, 20, 35);

      // blush
      fill(227, 118, 177);
      ellipse(100, 10, 50, 20);
      ellipse(-100, 10, 50, 20);
    }

    drawMouthStatic(){
    stroke(0);
    strokeWeight(3);
    fill(252, 96, 114);
    arc(0, 40, 50, 20, 0, 180);
    }
     

    drawBodyStatic(){
      fill(this.col)
      circle(0,0,450) 
    }
  


}

function keyPressed() {
  tama.x = constrain(tama.x, 300, width - 300);
  tama.y = constrain(tama.y, 250, height - 250);

  if (key == "a") {
    tama.x -= 50;
  } else if (key == "d") {
    tama.x += 50;
  } else if (key == "w"){
    tama.y -= 20
  }else if (key == "s"){
    tama.y += 20
  }
}


function mousePressed() {
  if (gameStarted == false) {
    gameStarted = true;
    userStartAudio();
    mic.start();         

    leveltest = 10
    healthIndex = 0;
    prevHealthIdx = -1;
    lastSoundTime = millis();
    tama.setHeart(10)
     r = 184
     g = 224
     b = 134
  }
}
