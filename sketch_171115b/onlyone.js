// Daniel Shiffman
// Code for: https://youtu.be/XATr_jdh-44

var rects = [];

function setup() {
  createCanvas(600, 600);
  
  // Lets make sure we don't get stuck in infinite loop
  var protection = 0;
  
  // Try to get to 500
  while (rects.length < 2500) {
    // Pick a random circle
    var rec = {
      x: random(1000),
      y: random(1000),
      w: random(50),
      h: random(50),
    }

    // Does it overlap any previous circles?
    var overlapping = false;
    for (var j = 0; j < rects.length; j++) {
      var other = rects[j];
      // var d = dist(rec.x, rec.y, other.x, other.y);
      // if (d < rec.r + other.r) {

         // if (rec.left > other.right || 
         //   rec.right < other.left || 
         //   rec.top > other.bottom ||
         //   rec.bottom < other.top) {

           if (rec.x > other.w || 
           rec.w < other.x || 
           rec.y > other.h ||
           rec.h < other.y) {


        overlapping = true;
      }
    }
  
    // If not keep it!
    if (!overlapping) {
      rects.push(rec);

    }
    
    // Are we stuck?
    protection++;
    if (protection > 10000) {
      break;
    }
  }

  // Draw all the circles
  for (var i = 0; i < rects.length; i++) {
    fill(255, 0, 175, 100);
    rectMode(CORNER);
    noStroke();
    console.log(rects.length);
    rect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
  }

}