var hk = require('./index.js');
var sensors = require('./sensors.js');
var request = require('request');

var liveDemo = true;

// Harman-Kardon Hub Variables
var hub = {
  "SessionID":"1000",           // Default value
  "DeviceID":"2586126661808",   // This is the value of the device ID at our Hackathon
  "PersistentID":"7180490900718530992",
  "baseUrl":'http://10.0.1.9:8080/'
};

var mp3Idx = -1;
var vol = -1;
var counter=0;

// http://sampleswap.org/mp3/creative-commons/free-music.php
var mp3s = [
  'http://sampleswap.org/mp3/artist/47459/tylersrevenge_mylostbeat-320.mp3',    // neutral (intro)
  'http://sampleswap.org/mp3/artist/167001/AL3X_Flight-320.mp3',                // happy
  'http://sampleswap.org/mp3/artist/3041/Dagreen_Taken-320.mp3',                // sad
  'http://sampleswap.org/mp3/artist/100312/Voyager-Music_Sanctuary-of-Light-320.mp3'  // sleepy
];

//var mp3s = [
//  'http://sampleswap.org/mp3/artist/5101/Peppy--The-Firing-Squad_YMXB-320.mp3',          // Intro Music
//  'http://sampleswap.org/mp3/artist/23531/emanon_21seiki-Techno-Shonen-320.mp3',         // Upbeat
//  'http://sampleswap.org/mp3/artist/4646/vibesbuilderyahoode_Minute-Quantity--320.mp3',  // Erratic beat
//  'http://sampleswap.org/mp3/artist/4646/vibesbuilderyahoode_Minute-Quantity--320.mp3',  // Erratic beat
//  'http://sampleswap.org/mp3/artist/26180/DucK_Classicalised-Dub-320.mp3',               // Classical dub
//  'http://sampleswap.org/mp3/artist/26180/DucK_Classicalised-Dub-320.mp3',               // Classical dub
//  'http://sampleswap.org/mp3/artist/26180/DucK_Classicalised-Dub-320.mp3',               // Classical dub
//  'http://sampleswap.org/mp3/artist/26180/DucK_Classicalised-Dub-320.mp3',               // Classical dub
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3',          // Fun beat
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3',          // Fun beat
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3',          // Fun beat
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3',          // Fun beat
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3',          // Fun beat
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3',          // Fun beat
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3',          // Fun beat
//  'http://sampleswap.org/mp3/artist/36060/ImaginaryNumbers_TheKrishna-320.mp3'           // Fun beat
//];

var streamBasedOnSensors = function(callback) {

  // Get the new song and re-start if it's different than the one playing
  sensors.getControlVars(liveDemo).then(function(controlVars) {
    console.log(controlVars);

    if (mp3Idx !== controlVars.songIdx) { // && !(counter%10)
      mp3Idx = controlVars.songIdx;
      console.log(hk.streamCmd(hub,mp3s[mp3Idx]));
      request(hk.streamCmd(hub, mp3s[mp3Idx]), function (err,res,body) {
        if (!err && res.statusCode == 200) {
          //console.log('Changed song to: ' + mp3s[mp3Idx]);
        } else {
          console.log('Error trying to change the song');
        }
      });
    }
    if (!(counter%2)) { // vol !== controlVars.vol
      vol = controlVars.vol;
      console.log(hk.setVolumeCmd(hub,vol));
      request(hk.setVolumeCmd(hub, vol), function(err,res,body) {
        if (!err && res.statusCode == 200) {
          //console.log('Set volume to: ' + vol);
        } else {
          console.log('Error trying to change the volume');
        }
      });
    }

    counter = (counter + 1);
  });

  callback();
};

// Streaming loop
function streamingLoop(){
  setTimeout(function(){
    streamBasedOnSensors(streamingLoop);
  }, 3000);
}

// remove other devices: 23983452403888, 258849645344944, 31684328765616, 260773555812528
var remList = '23983452403888,258849645344944,31684328765616,260773555812528';

// Initialize the session
request(hk.initCmd(hub), function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
    hub.SessionID = JSON.parse(body).SessionID;
  }

  // Add device to the session
  request(hk.addDevCmd(hub), function(err,res,body) {
    if (!err && response.statusCode == 200) {
      console.log(body);
    }

    request(hk.remDevCmd(hub,remList), function(err,res,body) {
      if (!err && response.statusCode == 200) {
        console.log(body);
      }

      request(hk.setVolumeCmd(hub, 20), function(err,res,body) {
        if (!err && response.statusCode == 200) {
          console.log(body);
        }

        // Start the streaming loop
        streamBasedOnSensors(streamingLoop);
      });
    })
  });
});