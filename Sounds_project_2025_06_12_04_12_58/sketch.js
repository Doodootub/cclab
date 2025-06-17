let xArray = [];
let yArray = [];
let diaArray = []
let initalSizeOfArray = 20; // i can use any number here

function preload(){
  bap = loadSound("sounds/8000__cfork__cf_fx_bloibb.mp3")
}

function setup() {
  createCanvas(800, 500);
  
  
  for(let i = 0; i < initalSizeOfArray; i++){

    xArray[i] = random(0, width);
    yArray[i] = random(0, height);
     diaArray[i] = random(10,50)

  }
  
}

function draw() {
  background(220);

  for(let i = 0; i < xArray.length; i++){
    let x = xArray[i];
    let y = yArray[i];

    xArray[i] += random(-1,1)
    yArray[i] += random(-1,1)
   

    circle(x, y, diaArray[i]);

  }
  
}

function mousePressed(){
  xArray.push(mouseX)
  yArray.push(mouseY)

  bap.play()
  diaArray.push(random(10,50))

}
