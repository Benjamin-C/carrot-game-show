
/*
 * ██████   ██    ██  ██  ██       ██████
 * ██   ██  ██    ██  ██  ██       ██   ██
 * ██████   ██    ██  ██  ██       ██   ██
 * ██   ██  ██    ██  ██  ██       ██   ██
 * ██████    ██████   ██  ███████  ██████
 * Builds the visible parts of the gameshow
 */
function build() {
	// console.log("Building");
	switch (myMode) {
		// For when the gameshow view window is supposed to be playing videos
		case MyModes.VIDEO: {
			// for this window
			let tbl = "Playing video";
			tbl = tbl + "<button id=\"pausebutton\" onclick=\"pauseVideo()\">Pause</button><button id=\"fadebutton\" onclick=\"fadeGame()\">Fade out</button>";
			document.getElementById("table").innerHTML = tbl;
			let ctlhtml = "";
			document.getElementById("control").innerHTML = ctlhtml;

			// For other window
			let otbl = "<video autoplay class=\"video js-fade fade-out is-paused\" id=\"myVideo\" height=\"100%\"><source src=\"" + videoloc + "\" type=\"video/mp4\">Your browser does not support HTML5 video.</video>";
			gamePanel.document.getElementById("table").innerHTML = otbl;
			gamePanel.document.title = "BenGameShow";
			//document.getElementById('control').innerHTML = "</div><center><table><tr><td><h1 id=\"score\"></h1></td><td><button onclick=\"savejson()\"><h1>Save</h1></button></td></tr></table></center>";
			hideScore();
		}
		break;
	// For when the gameshow view window is suppsoed to be blank
	case MyModes.BLANK: {
		// for this window
		let tbl = "Showing nothing";
		document.getElementById("table").innerHTML = tbl;
		let ctlhtml = "";
		document.getElementById("control").innerHTML = ctlhtml;

		// For other window
		let otbl = "";
		gamePanel.document.getElementById("table").innerHTML = otbl;
		gamePanel.document.title = "BenGameShow";

		hideScore();
	}
	break;
	// For when the gamesnow view window is suppsoed to show an image
	case MyModes.IMAGE: {
		// for this window
		let tbl = "Showing image";
		document.getElementById("table").innerHTML = tbl;
		let ctlhtml = "";
		document.getElementById("control").innerHTML = ctlhtml;

		// For other window
		let otbl = "<img width=\"100%\" src=\"" + videoloc + "\" />";
		gamePanel.document.getElementById("table").innerHTML = otbl;
		gamePanel.document.title = "BenGameShow";
		//document.getElementById('control').innerHTML = "</div><center><table><tr><td><h1 id=\"score\"></h1></td><td><button onclick=\"savejson()\"><h1>Save</h1></button></td></tr></table></center>";
		hideScore();
	}
	break;
	// For when you are actually playing the game
	case MyModes.GAME: {
		$.css // Does this line do anything nice?
		// for this window
		let biga = "";
		if (playfield.biganswer) {
			biga = " Big Answer";
		}
		let biganswerstr = "";
		if (playfield.biganswer) {
			biganswerstr = "checked=\"" + "true" + "\"";
		}
		let squareboxstr = "";
		if(playfield.squarebox) {
			squareboxstr = "checked=\"" + "true" + "\"";
		}
		let showconfigstr = "";
		let cccb = document.getElementById("showconfig");
		if(cccb != undefined) {
			if(cccb.checked) {
				showconfigstr = "checked";
			}
		}
		let tbl = "<h1 id=\"title\">" + playfield.title + biga + "</h1><input id=\"titlebox\" type=\"text\" value=\"" + playfield.title + "\"/><input id=\"bigansbox\" type=\"checkbox\" " + biganswerstr + ">Big Answer</input><input id=\"squareboxbox\" type=\"checkbox\" " + squareboxstr +">Square box</input><button onclick=\"titlechange()\">mod</button><input id=\"showconfig\" type=\"checkbox\" onclick=\"setShowConfig()\" " + showconfigstr + ">Show Config</input><table class=\"gametable\">";
		for (let i = 0; i < playfield.height; i++) {
			tbl = tbl + "<tr>";
			for (let j = 0; j < playfield.width; j++) {
				tbl = tbl + getNewControlTableBox(i + (j * playfield.height));
			}
			tbl = tbl + "</tr>";
		}
		tbl = tbl + "</table>";
		document.getElementById("table").innerHTML = tbl;
		let ctlhtml = "<button onclick=\"openBuzzerMenu()\"><h1>Buzz</h1></button>&nbsp<button onclick=\"openRandomizerMenu()\"><h1>Rand</h1></button>&nbsp<button onclick=\"build()\"><h1>Build</h1></button>&nbsp<button onclick=\"savejson()\"><h1>Save</h1></button>&nbsp";
		ctlhtml = ctlhtml + "<button onclick=\"showXr()\"><h1 style=\"color:#FF0080\">R</h1></button><button id=\"xtb0\" onclick=\"showX(0)\"><h1 style=\"color:#FF0000\">&nbsp&nbsp</h1></button><button id=\"xtb1\" onclick=\"showX(1)\" style=\"background-color:#808080\"><h1 style=\"color:#FF0000\">X</h1></button><button id=\"xtb2\" onclick=\"showX(2)\"><h1 style=\"color:#FF0000\">XX</h1></button><button id=\"xtb3\" onclick=\"showX(3)\"><h1 style=\"color:#FF0000\">XXX</h1></button>";
		document.getElementById("control").innerHTML = ctlhtml;

		// For other window
		gamePanel.document.title = "BenGameShow";
		//document.getElementById('control').innerHTML = "</div><center><table><tr><td><h1 id=\"score\"></h1></td><td><button onclick=\"savejson()\"><h1>Save</h1></button></td></tr></table></center>";
		if(playfield.currentBig !== undefined && playfield.currentBig >= 0) {
			let boxwidth = Math.round($(document).width() );
			let boxheight = Math.round($(document).height() *0.6);
			let box = getNewAnswerTableBox(playfield.currentBig, boxwidth, boxheight);
			gamePanel.document.getElementById("table").innerHTML = "<table><tr>" + box + "</tr></table>";
			gamePanel.document.getElementById("box" + playfield.currentBig).className = "gametd center";
			gamePanel.document.getElementById("text" + playfield.currentBig).className = "center";
			gamePanel.document.getElementById("box" + playfield.currentBig).style.width = (window.innerWidth) + "px";
			gamePanel.document.getElementById("box" + playfield.currentBig).style.height = (window.innerHeight) + "px";
			hideScore();
		} else {
			// Not big answer
			gamePanel.document.getElementById("table").innerHTML = getAnswerTable();
			drawScore();
		}
		// TODO put it here
		cacheGame(); // Save the game to the cache in case something crashes
	}
	break;
	}
}

