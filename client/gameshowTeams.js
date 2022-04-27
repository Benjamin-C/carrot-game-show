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

function openTeamMenu(teamnum) {
	let team = playfield.teams[teamnum];
  let text = '';
  text += '<div id="teamsettings" class="movable">';
  text += '  <div id="teamsettingsheader" class="movable-header" style="background-color:' + team.selcol + '; color:' + team.forecol + '">Team ' + teamnum + ' Config <button onclick="closeTeamMenu()" class="xitbtn">X</button></div>';
  text += '  <div class="padded"><table id="teamsettingsbody" class="settingsbodytable">';
  text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="netman.setOnline(' + ((netman.online) ? 'false' : 'true') + ')">' + ((netman.online) ? 'End' : 'Start new') + ' online game</button></td></tr>';
  text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="">List online games</button></td></tr>';
  text += '</table></div></div>';
  console.log("Opening net settings");
  document.getElementById("floatingbox").innerHTML = text;
  dragElement(document.getElementById("teamsettings"));
}

// Close the network settings dialog
function closeTeamMenu() {
	document.getElementById("floatingbox").innerHTML = '';
}
