
// stole from https://github.com/seanny1986/particlePhysics 
// (https://seanny1986.wordpress.com/2017/10/01/simulation-of-elastic-collisions-in-python/)
// and https://bl.ocks.org/tophtucker/16fbd7e7c6274ed329111cbe139a6bb6#index.html
let touching = [[0,0]];

// this class puts it all together
// drawing the pins and dvds on the screen and updating dvd positions at every frame
class dvds {
    constructor() {
        this.dvdArray = [];
        this.pinsArray = [];
    }

    // update each dvd in the array
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
                            this.dvdArray[i].x -= ((this.dvdArray[j].x - this.dvdArray[i].x) * scaleFactor) / 2;
                            this.dvdArray[i].y -= ((this.dvdArray[j].y - this.dvdArray[i].y) * scaleFactor) / 2;
                            distance = dist(this.dvdArray[j].x, this.dvdArray[j].y, this.dvdArray[i].x, this.dvdArray[i].y);
                            touching.push([j, i]);
                        }
                        this.elasticCollision(this.dvdArray[i], this.dvdArray[j]);
                    }
                }
            }
        }
        this.display();
    }
    // display the dvds on the page
    display() {
        let pinned = false;
        for(let i in this.pinsArray) {
            if(dist(this.pinsArray[i].x, this.pinsArray[i].y, mouseX, fixY(mouseY)) <= 15 && dist(this.pinsArray[i].x, this.pinsArray[i].y, this.dvdArray[i].x, this.dvdArray[i].y) > this.dvdArray[i].radius + 15/2) {
                pinned = true;
            } else{
                // display pin
                push();
                    fill(252, 186, 3);
                    ellipse(this.pinsArray[i].x, this.pinsArray[i].y, 15, 15);
                pop();
            }
        }

        for(let i in this.dvdArray) {
            if(pinned) {
                // display line between pin and dvd
                if(dist(this.pinsArray[i].x, this.pinsArray[i].y, mouseX, fixY(mouseY)) <= 15 && dist(this.pinsArray[i].x, this.pinsArray[i].y, this.dvdArray[i].x, this.dvdArray[i].y) > this.dvdArray[i].radius + 15/2) {
                    push();
                        stroke(255);
                        strokeWeight(5);
                        line(this.pinsArray[i].x, this.pinsArray[i].y, this.dvdArray[i].x, this.dvdArray[i].y);
                    pop();
                    // display pin
                    push();
                        fill(252, 186, 3);
                        ellipse(this.pinsArray[i].x, this.pinsArray[i].y, 15, 15);
                    pop();
                    // display pinned dvd
                    push();
                        fill(this.dvdArray[i].setOpacity(255));
                        ellipse(this.dvdArray[i].x, this.dvdArray[i].y, this.dvdArray[i].diameter, this.dvdArray[i].diameter);
                    pop();
                } else {
                    // display all other dvds
                    push();
                        fill(this.dvdArray[i].setOpacity(90));
                        ellipse(this.dvdArray[i].x, this.dvdArray[i].y, this.dvdArray[i].diameter, this.dvdArray[i].diameter);
                    pop();
                }
                
            } else{
                // display all dvds
                push();
                    fill(this.dvdArray[i].fill);
                    ellipse(this.dvdArray[i].x, this.dvdArray[i].y, this.dvdArray[i].diameter, this.dvdArray[i].diameter);
                pop();
            }
            
        }
        pinned = false;
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
            dvd.yVelocity = -dvd.yVelocity;
        }
        // bottom of screen
        if(dvd.y <= dvd.radius) {
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
        }

        // left of screen
        if(dvd.x <= dvd.radius) {
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

    addAll(aDvd, aPin) {
        this.addDVD(aDvd);
        this.addPin(aPin);
    }

    // add a new dvd to the dvd array
    addDVD(aDvd) {
        this.dvdArray.push(aDvd);
    }

    // add a new pin to the pin array
    addPin(aPin) {
        this.pinsArray.push(aPin);
    }
}

// bouncing dvd objects
class dvd {
    constructor(x, y, humidity, angle, velocity, temp) {
        this.x = x;
        this.y = y;
        this.temp = temp;
        this.getColor(temp);
        this.getDiameter(humidity);
        this.radius = this.diameter / 2;

        this.angle = angle;
        this.velocity = velocity/3;
        this.mass = 300;

        // isolate the velocity in the x and y directions
        this.xVelocity = velocity * Math.cos(angle * Math.PI / 180);
        this.yVelocity = velocity * Math.sin(angle * Math.PI / 180);
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

    getColor(temp) {
        if(temp < 32) {
            // bluee
            this.fill = color(66, 135, 245, 230);
            return;
        } 
        if(temp < 50) {
            // yellow
            this.fill = color(247, 213, 59, 230);
            return;
        } 
        if(temp < 70) {
            // green
            this.fill = color(66, 245, 114, 230);
            return;
        } 
        // pink
        this.fill = color(242, 58, 138, 230);
        return;
    }

    setOpacity(opacity) {
        let temp = this.temp;
        if(temp < 32) {
            // bluee
            return color(66, 135, 245, opacity);
        } 
        if(temp < 50) {
            // yellow
            return color(247, 213, 59, opacity);
        } 
        if(temp < 70) {
            // green
            return color(66, 245, 114, opacity);
        } 
        // pink
        return color(242, 58, 138, opacity);
    }

    getDiameter(humidity) {
        if(humidity < 60) {
            this.diameter = 70;
            return;
        } 
        if(humidity < 70) {
            this.diameter = 100;
            return;
        } 
        if(humidity < 90) {
            this.diameter = 150;
            return;
        } 
        this.diameter = 200;
        return;
    }
}

// pin for the location
class pin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let allDVDs = new dvds;