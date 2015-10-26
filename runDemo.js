// $ node runDemo.js
//
// Runs the Harman/Kardon portion of the demo that my team built at the AT&T Hackathon
// in San Diego in October 2015.
//

var hk = require('./index.js');
var sensors = require('./sensors.js');
var request = require('request');

var liveDemo = false;  // leave set to false to test your setup

// Harman/Kardon Hub Variables
var hub = {
  "SessionID":"1000",                    // Default value of the SessionID
  "DeviceID":"2586126661808",            // This was the DeviceID of the device we used at our Hackathon
  "PersistentID":"7180490900718530992",  // This was the PersistentID of the first song in our media list
  "baseUrl":'http://10.0.1.9:8080/'      // This was the URL assigned when opening the Hub app on our iPhone
};

// The default mode of the Hub app is to communicate with ALL speakers on the local network.  Update this list
// based on finding out the DeviceIDs of any speaker on the network that you do NOT want to use.  It's a very
// kind thing to do, because otherwise you will be colliding with other people testing their speakers.
var remList = '23983452403888,258849645344944,31684328765616,260773555812528';

var mp3Idx = -1;
var vol = -1;
var counter=0;

// http://sampleswap.org/mp3/creative-commons/free-music.php
// You might need to make this list of songs longer depending on the returned JSON from sensors.getControlVars
var mp3s = [
  'http://sampleswap.org/mp3/artist/47459/tylersrevenge_mylostbeat-320.mp3',    // neutral (intro)
  'http://sampleswap.org/mp3/artist/167001/AL3X_Flight-320.mp3',                // happy
  'http://sampleswap.org/mp3/artist/3041/Dagreen_Taken-320.mp3',                // sad
  'http://sampleswap.org/mp3/artist/100312/Voyager-Music_Sanctuary-of-Light-320.mp3'  // sleepy
];

// Function to play streaming music.  The callback is used to create an infinite loop that checks for updates
// every so often (see streamingLoop method).
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

// --- Below is where all the Harmon/Kardon setup happens adn the streaming loop is started --- //

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