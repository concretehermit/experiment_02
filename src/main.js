// set some global variables
let weather = []
let weatherData
let minLng
let maxLng
let minLat
let maxLat

//This function maps one range of numers to anoter 
function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

// load in data from json
function preload(){
  weatherData = 'http://api.openweathermap.org/data/2.5/group?id=2643743,3333229,3333169,2655603,3333231,3333164,2657830,7290598,2644668,2656173,3333134,3333174,3333181,3333167,3333142,3333139,3333212,3333223,2633351,3333178&units=metric&APPID=5f93126ff05b201ddb419615645dd6eb'
  weatherData = loadJSON(weatherData)
}

// setup canvas
function setup(){
  const canvas = createCanvas(800, 800)
  canvas.parent('container')
  angleMode(DEGREES)
  // get minimum and maximum variables to convers lattituda and longitude into pixel positions
  minLng = Math.min.apply(Math, weatherData.list.map(function(v) {
    return v.coord.lon;
  }));

  maxLng = Math.max.apply(Math, weatherData.list.map(function(v) {
    return v.coord.lon;
  }));

  minLat = Math.min.apply(Math, weatherData.list.map(function(v) {
    return v.coord.lat;
  }));

  maxLat = Math.max.apply(Math, weatherData.list.map(function(v) {
    return v.coord.lat;
  }));

  // Draw static map locations
  // for (let i = 0; i < weatherData.list.length; i ++) {
  //   let point = weatherData.list[i]
  //   weather[i] = new WeatherPoint(point)
  // }

}

function draw(){
  background(0)
  // Orientate and fit the 'map'
  scale(0.8)
  rotate(-70)
  translate(-750, 250)

  // Draw the map points and run update to animate
  for (let i = 0; i < weatherData.list.length; i ++) {
    let point = weatherData.list[i]
    weather[i] = new WeatherPoint(point)

    let latitude = weatherData.list[i].coord.lat
    let longitude = weatherData.list[i].coord.lon
    // convert the range of lat and lng to canvas width and height
    let lat = convertRange(latitude, [minLat, maxLat], [0, width])
    let lng = convertRange(longitude, [minLng, maxLng], [0, height])

    weather[i].display(lat, lng)
    weather[i].update(lat, lng)
  }
}

function WeatherPoint(rain) {
  // Setup map point information
  this.name = rain.name
  this.humid = rain.main.humidity
  this.scale = random(this.humid);

  this.display = function(lat, lng) {
    push()
      let x = map(lat, 0, width, 0, width)
      let y = map(lng, 0, height, 0, height)

      stroke(255, 255, 255)
      noFill()
      ellipse(x, y, this.humid, this.humid)
      // text(this.name, x, y)
    pop()
  }

  this.update = function(lat, lng) {
    push()
      x = map(lat, 0, width, 0, width)
      y = map(lng, 0, height, 0, height)
      ellipse(x, y, this.scale, this.scale)
    pop()
  }
}