// Shows or hides the color modification boxes for cleaner view if you are not changing colors
function setShowConfig() {
	showColorConfig = document.getElementById('showconfig').checked;
	for (let i = 0; i < playfield.height; i++) {
		for (let j = 0; j < playfield.width; j++) {
			let num = (i + (j * playfield.height))
			document.getElementById("box" + num + "color").style.display = (showColorConfig) ? "" : "none";
		}
	}
}

function makeConfigCheckbox(id, num, checked, text, func, table) {
	if(func == undefined) {
		func = "looks";
	}
	if(table == undefined) {
		table = true;
	}
	return ((table) ? "<td>" : "") + "<input id=\"" + id + num + "\" type=\"checkbox\" " + ((checked) ? "checked" : "") + " onclick=\"" + func + "(" + num + ")\">" + text + "</input>" + ((table) ? "</td>" : "");
}

// Creates a table element to add to the control table for a specific cell.
// <button onclick=\"myclickkeep(" + num + ")\"><h3>" + (num + 1) + "(" + questions[num].points + "): " + questions[num].answer + "</h3></button>
function getNewControlTableBox_param(num, used) {
	let txt = "<td id=\"box" + num + "\" class=\""
	txt = txt + "gametd"
	if (used) {
		txt = txt + " used";
	}
	// txt = txt + "\" width=\"64\" style=\"background-color:";
	txt = txt + "\" style=\"background-color:#";
	if(playfield.questions[num].highlighted) {
		txt += playfield.questions[num].highlightcolor;
	} else {
		if (used) {
			txt = txt + playfield.questions[num].usedcolor;
		} else {
			txt = txt + playfield.questions[num].unusedcolor;
		}
	}
	txt = txt + "\"><input id=\"ques" + num + "\" type=\"text\" value=\"" + playfield.questions[num].question + "\"/><br/><input id=\"ans" + num + "\" type=\"text\" value=\"" + playfield.questions[num].answer + "\"/><input id=\"pts" + num + "\" class=\"numbox\" type=\"text\" value=\"" + playfield.questions[num].points + "\"/><br/><button id=\"ansbtn" + num + "\" "
	if(playfield.biganswer && playfield.currentBig >= 0 && playfield.currentBig !== num) {
		txt += "class=\"disabledbutton\" disabled ";
	}
	txt += "onclick=\"";
	if(used) {
		if(playfield.currentBig == num) {
			txt = txt + "doneans(" + num + ")\"><h3>Done</h3>";
		} else {
			txt = txt + "hideans(" + num + ")\">" + makeHideButton(num);
		}
	} else { // "doneans(" + num + ")
		// txt += "showQuest(" + num + ")\"><h3>"
		if(playfield.biganswer) {
			if(playfield.currentBig !== num) {
				txt += "showQuest(" + num + ")\"><h3>Show</h3>";
			} else {
				txt += "showAns(" + num + ")\"><h3>Ans</h3>";
			}
		} else {
			txt += "showQuest(" + num + ")\"><h3>Answer</h3>";
		}
	}
	txt += "</button>&nbsp;<button onclick=\"looks(" + num + ")\"><h3>looks</h3></button><br/>"
	txt += makeConfigCheckbox("doth", num, playfield.questions[num].highlighted, "Highlight", "updateHighlight", false);

	let hidestr = "style=\"display:none\"";
	let cccb = document.getElementById("showconfig");
	if(cccb != undefined) {
		if(cccb.checked) {
			hidestr = "";
		}
	}
	txt += "<div id=\"box" + num + "color\" " + hidestr + ">";
	txt += "<center><table><tr>";
	txt += makeConfigCheckbox("dotm", num, playfield.questions[num].showteam, "Show Team");
	txt += makeConfigCheckbox("dosc", num, playfield.questions[num].showScore, "Show Score");
	txt += "</tr><tr>";
	txt += makeConfigCheckbox("dotr", num, playfield.questions[num].randomizable, "Randomizable");
	txt += makeConfigCheckbox("doti", num, playfield.questions[num].isGraphic, "Graphics");
	txt += "</tr><tr>";
	txt += makeConfigCheckbox("dohq", num, playfield.questions[num].hideQ, "Hide Q");
	txt += makeConfigCheckbox("doha", num, playfield.questions[num].hideA, "Hide A");
	txt += "</tr><tr>";
	txt += makeConfigCheckbox("dopq", num, playfield.questions[num].qIsPts, "Q is pts");
	txt += makeConfigCheckbox("dopa", num, playfield.questions[num].aIsPts, "A is pts");
	txt += "</tr></table></center>";
	txt += "Unused color<input id=\"cols" + num + "\" class=\"colbox\" value=\"" + playfield.questions[num].unusedcolor + "\"/><br/>";
	txt += "Used color<input id=\"cold" + num + "\" class=\"colbox\" value=\"" + playfield.questions[num].usedcolor + "\"/><br/>"
	txt += "Highlight color<input id=\"colh" + num + "\" class=\"colbox\" value=\"" + playfield.questions[num].highlightcolor + "\"/><br/>";
	txt += "</td></div>"

	return txt;
}

