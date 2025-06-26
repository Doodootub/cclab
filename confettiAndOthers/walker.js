class Eater{
  constructor(){
    this.x = random(width);
    this.y = random(height);
    this.dia = 30;
    this.speed = 1;
    this.direction = "RIGHT";
    this.hue = (backgroundHue + 180)%360; // what happens here?
  }
  update(){
    if(this.direction == "RIGHT"){
      this.x += this.speed;
      if(this.x > width+this.dia/2){
        this.x = -this.dia/2
      }
    }
  }
  display(){
    push();
    translate(this.x, this.y);

    noStroke();
    fill(this.hue,60, 190)
    circle(0, 0, this.dia)

    //arrow
    fill(this.hue,255, 50)
    triangle(2, -3, 10, 0, 2, 3)
   

    pop();
  }
}