var spotifyUrlRegExp = "https://open.spotify.com/*";

var muteSwitch = document.getElementById('muteSwitch');
var pauseButton = document.getElementById('pauseButton');
var playButton = document.getElementById('playButton');
var backButton = document.getElementById('backButton');
var forwardButton = document.getElementById('forwardButton');

muteSwitch.checked = localStorage.getItem("activateMutedFunction") === "true";
localStorage.setItem('activateMutedFunction',  muteSwitch.checked);

muteSwitch.addEventListener('click', function() {
    localStorage.setItem('activateMutedFunction',  muteSwitch.checked);
	sendStateChange();
}, false);


function isPlayed(){
	pauseButton.className = 'show';
	playButton.className = 'hide';
	localStorage.setItem('isPlaying',  "true");
}

function isPaused(){
	pauseButton.className = 'hide';
	playButton.className = 'show';
	localStorage.setItem('isPlaying',  "false");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function playerDecision(){
	chrome.tabs.query({url: spotifyUrlRegExp}, function(tabs) {
		console.log(tabs[0].title);
		if(tabs[0].title.includes("Browse - Featured")){
			isPaused();
		}else{
			isPlayed();
		}
	});	
}

function responseMessages(request, sender, sendResponse) {
	if( request.action === "ManualPlayerClick"){
		sleep(1000);
		playerDecision();
	}
}
chrome.runtime.onMessage.addListener(responseMessages);
playerDecision();

pauseButton.addEventListener('click', function() {
	isPaused();
	sendAction2Spotify("pausePlayer");
}, false);

playButton.addEventListener('click', function() {
	isPlayed();
	sendAction2Spotify("playPlayer");
}, false);

backButton.addEventListener('click', function() {
	sendAction2Spotify("backPlayer");
}, false);

forwardButton.addEventListener('click', function() {
	isPlayed();
	sendAction2Spotify("forwardPlayer");
}, false);


function sendAction2Spotify(playerAction){
	chrome.tabs.query({url: spotifyUrlRegExp}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action: playerAction}, null);
	});	
}

function sendStateChange(){
	chrome.runtime.sendMessage({action: "StateChange"},null);
}

