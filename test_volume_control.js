var hk = require('./index.js');
var request = require('request');

// Harman/Kardon Hub Variables
var hub = {
  "SessionID":"1000",                    // Default value of the SessionID
  "DeviceID":"2586126661808",            // This is DeviceID of the device we used at our Hackathon
  "PersistentID":"7180490900718530992",  // This was the PersistentID of the first song in our media list
  "baseUrl":'http://10.0.1.9:8080/'      // This was the URL assigned when opening the Hub app on our iPhone
};

var vol = 10;
//var mp3 = 'http://sampleswap.org/mp3/artist/5101/Peppy--The-Firing-Squad_YMXB-320.mp3';       // Intro Music
var mp3 = 'http://sampleswap.org/mp3/artist/23531/emanon_21seiki-Techno-Shonen-320.mp3';

// Set the volume
var volumeTest = function volumeTest(callback) {
  vol = vol+1;
  console.log(hk.setVolumeCmd(hub,vol));
  request(hk.setVolumeCmd(hub, vol), function (err, res, body) {
    if (!err && res.statusCode == 200) {
      console.log(body);
    }
  });
  if (vol<40) callback();
};

// Volume loop
function volumeLoop(){
  setTimeout(function(){
    volumeTest(volumeLoop);
  }, 1000);
}

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

    // Start streaming a song
    request(hk.streamCmd(hub,mp3), function(err,res,body) {

      // Run the loop to test changing the volume
      volumeTest(volumeLoop);

    });
  });
});