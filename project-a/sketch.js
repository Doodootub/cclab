/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/


let angleRight = 0;
let angleLeft = 0
let highlightsMoving = false;
let highlightsMoving2 = false;
let isCrying = false;

function setup() {
  
   let canvas = createCanvas(800, 500);
   canvas.parent("p5-canvas-container");
  avoidX = 375 * 0.5 - 100;
  avoidY = -325 * 0.5 + 100;
}

function draw() {
  background(247, 235, 204);
  fill("blue");
  text(mouseX + ", " + mouseY, mouseX, mouseY);
  drawCreature();
}

function drawCreature() {
  push();
  translate(width / 2, height / 2);
  drawHead();
  drawClusters();
  drawLines();
  drawNeurons();
  drawThinkingBoubles();

  if (highlightsMoving == true) {
    drawMovingHighlights();
  } else if (highlightsMoving2 == true) {
    drawMessyHighlight();
  } else {
    drawstaticHighlights();
  }

  if (isCrying) drawTears();
  pop();
}

function drawHead() {
  //upper brain part
  //head
  stroke(0);
  strokeWeight(3);
  fill(144, 207, 174, 100);
  arc(0, 90, 750, 650, PI, 0, OPEN);

  //brian structure
  noFill();
  beginShape();
  curveVertex(0, -235);
  curveVertex(0, -235);

  curveVertex(0, -233);
  curveVertex(1, -212);
  curveVertex(0, -190);
  curveVertex(-3, -172);
  curveVertex(-2, -158);
  curveVertex(0, -134);
  curveVertex(-3, -113);
  curveVertex(-6, -96);
  curveVertex(-10, -67);
  curveVertex(-7, -38);
  curveVertex(-7, -19);
  curveVertex(-12, -10);
  curveVertex(-25, -6);
  curveVertex(-60, -5);
  curveVertex(-90, -3);
  curveVertex(-120, -3);
  curveVertex(-171, -1);
  curveVertex(-207, 0);
  curveVertex(-263, -3);
  curveVertex(-318, 0);
  curveVertex(-361, 0);

  curveVertex(-360, 0);
  curveVertex(-360, 0);
  endShape();

  beginShape();
  curveVertex(0, -235);
  curveVertex(0, -235);

  curveVertex(0, -231);
  curveVertex(0, -184);
  curveVertex(4, -145);
  curveVertex(3, -120);
  curveVertex(1, -84);
  curveVertex(5, -55);
  curveVertex(6, -27);
  curveVertex(29, -9);
  curveVertex(87, -7);
  curveVertex(130, -5);
  curveVertex(166, -5);
  curveVertex(217, -5);
  curveVertex(257, -5);
  curveVertex(301, 2);

  curveVertex(360, 0);
  curveVertex(360, 0);
  endShape();

  //downward face part
  fill(144, 207, 174);
  arc(0, 90, 750, 300, 0, PI, OPEN);

  fill(0);
  ellipse(100, 150, 75, 110);
  ellipse(-100, 150, 75, 110);
}

function drawClusters() {
  fill(50, 150, 250);
  noStroke();

  // ellipse that center at (0,90), radiusX = 750/2 = 375, radiusY = 650/2 = 325
  let a = 375;
  let b = 325;

  for (let i = 0; i < 50; i++) {
    let px = random(-a, 0);
    let py = random(-b + 90, 0);
    //the ellipse equation ((x/a)^2 + ((y-90)/b)^2 <= 1)
    if (
      py <= 90 &&
      (px * px) / (a * a) + ((py - 90) * (py - 90)) / (b * b) <= 1
    ) {
      rect(px, py, 5, 5);
    } else {
      i--;
    }
  }
}

function drawLines() {
  strokeWeight(2);
  stroke(50, 100, 200, 150);

  // horizontal span and vertical bounds
  let span = 350;
  let topY = 30;
  let botY = 90;
  // how densely we draw lines
  let step = 20;

  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  for (let x = -span; x <= span; x += step) {
    // Base length pulses with a sine wave
    //    offset each line by its x so they wave out of phase
    let wave = sin(frameCount * 0.05 + x * 0.02);
    let baseLen = map(wave, -1, 1, 10, 60);

    // Mouse‐distance effect: lines near the cursor get longer/brighter
    let distX = abs(mx - x);
    // normalize to [0,1]
    let t = constrain(distX / span, 0, 1);
    // invert so closer → bigger
    let boost = map(1 - t, 0, 1, 0.5, 1.5);

    // final length
    let len = baseLen * boost;

    // Only draw if within the y-band
    //    (drawing vertical lines from botY up to botY–len)
    let y1 = botY;
    let y2 = botY - len;
    line(x, y1, x, y2);
  }
}