// Calls the above functoin with the current used state.
// The above does not seem to be used anywher else, so these should maybe be merged
function getNewControlTableBox(num) {
	return getNewControlTableBox_param(num, playfield.questions[num].used);
}

// Gets the HTML table shown on the player viewer display
function getAnswerTable(privileged, doc, vsf) {
	privileged = (privileged === undefined) ? true : privileged;
	doc = (doc === undefined) ? gamePanel : doc;
	vsf = (vsf === undefined) ? 0.6 : vsf;
	// console.log("m:" + privileged);
	let tbl = "<h1 id=\"title\">" + playfield.title + "</h1><table class=\"gametable\">";
	// let boxwidth = Math.round($("#table").width() / playfield.width);
	// let boxheight = Math.round($("#table").height() / playfield.height *0.7);
	let boxwidth = Math.round($(document).width() / playfield.width);
	let boxheight = Math.round($(document).height() / playfield.height *0.6);
	if(playfield.squarebox) {
			let boxSize = Math.min(boxwidth, boxheight);
			boxwidth = boxSize;
			boxheight = boxSize;
	}
	for (let i = 0; i < playfield.height; i++) {
		tbl = tbl + "<tr>";
		let j;
		for (j = 0; j < playfield.width; j++) {
			tbl = tbl + getNewAnswerTableBox(i + (j * playfield.height), boxwidth, boxheight);
		}
		tbl = tbl + "</tr>";
	}
	tbl = tbl + "</table>";
	return tbl;
}

