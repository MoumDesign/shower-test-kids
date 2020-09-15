
var timeLeft = 0; // timeleft for the countdown timer
var timeLeftInterval;
var currentPhase;
var scene;

/* set up the text to speech engine */
var speech = new SpeechSynthesisUtterance();
speech.rate = 0.8;
speech.lang = 'en-US';
setVoice("Samantha");


/* load all sounds */

var chime = new Howl({
  src: ['assets/vibra.mp3'],
  autoplay: false,
  volume: 1.0
});

var endChime = new Howl({
  src: ['assets/stop-bowl.m4a'],
  autoplay: false,
  volume: 1.0
});

/* ~~ Scene handler ~~ */

/* prepare for scene to be played */
function initScene() {

	speech.text = " ";
	speechSynthesis.speak(speech); // workaround for allowing us to use text to speech at a later stage without needing another click event
	
	document.querySelector('.modal:not(.hide)').classList.add('hide'); // hide current view
	document.body.classList.add('playing'); // present sceneview
	
	fetch("scene.json") // load scene data
	  .then(response => response.json())
	  .then(json => playScene(json));
}


function playScene(json){
	scene = json.queue;
	scene.reverse();
	playNextPhase();
}

function playNextPhase(){
	if (scene.length >= 1){ // if there are more phases to be played
		currentPhase = scene.pop();
		presentPhase();
		setTimeout(speakAndStartTimer, 2.5 * 1000); // wait 2.5 seconds before speaking and going into next phase to prevent the sound of water disturbing
	} else {
		presentEnding();
	}
}

function presentPhase(){
	document.querySelector('.bg').setAttribute('style', 'background: ' + currentPhase.background + ';');
	document.querySelector('.bg').classList.add('low');
	document.querySelector('.scene--title').innerText = currentPhase.title;
	
	if (currentPhase.type !== "intro"){
		/* reset countdown timer for new phase */
		clearTimeleftInterval();
		timeLeft = currentPhase.duration;
		timeLeftUpdate();	
	}
}

/* transition to ending message */
function presentEnding(){
	document.body.classList.remove('playing');
	document.querySelector('.bg').classList.remove('low');
	setTimeout(function(){
		document.querySelector('.thanks--msg').classList.remove('hide');
	}, 2000);
}

/* Speaks the phase text and then starts the timers */
function speakAndStartTimer(){
	speech.text = currentPhase.speech;
	speech.onend = function(){
		if ( currentPhase.type === "intro"){ // go straight to next scene if intro
			document.querySelector('.bg').classList.remove('low');
			setTimeout(playNextPhase, 1.5 * 1000);
		} else { // else start the timer and phase
			startTimer(currentPhase.duration);	
		}
	}
	speechSynthesis.speak(speech);
}

/* Initiate and starts all timers */
function startTimer(duration) {
	playChime(); // plays tune for phase beginning
	setTimeout(playRepeatingChime,(duration - 10) * 1000); // schedules ending chimes to play 10 seconds before phase ends.
	setTimeout(playNextPhase, duration * 1000); // schedules to play next phase after the phase is over 
	
	/* initiating countdown timer, that updates on the screen every second */
	timeLeftInterval = setInterval(timeLeftUpdate,1000);

}
	
function timeLeftUpdate(){
	if (timeLeft) {
		document.querySelector('.scene--time-left').innerText = timeLeft;
		timeLeft--;
	}
}
function clearTimeleftInterval(){
	document.querySelector('.scene--time-left').innerText = '';
	clearInterval(timeLeftInterval);
}


/* ~~ Sound handling ~~ */

/* Repeating sound that gets played in the end */
function playRepeatingChime(){
	playChime();
	setTimeout(playChime, 3     * 1000);
	setTimeout(playChime, 5     * 1000);
	setTimeout(playChime, 7     * 1000);
	setTimeout(playChime, 8     * 1000);
	setTimeout(playChime, 9     * 1000);
	setTimeout(playChime, 9.5   * 1000);
	setTimeout(playEndChime, 10 * 1000);
}

/* playing the chime sound and blinks the screen/light once */
function playChime(){
	chime.play();
	blinkScreen();
}

/* playing the longer end sound together with the regular one when the phase is over */
function playEndChime(){
	playChime();
	endChime.play();
}

/* blinks the screen quickly */
function blinkScreen(){
	document.querySelector('.bg').classList.add('blink');
	setTimeout(function(){
		document.querySelector('.bg').classList.remove('blink');
	}, 400);	
}


/* ~~ Event Handlers ~~ */

[].forEach.call(document.querySelectorAll('.btn'), function(btn){
	btn.addEventListener('click', buttonPress, false);	
});

function buttonPress(e){
	action = e.currentTarget.dataset.action;
	target = e.currentTarget.dataset.target;

	if ( action == "initScene") {
		initScene();
	} else if ( action == "playRepeatingChime") {
		playRepeatingChime();
	} else if ( action == "reloadApp"){
			location.reload();
			return false;
	} else {
		document.querySelector('.modal:not(.hide)').classList.add('hide');
		document.querySelector(target).classList.remove('hide');
	}
}


/* ~~ Helper functions ~~ */

/* choose a specific text to speech voice */
function setVoice(x) {
	var voices = speechSynthesis.getVoices();
	for (var i = 0;i< voices.length;i++){
		if (voices[i].name == x){
			speech.voice = voices[i];
			return true;
		}
	}
}


