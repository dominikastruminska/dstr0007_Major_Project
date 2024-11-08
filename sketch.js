
const colourPalette = ['#E54379', '#CB010B', '#782221', 'purple'];
const colorKeys = ["flower", "leaves", "endLeaves", "endLeavesStroke"];
let circles = [];
let dots = [];
let endSphereSize,endSphereStroke;


let song;
let Palms = [];
let numPalms = 20;
let centerSphereSize = 30;

class Palm {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color; 
    this.rotation = random(90,270); 
    this.offset = 0
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation); 
    
    this.drawPalm();
    pop();
  }

  drawPalm() { 
    let leafCount = 8; // number of leaves per group
    let angle = 60 / 3; // rotation angle per leaf
    let leafLength = 90; // palm leaf length

    for (let i = 0; i < leafCount; i++) {
      this.drawLeaves(angle, leafLength); // pass leaf length to drawing function
    }
    // draw the middle of the Palm
    fill(this.color);
    noStroke();
    circle(0, 0, 30);
  }

  drawLeaves(angle, leafLength) { 
    let segments = 40; 
    let px, py;

    // attributes of the leaf curve
    strokeWeight(5); 
    stroke(this.color);

    rotate(angle); // rotate leaf to respective angle
    noFill();

    let xoff = this.offset; //define offset for swaying motion
    this.offset += 0.0008; //define offset value (smaller value for smoother motion)

    //draw the palm leaf as a curved line:
    beginShape();
    for (let i = 0; i < segments; i++) {
      px = map(i , 0, segments , 0 , leafLength); // define x position of the end of the leaf curve
      py = sin(i * 10) * (map(noise(xoff), 0, 1, -10, 10)) ; // apply Perlin noise to leaf curve to create a swaying motion
      vertex(px, py);
    }
    endShape();

    this.drawEndLeaf(px, py); 
  }


  drawEndLeaf(px, py) {
    fill(this.color);
    strokeWeight(5);
    stroke(this.color);
    circle(px, py, 15);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  initializeElements(); 
}

function initializeElements() {

  const gridSize = windowWidth / 5; 
  const rows = ceil((windowHeight-(windowHeight/5)) / gridSize); 
  const cols = ceil(windowWidth / gridSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

      let x = col * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let y = row * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let r = random(50, 100);
      let leafCount = Math.floor(random(8,15));
      IndividualRotation = random(120);
    
      //check if this circle overlaps with any previous circle in circles
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
    for (let i = 0; i < numPalms; i++) {
      let palmColor = random(colourPalette);
      let palm = new Palm(random(width), height, palmColor)
      Palms.push(palm);
    }
}

// Util functions

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
  // define attributes
  fill(color(colors.endLeaves));
  strokeWeight(endSphereStroke);
  stroke(color(colors.endLeavesStroke));
  // draw small circle
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

// Main drawing function
function draw() {
  background(251, 176, 59); 
  drawDots();
  
  
  for (let i = 0; i < circles.length; i++) {

  
    stroke('purple');
    strokeWeight(3);
    noFill();

    let curveX = (circles[i].x - 10, circles[i].x + 15);  // point x curve
    let curveY = (circles[i].y, height);  // point y curve

    // draw the Bezier curve from the flower center to the bottom of the canvas
    bezier(circles[i].x, circles[i].y, curveX, curveY, curveX, height, circles[i].x, height);

    drawFlower(circles[i].x, circles[i].y, circles[i].leafCount, circles[i].r, circles[i].colors, circles[i].IndividualRotation); 
  }

  for (let i = 0; i < Palms.length; i++) {
    Palms[i].draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeElements(); // reinitialize elements for new window size
  endSphereStroke = min(windowWidth, windowHeight) / 250; 
}