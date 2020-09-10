
var timeleft = 0;
var timeleftInterval;
var currentScene;
var speech = new SpeechSynthesisUtterance();
speech.rate = 0.8;
setVoice("Samantha");

var queue = [
	{ "type" : "pause",
		"title" : "Intro",
		"speech" : "Welcome. I'm glad you made it to this MeScapes Shower Practice. When you hear the first chime it's time to turn on the shower and soak your body. And when you hear chimes again you've got 5 seconds to turn it back off.",
		"duration" : 30,
		"background" : "radial-gradient(closest-side, #ffcf7c 58.4%, #ffb430 100%, #fca100);"
	},
	{ "type" : "water",
		"title" : "Soak",
		"speech" : "Okay. It's time to turn on the water for 60 seconds.",
		"duration" : 60,
		"background" : "radial-gradient(closest-side, #ff9e7c 58.4%, #ff6530 100%, #fc6100);"
	},
	{ "type" : "pause",
		"title" : "Soap",
		"speech" : "Good job. I hope you are all soaked by now, because now it's time to soap your body.",
		"duration" : 30,
		"background" : "radial-gradient(closest-side, #ffcf7c 58.4%, #ffb430 100%, #fca100);"
	},
	{ "type" : "water",
		"title" : "Wash",
		"speech" : "Time to rinse away all stress for 90 seconds. Turn the water back on.",
		"duration" : 90,
		"background" : "radial-gradient(closest-side, #ff9e7c 58.4%, #ff6530 100%, #fc6100);"
	},
	{ "type" : "pause",
		"title" : "Dry",
		"speech" : "Good. Now it's time to get dry and go to bed. Hope you enjoyed it.",
		"duration" : 0,
		"background" : "radial-gradient(closest-side, #ffcf7c 58.4%, #ffb430 100%, #fca100);"
	}
];
queue.reverse();

var duration;
var interval;
function timeinterval(){
	
	// sound.fade(1.0, 0.0, interval * 1000);
	if (interval == 0) { //if dry mode
		playNextScene();
	}
	else if (interval < 1.1){
		sound.play();
		stopSound.play();
		playNextScene();
	} else {
		sound.play();
	
		document.querySelector('.bg').classList.add('blink');
		setTimeout(function(){
			document.querySelector('.bg').classList.remove('blink');
		}, 400);	
		
		setTimeout(timeinterval, (interval-1) * 1000);
		interval = Math.pow(interval,1/1.5);	
	}
}


[].forEach.call(document.querySelectorAll('.btn'), function(btn){
	btn.addEventListener('click', btnListener, false);	
});

function btnListener(e){
	if (e.currentTarget.dataset.action == "start") {
		startInterval();
	} else if (e.currentTarget.dataset.action == "playChime") {
		playChime();
	} else {
		document.querySelector('.modal:not(.hide)').classList.add('hide');
		document.querySelector(e.currentTarget.dataset.action).classList.remove('hide');
	}
}

function startInterval() {
	speech.text = " ";
	speechSynthesis.speak(speech);
	document.querySelector('.modal:not(.hide)').classList.add('hide');
	document.body.classList.add('playing');

	playIntro();
	// setTimeout(function(){initTimer(30)},6000);
}




function initTimer(dur) {

	duration = dur;
	interval = 5;
	if (duration){
			playChime();
			setTimeout(playRepeatingChime,(dur-interval+1) * 1000);
	}
	
	
	timeleft = dur;

	timeleftInterval = setInterval(timeleftUpdate,1000);

	
}

function timeleftUpdate(){
	if (timeleft) {
		document.querySelector('.scene--time-left').innerText = timeleft;
		timeleft--;
	} else {
		document.querySelector('.scene--time-left').innerText = '';
		clearInterval(timeleftInterval);
	}
}


var sound = new Howl({
  src: ['assets/vibra.mp3'],
  autoplay: false,
  volume: 1.0
});

var stopSound = new Howl({
  src: ['assets/stop-bowl.m4a'],
  autoplay: false,
  volume: 1.0
});

function playIntro(){

	if (queue.length >= 1){
		currentScene = queue.pop();
		document.querySelector('.bg').setAttribute('style', 'background: ' + currentScene.background + ';');
		document.querySelector('.bg').classList.add('low');
		document.querySelector('.scene--title').innerText = currentScene.title;
		setTimeout(function(){
			
			speech.text = currentScene.speech;
			speech.onend = function(){
				document.querySelector('.bg').classList.remove('low');
				setTimeout(playNextScene,1500);
			}
			speechSynthesis.speak(speech);

			
		},2000);
	}
	
}



function playNextScene(){


	if (queue.length >= 1){

		currentScene = queue.pop();
		document.querySelector('.bg').setAttribute('style', 'background: ' + currentScene.background + ';');
		document.querySelector('.bg').classList.add('low');
		
		clearInterval(timeleftInterval);
		timeleft = currentScene.duration;
		timeleftUpdate();	
		document.querySelector('.scene--title').innerText = currentScene.title;

		setTimeout(function(){
			
			speech.text = currentScene.speech;
			speech.onend = function(){
				initTimer(currentScene.duration);
			}
			speechSynthesis.speak(speech);
			
		},2500);
	}
	
}

function playRepeatingChime(){
	playChime();

	setTimeout(playChime, 1 * 1000);
	setTimeout(playChime, 2 * 1000);
	setTimeout(playChime, 2.5 * 1000);
	setTimeout(playChime, 3.0 * 1000);
	setTimeout(playChime, 3.5 * 1000);
	setTimeout(playEndChime, 4 * 1000);
	// setTimeout(playChime, 4.0 * 1000);
	// setTimeout(playChime, 4.5 * 1000);
	// setTimeout(playChime, 4.75 * 1000);
	// setTimeout(playEndChime, 5 * 1000);

}

function playChime(){
	sound.play();
	
		document.querySelector('.bg').classList.add('blink');
		setTimeout(function(){
			document.querySelector('.bg').classList.remove('blink');
		}, 400);	
}

function playEndChime(){
	playChime();
	stopSound.play();
	playNextScene();
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