// Gets the text to show in the box. num is the question num. Not sure what the commented stuff is meant to do
function genAnswerTableBoxText(num, boxwidth, boxheight) {//, showans, hide, privileged) {
	let rtxt = '<h1 id=text' + num + '>';
	// if(privileged) {
		// if (!hide) {
	let q = playfield.questions[num];
	console.log(isValidQuestionNum(playfield.currentBig));
	if(playfield.biganswer && num != playfield.currentBig && ((q.used && q.hideA) || (!q.used && q.hideQ))) {
		return rtxt + nbsp(1) + "</h1>";
	} else if(playfield.biganswer && num != playfield.currentBig && ((q.used && q.aIsPts) || (!q.used && q.qIsPts))) {
		return rtxt + q.points + "</h1>";
	} else {
		let txt = ((q.used) ? q.answer : q.question)
		if(q.isGraphic && txt.startsWith("http")) {
			return "<img id=\"text" + num + "\" src=\"" + txt + "\" style=\"width:" + boxwidth + "px;max-height=" + boxheight + "px\">";
		} else {
			// console.log(txt)
			if(txt.startsWith("\\")) {
				txt = txt.substring(1);
			}
			if (q.used) {
				if(q.showScore == true) {
					let team = q.team;
					console.log(team);
					if(q.showteam == true && isValidTeamNum(team)) {
						txt += ' <span style="color:' + playfield.teams[team].forecol + '">[' + q.points + ']</span>';
						// txt += playfield.teams[team].forecol
						console.log(txt);
					} else {
						txt += " [" + q.points + "]"
						console.log(txt);
					}
					// console.log('Score' + num);
				} else {
					// console.log('No score' + num);
				}
			}
			rtxt += txt + '</h1>';
			return rtxt;
		}
	}
}

// Gets the boxes for the abve table
function getNewAnswerTableBox(num, boxwidth, boxheight) {
	let txt = "<td id=\"box" + num + "\" class=\"gametd";
	let q = playfield.questions[num];
	if (q.used) {
		txt += " used";
	}
	txt = txt + "\" width=" + boxwidth + " height=" + boxheight + " style=\"background-color:#";
	if(q.highlighted) {
		txt += q.highlightcolor;
	} else {
		if (q.used) {
			txt += q.usedcolor;
		} else {
			txt += q.unusedcolor;
		}
	}
	txt += "\">" + genAnswerTableBoxText(num, boxwidth, boxheight) + "</td>";
	return txt;
}

// Hides the score display
// Used for blank/image/video/big answers
function hideScore() {
	// document.getElementById("score").innerHTML = "";
	playfield.showScore = false;
	gamePanel.document.getElementById("score").innerHTML = "";
}

// Shows the score display
function showScore() {
	playfield.showScore = true;
	drawScore();
}

function drawScore() {
	var cfg = "";
	var scb = "<table><tr>";
	// Calculate the correct team scores
	calcTeamPoints();
	// console.log(playfield.teams);
	// Display the team scores
	for(let i = 0; i < playfield.teams.length; i++) {
		if(i > 0) {
			cfg += nbsp(1);
			scb += "<td>" + "</td>";
		}
		cfg += createScoreButton(i);
		scb += "<td>" + createScoreLabel(i) + "</td>";
	}
	cfg += nbsp(1) + createScoreButton(-1);
	cfg += nbsp(1) + '<button id="scoreadd" onclick="addNewTeam()" style="color:#FFFFFF; background-color:#222222"><h2>+</h2></button>';
	scb += "</tr></table>";
	document.getElementById("score").innerHTML = cfg;
	if(playfield.showScore) {
		gamePanel.document.getElementById("score").innerHTML = scb;
	}
	updateTeamMenuInnards();
}

// Gets a number of nonbreaking spaces
function nbsp(num) {
	var n = "";
	if(num > 0) {
		for(var i = 0; i < num; i++) {
			n += "&nbsp";
		}
	}
	return n;
}

