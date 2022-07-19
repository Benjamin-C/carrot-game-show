//  let gridAns = ["This", "Is", "some", "text", "that i", "will want", "to find out", "what will happen", "if i were to put", "way too much text in one box and it had to overflow"];
//  let gridScore = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]

// Should probably be updated to generate this from the web url
const baseURL = 'http://mccreas.us:33543/node?use=gameshow';

// Unused
function matchRule(str, rule) {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

// The load function for if the client is a player
let playerFunc = function() {
	console.log("Player launching");
	document.getElementById("table").innerHTML = "<h1>Something has gone wrong. You should not have gotten here. Please launch the controller first.</h1>";
	let go = false;
	if (window.opener != null) {
		go = window.opener.popupReady();
	}
	// Why is this commented out, shouldn't it still exist?
	// window.onUnload = Function() {
	//   window.opener.popupClosed();
	// }
}

// The load function for if the client is a controller
let controlFunc = function() {
	console.log("Launghing");
	document.title = "Control BenGameShow";
	document.getElementById("topnav").innerHTML = "<input id=\"fadebox\" type=\"checkbox\">Fade</input><input type=\"file\" id=\"files\" style=\"display: none;\" /><input class=\"button\" type=\"button\" value=\"Pick some questions\" onclick=\"document.getElementById('files').click()\" />" + " or " + "<input class=\"button\" type=\"button\" value=\"Load from cache\" onclick=\"handleCacheSelect()\" />" + " or " + "<input type=\"file\" id=\"videos\" style=\"display: none;\" /><input class=\"button\" type=\"button\" value=\"Pick a video\" onclick=\"document.getElementById('videos').click()\" />" + " or " + "<input type=\"file\" id=\"images\" style=\"display: none;\" /><input  class=\"button\" type=\"button\" value=\"Pick an Image\" onclick=\"document.getElementById('images').click()\" />" + " or " + "<input class=\"button\" type=\"button\" value=\"Blank\" onclick=\"prepareBlank()\" />&nbsp&nbsp&nbsp";//<button onClick=\"openNetworkSettings()\">Online Settings</button>"; Online settings is disabled for now
	document.getElementById('files').addEventListener('change', handleFileSelect, false);
	document.getElementById('videos').addEventListener('change', handleVideoSelect, false);
	document.getElementById('images').addEventListener('change', handleImageSelect, false);

	document.getElementById("table").innerHTML = "<h1>Pick some questions!</h1><input type=\"file\" id=\"sfiles\" name=\"files[]\"/><h1>Load from cache!</h1><input type=\"button\" value=\"Load\" onclick=\"handleCacheSelect()\" /><h1>Play a video</h1><input type=\"file\" id=\"svideos\" name=\"videos[]\"/><h1>Or start a blank game</h1>W:<input id=\"inw\" class=\"numbox\"/>H:<input id=\"inh\" class=\"numbox\"/>T:<input id=\"int\"/><button onclick=\"startnew()\">Go</button>";
	for (i = 0; i < args.length; i++) {
		let str = args[i];
		let spt = str.split("=");
		if (spt[0] == "q") {
			prepareFromFile(spt[1]);
		} else if (spt[0] == "f") {
			prepareFromFile(window.location.origin + "/" + spt[1]);
		}
	}
	document.getElementById('sfiles').addEventListener('change', handleFileSelect, false);
	document.getElementById('svideos').addEventListener('change', handleVideoSelect, false);
}
let blankFunc = function() {
	document.getElementById("table").innerHTML = "";
}

// Game modes to determine what type of conetnt should be shown
const MyModes = {
	GAME: 'game',
	ANS: '1answer',
	VIDEO: 'video',
	IMAGE: 'image',
	BLANK: 'blank'
}

// The current game mode
let myMode = MyModes.GAME;

// The location where the video (possibly also image) is found
let videoloc;

// The playfield where all aspects of the game are stored
let playfield = new Object();
playfield.questions = new Array();
playfield.width = 2;
playfield.height = 5;
playfield.title = "GameShow";
playfield.biganswer = false;
playfield.squarebox = false;
playfield.teams = []
playfield.currentbig = -1;
playfield.showScore = 1;

// The second screen presentation window
let gamePanel;
// If the presentation window is open and ready to be drawn to
let gamePanelOpen = false;

// Waiting for all required windows to open
let waiting = true;
let meWaiting = true;

// The number of Xs to be shown next time (for family fued style games)
let nextx = 1;

// ??? If the next view transition should be a fade
let nextFadeMode = false;

// The name for the cookie storing a backup of the current game
let backup_name = "backup-game";

// URL paramaters, maybe should be parsed by the browser?
let args = window.location.toString().split('?').pop().split("&");

// ??? If the color settings should be shown on the control speed
let showColorConfig = false;

// Init code

/**
 * @brief    Controller startup.
 */
function initGameshowController() {
	window.onload = controlFunc;
	let setRole = false;
	for (let i = 0; i < args.length; i++) {
		let str = args[i];
		let spt = str.split("=");
		console.log("arg " + spt[0] + " = " + spt[1]);
		if (spt[0] == "role") {
			window.onload = blankFunc;
			if (spt[1] == "player") {
				window.onload = playerFunc;
			} else {
				alert("Invalid role " + spt[1]);
			}
		}
		if (spt[0] == "width") {
			playfield.width = parseInt(spt[1]);
		}
		if (spt[0] == "height") {
			playfield.height = parseInt(spt[1]);
		}
	}
}

// Starts a new game based on the settings in the setting fields
function startnew() {
	playfield.width = parseInt(document.getElementById("inw").value);
	playfield.height = parseInt(document.getElementById("inh").value);
	playfield.title = document.getElementById("int").value
	for (let i = 0; i < (playfield.width * playfield.height); i++) {
		let obj = new Object();
		obj.answer = "";
		obj.points = 0;
		obj.showScore = false;
		obj.unusedcolor = "0000FF";
		obj.usedcolor = "0080FF";
		obj.question = "";
		playfield.questions[i] = obj;
	}
	prepare("blank");
}

/*
 * ██████   ██████   ███████  ██████    █████   ██████   ███████
 * ██   ██  ██   ██  ██       ██   ██  ██   ██  ██   ██  ██
 * ██████   ██████   █████    ██████   ███████  ██████   █████
 * ██       ██   ██  ██       ██       ██   ██  ██   ██  ██
 * ██       ██   ██  ███████  ██       ██   ██  ██   ██  ███████
 */

// Prepres to show a video
function prepareVideo(video) {
	console.log("Prep video")
	openWindow();
	videoloc = video;
	myMode = MyModes.VIDEO;
	meWaiting = true;
	meReady();
}

// Prepares to show an image
function prepareImage(image) {
	console.log("Prep img")
	openWindow();
	videoloc = image;
	myMode = MyModes.IMAGE;
	meWaiting = true;
	meReady();
}

// Prepare to make the screen blank
function prepareBlank() {
	if (mymode = MyModes.GAME) {
		// What's supposed to be here?
	}
	console.log("Prep blank")
	openWindow();
	myMode = MyModes.BLANK;
	meWaiting = true;
	meReady();
}

// Prepares from the game from a provided game file
// Definantly supports online files, but should? also support local files
function prepareFromFile(file) {
	let allText = "";
	let rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status == 0) {
				allText = rawFile.responseText;
				prepare(allText);
			}
		}
	}
	try {
		rawFile.send(null);
	} catch (err) {
		alert("Something went wrong loading the file. Pleas try again, or use a different file");
	}
	console.log(allText);
	return allText;
}

