# Harman/Kardon Hup App Simple API and Demo
API and demo to work with Harman-Kardon Web Hub App

## Install
```
npm install harman-kardon-hubapp-api
```

## Usage
The library provides functions to generate RESTful API endpoints. Some values set below were specific to the 
hackathon event from which this library was built; you will need to get these values (see the demo video referenced 
in the Description below).
```
var hk = require('harman-kardon-hubapp-api');
var request = require('request');

var hub = {                              // Harman/Kardon Hub Variables
  "SessionID":"1000",                    // Default value of the SessionID
  "DeviceID":"2586126661808",            // This was the DeviceID of the device we used at our Hackathon
  "PersistentID":"7180490900718530992",  // This was the PersistentID of the first song in our media list 
  "baseUrl":'http://10.0.1.9:8080/'      // This was the URL assigned when opening the Hub app on our iPhone
};

request(hk.initCmd(hub), function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
    hub.SessionID = JSON.parse(body).SessionID;   // resets the SessionID based on initialization call
  }
  
  // ... continue with other RESTful API calls ...
}
```

## Description
This api and demo was built for an ATT Hackathon in San Diego in October 2015. One of the vendors
participating in the demo was Harman/Kardon. Harman/Kardon provided wi-fi enabled speakers (specifically
the Omni10) to hackers to see what kinds of cool things could be accomplished using their APIs and SDKs. 
There was a RESTful API accessible via the HKWebHubApp, as well as Android and iOS APIs.  My team chose to
utilize the HKWebHub App for "quick-and-dirty" hacking.  We recommend going this route to get started, because
it took us less than an hour to get it working initially.  (Note: As of this writing, you must have an iOS device to use the 
HKWebHubApp).

Register as a developer:
http://developer.harman.com/site/global/home/p_home.gsp

Here's a link to find the HKWebHub App (near the bottom):
http://developer.harman.com/site/global/developer_tools/sample_apps/index.gsp

Here's a link to the developer tools (check out the WebHub App Demo video first!):
http://developer.harman.com/site/global/developer_tools/wirelesshd_sdk_overview/index.gsp

## Demos
You will need to tinker with a few parameters and setting to get these demos set up for your needs.  They are mostly
just here to give you an idea of how to use the library.

### Sensors Demo
This demo was built to modify the song being played and adjust the volume dependent on sensor inputs posted to a 
server.  You should be able to run it with `liveDemo=false`.  It demonstrates many of the things you would need to do
to get up and running.
```
node runDemo.js
```

### Volume Control Demo
This demo was built when debugging how to use the volume control REST-ful API calls
```
node test_volume_control.js
```

## Troubleshooting tips
If you run into problems, console.log the commands that the library is generating and try running them from a curl
statement or from the browser. It helped me find typos and peculiarities of the interface. Here's an example:
```
console.log(hk.setVolumeCmd(hub,vol));
```