// Gets the background color of the webpage
function getBackgroundColor() {
	var val = document.body.style.backgroundColor;
	return val;
}

// Creates the score display sections
function createScoreLabel(id) {
	if(id < playfield.teams.length) {
		return "<h1 style=\"border:" + ((id == scoreid) ? playfield.teams[id].forecol : getBackgroundColor()) + "; border-width:5px; border-style:solid; color:" + playfield.teams[id].forecol + "\">&nbsp" + scoreStr + playfield.teams[id].score + "&nbsp</h1>";
	} else {
		return ""
	}

}

// Creates the buttons gamemasters can use to control scores
function createScoreButton(id) {
	if(id >= 0 && id < playfield.teams.length) {
		return "<button id=\"scoreid-" + id + "\" onclick=\"setScoreID(" + id + ")\" style=\"color:" + playfield.teams[id].forecol + "; background-color:" + (	(id == scoreid) ? playfield.teams[id].selcol : playfield.teams[id].backcol) + "\"><h2>" + scoreStr + playfield.teams[id].score + "</h2></button><button id=scorebtn-" + id + "\" onclick=\"openTeamMenu(" + id + ")\" style=\"color:" + playfield.teams[id].forecol + "; background-color:" + (	(id == scoreid) ? playfield.teams[id].selcol : playfield.teams[id].backcol) + "\"><h2>&nbsp" + gear + "&nbsp</h2></button>";
	} else {
		return "<button id=\"scoreid-" + id + "\" onclick=\"setScoreID(" + id + ")\" style=\"color:#FFFFFF; background-color:" + (	(id == scoreid) ? "#444444" : "#222222") + "\"><h2>null</h2></button>";
	}
}

// Sets the currently selected Team
// Should probably check if scores are currently shown before showing them
function setScoreID(id) {
	scoreid = id;
	// for(var iter = 0; iter < score.length; iter++) {
	//   document.getElementById("scoreid-" + iter).style.background = scorecolor[(iter == id) ? 1 : 2][iter];
	// }
	// scorecolor
	drawScore();
}

// Opens the main window, setting up the second (player) display
function openWindow() {
	if (!gamePanelOpen) {
		gamePanel = window.open("bengameshow.html?role=player", null, "status=no,toolbar=no,menubar=no,location=no,titlebar=no"); //height=720,width=1280,
		gamePanelOpen = true;
	} else {
		// Don't need to open the other window multiple times per game
		console.log("Windw open, not doing anything")
	}
}

// Supposed to be called when the popup closes so that it can be handled cleanly
// Currently dones't seem to be called
function popupClosed() {
	gamePanelOpen = false;
}

// Called when the popup is ready to do stuff
function popupReady() {
	if (waiting) {
		waiting = false;
		if (!meWaiting) {
			prepBuild();
		}
		return true;
	}
}

// Called when the main window is ready
function meReady() {
	if (meWaiting) {
		meWaiting = false;
		console.log("Ready " + meWaiting + " " + waiting);
		if (!waiting) {
			prepBuild();
		}
	}
}

// Called once both the main window and the popup are ready
function prepBuild() {
	console.log("prepBuild");
	if (document.getElementById("fadebox").checked) {
		console.log("Fade should happen now");
		nextFadeMode = false;
		controlGameFade(0, 500, function() {
			build();
			controlGameFade(1, 500);
		});
	} else {
		build();
	}
}

/*
 *  █████   ███    ██  ███████  ██     ██  ███████  ██████        ██    ██  ██  ███████  ██     ██
 * ██   ██  ████   ██  ██       ██     ██  ██       ██   ██       ██    ██  ██  ██       ██     ██
 * ███████  ██ ██  ██  ███████  ██  █  ██  █████    ██████        ██    ██  ██  █████    ██  █  ██
 * ██   ██  ██  ██ ██       ██  ██ ███ ██  ██       ██   ██        ██  ██   ██  ██       ██ ███ ██
 * ██   ██  ██   ████  ███████   ███ ███   ███████  ██   ██         ████    ██  ███████   ███ ███
 */

function makeHideButton(num) {
	let ansteam = playfield.questions[num].team;
	let color = (ansteam >= 0 && ansteam < playfield.teams.length) ? playfield.teams[ansteam].forecol : "white";
	return "<h3 style=\"color:" + color + "\">Hide<h3>";
}

