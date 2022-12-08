
let touching = [[0,0]];
// stole from https://github.com/seanny1986/particlePhysics 
// (https://seanny1986.wordpress.com/2017/10/01/simulation-of-elastic-collisions-in-python/)
// and https://bl.ocks.org/tophtucker/16fbd7e7c6274ed329111cbe139a6bb6#index.html
class dvds {
    constructor() {
        this.dvdArray = [];
    }

    // update each point in the array
    update() {
        // for each dvd in dvd array
        for(let i in this.dvdArray) {
            // update coordinates
            this.dvdArray[i].changeCoordinates();
            // bounce if wall is hit
            this.bounce(this.dvdArray[i]);
            // if dvds are touching, collide
            for(let j in this.dvdArray) {
                if (i != j) {
                    let touchDist = this.dvdArray[j].radius + this.dvdArray[i].radius;
                    let distance = dist(this.dvdArray[j].x, this.dvdArray[j].y, this.dvdArray[i].x, this.dvdArray[i].y);
                    // if dvds are touching, bounce
                    if( distance <= touchDist) {
                        // if dvds are overlapping, move them so they are touching but not overlapped
                        if(distance < touchDist) {
                            let overlap = touchDist - distance;
                            let scaleFactor = overlap / distance;
                            this.dvdArray[i].x -= (this.dvdArray[j].x - this.dvdArray[i].x) * scaleFactor / 2;
                            this.dvdArray[i].y -= (this.dvdArray[j].y - this.dvdArray[i].y) * scaleFactor / 2;
                            if(j == touching[touching.length - 1][0] && i == touching[touching.length - 1][1]) {
                                console.log(this.dvdArray[i].xVelocity + ", " + this.dvdArray[i].yVelocity);
                                console.log(this.dvdArray[j].xVelocity + ", " + this.dvdArray[j].yVelocity);
                                debugger;
                            }
                            touching.push([j, i]);
                        }
                        this.elasticCollision(this.dvdArray[i], this.dvdArray[j]);
                    }
                }
            }
            push();
            fill(this.dvdArray[i].fill);
            ellipse(this.dvdArray[i].x, this.dvdArray[i].y, this.dvdArray[i].diameter, this.dvdArray[i].diameter);
            pop();
        }
    }

    // when dvd bounces against wall
    bounce(dvd) {
        // if dvd hits the edge of the screen 
        // top of screen
        if(dvd.y >= height - dvd.radius) {
            // if dvd is over the edge of the screen, move it so that it is touching but not overlapped with the edge
            if(dvd.y > height - dvd.radius) {
                let overlap = dvd.y - (height - dvd.radius);
                dvd.y -= overlap;
            }
            // dvd.topHit = true;
            dvd.yVelocity = -dvd.yVelocity;
        }
        // bottom of screen
        if(dvd.y <= dvd.radius) {
            // dvd.topHit = false;
            // if dvd is over the edge of the screen, move it so that it is touching but not overlapped with the edge
            if(dvd.y < dvd.radius) {
                let overlap = dvd.radius - dvd.y;
                dvd.y += overlap;
            }
            dvd.yVelocity = -dvd.yVelocity;
        }

        // right of screen
        if(dvd.x >= width - dvd.radius) {
            // if dvd is over the edge of the screen, move it so that it is touching but not overlapped with the edge
            if(dvd.x > width - dvd.radius) {
                let overlap = dvd.x - (width - dvd.radius);
                dvd.x -= overlap;
            }
            dvd.xVelocity = -dvd.xVelocity;
            // dvd.rightHit = true;
        }

        // left of screen
        if(dvd.x <= dvd.radius) {
            // dvd.rightHit = false;
            // if dvd is over the edge of the screen, move it so that it is touching but not overlapped with the edge
            if(dvd.x < dvd.radius) {
                let overlap = dvd.radius - dvd.x;
                dvd.x += overlap;
            }
            dvd.xVelocity = -dvd.xVelocity;
        }
    }

