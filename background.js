var spotifyUrlRegExp = "https://open.spotify.com/*";
var spotifyUrl = "open.spotify.com";
var addTitleText = "Spotify";

function checkTabs(tabId, changeInfo, tab) {
	if(tab.url.includes(spotifyUrl) && tab.audible){
		var actionExecuted = false;
		console.log("Inspect Spotify tab change.", tab.title);
		if(tab.title.includes(addTitleText)){
			if(!tab.mutedInfo.muted){
				switchSound(tabId,true);
			}
			actionExecuted = true;
		}
		if(!actionExecuted){			
			chrome.tabs.query({url: spotifyUrlRegExp}, function(tabs) {
				chrome.tabs.query({url: spotifyUrlRegExp}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {action: "getSource"}, function(response) {
						checkAnotherAds(response, tabs[0]);
					});
				});
			});	
		}
	}
};

function switchSound(tabId,muted){
	if(muted){
		chrome.tabs.update(tabId, {muted: true});
		chrome.browserAction.setBadgeText({text: 'ON'});
		chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
	}else{
		chrome.tabs.update(tabId, {muted: false});
		chrome.browserAction.setBadgeText({text: ''});
		chrome.browserAction.setBadgeBackgroundColor({color: '#ffffff'});
	}
}

function checkAnotherAds(source, checkedTab){
	if(source != undefined){
		if(source.includes("control-button--disabled")){
			if(!checkedTab.mutedInfo.muted){
				switchSound(checkedTab.id, true);
			}
		}else if(source.includes("control-button")){
			if(checkedTab.mutedInfo.muted){
				switchSound(checkedTab.id,false);
			}
		}
	}
}

function checkStateChanges(request,sender,sendResponse){
    if( request.action === "StateChange" ){
        activateMute = localStorage.getItem("activateMutedFunction");
		if(activateMute === "true"){
			chrome.tabs.onUpdated.addListener(checkTabs);		
		}else{
			chrome.tabs.onUpdated.removeListener(checkTabs);	
		}
    }
}

function sendAction2Spotify(playerAction){
	chrome.tabs.query({url: spotifyUrlRegExp}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action: playerAction}, null);
	});	
}

chrome.commands.onCommand.addListener(function(command) {
	if (command === 'spotify-pause-key'){
		console.log("Command Pause");
		sendAction2Spotify("pausePlayer");
	}else if(command === 'spotify-resume-key'){
		console.log("Command Play");
		sendAction2Spotify("playPlayer");
	}else if(command === 'spotify-forward-key'){
		console.log("Command Forward");
		sendAction2Spotify("forwardPlayer");
	}
});

async function start() {
	activateMute = localStorage.getItem("activateMutedFunction");
	if(activateMute === "true"){
		chrome.tabs.onUpdated.addListener(checkTabs);		
	}
	chrome.runtime.onMessage.addListener(checkStateChanges); 
}
start();