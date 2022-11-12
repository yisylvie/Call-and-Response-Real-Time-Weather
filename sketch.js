// long = x with a range of -180 to 180
// lat = y with a range of -90 to 90
let geoApi="http://api.openweathermap.org/geo/1.0/direct?q=";

let weather;
let lat;
let lon;
let api="https://api.openweathermap.org/data/2.5/weather?";
let city="St Louis";
let APIkey="&appid=57dad3c0573f350a6d2e4de20f81c262";
let units="&units=imperial";

function setup() {
  createCanvas(360, 180);
  input=select('#city');
  let button=select('#submit');
  // button.mousePressed(geoAsk);
  // button.keyPressed(weatherAsk);
}

function geoAsk(){
  let url = geoApi+input.value()+APIkey;
  loadJSON(url, gotLatData);   
}

// check if x y coordinates are in the bounds of the page
function inBound(x, y) {
  return y <= 90 && y >= -90 && x <= 180 && x >= -180;
}

function mouseClicked() {
  // let url = geoApi+input.value()+APIkey;
  let y = (mouseY - height/2);
  let x = (mouseX - width/2);
  lat = "lat=" + y;
  lon = "&lon=" + x;
  let url = api+lat+lon+APIkey+units;
  console.log(lat);
  console.log(lon);
  if(inBound(x,y)) {
    loadJSON(url, gotWeatherData);   
  }
}

function gotLatData(data){
  console.log(data);
  // lat = "lat=" + data[0].lat;
  // log = "&lon=" + data[0].lon;
  // lat = "lat=" + 20;
  // log = "&lon=" + 180;
  url = api+lat+lon+APIkey+units;
  console.log(url);
  loadJSON(url, gotWeatherData);
}

function gotWeatherData(data) {
  weather = data;
  console.log(weather);
}

function draw() {
  translate(width/2, height/2); 
  // rectMode(CENTER);
  rect(-180,-90,360,180);
  if (weather != null && weather != undefined){
    let temp = weather.main.temp;
    let humidity = weather.main.humidity;
    let wind = weather.wind.speed
    
    stroke(100, 100, 240);
    ellipse(width/2, height/2, temp, temp);
    noFill();
    stroke(200, 200, 0);
    ellipse(width/2, height/2,humidity*2,  humidity*2);
    
    stroke(255, 255, 55);
    ellipse(width/2, height/2,wind*2,  wind*2);
  }
}