function drawNeurons() {
  let dia = 50;
  let a = 375;
  let b = 325;
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  //vector from mouse → circle
  let vx = avoidX - mx;
  let vy = avoidY - my;
  let dist = sqrt(vx * vx + vy * vy);

  let threshold = 80;
  if (dist < threshold && dist > 0) {
    let ux = vx / dist;
    let uy = vy / dist;
    let speed = 2;

    let testX = avoidX + ux * speed;
    let testY = avoidY + uy * speed;

    if (
      testX >= 0 &&
      testY <= 0 &&
      (testX * testX) / (a * a) +
        ((testY - 90 - dia / 2 - 5) * (testY - 90 - dia / 2 - 5)) / (b * b) <=
        1
    ) {
      avoidX += ux * speed;
      avoidY += uy * speed;
    }
  }

  avoidX = constrain(avoidX, 0 + dia / 2, 375 - dia / 2);
  avoidY = constrain(avoidY, -325 + dia, 0 - dia / 2);

  fill(200, 50, 50);
  noStroke();
  circle(avoidX, avoidY, dia);

  let s = 10 + cos(frameCount * 0.01) * 10;
  let blueColor = 128 + cos(frameCount * 0.01) * 128;
  fill(0, 0, blueColor);
  rect(150, -150, s, s);

  //scary black circle
  push();
  translate(200, -50);
  stroke(0);
  fill(0);

  beginShape();
  for (let i = 0; i < 100; i++) {
    const radius = 10 + random(5);
    const x = cos(radians(i * 3.6)) * radius;
    const y = sin(radians(i * 3.6)) * radius;
    vertex(x, y);
  }
  endShape();

  pop();
}

function drawMovingHighlights() {
  //highlight of Left eyes
  push();
  translate(-100, 150);

  noStroke();
  fill(255);
  rotate(radians(angleLeft));
  ellipse(25, 0, 25, 35);
  angleLeft++;
  pop();

  // //highlight of Right eyes
  push();
  translate(100, 150);

  noStroke();
  fill(255);
  rotate(radians(angleRight));
  ellipse(25, 0, 25, 35);
  angleRight++;
  pop();
}

function drawstaticHighlights() {
  push();
  translate(-100, 150);
  noStroke();
  fill(255);
  ellipse(0, 0, 25, 35);
  pop();

  push();
  translate(100, 150);
  noStroke();
  fill(255);
  ellipse(0, 0, 25, 35);
  pop();
}

function drawTears() {
  let drops = [];
  drops.push(25, 35, 45, 55, 65, 75, 85, 95, 105);

  noStroke();
  fill(136, 235, 252, 100);
  for (let i = 0; i < drops.length; i++) {
    let o = drops[i];
    ellipse(-95, 150 + o, 8, 16);
    ellipse(95, 150 + o, 8, 16);
  }
}

function mousePressed() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  let a = 375;
  let b = 325;
  if (
    mx <= 0 &&
    my <= 0 &&
    (mx * mx) / (a * a) + ((my - 90) * (my - 90)) / (b * b) <= 1
  ) {
    highlightsMoving = true;
    highlightsMoving2 = false;
    angleLeft = 0;
    angleRight = 0;
  } else {
    highlightsMoving = false;
  }

  let s = 10 + cos(frameCount * 0.01) * 10;
  if (mx >= 150 && mx <= 150 + s && my >= -150 && my <= -150 + s) {
    isCrying = true;
  } else {
    isCrying = false;
  }
}

function drawMessyHighlight() {
  // Left eye
  push();
  translate(-100, 150);
  noStroke();
  fill(255);
  rotate(radians(angleLeft));
  ellipse(25, 0, 25, 35);
  pop();

  // Right eye
  push();
  translate(100, 150);
  noStroke();
  fill(255);
  rotate(radians(angleRight));
  ellipse(25, 0, 25, 35);
  pop();

  angleLeft += random(1, 5);
  angleRight += random(-1, -5);
}

function keyPressed() {
  console.log("keyPressed:", key, "isNaN is", isNaN(key));

  if (!isNaN(key)) {
    highlightsMoving2 = true;
    highlightsMoving = false;
    angleLeft = 0;
    angleRight = 0;
  } else {
    highlightsMoving2 = false;
  }
}

function drawThinkingBoubles() {
  x = -325;
  y = -225;
  w = 150;
  h = 45;

  fill(255);
  ellipse(x, y, w, h);
  ellipse(x + 20, y + 50, w - 80, h - 20);
  ellipse(x + 40, y + 75, w - 100, h - 30);

  if (keyIsPressed == true) {
    noStroke();
    fill(0);
    text("I'm not good at numbers", x - w / 2 + 10, y);
  }

  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  let a = 375;
  let b = 325;
  if (
    mx <= 0 &&
    my <= 0 &&
    (mx * mx) / (a * a) + ((my - 90) * (my - 90)) / (b * b) <= 1 &&
    mouseIsPressed == true
  ) {
    fill(0);
    text("I'm thinking......", x - w / 2 + 10, y);
  }
}
