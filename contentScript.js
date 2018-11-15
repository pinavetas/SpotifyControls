var isButtonAutoclicked = false;

function responseMessages(request, sender, sendResponse) {
	if( request.action === "getSource"){
		var forwardButton = document.getElementsByClassName("spoticon-skip-forward-16");		
		sendResponse(forwardButton[0].outerHTML);
	}else if( request.action === "pausePlayer"){
		var pauseButton = document.getElementsByClassName("spoticon-pause-16");
		isButtonAutoclicked =true;
		pauseButton[pauseButton.length -1].click();		
	}else if( request.action === "playPlayer"){
		var playButton = document.getElementsByClassName("spoticon-play-16");
		isButtonAutoclicked =true;
		playButton[playButton.length -1].click();
	}else if( request.action === "backPlayer"){
		var backButton = document.getElementsByClassName("spoticon-skip-back-16");
		isButtonAutoclicked =true;
		backButton[backButton.length -1].click();
	}else if( request.action === "forwardPlayer"){
		var forwardButton = document.getElementsByClassName("spoticon-skip-forward-16");
		isButtonAutoclicked =true;
		forwardButton[forwardButton.length -1].click();
	}
}

chrome.runtime.onMessage.addListener(responseMessages);

var playButtons = document.getElementsByClassName("spoticon-play-16");
for (var i = 0; i < playButtons.length; i++) {
	 playButtons[i].addEventListener('click', function() {
		if(isButtonAutoclicked){
			isButtonAutoclicked = false;
		}else{
			chrome.runtime.sendMessage({action: "ManualPlayerClick"},null);
		}
	}, false);
}

