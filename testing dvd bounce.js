function dvd(x, y, topHit, rightHit, diameter, xSlope, ySlope, fill) {
    this.x = x;
    this.y = y;
    this.fill = fill;
    this.topHit = topHit;
    this.rightHit = rightHit;
    this.diameter = 200;
    this.radius = this.diameter / 2;
    this.ySlope = ySlope;
    this.xSlope = xSlope;
}

let dvdArray = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(20);
    background(1);
    let dvd1 = new dvd(90, 90, false, false, 20, 5, 2, color(255,3,20));
    dvdArray.push(dvd1);
    console.log(dvd1);
    let dvd2 = new dvd(180, 180, true, true, 100, 3, 7, color(0,100,50));
    dvdArray.push(dvd2);
    console.log(dvd2);
    dvd2 = new dvd(300, 700, false, true, 50, 5, 2, color(90,2,50));
    dvdArray.push(dvd2);
    // dvd2 = new dvd(200, 700, true, false, 50, 3, 9, color(90,100,50));
    // dvdArray.push(dvd2);
    // console.log(dvd2);
    // dvd2 = new dvd(200, 800, true, false, 75, 2, 9, color(0,100,50));
    // dvdArray.push(dvd2);
    // console.log(dvd2);
    // dvd2 = new dvd(200, 200, true, false, 50, 2, 10, color(90,20,50));
    // dvdArray.push(dvd2);
    // console.log(dvd2);
}

function mouseClicked() {
    let newY = (mouseY)-height;
    let newX = mouseX;
    dvd2 = new dvd(newX, -newY, true, false, 50, 2, 10, color(90,20,50));
    dvdArray.push(dvd2);
}

// resize canvas and reset reference points when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(1);
}

function changeCoordinates(dvd, index){
    if(dvd.topHit) {
        dvd.y -= dvd.ySlope;
    } else{
        dvd.y += dvd.ySlope;
    }
    if(dvd.rightHit) {
        dvd.x -= dvd.xSlope;
    } else{
        dvd.x += dvd.xSlope;
    }

    // if dvd hits the edge of the screen 
    if(dvd.y >= height - dvd.radius) {
        dvd.topHit = true;
    }
    if(dvd.y <= dvd.radius) {
        dvd.topHit = false;
    }

    if(dvd.x >= width - dvd.radius) {
        dvd.rightHit = true;
    }
    if(dvd.x <= dvd.radius) {
        dvd.rightHit = false;
    }
    
    // |/_ blue
    if(dvd.rightHit && dvd.topHit) {
        dvd.fill = color(0,0,200);
    } 
    // _\| white
    if(!dvd.rightHit && dvd.topHit) {
        dvd.fill = color(200,200,200);
    } 
    //  _ 
    // |\ red
    if(dvd.rightHit && !dvd.topHit) {
        dvd.fill = color(200,0,0);
    } 

    //  _ 
    //  /| green
    if(!dvd.rightHit && !dvd.topHit) {
        dvd.fill = color(0,200,0);
    } 
}

function draw() {
    // rectMode(CENTER);
    translate(0, height); 
    // origin at lower left corner
    scale(1,-1);
    // background(1);
    // noStroke();
    // draw marker history
    // for each dvd
    for (let i = 0; i < dvdArray.length - 1; i++) {
        for (let j = i + 1; j < dvdArray.length; j++) {
            // if dvds are touching, bounce
            if(dist(dvdArray[j].x, dvdArray[j].y, dvdArray[i].x, dvdArray[i].y) <= dvdArray[j].radius + dvdArray[i].radius) {
                // if dvd are moving in same direction
                if(dvdArray[j].topHit == dvdArray[i].topHit && dvdArray[j].rightHit == dvdArray[i].rightHit) {
                    dvdArray[j].topHit = !dvdArray[j].topHit;
                    dvdArray[j].rightHit = !dvdArray[j].rightHit;
                    dvdArray[i].topHit = !dvdArray[i].topHit;
                    dvdArray[i].rightHit = !dvdArray[i].rightHi;
                } else {
                    let tempTop = dvdArray[j].topHit;
                    let tempRight = dvdArray[j].rightHit;
                    dvdArray[j].topHit = dvdArray[i].topHit;
                    dvdArray[j].rightHit = dvdArray[i].rightHit;
                    dvdArray[i].topHit = tempTop;
                    dvdArray[i].rightHit = tempRight;
                }
                
                if(dvdArray[j].topHit) {
                    dvdArray[j].y -= dvdArray[j].ySlope * 2;
                } else{
                    dvdArray[j].y += dvdArray[j].ySlope * 2;
                }
                if(dvdArray[j].rightHit) {
                    dvdArray[j].x -= dvdArray[j].xSlope * 2;
                } else{
                    dvdArray[j].x += dvdArray[j].xSlope * 2;
                }

                if(dvdArray[i].topHit) {
                    dvdArray[i].y -= dvdArray[i].ySlope * 2;
                } else{
                    dvdArray[i].y += dvdArray[i].ySlope * 2;
                }
                if(dvdArray[i].rightHit) {
                    dvdArray[i].x -= dvdArray[i].xSlope * 2;
                } else{
                    dvdArray[i].x += dvdArray[i].xSlope * 2;
                }
            }  
        }  
    }
    for (let i = 0; i < dvdArray.length; i++) {
        changeCoordinates(dvdArray[i], i);
        push();
        fill(dvdArray[i].fill);
        ellipse(dvdArray[i].x, dvdArray[i].y, dvdArray[i].diameter, dvdArray[i].diameter);
        pop();
    }
}