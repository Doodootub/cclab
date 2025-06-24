let confettis = [];
let numConfettis = 1;

//let backgroundHue = 0

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");


  // for(let i = 0; i < numConfettis; i++){
    // confettis.push(new Confetti(width/2, height/2));
  // }
  colorMode(HSB)
  //backgroundHue = 
}

function draw() {
  background(360,10,255);
  // confettis.push(new Confetti(width/2, height/2));

  if (mouseIsPressed == true){
     for (let i = 0; i < numConfettis; i++) {
    confettis.push(new Confetti(mouseX, mouseY));
  }
  }

  for(let i = 0; i < confettis.length; i++){
    confettis[i].update();
    confettis[i].display();
    confettis[i].checkOnScreen()
  }
  // if( confettis.length > 40){
  //   confettis.splice(0, 1);
  // }
// while(confettis.length > 1000){
//   confettis.splice(0, 1);
// this.OnScreen = true
// }
  for(let i = confettis.length-1;i>=0; i++){
    if(confettis[i].onScreen == false){
      confettis.splice(i,1)
    }
  } 
  fill(255)
  text(confettis.length, 10, 10)
}

class Confetti{
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);
    
    this.speedX = random(-2, 2);
    this.speedY = random(-1, -3);  
    this.onScreen = true 

    this.c = color(random(360),255,255)
  }
  update(){
    this.x+=this.speedX;
    if(this.x < 0 || this.x > width){
      this.speedX *= 0.99; // bounce off the edges
    }

    this.y+=this.speedY;
    this.speedY += 0.1; // gravity effect
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
    if(this.y<0 || this.y>height){
      this.onScreen = false
    }


  }

}
// function mousePressed() {
//   for (let i = 0; i < numconfettis; i++) {
//     confettis.push(new Confetti(mouseX, mouseY));
//   }
// }
