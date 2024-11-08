/*
acknowledgement of the sources and use of AI:
In order to create visually appealing, animated interpretation of the choosen artwork I have combined and altered a base Code
created by Tut 6 Group A for this Major Project Assignment by changing some of elements and adding timed events. I have used
ChatGPT to help me write some of these additional parts.
*/

//define variables for the artwork - Group Code
const colourPalette = ['#E54379', '#CB010B', '#782221', 'purple'];
const colorKeys = ["flower", "leaves", "endLeaves", "endLeavesStroke"];
let circles = [];
let dots = [];
let endSphereSize,endSphereStroke;

//define additional variables for the artwork - Individual Code
let song;
let Palms = [];
let numPalms = 20;
let centerSphereSize = 30; // constant size of the middle of the flower, this value will be used as a base to determine other dimnsions in the artwork 

//preload music for the artwork - "Vibe Out"  by Jazzinuf
function preload() {
  song = loadSound('assets/VibeOut.mp3');
}

//create a class to draw Palms at the bottom of the artwork - Individual Code (developed with some AI aid)
class Palm {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color; // uniform colour for each palm, picked up from a colour palette determined above
    this.rotation = random(90,270); // random rotation range for each palm
    this.offset = 0 //initial offset for palms swaying motion
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation); // apply random rotation to each palm
    
    this.drawPalm();
    pop();
  }

  drawPalm() { //drawPalm function is based on the function to draw a flower from the Group Code
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

  drawLeaves(angle, leafLength) { //re-used function from the Group Code, however applied to the Palm Class
    let segments = 40; // number of segments per the length of the leaf (curve)
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

    this.drawEndLeaf(px, py); // add small sphere at leaf tip, align with the end of the palm leaf
  }

  //function to draw that small sphere at leaf tip"
  drawEndLeaf(px, py) {
    //define attributes:
    fill(this.color);
    strokeWeight(5);
    stroke(this.color);
    circle(px, py, 15); // draw small circle, align with the end of the palm leaf using earlier defined coordinates for the end of the curve
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  song.loop(); //add song to the artwork on loop

  initializeElements(); //run initializeElements function in setup() in order to set some of the properties for the artwork before the code is run
}

function initializeElements() {

  //create a grid to curve the spreading of the flowers on hte canvas - Group Code
  const gridSize = windowWidth / 5; 
  const rows = ceil((windowHeight-(windowHeight/5)) / gridSize); //prevent the flowers to be drawn at the bottom bart of the artwork, such that they don't overlap the palms - Individual Code
  const cols = ceil(windowWidth / gridSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Randomize position within the grid cell, with a small random offset
      let x = col * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let y = row * gridSize + random(gridSize * 0.2, gridSize * 0.8);
      let r = random(50, 100);
      let leafCount = Math.floor(random(8,15));
      IndividualRotation = random(120); //add individual rotation within a range to rach flower to increase variety of the flowers drawn - Individual Code
    
      //ensure the flowers drawn in random positions all over the canvas are not overlapping:
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
        // define Colors to each circle - Group Code
        let colors = Object.fromEntries(
          colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
        );
        circles.push({ x, y, r, leafCount,colors, IndividualRotation });
      }
    }
  }
    // draw palms using the palm class with random attributes for each palm group - Individual Code (developed with some AI aid) 
    for (let i = 0; i < numPalms; i++) {
      let palmColor = random(colourPalette);
      let palm = new Palm(random(width), height, palmColor)
      Palms.push(palm);
    }
}

// Util functions - Group Code:

// function to create random colour from a set of colours determined in an array - Group Code
function randomColor() {
  return colourPalette[floor(random(colourPalette.length))];
}

//function to determine atrributes for the background dots - Group Code
function createRandomDotsAttributes() {
  return {
    x: random(width), // Random X-coordinate
    y: random(height), // Random Y-coordinate
    size: random(5, 15), // Set dot size between 5 and 15
    chosenColor: randomColor(), // Randomly select color from color pallet
    noiseOffset: random(300) // Random noise offset for unique movement
  };
}

