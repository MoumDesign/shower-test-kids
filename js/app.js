
var duration;
var interval;
function timeinterval(){
	
	// sound.fade(1.0, 0.0, interval * 1000);
	if (interval < 0.015){
		sound.play();
		stopSound.play();
		document.body.classList.add('pause');
	} else {
		sound.play();
		document.body.classList.add('blink');
		setTimeout(function(){
			document.body.classList.remove('blink');
		}, 250);
		setTimeout(timeinterval, interval * 0.9 * 1000);
		interval = interval / 1.618;	
	}
}

document.addEventListener('click', startInterval, false);

function startInterval(){
	initTimer(30);
	document.removeEventListener('click', startInterval, false);		
}


function initTimer(dur) {
	duration = dur;
	interval = dur / 3;
	timeinterval();
}


var sound = new Howl({
  src: ['../assets/singing-bowl-gong.mp3'],
  autoplay: false,
  volume: 1.0
});

var stopSound = new Howl({
  src: ['../assets/stop-bowl.m4a'],
  autoplay: false,
  volume: 1.0
});