    // when there is an elastic collision
    elasticCollision(dvd1, dvd2) {
        let π = Math.PI,
                x1 = dvd1.x,
                y1 = dvd1.y,
                x2 = dvd2.x,
                y2 = dvd2.y,
                m1 = dvd1.mass,
                m2 = dvd2.mass,
                v1x = dvd1.xVelocity,
                v1y = dvd1.yVelocity,
                v2x = dvd2.xVelocity,
                v2y = dvd2.yVelocity,
                v1 = Math.sqrt(Math.pow(v1x,2) + Math.pow(v1y,2)),
                v2 = Math.sqrt(Math.pow(v2x,2) + Math.pow(v2y,2));
  
        // get contact angle
        let φ = Math.atan2(y2-y1, x2-x1);

        // get movement angles
        let θ1 = Math.atan2(v1y, v1x);
        let θ2 = Math.atan2(v2y, v2x);
        
        let v1x_new = 
        ( v1 * Math.cos(θ1 - φ) * (m1 - m2) + 
            2 * m2 * v2 * Math.cos(θ2 - φ) ) / 
        ( m1 + m2 ) * 
        Math.cos(φ) +
        v1 * Math.sin(θ1 - φ) * Math.cos(φ + π/2);

        let v1y_new = 
        ( v1 * Math.cos(θ1 - φ) * (m1 - m2) + 
            2 * m2 * v2 * Math.cos(θ2 - φ) ) / 
        ( m1 + m2 ) * 
        Math.sin(φ) +
        v1 * Math.sin(θ1 - φ) * Math.cos(φ + π/2);
        
        let v2x_new = 
        ( v2 * Math.cos(θ2 - φ) * (m2 - m1) + 
            2 * m1 * v1 * Math.cos(θ1 - φ) ) / 
        ( m2 + m1 ) * 
        Math.cos(φ) +
        v2 * Math.sin(θ2 - φ) * Math.cos(φ + π/2);

        let v2y_new = 
        ( v2 * Math.cos(θ2 - φ) * (m2 - m1) + 
            2 * m1 * v1 * Math.cos(θ1 - φ) ) / 
        ( m2 + m1 ) * 
        Math.sin(φ) +
        v2 * Math.sin(θ2 - φ) * Math.cos(φ + π/2);

        dvd1.xVelocity = v1x_new;
        dvd1.yVelocity = v1y_new;
        dvd2.xVelocity = v2x_new;
        dvd2.yVelocity = v2y_new;
    }

    // add a new dvd to the dvd array
    addDVD(aDvd) {
        this.dvdArray.push(aDvd);
    }
}

class dvd {
    constructor(x, y, diameter, angle, velocity, fill) {
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.angle = angle;
        // if(180 < this.angle <= 360) {
        //     //   |
        //     //  \|/
        //     this.topHit = true;
        // } else {
        //     //  /|\
        //     //   |
        //     this.topHit = false;
        // }

        // if (90 < this.angle <= 270) {
        //     //  <--
        //     this.rightHit = true;
        // } else {
        //     //  -->
        //     this.rightHit = false;
        // }

        this.diameter = diameter;
        this.radius = this.diameter / 2;
        this.velocity = velocity;
        this.mass = 300;

        // isolate the velocity in the x and y directions
        this.xVelocity = velocity * Math.cos(angle * Math.PI / 180);
        this.yVelocity = velocity * Math.sin(angle * Math.PI / 180);
    }

    // new x and y coordinate from d = v*t
    changeCoordinates() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    // move x and y based on dist
    addDistance(dist){
        // isolate the velocity in the x and y directions
        let xPositionVelocity = dist * Math.cos(this.angle * Math.PI / 180);
        let yPositionVelocity = dist * Math.sin(this.angle * Math.PI / 180);
        this.x += xPositionVelocity;
        this.y += yPositionVelocity;
    }
}

let allDVDs = new dvds;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);
    background(1);
    let dvd1 = new dvd(90, 90, 100, 30, 2, color(255,3,20));
    allDVDs.addDVD(dvd1);
    dvd1 = new dvd(90, 300, 100, 300, 2, color(0,3,255));
    allDVDs.addDVD(dvd1);
}

// resize canvas and reset reference points when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(1);
}

function mouseClicked() {
    let newY = (mouseY)-height;
    let newX = mouseX;
    dvd2 = new dvd(newX, -newY, Math.random() * 200 + 20, Math.random() * 360, Math.random() * 20 + 1, color(90,20,50));
    allDVDs.addDVD(dvd2);
}

function draw() {
    // rectMode(CENTER);
    translate(0, height); 
    // origin at lower left corner
    scale(1,-1);
    // background(1);
    // noStroke();

    allDVDs.update();
}