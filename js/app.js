
var timeleft = 0;
var timeleftInterval;
var currentScene;
var speech = new SpeechSynthesisUtterance();
speech.rate = 0.8;
setVoice("Samantha");

var queue = [
	{ "type" : "pause",
		"title" : "Intro",
		"speech" : "Welcome. My team and I are glad you want to be part of this very first Shower test. When you hear the first chime it’s time to turn on the shower and rinse your body. And when you hear the chimes again you’ve got 10 seconds to turn it back off.",
		"duration" : 30,
		"background" : "#ffb430;"
	},
	{ "type" : "water",
		"title" : "Rinse",
		"speech" : "Okay. It’s time to turn on the water for 45 seconds and rinse.",
		"duration" : 45,
		"background" : "#ff6530;"
	},
	{ "type" : "pause",
		"title" : "Soap",
		"speech" : "I hope you managed to rinse, because now it’s time to soap your body.",
		"duration" : 45,
		"background" : "#ffb430;"
	},
	{ "type" : "water",
		"title" : "Rinse",
		"speech" : "Time to rinse for 90 seconds. Turn the water back on and get started.",
		"duration" : 90,
		"background" : "#ff6530;"
	},
	{ "type" : "pause",
		"title" : "Dry",
		"speech" : "Good. Now it’s time to get dry. I think this might have been the first time a robot guided you to shower?",
		"duration" : 0,
		"background" : "#ffb430;"
	}
];
queue.reverse();

var duration;
var interval;


[].forEach.call(document.querySelectorAll('.btn'), function(btn){
	btn.addEventListener('click', btnListener, false);	
});

function btnListener(e){
	sound.stop();
	stopSound.stop();
	if (e.currentTarget.dataset.action == "start") {
		startInterval();
	} else if (e.currentTarget.dataset.action == "playRepeatingChime") {
		playRepeatingChime();
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
	interval = 10;
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
	// setTimeout(playChime, 2 * 1000);
	setTimeout(playChime, 3 * 1000);
	
	setTimeout(playChime, 5 * 1000);


	setTimeout(playChime, 1 * 1000 + 5000);
	setTimeout(playChime, 2 * 1000 + 5000);
	setTimeout(playChime, 2.5 * 1000 + 5000);
	setTimeout(playChime, 3.0 * 1000 + 5000);
	setTimeout(playChime, 3.5 * 1000 + 5000);
	setTimeout(playEndChime, 4 * 1000 + 5000);
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
	if (document.body.classList.contains('playing')) playNextScene();
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