// Shows an answer to a question
function showQuest(num) {
	update(num);
	if (playfield.biganswer) {
		playfield.currentBig = num;
	} else {
		playfield.questions[num].used = true;
	}
	build();
}

// Function to call when done viewing a large question
function showAns(num) {
	update(num);
	playfield.questions[num].used = true;
	build();
}

// Function to call when you are done viewing a large answer
function doneans(num) {
	playfield.questions[num].team = scoreid;
	playfield.questions[num].used = true;
	playfield.currentBig = -1;
	console.log("Unbigged");
	update(num);
	showScore();
	build();
}

// Function to call to hide an already visible answer
function hideans(num) {
	playfield.questions[num].used = false;
	playfield.questions[num].team = -1;
	update(num);
	build();
}

/*
 * ██    ██  ██████   ██████    █████   ████████  ███████
 * ██    ██  ██   ██  ██   ██  ██   ██     ██     ██
 * ██    ██  ██████   ██   ██  ███████     ██     █████
 * ██    ██  ██       ██   ██  ██   ██     ██     ██
 *  ██████   ██       ██████   ██   ██     ██     ███████
 */

// Update a cell then build the board
function looks(num) {
	update(num);
	build(num);
}

// Seems to be called every time any aspect of a box changes
// Updates colors and some text
function update(num) {
	let question = makejobject(num, playfield.questions[num]);
	cacheGame(); // Autosave when anything important happens
}

// Change the title
function titlechange() {
	playfield.title = document.getElementById("titlebox").value;
	playfield.biganswer = document.getElementById("bigansbox").checked;
	playfield.squarebox = document.getElementById("squareboxbox").checked;
	build();
}

/*
 * ███████   █████   ██  ██            ██   ██
 * ██       ██   ██  ██  ██             ██ ██
 * █████    ███████  ██  ██              ███
 * ██       ██   ██  ██  ██             ██ ██
 * ██       ██   ██  ██  ███████       ██   ██
 */

// Resets the number of Xs
function showXr() {
	nextx = 1;
	showX(0);
}

// Shows the Xs above other stuff
function showX(num) {
	if (num > 0) {
		nextx = num + 1;
	}
	if (nextx >= 4) {
		nextx = 1;
	}
	let xs = "<div id=\"Xwindow\" style=\"position: absolute; z-index: 99999; width: 100%; height: 300px; top: 70px; background: clear;\"><center>";
	for (let i = 0; i < num; i++) {
		xs = xs + "<img src=\"strike.png\"/ height=\"300px\"/>";
		if (num > 1 && i < (num - 1)) {
			xs = xs + "&nbsp&nbsp&nbsp&nbsp";
		}
	}
	for (let i = 0; i < 4; i++) {
		if (i == nextx) {
			document.getElementById("xtb" + i).style = "background-color:#808080";
		} else {
			document.getElementById("xtb" + i).style = "background-color:#404040";
		}
	}
	xs = xs + "</center></div>";
	gamePanel.document.getElementById("xzone").innerHTML = xs;
}

/*
 * ██████   ██████    █████    ██████    ██████   ██  ███    ██   ██████
 * ██   ██  ██   ██  ██   ██  ██        ██        ██  ████   ██  ██
 * ██   ██  ██████   ███████  ██   ███  ██   ███  ██  ██ ██  ██  ██   ███
 * ██   ██  ██   ██  ██   ██  ██    ██  ██    ██  ██  ██  ██ ██  ██    ██
 * ██████   ██   ██  ██   ██   ██████    ██████   ██  ██   ████   ██████
 * Allows creating things that can be dragged around
 */

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
		console.log("No header found, using anywhere insted");
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

/*
 * ██   ██ ██  ██████  ██   ██ ██      ██  ██████  ██   ██ ████████
 * ██   ██ ██ ██       ██   ██ ██      ██ ██       ██   ██    ██
 * ███████ ██ ██   ███ ███████ ██      ██ ██   ███ ███████    ██
 * ██   ██ ██ ██    ██ ██   ██ ██      ██ ██    ██ ██   ██    ██
 * ██   ██ ██  ██████  ██   ██ ███████ ██  ██████  ██   ██    ██
 * Highlighting cells
 */

function updateHighlight(num) {
	highlightBox(num, document.getElementById("doth" + num).checked);
}

