const colourPalette = ['#E54379', '#CB010B', '#782221', 'purple'];
const colorKeys = ["flower", "leaves", "endLeaves", "endLeavesStroke"];
let circles = [];
let dots = [];
let endSphereSize,endSphereStroke;

let centerSphereSize = 30; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  initializeElements();
}

function initializeElements() {

  const gridSize = windowWidth / 5; 
  const rows = ceil(windowHeight / gridSize); 
  const cols = ceil(windowWidth / gridSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Randomize position within the grid cell, with a small random offset
      let x = col * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let y = row * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let r = random(50, 100);
      let leafCount = Math.floor(random(8,15));
      IndividualRotation = random(120);

      //check if this circle overlaps with any previous circle in circles - Group Code based on 9.8: Random Circles with No Overlap - p5.js Tutorial from The Coding Train (explained in detail in Group Documentation)
      let overlapping = false;
      for (let other of circles) {
        let d = dist(x, y, other.x, other.y);
        if (d < r + other.r) {
          overlapping = true;
          break;
        }
      }
      //only add the circle if it’s not overlapping
      if (!overlapping) {
        let colors = Object.fromEntries(
          colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
        );
        circles.push({ x, y, r, leafCount,colors, IndividualRotation });
      }
    }
  }
}

// Util functions:

function randomColor() {
  return colourPalette[floor(random(colourPalette.length))];
}

function createRandomDotsAttributes() {
  return {
    x: random(width), // Random X-coordinate
    y: random(height), // Random Y-coordinate
    size: random(5, 15), // Set dot size between 5 and 15
    chosenColor: randomColor(), // Randomly select color from color pallet
    noiseOffset: random(300) // Random noise offset for unique movement
  };
}


function drawFlower(x, y, leafCount, leafLength, colors, IndividualRotation) {
  push();
  translate(x, y);
  rotate(IndividualRotation) 

  endSphereStroke = endSphereSize/3; 

  if (frameCount < 400){
  endSphereSize = centerSphereSize/6 * frameCount/300;
  }

  if (frameCount >= 400 && frameCount < 1400){
    endSphereSize = centerSphereSize/6 * (600/400+(1+frameCount-400)/200) 
    }

  if (frameCount < 360){
  angleStep = frameCount / leafCount;
  }
  if (frameCount >= 360){
    angleStep = 360 / leafCount; 
  }


  for (let i = 0; i < leafCount; i++) {
    drawLeaves(angleStep, leafLength,colors); 
  }

  fill(color(colors.flower));
  noStroke();

  circle(0, 0, centerSphereSize);

  pop();
}

function drawLeaves(angleStep, leafLength,colors) {

  let segments = 15
  let targetSegments = 5 
  segments = lerp(segments, targetSegments, 0.4)

  let px, py; 

  strokeWeight(5); 
  stroke(color(colors.leaves));
  noFill();
  rotate(angleStep);

  beginShape();

  for (let i = 0; i < segments; i++) {

    if (frameCount<1000){
      px = map(i, 0, segments, 0, leafLength);
    }
    if (frameCount>=1000){
      px = map(i, 0, segments+(frameCount-1000)*0.2, 0, leafLength);
    }
    if (frameCount>=1400){
      px = map(i, 0, segments+(1400-1000)*0.2, 0, leafLength);
    }

    if (frameCount>0){
      py = sin(i * 15/(120/120)) * 50;
    }
    if (frameCount>=120){
      py = sin(i * 15/(frameCount/120)) * 50;
    }
    if (frameCount>=600){
      py = sin(i * (15 + (frameCount-600)*0.3)/(600/120)) * 50;
    }
    if (frameCount>=1000){
      py = sin(i * (15 + (1000-600)*0.3)/(600/120)) * 50;
    }
    if (frameCount>1400){
      py = (sin(i * (15 + (1000-600)*0.3)/(frameCount-1400)) * 30)
    }

    vertex(px, py);
  }
  endShape();

 
  if (frameCount < 1400){
  drawEndLeaf(px, py,colors); 
  }

  if (frameCount >= 1400 && frameCount < 2800){
  drawEndLeaf(px+(frameCount-1400), py+(frameCount-1400)/2,colors);
  }
}


function drawEndLeaf(x, y,colors) {

  fill(color(colors.endLeaves));
  strokeWeight(endSphereStroke);
  stroke(color(colors.endLeavesStroke));

  circle(x, y, endSphereSize);
}


function drawDots() {
  noStroke();
  for (let dot of dots) {
    fill(dot.chosenColor);
    
    
    dot.x += map(noise(dot.noiseOffset), 0, 1, -2, 2);
    dot.y += map(noise(dot.noiseOffset + 4), 0, 1, -2, 2);
    dot.noiseOffset += 0.01; 
    
    if (frameCount < 1400){
    circle(dot.x, dot.y, dot.size * 0.5);
    }
    
    if (frameCount >= 1400){
      circle(dot.x, dot.y, dot.size * 0.5 * (100/((frameCount-1400)))); 
    }

    if (dot.x < 0 || width < dot.x || dot.y < 0 || height < dot.y){
      dot = createRandomDotsAttributes(); 
    }
  }

  if (frameCount < 1500){
    while (dots.length < frameCount) {
      dots.push(createRandomDotsAttributes());
    }
  }
}

function draw() {
  background(251, 176, 59); 
  drawDots(); 
  
 
  for (let i = 0; i < circles.length; i++) {
    drawFlower(circles[i].x, circles[i].y, circles[i].leafCount, circles[i].r, circles[i].colors, circles[i].IndividualRotation); 
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeElements(); 
  endSphereStroke = min(windowWidth, windowHeight) / 250; 
}