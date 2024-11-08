const colourPalette = ['#E54379', '#CB010B', '#782221', 'purple'];
const colorKeys = ["flower", "leaves", "endLeaves", "endLeavesStroke"];
let circles = [];
let dots = [];
let centerSphereSize,endSphereSize,endSphereStroke;
let m = 1;


function setup() { 
  createCanvas(windowWidth, windowHeight);
  initializeElements();
  numDots = int((width * height) / 500);

}

function initializeElements() {
  circles = []; // Clear the existing circle data
  const gridSize = windowWidth / 5; 
  const rows = ceil(windowHeight / gridSize);
  const cols = ceil(windowWidth / gridSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Randomize position within the grid cell, with a small random offset
      let x = col * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let y = row * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let r = random(50, 100);
      let leafCount = random(8, 15);
    
      // Check if this circle overlaps with any previous circle in `circles`
      let overlapping = false;
      for (let other of circles) {
        let d = dist(x, y, other.x, other.y);
        if (d < r + other.r) {
          overlapping = true;
          break;
        }
      }

      // Only add the circle if it’s not overlapping
      if (!overlapping) {
        // Define Colors to each circle
        let colors = Object.fromEntries(
          colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
        );
        circles.push({ x, y, r, leafCount,colors });
      }
    }
  }

  angleMode(DEGREES);
}

// Main drawing function
function draw() {
  background(251, 176, 59); // Set background color

/* if (frameCount > 360){
    drawDots();
    }
*/
  
  for (let i = 0; i < circles.length; i++) {
    /* 
    INPUT PARAM:
    1, x: x position of the flower
    2, y: y position of the flower
    3, leafCount: number of the flower leaves
    4, leaflength: number of the flower leaves
    5, colors: color pallet for the flower
     */ 
    drawFlower(circles[i].x, circles[i].y, circles[i].leafCount, circles[i].r, circles[i].colors); 
  }



}

// Draw flowers
function drawFlower(x, y, leafCount, leafLength, colors) {
  push();
  translate(x, y);

  if (frameCount > 545){
    rotate(frameCount*0.5);
    }

  if (frameCount < 515){
  centerSphereSize = 30; // size of the cirle in the center of the flower
  }
  if (frameCount > 515){
    centerSphereSize = 30+(frameCount-515); // size of the cirle in the center of the flower
    }
  if (frameCount > 600){
    centerSphereSize = 115; // size of the cirle in the center of the flower
    }


  endSphereSize = 1+frameCount/30;
  endSphereStroke = 1; // size of the circle stroke in the end of the leaves

  if (frameCount < 360){
   angleStep = frameCount / leafCount; // Rotation angle per leaf
  }
  if (frameCount > 360){
   angleStep = 360 / leafCount; // Rotation angle per leaf
  }


  // Draw leaves
  for (let i = 0; i < leafCount; i++) {
    drawLeaves(angleStep, leafLength,colors); // Pass leaf length to drawing function
  }
    
  // Draw central sphere
  fill(color(colors.flower));
  noStroke();
  ellipse(0, 0, centerSphereSize, centerSphereSize); // Draw central sphere

  pop();
}

// Draw flowers
function drawLeaves(angle, leafLength,colors) {



  if (frameCount < 360){
  segments = 15;}
  if (frameCount > 360){
  segments = lerp(15, 20, 0.02);
  }
  if (frameCount > 400){
    segments = lerp(20, 30, 0.01);
    }
  if (frameCount > 415){
    segments = 30;
    }
  
  // number of segments per the length of the leaf (curve)
  let px, py;

  //attributes of the leaves (curve)
  strokeWeight(5);  // Set leaf stem line width thicker
  stroke(color(colors.leaves));

  rotate(angle); // Rotate leaf to respective angle
  noFill(); // Ensure stem part is not filled

  beginShape();
  // leaf curve
  for (let i = 0; i < segments; i++) {
    px = map(i, 0, segments, 0, leafLength); //define x position of the end of the leaf curve

    if (frameCount < 360){
      py = sin(i * 10) * 50; //define y position of the end of the leaf curve, increase frequency and amplitude, make curvature more obvious
     }
    if (frameCount > 360){
      py2 = sin(i * 10) * 50*0.5
      py1 = sin(i * 10) * (frameCount-360)*0.5; //define y position of the end of the leaf curve, increase frequency and amplitude, make curvature more obvious
  
      py = lerp(py1, py2, 0.03)
        }
     if (frameCount > 520){
      py = sin(i * 10) * 80; //define y position of the end of the leaf curve, increase frequency and amplitude, make curvature more obvious
     }

    
    vertex(px, py);
  }
  endShape();

  drawEndLeaf(px, py,colors); // Add small sphere at leaf tip, align with line end
}

function drawEndLeaf(x, y,colors) {
  fill(color(colors.endLeaves));
  strokeWeight(endSphereStroke);
  stroke(color(colors.endLeavesStroke));
  ellipse(x, y, endSphereSize, endSphereSize); // Draw small circle with stroke
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
  };
}

//draw bg dots
function drawDots() {

  for (let i = 0; i < numDots; i++) {
    let size = random(5, 10); // Random size range for dots
    let x = random(size / 2, width - size / 2); // Ensure within horizontal boundaries
    let y = random(size / 2, height - size / 2); // Ensure within vertical boundaries
    let chosenColor = random([color(229, 67, 121,20), color(120, 34, 33,20), color(203, 1, 11,20), color(18, 12, 8,20), color(122, 70, 118,20)]);
    dots.push({ x, y, size, chosenColor}); // Store properties
  }

  noStroke(); // Remove outline
  for (let dot of dots) {
    fill(dot.chosenColor);
    ellipse(dot.x, dot.y, dot.size * 0.5, dot.size * 0.5); // Shrink dot size and draw
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeElements(); // Reinitialize elements for new window size

  endSphereStroke = min(windowWidth, windowHeight) / 250; 
}