// Highlights a box. State is the new state of the box. Solo is to unhighlight everything else.
// Assumes state=true and solo=false if not specified
function highlightBox(num, state, solo) {
	if(state === undefined) {
		state = true;
	}
	if(solo === undefined) {
		solo = false;
	}
	if(solo) {
		for(let i = 0; i < playfield.width * playfield.height; i++) {
			playfield.questions[i].highlighted = (i == num) ? state : false;
		}
	} else {
		playfield.questions[num].highlighted = state;
	}
	build();
}
/*
 * ██████   █████  ███    ██ ██████   ██████  ███    ███ ██ ███████ ███████ ██████
 * ██   ██ ██   ██ ████   ██ ██   ██ ██    ██ ████  ████ ██    ███  ██      ██   ██
 * ██████  ███████ ██ ██  ██ ██   ██ ██    ██ ██ ████ ██ ██   ███   █████   ██████
 * ██   ██ ██   ██ ██  ██ ██ ██   ██ ██    ██ ██  ██  ██ ██  ███    ██      ██   ██
 * ██   ██ ██   ██ ██   ████ ██████   ██████  ██      ██ ██ ███████ ███████ ██   ██
 * Randomly highlight cells every now and then
 */

let randomizing = false;
let randomizerid = undefined;
const RANDOMIZER_CALLBACK_NAME = "randomizercallback";

function openRandomizerMenu(teamnum) {
	if(playfield.randomizerInterval == undefined) {
		playfield.randomizerInterval = 250;
	}

  let text = '';
	// Make a floating window that the gamemaster can move around to their liking
  text += '<div id="randomizersettings" class="movable">';
	// Title bar
	let spacecount = 5
	text += '<div id="randomizersettingsheader" class="movable-header" style="background-color:404040; color:B0B0B0">' + nbsp(spacecount) + 'Randomizer Config' + nbsp(spacecount) + '<button onclick="closeRandomizerMenu()" class="xitbtn">X</button></div>';
	// Table with the stuffs in it. Not sure if it was needed, but the example had it, so I do too.
	text += '  <div class="padded">';
	text += '<div id="randomizerthingydiv"><center>';
	text += '<table><tr><td><label for="randomizerinterval">Interval (ms):</label></td><td><input id="randomizerinterval" style="width:4em" type="number" value="' + playfield.randomizerInterval + '" min="0" step="50"/></td></tr></table>'
	// text += '<label for="randomizerinterval">Interval (ms):</label>'
	text += '<button class="larger" onclick=\"startRandomizing()\">Start</button>' + nbsp(2);
	text += '<button class="larger" onclick=\"stopRandomizing()\">Stop</button>';// + nbsp(2);
	text += '</center></div>'
	text += '</div>';
	// popup div
	text += '</div>';
  console.log("Opening randomizer settings");
  document.getElementById("floatingbox-randomizer").innerHTML = text;
  dragElement(document.getElementById("randomizersettings"));
}

// Close the team settings dialog
function closeRandomizerMenu() {
	document.getElementById("floatingbox-randomizer").innerHTML = '';
}

function startRandomizing() {
	intervalTextBox = document.getElementById("randomizerinterval");
	if(intervalTextBox != undefined) {
		playfield.randomizerInterval = intervalTextBox.value;
	}
	if(randomizerid != undefined) {
		stopRandomizing();
	}
	lastRandCell = -1;
	netman.addCallback(RANDOMIZER_CALLBACK_NAME, (item) => {
		let msg = item.message.substring(item.message.indexOf(')') + 3);
		if(msg.startsWith("button")) {
			stopRandomizing();
		}
	});
	doRandomizing();
	randomizerid = window.setInterval(doRandomizing, playfield.randomizerInterval);
}

function stopRandomizing() {
	if(randomizerid != undefined) {
		window.clearInterval(randomizerid);
		randomizerid = undefined;
	}
	netman.removeCallback(RANDOMIZER_CALLBACK_NAME);
}

let lastRandCell = -1;
function doRandomizing() {
	let nnum = lastRandCell;
	while(!isValidQuestionNum(nnum) || nnum == lastRandCell || !playfield.questions[nnum].randomizable) {
		nnum = Math.floor(Math.random() * (playfield.width * playfield.height));
	}
	highlightBox(nnum, true, true);
	lastRandCell = nnum;
}

