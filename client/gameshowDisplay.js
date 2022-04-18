
/*
 * ██████   ██    ██  ██  ██       ██████
 * ██   ██  ██    ██  ██  ██       ██   ██
 * ██████   ██    ██  ██  ██       ██   ██
 * ██   ██  ██    ██  ██  ██       ██   ██
 * ██████    ██████   ██  ███████  ██████
 * Builds the visible parts of the gameshow
 */
function build() {
	console.log("Building");
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
			biganswerstr = "checked=\"" + "false" + "\"";
		}
		let squareboxstr = "";
		if(playfield.squarebox) {
			squareboxstr = "checked=\"" + "true" + "\"";
		}
		let tbl = "<h1 id=\"title\">" + playfield.title + biga + "</h1><input id=\"titlebox\" type=\"text\" value=\"" + playfield.title + "\"/><input id=\"bigansbox\" type=\"checkbox\" " + biganswerstr + ">Big Answer</input><input id=\"squareboxbox\" type=\"checkbox\" " + squareboxstr +">Square box</input><button onclick=\"titlechange()\">mod</button><input id=\"configcolor\" type=\"checkbox\" onclick=\"setShowColorConfig()\">Config Color</input><table class=\"gametable\">";
		document.getElementById("scoremod").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<input id=\"scoremodnum\" class=\"numbox\" type=\"text\" value=\"0\"/>&nbsp;<button onclick=\"scorechange(1)\"><h3>&nbsp;&nbsp;+&nbsp;&nbsp;</h3></button>&nbsp;<button onclick=\"scorechange(-1)\"><h3>&nbsp;&nbsp;-&nbsp;&nbsp;</h3></button>&nbsp;<button onclick=\"scorechange(0)\"><h3>&nbsp;&nbsp;S&nbsp;&nbsp;</h3></button>";
		for (let i = 0; i < playfield.height; i++) {
			tbl = tbl + "<tr>";
			for (let j = 0; j < playfield.width; j++) {
				tbl = tbl + getNewControlTableBox(i + (j * playfield.height));
			}
			tbl = tbl + "</tr>";
		}
		tbl = tbl + "</table>";
		document.getElementById("table").innerHTML = tbl;
		let ctlhtml = "<button onclick=\"savejson()\"><h1>Save</h1></button>&nbsp";
		ctlhtml = ctlhtml + "<button onclick=\"showXr()\"><h1 style=\"color:#FF0080\">R</h1></button><button id=\"xtb0\" onclick=\"showX(0)\"><h1 style=\"color:#FF0000\">&nbsp&nbsp</h1></button><button id=\"xtb1\" onclick=\"showX(1)\" style=\"background-color:#808080\"><h1 style=\"color:#FF0000\">X</h1></button><button id=\"xtb2\" onclick=\"showX(2)\"><h1 style=\"color:#FF0000\">XX</h1></button><button id=\"xtb3\" onclick=\"showX(3)\"><h1 style=\"color:#FF0000\">XXX</h1></button>";
		document.getElementById("control").innerHTML = ctlhtml;

		// For other window

		gamePanel.document.getElementById("table").innerHTML = getAnswerTable();
		gamePanel.document.title = "BenGameShow";
		//document.getElementById('control').innerHTML = "</div><center><table><tr><td><h1 id=\"score\"></h1></td><td><button onclick=\"savejson()\"><h1>Save</h1></button></td></tr></table></center>";
		showScore();
		cacheGame(); // Save the game to the cache in case something crashes
	}
	break;
	}
}

// Shows or hides the color modification boxes for cleaner view if you are not changing colors
function setShowColorConfig() {
	showColorConfig = document.getElementById('configcolor').checked;
	for (let i = 0; i < playfield.height; i++) {
		for (let j = 0; j < playfield.width; j++) {
			let num = (i + (j * playfield.height))
			document.getElementById("box" + num + "color").style.display = (showColorConfig) ? "" : "none";
		}
	}
}