// Drawing functions: set of functions to draw and manipulate elements on the canvas that will later be called in the main drawing function - Group and Individual Code

// function to draw flowers - Group Code (explained in detail in Group Documentation)
function drawFlower(x, y, leafCount, leafLength, colors, IndividualRotation) {
  push();
  translate(x, y); //determine 0,0 point for each flower, this allows the random positions generation for reach group
  rotate(IndividualRotation) //add individual rotation for each flower - Indivudual Code

  endSphereStroke = endSphereSize/3; // size of the circle stroke at the end of the leaves determined on the base of central sphere size

  // add Timed Event - size of the circle at the end of the leaf (flower seed) changing over time - Individual Code
  if (frameCount < 400){
  endSphereSize = centerSphereSize/6 * frameCount/300; //slowly increase the size of the seed as the flower is 'growing petals'
  }

  if (frameCount >= 400 && frameCount < 1400){
    endSphereSize = centerSphereSize/6 * (600/400+(1+frameCount-400)/200) //increase the size of the seed faster after all the petals been developed
    }

  // add Timed Event - develop Flower's petals - Individual Code
  if (frameCount < 360){
  angleStep = frameCount / leafCount; // increse the number of petals frame by frame until the whole 'circle' (360 deg) is developed
  }
  if (frameCount >= 360){
    angleStep = 360 / leafCount; // keep the number of petals constant after the full flower been developed
  }

  // draw leaves (petals) in the draw flower function - Group Code
  for (let i = 0; i < leafCount; i++) {
    drawLeaves(angleStep, leafLength,colors); // use drawLeaves nested function (described below)
  }

  // draw central sphere (middle of the flower):
  //determine attributes:
  fill(color(colors.flower));
  noStroke();

  circle(0, 0, centerSphereSize);

  pop();
}

// fnction to draw leaves (petals of the flower) - Group Code:
function drawLeaves(angleStep, leafLength,colors) {

  //add Timed Event - gradually change the number of segments of the leaf as the flower is developing - Individial Code
  let segments = 15
  let targetSegments = 5 
  segments = lerp(segments, targetSegments, 0.4) //use lerp function for gradual change


  //draw leaves (petals) as a curved shape - Group Code:

  let px, py; //curve end points

  //determine attributes: 
  strokeWeight(5); 
  stroke(color(colors.leaves));
  noFill();
  rotate(angleStep); // rotate leaf to respective angle

  beginShape();

  for (let i = 0; i < segments; i++) {

  //add Timed Events - gradually change the shape of the petal over time by manipulating px and py values - Individial Code

  //manipulate px (x end position of the curve) over time:
    if (frameCount<1000){
      px = map(i, 0, segments, 0, leafLength);
    }
    if (frameCount>=1000){
      px = map(i, 0, segments+(frameCount-1000)*0.2, 0, leafLength);
    }
    if (frameCount>=1400){
      px = map(i, 0, segments+(1400-1000)*0.2, 0, leafLength);
    }

    //manipulate py (y end position of the curve) over time:
    if (frameCount>0){
      py = sin(i * 15/(120/120)) * 50;
    }
    if (frameCount>=120){
      py = sin(i * 15/(frameCount/120)) * 50; //define y position of the end of the leaf curve, increase frequency and amplitude, make curvature more obvious
    }
    if (frameCount>=600){
      py = sin(i * (15 + (frameCount-600)*0.3)/(600/120)) * 50; //define y position of the end of the leaf curve, increase frequency and amplitude, make curvature more obvious
    }
    if (frameCount>=1000){
      py = sin(i * (15 + (1000-600)*0.3)/(600/120)) * 50; //define y position of the end of the leaf curve, increase frequency and amplitude, make curvature more obvious
    }
    if (frameCount>1400){
      py = (sin(i * (15 + (1000-600)*0.3)/(frameCount-1400)) * 30)
    }

    vertex(px, py);
  }
  endShape();

  // draw circles (flower seeds) at the end of the leaves - Group Code 
  // add Timed Events - manipulate the position of the flowers seeds over time - Individual Code

  // align the seed with the end of the petal while the flowers are blossoming:
  if (frameCount < 1400){
  drawEndLeaf(px, py,colors); //use drawEndLeaf nested function (decrbied below)
  }

  // disattach the seeds from the flowers after they blossom by changing their x and y positions over time:
  if (frameCount >= 1400 && frameCount < 2800){
  drawEndLeaf(px+(frameCount-1400), py+(frameCount-1400)/2,colors);
  }
}

