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
	text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="netman.copyGID()">Copy GID</button></td></tr>';
	text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="netman.sendClearGamesRequest()">Clear all games</button></td></tr>';
	text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="savetoClipboard(\'' + baseURL + '&role=master&action=message&message=button\' + document.getElementById(\'buttonnum\').value + \'&gid=\' + netman.gid )">Copy Button URL</button></td></tr>';
	text += '    <tr><td class="settingsbodytd"><button class="larger" onClick="netman.sendButtonPressRequest()">Button test</button><label for="buttonnum">ID:</label><input id="buttonnum" style="width:4em" type="number" value="0" min="0" step="1"/></td></tr>';
	text += '</table></div></div>';
	console.log("Opening net settings");
	document.getElementById("floatingbox-network").innerHTML = text;
	dragElement(document.getElementById("netsettings"));
}

// Close the network settings dialog
function closeNetworkSettings() {
	document.getElementById("floatingbox-network").innerHTML = '';
}

// The class to manage networking
class NetworkManager {
	constructor() {
		this.online = false;
		this.privateKey = '';
		this.gid = '';
		this.key = '';
		this.lastCID = 0;
		this.callbacks = new Map();
		this.errorCount = 0;
		this.maxErrors = 5;
	}

	addCallback(name, cb) {
		this.callbacks.set(name, cb);
	}

	removeCallback(name) {
		this.callbacks.delete(name)
	}

	hasCallback(name) {
		return this.callbacks.has(name);
	}

	copyGID() {
		savetoClipboard(this.gid);
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
									// if(confirm("Copy GID to clipboard?")) {
									// 	savetoClipboard(that.gid);
									// }
									that.online = true;
									that.sendReciverRequest();
									document.getElementById("onlinestatus").innerHTML = "<span style=\"color:green\">ONLINE!</span>";
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
			xhttp.open("POST", baseURL + "&role=reciver&gid=" + this.gid, true);
			xhttp.send(JSON.stringify(payload));
		}
	}

	goOffline() {
		this.online = false;
		document.getElementById("onlinestatus").innerHTML = "<span style=\"color:red\">offline</span>";
		alert('The game has gone offline');
	}

	// Sends a reciver request to the server
	sendReciverRequest() {
		if(this.online) {
			let xhttp = new XMLHttpRequest();
			let nm = this;
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					switch(this.status) {
					case 200: {
						console.log(this.status + ": " + this.responseText);
						let roa = JSON.parse(this.responseText);
						roa.forEach(ro => {
							console.log(ro.id);
							if(ro.id !== undefined) {
								console.log(ro.item)
								nm.lastCID = ro.id;
								switch(ro.item.cause) {
									case "message": {
										console.log("Got message: " + ro.item.message)
										nm.callbacks.forEach((cb, name, map) => {
											cb(ro.item);
										});
										nm.errorCount = 0;
									} break;
									case "server-closing": {
										nm.goOffline();
									}
								}
							}
						});
					} break;
					case 204: {
						console.log("No new messages");
					} break;
					case 400: {
						nm.errorCount++;
					} break;
					case 503: { console.log("The node server is currently down."); } break;
					case 0: { // Seems to be when server is offline
						nm.goOffline();
					} break;
					default: { console.log("Status: " + this.status); } break;
					}
					if(nm.errorCount < nm.maxErrors) {
						if(nm.online) {
							nm.sendReciverRequest();
						} else {
							console.log('Game is in offline mode');
						}
					} else {
						console.log("Too many errors, stopping");
					}
				}
			};
			xhttp.open("POST", baseURL + "&role=viewer&action=wait&lastCID=" + this.lastCID + "&gid=" + this.gid, true);
			xhttp.send("");
		}
	}

	sendButtonPressRequest(payload) {
		if(this.online) {
			// payload.key = this.key;
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
			let num = document.getElementById('buttonnum').value;
			xhttp.open("POST", baseURL + "&role=master&action=message&message=button" + num + "&lastCID=0&gid=" + this.gid, true);
			let pl = payload;
			if(typeof payload !== 'string') {
				pl = JSON.stringify(payload);
			}
			if(payload == undefined) {
				pl = "null";
			}
			xhttp.send(pl);
		}
	}

	sendClearGamesRequest(payload) {
		if(confirm('Are you sure you want to clear all games? This includes the current game.')) {
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					console.log(this.status + ": " + this.responseText);
				}
			};
			xhttp.open("POST", baseURL + "&role=master&action=clear&confirm=true", true);
			let pl = payload;
			if(typeof payload !== 'string') {
				pl = JSON.stringify(payload);
			}
			if(payload == undefined) {
				pl = "null";
			}
			xhttp.send(pl);
		}
	}
}

let netman = new NetworkManager();
