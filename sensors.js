
var request = require('request');
var Q = require('q');

// Request end-point.  Fill this in when I know it.
var sensorsUrl = 'http://atthack2015-omt66.c9.io/api/users/user1/latest';

// Local magic variables
var temperatureThresh = 79;  // Fahrenheit
var humidityThresh = 37.2;   // Percentage
var brightnessThresh = 0;    // 0: dark, 1: light
var altThresh = 1000;        // Lat (degrees), Long (degrees), Alt (m)

var minVolume = 30;

// Test sets of sensor data
var sensorTestData = [
  { // 0
    "temperature":temperatureThresh,  // All at (but not above) threshold
    "humidity":humidityThresh,
    "brightness":brightnessThresh,
    "gps":[28,160,altThresh]
  },
  { // 1
    "temperature":temperatureThresh+1,  // Break temperature thresh
    "humidity":humidityThresh,
    "brightness":brightnessThresh,
    "gps":[28,160,altThresh]
  },
  { // 2
    "temperature":temperatureThresh,
    "humidity":humidityThresh+1,         // Break humidity thresh
    "brightness":brightnessThresh,
    "gps":[28,160,altThresh]
  },
  { // 3
    "temperature":temperatureThresh+1,  // Break temperature thresh
    "humidity":humidityThresh+1,         // Break humidity thresh
    "brightness":brightnessThresh,
    "gps":[28,160,altThresh]
  },
  { // 4
    "temperature":temperatureThresh,
    "humidity":humidityThresh,
    "brightness":brightnessThresh+1,      // Break brightness thresh
    "gps":[28,160,altThresh]
  }
];

var testDataIdx = 0;
var songOrder = [0,1,2,4];

// Print sensors data
var printSensorsData = function printSensorsData(sensorsData) {
  console.log('Temp: ' + sensorsData.temperature + ", Hum: " + sensorsData.humidity + ", Brightness: " + sensorsData.brightness + ", Mood: " + sensorsData.mood);
};

// Get the sensors data
var getSensorsData = function getSensorsData(liveDemo) {
  var deferred = Q.defer();
  var sensData;
  if (liveDemo) {
    request(sensorsUrl, function(err,res,body) {
      if (!err && res.statusCode == 200) {
        sensData = JSON.parse(body);
        // console.log(sensData);
        if (sensData.mood == undefined) sensData.mood = {level:3};
        S = {
          "temperature":Number(sensData.temperature.val),
          "humidity":Number(sensData.humidity.replace(/%/g,'')), // mystring.replace(/r/g, '')
          "brightness":(sensData.brightness == 'dark') ? 0 : 1,
          "gps":[Number(sensData.gps.lat), Number(sensData.gps.lon), Number(sensData.gps.alt)],
          "mood":sensData.mood.level || 0
        };
        printSensorsData(S);
        deferred.resolve(S);
      } else deferred.reject(err);
    });
  } else {  // Debug data
    sensData = sensorTestData[songOrder[testDataIdx]];
    printSensorsData(sensData);
    deferred.resolve(sensData);
    testDataIdx = (testDataIdx+1)%4;
  }
  return deferred.promise;
};

// Function to select the song index
var getControlVars = function getControlVars(liveDemo) {

  var deferred = Q.defer();

  // Get the sensors data
  getSensorsData(liveDemo).then(function(sensorData) {

    songBin = ["0", "0", "0", "0"];
    if (sensorData.temperature > temperatureThresh) songBin[0] = "1";
    if (sensorData.humidity > humidityThresh) songBin[1] = "1";
    if (sensorData.brightness > brightnessThresh) songBin[2] = "1";
    if (sensorData.gps[3] > altThresh) songBin[3] = "1";
    var songIdxFromSensors = parseInt(songBin.reverse().join(''),2);

    var songIdxFromMood = sensorData.mood;

    // Set volume based on something
    vol = minVolume + Math.floor(sensorData.humidity/10);

    var controlVars = {
      songIdx:songIdxFromMood,
      vol:vol
    };

    deferred.resolve(controlVars);
  },function (err) {deferred.reject(err)});

  return deferred.promise;
};

module.exports.getControlVars = getControlVars;