// Prepare the game from a JSON string
function prepare(json) {
	if (json != "blank") {
		if (!loadjson(json)) {
			alert("Invalid file. Please try again");
			console.log(json);
			return false;
		}
	}
	openWindow();
	myMode = MyModes.GAME;
	meWaiting = true;
	meReady();
}

// Needs gameshowStorage.js

/*
 * ███    ███   ██████   ██████   ███████       ███████  ██     ██  ██  ████████   ██████  ██   ██
 * ████  ████  ██    ██  ██   ██  ██            ██       ██     ██  ██     ██     ██       ██   ██
 * ██ ████ ██  ██    ██  ██   ██  █████         ███████  ██  █  ██  ██     ██     ██       ███████
 * ██  ██  ██  ██    ██  ██   ██  ██                 ██  ██ ███ ██  ██     ██     ██       ██   ██
 * ██      ██   ██████   ██████   ███████       ███████   ███ ███   ██     ██      ██████  ██   ██
 * Switch between different view modes
 */

// Pause a video? Where is the video paused? Does this actually do anything?
function pauseVideo() {
	controlGameFade(1, 10);
}

// Fades the game to something
function fadeGame() {
	controlGameFade(0, 500);
}

// Actually does the fade animations
function controlGameFade(opas, time, onDone) {
	if (nextFadeMode == false) {
		if (myMode == MyModes.VIDEO) {
			document.getElementById("fadebutton").innerHTML = "Fade In";
			document.getElementById("pausebutton").innerHTML = "Play";
			gamePanel.$("#myVideo").animate({
				volume: 0,
				opacity: opas
			}, time, function() {
				gamePanel.document.getElementById("myVideo").pause();
				onDone();
			});
		} else {
			gamePanel.$("#game").animate({
				volume: 0,
				opacity: opas
			}, time, onDone);
		}
	} else {
		let tgt = "#game";
		if (myMode == MyModes.VIDEO) {
			document.getElementById("pausebutton").innerHTML = "Pause";
			document.getElementById("fadebutton").innerHTML = "Fade Out";
			gamePanel.document.getElementById("myVideo").play();
			tgt = "#myVideo";
		}
		gamePanel.$(tgt).animate({
			volume: 1,
			opacity: 1
		}, time, onDone);
	}
	nextFadeMode = !nextFadeMode;
}

// Load game from cookies
// Probably shows it now?
function handleCacheSelect() {
	let t = readCookie(backup_name);
	prepare(t);
}

// Load game from loaded file
// Probably shows it now?
function handleFileSelect(evt) {
	console.log("Loading file")
	let files = evt.target.files; // FileList object
	let file = files[0];
	let toret;
	let reader = new FileReader();
	playfield.biganswer = false;
	playfield.squarebox = false;
	reader.onload = (function(theFile) {
		return function(e) {
			prepare(e.target.result);
		};
	})(file);

	// Read in the image file as a data URL.
	reader.readAsText(file);
}

// Loads video from a file
// Probably shows it now?
function handleVideoSelect(evt) {
	console.log("HVS");
	nextFadeMode = false;
	console.log("Loading video");
	let files = evt.target.files; // FileList object
	let file = files[0];
	let toret;
	let reader = new FileReader();
	// alert("file " + URL.createObjectURL(file));
	prepareVideo(URL.createObjectURL(file));
}

// Load an image from a file
// Probably shows it now?
function handleImageSelect(evt) {
	console.log("Loading Image");
	let files = evt.target.files; // FileList object
	let file = files[0];
	let toret;
	let reader = new FileReader();
	// alert("file " + URL.createObjectURL(file));
	prepareImage(URL.createObjectURL(file));
}

// Shows nothing ?now?
function handleBlankSelect(evt) {
	console.log("Loading nothing");
	prepareBlank();
}
