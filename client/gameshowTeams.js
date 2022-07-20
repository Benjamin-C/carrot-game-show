// ID of the current team
let scoreid = 0;

// Generates a new team
function genTeam(name, fore, select, back) {
	let team = new Object();
	team.name = name;
	team.forecol = fore;
	team.selcol = select;
	team.backcol = back;
	team.score = 0;
	team.scoreAdj = 0;
	team.events = [];
	return team;
}

// Team score colors
let scorecolor = [ ["#ff0000", "#00FF00", "#0040ff", "#FFFF00"], ["#400000", "#004000", "#002080", "#404000"], ["#200000", "#002000", "#001020", "#202000"] ];

// Generates the default teams. These will be overritten if a game is loaded
for(let i = 0; i < scorecolor[0].length; i++) {
	playfield.teams.push(genTeam("", scorecolor[0][i], scorecolor[1][i], scorecolor[2][i]))
}

// Score text string. Maybe should be put in a localizatoin something?
let scoreStr = "Score = ";

function addTeam() {
	playfield.teams.push(genTeam("", scorecolor[0][i], scorecolor[1][i], scorecolor[2][i]))
}

let gear = '\u2699';

function addNewTeam() {
	playfield.teams.push(genTeam("", "FFFFFF", "#888888", "#444444"));
	drawScore();
}

// Modifies a team score. Dir sets wether to add, set, or subtract the value in a textbox
function scorechange(teamnum, dir) {
	let change = parseInt(document.getElementById("scoremodnum" + teamnum).value);
	let team = playfield.teams[teamnum];
	if(team.scoreAdj === undefined) {
		team.scoreAdj = 0;
	}
	if (dir == 1) {
		team.scoreAdj += change;
	} else if (dir == 0) {
		team.scoreAdj = change;
	} else if (dir == -1) {
		team.scoreAdj += change;
	}
	drawScore();
}

let openTeamMenuNum = -1;

function updateTeamMenuInnards() {
	if(openTeamMenuNum >= 0) {
		document.getElementById("teamsettings").innerHTML = genTeamMenuInnards(openTeamMenuNum);
		dragElement(document.getElementById("teamsettings"))
	}
}

function genTeamMenuInnards(teamnum) {
	let team = playfield.teams[teamnum];
	let text = "";
	text += '<div id="teamsettingsheader" class="movable-header" style="background-color:' + ((scoreid == teamnum) ? team.selcol : team.backcol) + '; color:' + team.forecol + '">' + nbsp(0) + 'Team ' + teamnum + ' Config' + nbsp(0) + '<button onclick="closeTeamMenu()" class="xitbtn">X</button></div>';
	// Table with the stuffs in it. Not sure if it was needed, but the example had it, so I do too.
	text += '  <div class="padded">';

	// Score changing values
	text += '<div id="scoremoddiv">Score: ' + team.score + nbsp(2) + '<input id="scoremodnum' + teamnum + '" type="text" value="0"/>&nbsp;<button onclick=\"scorechange(' + teamnum + ', 1)\"><h3>&nbsp;&nbsp;+&nbsp;&nbsp;</h3></button>&nbsp;<button onclick=\"scorechange(' + teamnum + ', -1)\"><h3>&nbsp;&nbsp;-&nbsp;&nbsp;</h3></button>&nbsp;<button onclick=\"scorechange(' + teamnum + ', 0)\"><h3>&nbsp;&nbsp;S&nbsp;&nbsp;</h3></button></div>';

	// Color stuff
	text += '<div id="teamcolordiv"><center><table>'
	text += '<tr><td><label for="teamforecol">Foreground Color:</label></td><td><input id="teamforecol' + teamnum + '" style="width:4em" maxlength="6" type="text" value="' + team.forecol.substring(1) + '"/></td></tr>'
	text += '<tr><td><label for="teamselcol">Selected Color:</label></td><td><input id="teamselcol'  + teamnum + '" style="width:4em" maxlength="6" type="text" value="' + team.selcol.substring(1) + '"/></td></tr>'
	text += '<tr><td><label for="teambackcol">Background Color:</label></td><td><input id="teambackcol' + teamnum + '" style="width:4em" maxlength="6" type="text" value="' + team.backcol.substring(1) + '"/></td></tr>'
	text += '</table></center></div>';

	text += '<div id="teamctlbuttons"><center>';
	text += '<button onclick=\"updateColors()\">Update colors</button>' + nbsp(2);
	text += '<button onclick=\"removeTeam(' + teamnum + ')\">Delete Team</button>';// + nbsp(2);
	text += '</center></div>'

	// Scrolling list code that should go somewhere else later
	// text += '<br/><div id="teamhistorydiv" style="height:200px;overflow:auto">';
	// text += '<table style="width:100%;border-collapse: collapse;">';
	// for(let i = 0; i < 18; i++) {
	// 	text += '<tr style="border: 2px solid ' + team.backcol + '">';
	// 	text += '<td><div style="overflow: auto;white-space: nowrap;"><h3>Hi where you' +   '</h3></div></td>';
	// 	text += '<td><div style="overflow: auto;white-space: nowrap;"><h3>Hi 2' +           '</h3></div></td>';
	// 	text += '<td><div style="overflow: auto;white-space: nowrap;"><h3>Hi 3' +           '</h3></div></td>';
	// 	text += '<td><div style="overflow: auto;white-space: nowrap;"><h3>My num is ' + i + '</h3></div></td>';
	// 	text += '</tr>';
	// }
	// text += '</table></div>';

	text += '</div>';

	return text;
}

