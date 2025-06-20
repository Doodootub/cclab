let dino
let dino2

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  
  dino = new Dinosaur(100,300)
  dino = new Dinosaur(300,100)
}

function draw() {
  background(220);

  dino.display()
}

//class def of blueprint
class Dinosaur{
  constructor(startX,startY){
    this.x = startX
    this.y = startY
    this.type = random(["trex","flying"])
    this.col = color(255,0,0)
    this.age = 0

  }
  update(){
    this.age += 0.1
    
  }
  display(){
    push()
    translate(this.x,this.y)
    fill(this.col)
    if(this.type == "trex"){
      rect(-30,-30,60,60)
      fill(0)
      text("trex", 0,0)
    }else if(this.type == "flying"){
      ellipse(0,0,60,40)
      fill(0)
      text("flying", 0,0)
    }

    pop()
  }

}