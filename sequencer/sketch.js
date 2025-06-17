let bassArray = [false, true, false, true, false, false]
let boxSize = 80
let topMargin = 50

let speed = 2
let playheadX = -speed

let bass

function preload(){
  bass = loadSound("assets/brendanCan.mp3")
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(220);
  //drawBox(50,50, boxSize,true)
  //drawBox(200,50, boxSize, false)

  for(let i = 0; i<bassArray.length; i++){
    let x=boxSize*i
    drawBox(x,topMargin, boxSize,bassArray[i])

  }

line(playheadX,0,playheadX,height)
playheadX+=speed

if(playheadX>=bassArray.length*boxSize){
  playheadX=0
}

if(playheadX%boxSize==0){
  let boxIdx = playheadX/boxSize
  console.log("reached next box!!!", boxIdx)
  let boxStatus = bassArray[boxIdx]
  if (boxStatus==true){
    bass.play()
  }
}
}


function drawBox(x,y, size, checked){
push()
translate(x,y)

if (checked == true) {
fill(0)  
}else{ 
  fill(255)
}
rect(0,0,size,size)

pop()

}

function mousePressed(){

  console.log(mouseX,mouseY)
  if(mouseY > topMargin&& mouseY <topMargin+boxSize && mouseX<bassArray.length*boxSize){
    let boxIdx= floor(mouseX/boxSize)

    console.log(mouseX, boxIdx)
    console.log(bassArray[boxIdx])

    if(bassArray[boxIdx] == false){
      bassArray[boxIdx] = true
    }else{
      bassArray[boxIdx] = false
    }


  }

}