
// This is the initialization command to initialize a session
var initCmd = function initCmd(hub) {
  return hub.baseUrl + 'v1/init_session?Priority=1000';
};

// GET request to close the session
var closeCmd = function closeCmd(hub) {
  return hub.baseUrl + 'v1/close_session?SessionID=' + hub.SessionID;
};

// GET request to get the list of devices
var devListCmd = function devListCmd(hub) {
  return hub.baseUrl + 'v1/deviceList?SessionID=' + hub.SessionID;
};

// GET request to add a device to the session
var addDevCmd = function addDevCmd(hub) {
  return hub.baseUrl + 'v1/add_device_to_session?SessionID=' + hub.SessionID + '&DeviceID=' + hub.DeviceID;
};

// GET request to remove a device from the session
var remDevCmd = function remDevCmd(hub, remList) {
  return hub.baseUrl + 'v1/remove_device_from_session?SessionID=' + hub.SessionID + '&DeviceID=' + remList;
}

// GET request to get the list of media associated with the session
var mediaListCmd = function mediaListCmd(hub) {
  return hub.baseUrl + 'v1/media_list?SessionID=' + hub.SessionID;
};

// GET request to start playing a song based on its persistent ID in the media list
var playCmd = function playCmd(hub, songID) {
  return hub.baseUrl + 'v1/play_hub_media?SessionID=' + hub.SessionID + '&PersistentID=' + songID;
};

// GET request to stop playing
var stopCmd = function stopCmd(hub) {
  return hub.baseUrl + 'v1/stop_play?SessionID=' + hub.SessionID;
};

// GET request to play streaming media
var streamCmd = function streamCmd(hub, mediaUrl) {
  return hub.baseUrl + 'v1/play_web_media?SessionID=' + hub.SessionID + '&MediaUrl=' + mediaUrl;
};

// GET request to set the volume (0 to 50)
var setVolumeCmd = function setVolumeCmd(hub, vol) {
  return hub.baseUrl + 'v1/set_volume?SessionID=' + hub.SessionID + '&Volume=' + vol + '&DeviceID=' + hub.DeviceID;
};

module.exports = {
  initCmd:initCmd,
  closeCmd:closeCmd,
  devListCmd:devListCmd,
  addDevCmd:addDevCmd,
  remDevCmd:remDevCmd,
  mediaListCmd:mediaListCmd,
  playCmd:playCmd,
  stopCmd:stopCmd,
  streamCmd:streamCmd,
  setVolumeCmd:setVolumeCmd
};