// Creates a table element to add to the control table for a specific cell.
// <button onclick=\"myclickkeep(" + num + ")\"><h3>" + (num + 1) + "(" + questions[num].points + "): " + questions[num].answer + "</h3></button>
function getNewControlTableBox_param(num, used) {
	let showscorevalue = "";
	if (playfield.questions[num].showscore) {
		showscorevalue = "checked=\"" + "false" + "\"";
	}
	let txt = "<td id=\"box" + num + "\" class=\""
	txt = txt + "gametd"
	if (used) {
		txt = txt + " used";
	}
	// txt = txt + "\" width=\"64\" style=\"background-color:";
	txt = txt + "\" style=\"background-color:#";
	if (used) {
		txt = txt + playfield.questions[num].usedcolor;
	} else {
		txt = txt + playfield.questions[num].unusedcolor;
	}
	txt = txt + "\"><input id=\"ques" + num + "\" type=\"text\" value=\"" + playfield.questions[num].question + "\"/><br/><input id=\"ans" + num + "\" type=\"text\" value=\"" + playfield.questions[num].answer + "\"/><input id=\"pts" + num + "\" class=\"numbox\" type=\"text\" value=\"" + playfield.questions[num].points + "\"/><br/><button id=\"ansbtn" + num + "\" onclick=\"";
	if (used) {
		txt = txt + "hideans(" + num + ")\"><h3>Hide</h3>";
	} else {
		txt = txt + "showans(" + num + ")\"><h3>Answer</h3>";
	}
	txt = txt + "</button>&nbsp;<button onclick=\"update(" + num + ")\"><h3>looks</h3></button><br/><input id=\"dosc" + num + "\" type=\"checkbox\" " + showscorevalue + ">Show Score</input><br/>";
	txt = txt + "<div id=\"box" + num + "color\" style=\"display:none\">Unused color<input id=\"cols" + num + "\" class=\"colbox\" value=\"" + playfield.questions[num].unusedcolor + "\"/><br/>Used color<input id=\"cold" + num + "\" class=\"colbox\" value=\"" + playfield.questions[num].usedcolor + "\"/></td></div>"

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
	console.log("m:" + privileged);
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
			tbl = tbl + getNewAnswerTableBox(i + (j * playfield.height), boxwidth, boxheight, privileged);
		}
		tbl = tbl + "</tr>";
	}
	tbl = tbl + "</table>";
	return tbl;
}

// Gets the boxes for the abve table
function getNewAnswerTableBox_param(num, text, color, hide, boxwidth, boxheight, privileged) {
	privileged = (privileged === undefined) ? true : privileged;
	console.log(privileged);
	console.log(playfield.questions[num]);
	let txt = "<td id=\"box" + num + "\" class=\"";
	if (color) {
		txt = txt + "used";
	} else {
		txt = txt + "gametd";
	}
	txt = txt + "\" width=" + boxwidth + " height=" + boxheight + " style=\"background-color:#";
	if(privileged) {
		if (color) {
			txt = txt + playfield.questions[num].usedcolor;
		} else {
			txt = txt + playfield.questions[num].unusedcolor;
		}
	} else {
		txt += playfield.questions[num].color;
	}
	txt = txt + "\"><h1 id=\"text" + num + "\">";
	if(privileged) {
		if (!hide) {
			if (text) {
				txt = txt + playfield.questions[num].answer;
			} else {
				txt = txt + playfield.questions[num].question;
			}
		}
	} else {
		txt += playfield.questions[num].text;
	}
	txt = txt + "</h1></td>";
	return txt;
}

// Gets the boxes for the above table, but with more default values
function getNewAnswerTableBox(num, boxwidth, boxheight, privileged) {
	return getNewAnswerTableBox_param(num, playfield.questions[num].used, playfield.questions[num].used, (playfield.biganswer && playfield.questions[num].used), boxwidth, boxheight, privileged);
}

// Hides the score display
// Used for blank/image/video/big answers
function hideScore() {
	document.getElementById("score").innerHTML = "";
	gamePanel.document.getElementById("score").innerHTML = "";
}

// Shows the score display
function showScore() {
	var cfg = "";
	var scb = "<table><tr>";
	for(let i = 0; i < score.length; i++) {
		if(i > 0) {
			cfg += nbsp(4);
			scb += "<td>" + "</td>";
		}
		cfg += createScoreButton(i);
		scb += "<td>" + createScoreLabel(i) + "</td>";
	}
	scb += "</tr></table>";
	document.getElementById("score").innerHTML = cfg;
	gamePanel.document.getElementById("score").innerHTML = scb;
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
	// return "<p style=\"color:" + scorecolor[0][id] + ";background-color:" + scorecolor[(id == scoreid) ? 1 : 2][id] + "\>" + scoreStr + score[id] + "</p>";
	// return scoreStr + score[id];
	return "<h1 style=\"border:" + ((id == scoreid) ? scorecolor[0][id] : getBackgroundColor()) + "; border-width:5px; border-style:solid; color:" + scorecolor[0][id] + "\">&nbsp" + scoreStr + score[id] + "&nbsp</h1>";
}

// Creates the buttons gamemasters can use to control scores
function createScoreButton(id) {
	return "<button id=\"scoreid-" + id + "\" onclick=\"setScoreID(" + id + ")\" style=\"color:" + scorecolor[0][id] + "; background-color:" + scorecolor[(id == scoreid) ? 1 : 2][id] + "\"><h2>" + scoreStr + score[id] + "</h2></button>";
}