/*
 * ██████  ██    ██ ███████ ███████ ███████ ██████  ███████
 * ██   ██ ██    ██    ███     ███  ██      ██   ██ ██
 * ██████  ██    ██   ███     ███   █████   ██████  ███████
 * ██   ██ ██    ██  ███     ███    ██      ██   ██      ██
 * ██████   ██████  ███████ ███████ ███████ ██   ██ ███████
 * Remote buzzers
 */

function buttonOrderText() {
	let txt = '';
	for(let i = 0; i < buzzerOrder.length; i++) {
		let num = buzzerOrder[i];
		txt += '<span style="color:' + playfield.teams[num].forecol + '">' + num + '</span> ';
	}
	return txt;
}

function openBuzzerMenu(teamnum) {
  let text = '';
	// Make a floating window that the gamemaster can move around to their liking
  text += '<div id="buzzerssettings" class="movable">';
	// Title bar
	let spacecount = 5
	text += '<div id="buzzerssettingsheader" class="movable-header" style="background-color:404040; color:B0B0B0">' + nbsp(spacecount) + 'Buzzer Control' + nbsp(spacecount) + '<button onclick="closeBuzzerMenu()" class="xitbtn">X</button></div>';
	// Table with the stuffs in it. Not sure if it was needed, but the example had it, so I do too.
	text += '  <div class="padded">';
	text += '<div id="buzzersthingydiv"><center>';
	// text += '<table><tr><td><label for="buzzersinterval">Interval (ms):</label></td><td><input id="buzzersinterval" style="width:4em" type="number" value="100" min="0" step="50"/></td></tr></table>'
	// text += '<label for="buzzersinterval">Interval (ms):</label>'
	text += '<button class="larger" id="buzzerenable" onclick=\"enableBuzzers()\">Enable</button>' + nbsp(2);
	text += '<button class="larger" onclick=\"resetBuzzers()\">Reset</button>' + nbsp(2);
	text += '<br/><span class="larger" id="buttonorder">' + buttonOrderText() + '</span>';
	text += '<button class="larger" onclick=\"nextButton()\">-&gt</button>';// + nbsp(2);
	text += '</center></div>'
	text += '</div>';
	// popup div
	text += '</div>';
  console.log("Opening buzzers settings");
  document.getElementById("floatingbox-buzzers").innerHTML = text;
  dragElement(document.getElementById("buzzerssettings"));
}

// Close the team settings dialog
function closeBuzzerMenu() {
	document.getElementById("floatingbox-buzzers").innerHTML = '';
}

let buzzersEnabled = false;
const BUZZER_CALLBACK_NAME = "buzzercallback"
let buzzerOrder = [];

function enableBuzzers() {
	console.log("Enable Buzzers");
	buzzersEnabled = true;
	netman.addCallback(BUZZER_CALLBACK_NAME, (item) => {
		let msg = item.message.substring(item.message.indexOf(')') + 3);
		if(msg.startsWith("button")) {
			if(buzzersEnabled) {
				let num = parseInt(msg.substring("button".length));
				console.log('BUTTON! ' + num);
				if(isValidTeamNum(num) && !buzzerOrder.includes(num)) {
					if(buzzerOrder.length == 0) {
						setScoreID(num);
					}
					buzzerOrder.push(num);
					let botb = document.getElementById("buttonorder");
					if(botb != undefined) {
						buttonorder.innerHTML = buttonOrderText();
					}
				}
			}
		}
	});
	let bebtn = document.getElementById("buzzerenable")
	if(bebtn != undefined) {
		bebtn.innerHTML = "Disable";
		bebtn.onclick = () => { disableBuzzers(); } ;
	}
}

function disableBuzzers() {
	console.log("Disable Buzzers");
	buzzersEnabled = false;
	netman.removeCallback(BUZZER_CALLBACK_NAME);
	let bebtn = document.getElementById("buzzerenable")
	if(bebtn != undefined) {
		bebtn.innerHTML = "Enable";
		bebtn.onclick = () => { enableBuzzers(); };
	}
}

function resetBuzzers() {
	buzzerOrder = [];
	let botb = document.getElementById("buttonorder");
	if(botb != undefined) {
		buttonorder.innerHTML = '';
	}
	console.log("Reset Buzzers");
}

function nextButton() {
	buzzerOrder.shift();
	if(buzzerOrder.length > 0) {
		setScoreID(buzzerOrder[0]);
	}
	let botb = document.getElementById("buttonorder");
	if(botb != undefined) {
		buttonorder.innerHTML = buttonOrderText();
	}
}
