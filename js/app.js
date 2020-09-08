var noSleep = new NoSleep();

var currentScene;
var speech = new SpeechSynthesisUtterance();
speech.rate = 0.8;
setVoice("Samantha");

var queue = [
	{ "type" : "water",
		"speech" : "Good evening. I’m glad you made it to this wind down shower practice. When you hear the first chime it's time to turn on the shower and soak your body. When the repeating chimes and light itensifies it's time to turn it off again.",
		"duration" : 90,
		"background" : "radial-gradient(closest-side, #ffcf7c 88.24%, #ffb430 95.8%, #fca100);"
	},
	{ "type" : "pause",
		"speech" : "Good job. I hope you are all soaked by now, because now it's time to soap your body.",
		"duration" : 40,
		"background": "radial-gradient(closest-side, #ff9e7c 88.24%, #ff6530 95.8%, #fc6100);"
	},
	{ "type" : "water",
		"speech" : "Time to rinse away all stress. Turn the water back on.",
		"duration" : 120,
		"background" : "radial-gradient(closest-side, #ffcf7c 88.24%, #ffb430 95.8%, #fca100);"
	},
	{ "type" : "pause",
		"speech" : "Good. Now it's time to get dry and go to bed. Hope you enjoyed it.",
		"duration" : 0,
		"background": "radial-gradient(closest-side, #ff9e7c 88.24%, #ff6530 95.8%, #fc6100);"
	}
];
queue.reverse();

var duration;
var interval;
function timeinterval(){
	
	// sound.fade(1.0, 0.0, interval * 1000);
	if (interval < 0.012){
		sound.play();
		stopSound.play();
		playNextScene();
	} else {
		sound.play();
		if (currentScene.type == "water"){
			document.querySelector('.bg').classList.remove('show');
			document.querySelector('.bg').classList.add('blink');
			setTimeout(function(){
				document.querySelector('.bg').classList.remove('blink');
			}, 400);	
		} else {
			document.querySelector('.bg').classList.remove('show');
			document.querySelector('.bg').classList.remove('blink');
			setTimeout(function(){
				document.querySelector('.bg').classList.add('blink');
			}, 400);
		}
		setTimeout(timeinterval, interval * 1000);
		interval = interval / 1.618;	
	}
}

document.querySelector('.start-practice--btn').addEventListener('click', startInterval, false);

function startInterval(){
	speech.text = " ";
	speechSynthesis.speak(speech);
	noSleep.enable();
	document.querySelector('.welcome--msg').classList.add('hide');
	playNextScene();
	

	// setTimeout(function(){initTimer(30)},6000);
}




function initTimer(dur) {
	duration = dur;
	interval = dur / 2.7;
	timeinterval();
}


var sound = new Howl({
  src: ['assets/singing-bowl-gong.mp3'],
  autoplay: false,
  volume: 1.0
});

var stopSound = new Howl({
  src: ['assets/stop-bowl.m4a'],
  autoplay: false,
  volume: 1.0
});


function playNextScene(){

	if (queue.length >= 1){
		currentScene = queue.pop();
		document.querySelector('.bg').setAttribute('style', 'background: ' + currentScene.background + ';');
		document.querySelector('.bg').classList.add('show');
		setTimeout(function(){
			
			speech.text = currentScene.speech;
			speech.onend = function(){
				initTimer(currentScene.duration);
			}
			speechSynthesis.speak(speech);	
		},2000);
	}
	
}

function setVoice(x) {
	var voices = speechSynthesis.getVoices();
	for (var i = 0;i< voices.length;i++){
		if (voices[i].name == x){
			speech.voice = voices[i];
			return true;
		}
	}
}