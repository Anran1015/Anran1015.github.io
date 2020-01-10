//Anran Zhou 3157820
//final work for Experiment 3: Endless forms most beautiful

// My Rules:
// generate random size rectangles at random position,
// generate some concentric circles inside the rectangle, create a cell
// once the cell collide to another, 
//destroy one of them and generate a new one at random position
//so these cell won't be overlapping
//add more elements or animation to make it look better~

//using p5 collide library to detect and overlapping and collision


var rects = [];
var numrects = 20;
var rec;
var speed;
var rad;
var cor;
var colourPalette=[];
var col;
var s;

function setup() {
  createCanvas(500,500);
  colourPalette=[
color(157, 250, 254),
color(241, 82, 156),
color(205, 253, 52),
color(133, 124, 173)

  ];

//using p5 collide library to detect collision and 
//generate non-overlapping shapes: https://bmoren.github.io/p5.collide2D/examples/randomPlacement/index.html

  for(i=0;i<numrects;i++){
    // generate a random sized rectangle and store it's ID for later
    c = new rectObj(random(50,80),random(50,80), i ); 
    //add it to the array
    rects.push(c); 
  }
frameRate(20);

}



function draw(){
background(213, 243, 241, 54);
smooth();
  

  for(j=0;j<numrects;j++){
    rectMode(CORNER);
    //try to place a rectangle on the screen
    rects[j].place(rects); 
    //display a rectangle on the screen
    rects[j].disp();

    //rectangle vibrates:
    rects[j].x += random(-1, 1);
    rects[j].y += random(-1, 1);

    stroke(rects[j].stroke);
   
    speed = noise(1);  
    
    rectMode(CENTER);  
    strokeWeight(1);

    //compare the width and the height, choose the shorter one as the radius
    if (rects[j].w >= rects[j].h) {
      rad = rects[j].h;
    } else {
      rad = rects[j].w;
    }

    //the fifth parameter to control the corner radius of rectangles
      cor=frameCount % (rad/speed);
   

    push();
   s=map(j,0,numrects,1.8,2.5);


    translate(rects[j].x+rects[j].w/s,rects[j].y+rects[j].h/s);

    fill(colourPalette[j%4]);
    rect(0,0,rad*0.6,rad*0.6,cor);
    rect(0,0,rad*0.4,rad*0.4,cor);
 
    // add a small circle rotating in the center of each
    rotate(rects[j].a);
    rects[j].a += random(0.03);
    noStroke();
    fill(54, 76, 100, cor*20);
    ellipse(rad/12, rad/12, rad / 6);
    
    //add some random wandering dots in the background.
     rotate(rects[j].a*10);
    let size = random(0, 12);
    fill(250);
    ellipse(100, 20, size);
    pop();
    


  }

 
}



//p5 collide library functions: generate random size shapes at random position
function rectObj(w,h, id){
  this.x = random(width);
  this.y = random(height);
  this.w = w;
  this.h = h;
  this.id = id;
  this.hit = true;
  this.mouse = true;
  this.a=random(0,20);

  this.stroke=color(255);



  this.place = function(objArray){

      for(i=0;i<objArray.length;i++){
        if(this.id != i){ 

          //detect the collide between each rectangle
          this.hit = collideRectRect(this.x, this.y, this.w,this.h, objArray[i].x, objArray[i].y, objArray[i].w,objArray[i].h); //colliding with anything?
          
          //detect if mouse is over the rectangle
          this.mouse = collidePointRect(mouseX,mouseY,this.x, this.y, this.w,this.h);

          //if collide is true, change the position to another random value, 
          //means generate a new one on the screen
          if(this.hit == true){ 
            this.x=random(500);
            this.y =random(500);

          }

          //if mouse is over the rectangle
           if(this.mouse == true){ 
            //increase the size, and change the colour
            this.w+=0.02;
            this.h+=0.02;
            this.color='yellow';

          }else{ this.color=color(250,150);
            this.stroke=color(255);

          }



        }
      }
  }

//display function
  this.disp = function(){

      stroke(this.stroke);
      rectMode(CORNER);
      fill(this.color);

  // add the fifth parameter to control the corner radius: translate the rectangle to circle
    rect(this.x,this.y,this.w,this.h,cor);
 
 
    

  }

}


