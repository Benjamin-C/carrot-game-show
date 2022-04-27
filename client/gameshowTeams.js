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
	showScore();
}

let openTeamMenuNum = -1;

function updateTeamMenuInnards() {
	if(openTeamMenuNum >= 0) {
		document.getElementById("teamsettings").innerHTML = genTeamMenuInnards(openTeamMenuNum);
	}
}

function genTeamMenuInnards(teamnum) {
	let team = playfield.teams[teamnum];
	let text = "";
	text += '<div id="teamsettingsheader" class="movable-header" style="background-color:' + ((scoreid == teamnum) ? team.selcol : team.backcol) + '; color:' + team.forecol + '">' + nbsp(0) + 'Team ' + teamnum + ' Config' + nbsp(0) + '<button onclick="closeTeamMenu()" class="xitbtn">X</button></div>';
	// Table with the stuffs in it. Not sure if it was needed, but the example had it, so I do too.
	text += '  <div class="padded">';

	// Score changing values
	text += '<div id="scoremoddiv"><input id="scoremodnum' + teamnum + '" maxlength="3" type="text" value="0"/>&nbsp;<button onclick=\"scorechange(' + teamnum + ', 1)\"><h3>&nbsp;&nbsp;+&nbsp;&nbsp;</h3></button>&nbsp;<button onclick=\"scorechange(' + teamnum + ', -1)\"><h3>&nbsp;&nbsp;-&nbsp;&nbsp;</h3></button>&nbsp;<button onclick=\"scorechange(' + teamnum + ', 0)\"><h3>&nbsp;&nbsp;S&nbsp;&nbsp;</h3></button></div>';

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
  console.log("Opening net settings");
  document.getElementById("floatingbox").innerHTML = text;
  dragElement(document.getElementById("teamsettings"));
}

// Close the network settings dialog
function closeTeamMenu() {
	openTeamMenuNum = -1;
	document.getElementById("floatingbox").innerHTML = '';
}

// Updates each team's score variable to the correct value
function calcTeamPoints() {
	console.log("Calculating points ...");
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