// function to draw circles (flower seeds) at the end of the leaves - Group Code:
function drawEndLeaf(x, y,colors) {
  // define attributes
  fill(color(colors.endLeaves));
  strokeWeight(endSphereStroke);
  stroke(color(colors.endLeavesStroke));
  // draw small circle
  circle(x, y, endSphereSize);
}

// function to draw and move background dots - Group Code (described in detail in Group Documentation)
function drawDots() {
  noStroke();
  for (let dot of dots) {
    fill(dot.chosenColor);
    
    // Update position using Perlin noise and constrain within boundaries - Group Code:
    dot.x += map(noise(dot.noiseOffset), 0, 1, -2, 2);
    dot.y += map(noise(dot.noiseOffset + 4), 0, 1, -2, 2);
    dot.noiseOffset += 0.01; // noise offset for smooth movement of the dots

    // add Timed Events - manipulate the size of background dots - Individial Code 
    //keep constant size of the dots while the flowers are blossoming:
    if (frameCount < 1400){
    circle(dot.x, dot.y, dot.size * 0.5);
    }
    //rapidly increase and decrease the dot size once the flowers blossomed and start loosing seeds, such that the dots cover the screen and than start disappearing:
    if (frameCount >= 1400){
      circle(dot.x, dot.y, dot.size * 0.5 * (100/((frameCount-1400)))); 
    }

    // Keep dots within canvas boundaries - Group Code:  
    if (dot.x < 0 || width < dot.x || dot.y < 0 || height < dot.y){
      dot = createRandomDotsAttributes(); //assign earlier defined attributes 
    }
  }

  /* add Timed Event - limit the number of dots poping up on the screen after a certain value is reached (and by the time the flowers
  are 'fully blossomed') - since the drawDots function has been moved to the draw() function the dots are being drawn frame after frame
  for a 'blossoming' effect. However they have to be 'stopped' at a chosen time.  */
  if (frameCount < 1500){
    while (dots.length < frameCount) {
      dots.push(createRandomDotsAttributes());
    }
  }
}

// Main drawing function
function draw() {
  background(251, 176, 59); // set background color
  drawDots(); // draw background dots
  
  // draw flowers as a for loop to create multiple ones in defferent positions with a use of earlier defined functions and attributes - Group Code
  for (let i = 0; i < circles.length; i++) {

    // add an flower stalk - draw slightly curved line from the center of the flower to the bottom edge of the canvas - Individual Code (developed with some AI aid)
    //determine attributes:
    stroke('purple');
    strokeWeight(3);
    noFill();

    let curveX = (circles[i].x - 10, circles[i].x + 15);  // point x curve
    let curveY = (circles[i].y, height);  // point y curve

    // draw the Bezier curve from the flower center to the bottom of the canvas
    bezier(circles[i].x, circles[i].y, curveX, curveY, curveX, height, circles[i].x, height);

    // draw flowers with a use of earlier defined drawFlower function and attributes - Group Code
    drawFlower(circles[i].x, circles[i].y, circles[i].leafCount, circles[i].r, circles[i].colors, circles[i].IndividualRotation); 
  }

  // Draw palms as a for loop at the bottom of the canvas - Individual Code (developed with some AI aid)
  for (let i = 0; i < Palms.length; i++) {
    Palms[i].draw();
  }
}

// ensure the artwork scales properly - Group Code:
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeElements(); // reinitialize elements for new window size
  endSphereStroke = min(windowWidth, windowHeight) / 250; 
}