// Sets the currently selected Team
// Should probably check if scores are currently shown before showing them
function setScoreID(id) {
	scoreid = id;
	// for(var iter = 0; iter < score.length; iter++) {
	//   document.getElementById("scoreid-" + iter).style.background = scorecolor[(iter == id) ? 1 : 2][iter];
	// }
	// scorecolor
	showScore();
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

// Shows an answer to a question
function showans(num) {
	if (playfield.biganswer) {
		// myMode = MyModes.ANS;
		document.getElementById("ansbtn" + num).onclick = function() {
			doneans(num); // Call doneans to clean up large answers
		};
		document.getElementById("ansbtn" + num).innerHTML = "Done";

		console.log(document.getElementById("ansbtn" + num).className);

		for (let i = 0; i < (playfield.width * playfield.height); i++) {
			if (i != num) {
				document.getElementById("ansbtn" + i).disabled = true;
				document.getElementById("ansbtn" + i).className = "disabledbutton";
			}
		}
		let box = getNewAnswerTableBox_param(num, true, false);
		console.log(box);
		gamePanel.document.getElementById("table").innerHTML = "<table><tr>" + box + "</tr></table>";
		gamePanel.document.getElementById("box" + num).className = "gametd center";
		gamePanel.document.getElementById("text" + num).className = "center";
		gamePanel.document.getElementById("box" + num).style.width = (window.innerWidth) + "px";
		gamePanel.document.getElementById("box" + num).style.height = (window.innerHeight) + "px";
		hideScore();
	} else {
		document.getElementById("ansbtn" + num).onclick = function() {
			hideans(num)
		};
		document.getElementById("ansbtn" + num).innerHTML = "<h3>Hide<h3>";

		playfield.questions[num].used = true;
		let pts = parseInt(document.getElementById("pts" + num).value);
		score[scoreid] = score[scoreid] + pts;

		update(num);
		// document.getElementById("box" + num).className = "used";
		// gamePanel.document.getElementById("box" + num).className = "used";
		showScore();
	}
}

// Function to call when you are done viewing a large answer
function doneans(num) {
	document.getElementById("ansbtn" + num).onclick = function() {
		hideans(num)
	};
	document.getElementById("ansbtn" + num).innerHTML = "<h3>Hide</h3>";

	playfield.questions[num].used = true;
	update(num);

	for (let i = 0; i < (playfield.width * playfield.height); i++) {
		if (i != num) {
			document.getElementById("ansbtn" + i).disabled = false;
			document.getElementById("ansbtn" + i).className = "";
		}
	}

	let pts = parseInt(document.getElementById("pts" + num).value);
	score[scoreid] = score[scoreid] + pts;
	showScore();

	gamePanel.document.getElementById("table").innerHTML = getAnswerTable();
}

// Function to call to hide an already visible answer
function hideans(num) {
	document.getElementById("ansbtn" + num).onclick = function() {
		showans(num)
	};
	document.getElementById("ansbtn" + num).innerHTML = "<h3>Answer</h3>";
	playfield.questions[num].used = false;
	let pts = parseInt(document.getElementById("pts" + num).value);
	score[scoreid] = score[scoreid] - pts;
	showScore();
	document.getElementById("box" + num)
	update(num);
}

/*
 * ██    ██  ██████   ██████    █████   ████████  ███████
 * ██    ██  ██   ██  ██   ██  ██   ██     ██     ██
 * ██    ██  ██████   ██   ██  ███████     ██     █████
 * ██    ██  ██       ██   ██  ██   ██     ██     ██
 *  ██████   ██       ██████   ██   ██     ██     ███████
 */

// Seems to be called every time any aspect of a box changes
// Updates colors and some text
function update(num) {
	let question = makejobject(num, playfield.questions[num]);

	let used = !(question.used == null || question.used == false);
	if (used) {
		document.getElementById("box" + num).style = "background-color:#" + question.usedcolor;
		gamePanel.document.getElementById("box" + num).style = "background-color:#" + question.usedcolor;
		document.getElementById("box" + num).classList.add(used);
		gamePanel.document.getElementById("box" + num).classList.add(used);

		let newval = "<h1>" + question.answer + ((question.showscore == true) ? " [" + question.points + "]" : "")  + "</h1>";
		gamePanel.document.getElementById("box" + num).innerHTML = newval;
		console.log("used");
	} else {
		document.getElementById("box" + num).style = "background-color:#" + question.unusedcolor;
		gamePanel.document.getElementById("box" + num).style = "background-color:#" + question.unusedcolor;
		document.getElementById("box" + num).className = "gametd";
		gamePanel.document.getElementById("box" + num).className = "gametd";

		gamePanel.document.getElementById("box" + num).innerHTML = "<h1>" + question.question + "</h1>";
		console.log("Unused");
	}

	netman.updateCell(num);

	cacheGame(); // Put here because setcol() is called after each time a question is changed from the answer,hide,or looks buttons, so that the game essentially autosaves often.
}

// Change the title
function titlechange() {
	playfield.title = document.getElementById("titlebox").value;
	playfield.biganswer = document.getElementById("bigansbox").checked;
	playfield.squarebox = document.getElementById("squareboxbox").checked;
	build();
}

// Modifies a team score. Dir sets wether to add, set, or subtract the value in a textbox
function scorechange(dir) {
	let change = parseInt(document.getElementById("scoremodnum").value);
	if (dir == 1) {
		score[scoreid] = score[scoreid] + change;
	} else if (dir == 0) {
		score[scoreid] = change;
	} else if (dir == -1) {
		score[scoreid] = score[scoreid] - change;
	}
	showScore();
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
