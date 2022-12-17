// long = x with a range of -180 to 180
// lat = y with a range of -90 to 90
let geoApi="http://api.openweathermap.org/geo/1.0/direct?q=";

let weather;
let lat;
let lon;
let api="https://api.openweathermap.org/data/2.5/weather?";
let APIkey="&appid=57dad3c0573f350a6d2e4de20f81c262";
let units="&units=imperial";

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
}

// resize canvas and reset reference points when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// change y value to account for canvas flipping
function fixY(y) {
  return -((y)-height);
}

// when you click the map
invisibleMap.on('click', function onMapClick(e) {

  lat = e.latlng.lat;
  lon = e.latlng.lng;
  // used https://gis.stackexchange.com/questions/303300/calculating-correct-longitude-when-its-over-180
  lon = (lon % 360 + 360 + 180) % 360 - 180;
  lat = "lat=" + lat;
  lon = "&lon=" + lon;
  let url = api+lat+lon+APIkey+units;
  let newY = fixY(mouseY);
  let newX = mouseX;
  fetchWeather(url, newX, newY);
});

let jsonData;

// fetch the weather data and add a new dvd based on it
function fetchWeather(url, newX, newY){
    fetch(url, {
      method: "GET"
    })
    .then(res => res.json())
    .then(data => {jsonData = data; console.log(data.coord.lat); createWeather()})
    .catch(error => console.error('Error:',error))

    function createWeather() {
      if(jsonData.main) {
        let dvdSpeed = jsonData.wind.speed;
        let dvdAngle = jsonData.wind.deg;
        let dvdDiameter = jsonData.main.humidity;
        let dvd1 = new dvd(newX, newY, dvdDiameter, dvdAngle, dvdSpeed, jsonData.main.temp);  
        allDVDs.addAll(dvd1, new pin(newX, newY));
      }
    }
}

// stole from https://www.30secondsofcode.org/js/s/rgb-to-hsb 
const RGBToHSB = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

function draw() {
  translate(0, height); 
  // origin at lower left corner
  scale(1,-1);
  noStroke();
  clear();
  allDVDs.update();
}