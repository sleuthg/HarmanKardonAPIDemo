var sensors = require('./sensors.js');

//// Variables from the Media-Tek Device
//var sensorData = {
//  "temperature":32,  // Celsius
//  "humidity":50,     // Percentage
//  "brightness":1,    // 0: dark, 1: light
//  "gps":[28,160,10]  // Lat (degrees), Long (degrees), Alt (m)
//};

sensors.getSongIdx().then(function(songIdx) {
  console.log(songIdx);
});

