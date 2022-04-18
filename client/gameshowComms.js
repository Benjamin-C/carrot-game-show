/*
 * ███    ██  ███████  ████████  ██     ██   ██████   ██████   ██   ██  ██  ███    ██   ██████
 * ████   ██  ██          ██     ██     ██  ██    ██  ██   ██  ██  ██   ██  ████   ██  ██
 * ██ ██  ██  █████       ██     ██  █  ██  ██    ██  ██████   █████    ██  ██ ██  ██  ██   ███
 * ██  ██ ██  ██          ██     ██ ███ ██  ██    ██  ██   ██  ██  ██   ██  ██  ██ ██  ██    ██
 * ██   ████  ███████     ██      ███ ███    ██████   ██   ██  ██   ██  ██  ██   ████   ██████
 * This is a bunch of stuff that was added late, and is probably not done.
 */

// Creates a dragable thing to control network stuffs
function openNetworkSettings() {
	let text = '';
	text += '<div id="netsettings" class="movable">';
	text += '  <div id="netsettingsheader" class="movable-header">Network Settings <button onclick="closeNetworkSettings()" class="xitbtn">X</button></div>';
	text += '  <div class="padded"><table id="netsettingsbody" class="settingsbodytable">';
	text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="netman.setOnline(' + ((netman.online) ? 'false' : 'true') + ')">' + ((netman.online) ? 'End' : 'Start new') + ' online game</button></td></tr>';
	text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="">List online games</button></td></tr>';
	text += '</table></div></div>';
	console.log("Opening net settings");
	document.getElementById("netset").innerHTML = text;
	dragElement(document.getElementById("netsettings"));
}

// Close the network settings dialog
function closeNetworkSettings() {
	document.getElementById("netset").innerHTML = '';
}

// The class to manage networking
class NetworkManager {
	constructor() {
		this.online = false;
		this.privateKey = '';
		this.gid = '';
		this.key = '';
	}

	// Tries to turn on the networking
	setOnline(online) {
		if(online) {
			let that = this;
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					console.log("Update: ", this.responseText);
					switch(this.status) {
						case 200: {
							try {
								let j = JSON.parse(this.responseText);
								if(j.gid !== undefined && j.key !== undefined) {
									that.gid = j.gid;
									that.key = j.key;
									if(confirm("Copy GID to clipboard?")) {
										savetoClipboard(that.gid);
									}
									that.online = true;
								} else {
									console.log("GID or KEY was not specified");
								}
							} catch (error) { console.error(error) }
						} break;
						case 503: {console.log("The node server is currently down.");} break;
						default: {console.log("Status: " + this.status);} break;
					}
				}
			};
			xhttp.open("POST", baseURL + "&role=master&action=begin", true);
			xhttp.send(JSON.stringify(saveToObj()));
			console.log(xhttp.responseURL)
		} else {
			// Disconnect?
			this.online = false;
		}
		// Need to connect to server here if required
	}

	// not sure what this was supposed to do
	updateCell(num) {
		if(this.online) {
			let pl = new Object();
			pl.type = 'cell';
			pl.num = num;
			pl.cell = playfield.questions[num];
			this.sendPOSTRequest(pl);
		}
	}

	// Sends a post request to the server
	sendPOSTRequest(payload) {
		if(this.online) {
			payload.key = this.key;
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					// console.log("Update: ", this);
					// switch(this.status) {
					//   case 200: { console.log(this.responseText); } break;
					//   case 503: {document.getElementById("body").innerHTML = "The node server is currently down."} break;
					//   default: {document.getElementById("body").innerHTML = "Status: " + this.status ;} break;
					// }
					console.log(this.status + ": " + this.responseText);
				}
			};
			xhttp.open("POST", baseURL + "&role=master&action=update&gid=" + this.gid, true);
			xhttp.send(JSON.stringify(payload));
		}
	}
}

let netman = new NetworkManager();