function openTeamMenu(teamnum) {
	openTeamMenuNum = teamnum;

  let text = '';
	// Make a floating window that the gamemaster can move around to their liking
  text += '<div id="teamsettings" class="movable">';
	// Title bar
	text += genTeamMenuInnards(teamnum);
	// popup div
	text += '</div>';
  console.log("Opening team " + teamnum + " settings");
  document.getElementById("floatingbox").innerHTML = text;
  dragElement(document.getElementById("teamsettings"));
}

// Close the team settings dialog
function closeTeamMenu() {
	openTeamMenuNum = -1;
	document.getElementById("floatingbox").innerHTML = '';
}

// Updates each team's score variable to the correct value
function calcTeamPoints() {
	// console.log("Calculating points ...");
	let teams = playfield.teams;
	let qs = playfield.questions;
	for(let i = 0; i < teams.length; i++) {
		if(teams[i].scoreAdj === undefined) {
			teams[i].scoreAdj = 0;
		}
		teams[i].score = teams[i].scoreAdj;
	}
	for(let i = 0; i < qs.length; i++) {
		let t = qs[i].team;
		let qpt = qs[i].points;
		if(t >= 0 && t < teams.length && qs[i].givesPoints !== false) {
			teams[t].score += qpt;
		}
	}
}

function removeTeamQuestions(teamnum) {
	if(isValidTeamNum(teamnum)) {
		let qs = playfield.questions;
		for(let i = 0; i < pl.length; i++) {
			let t = qs[i].team;
			if(t == teamnum) {
				qs[i].givesPoints = false;
			}
		}
	}
}

function isValidTeamNum(teamnum) {
	return teamnum >= 0 && teamnum < playfield.teams.length;
}

function updateColors() {
	console.log("Updating colors ... ")
	// let playfield.teams = playfield.teams;
	for(let i = 0; i < playfield.teams.length; i++) { // teamselcol2
		box = document.getElementById('teamselcol' + i);
		if(box != undefined) {
			playfield.teams[i].selcol  = '#' + document.getElementById('teamselcol'  + i).value;
			playfield.teams[i].forecol = '#' + document.getElementById('teamforecol' + i).value;
			playfield.teams[i].backcol = '#' + document.getElementById('teambackcol' + i).value;
		}
	}
	drawScore();
}

function removeTeam(id, confirmedRemove) {
	if(confirmedRemove === undefined) {
		// Open confirm dialog
		removeTeam(id, confirm('Are you sure you want to remove Team ' + id + '?. This can not be undone.'));
	} else if(confirmedRemove === true) {
		// Delete the team
		playfield.teams.splice(id, 1);
		for(let i = 0; i < playfield.questions.length; i++) {
			if(playfield.questions[i].team == id) {
				playfield.questions[i].team = -1
			} else if(playfield.questions[i].team >= id) {
				playfield.questions[i].team--;
			}
		}
		closeTeamMenu();
		build();
	} else {
		// Don't delete the team
		console.log("Team not deleted")
	}
}
