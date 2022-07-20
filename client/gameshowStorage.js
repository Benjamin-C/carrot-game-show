/*
 *      ██  ███████   ██████   ███    ██
 *      ██  ██       ██    ██  ████   ██
 *      ██  ███████  ██    ██  ██ ██  ██
 * ██   ██       ██  ██    ██  ██  ██ ██
 *  █████   ███████   ██████   ██   ████
 * Load and save JSON game files
 */

// Convert old question formats to new question formats
function convertOldQuestions(oldq, size) {
	let nq = new Array(size);
	for(let i = 0; i < size; i++) {
		nq[i] = oldq[i];
	}
	return nq;
}

// Load JSON from a text string
// Returns true if the JSON was loaded, false otherwise
// Has cases for all old versions, and they *should* import correctly
function loadjson(json) {
	if (json != "blank") {
		if (json != null) {
			let indata = json.split("#");
			if (indata[0] == "Ben's Game Show Question File") {
				let qfileversion = 0;
				try {
					qfileversion = parseInt(indata[1]);
				} catch (error) {
					qfileversion = 1;
				}
				if (indata.length >= 2) {
					switch (qfileversion) {
						case 1: {
							console.log("Q version 1");
							if (indata[1] == null || indata[2] == null || indata[3] == null || indata[4] == null) {
								alert("File loading Error " + indata.length + "\nw: " + indata[1] + "\nh: " + indata[2] + "\nt: " + indata[3] + "\nj: " + indata[4] + "\nf: " + json);
							}
							playfield.width = parseInt(indata[1]);
							playfield.height = parseInt(indata[2]);
							playfield.title = indata[3];

							playfield.questions = convertOldQuestions(JSON.parse(indata[4]), playfield.width*playfield.height);
							return true;
						} break;
						case 2: {
							console.log("Q version 2");
							if (indata.length == 7) {}
							if (indata[2] == null || indata[3] == null || indata[4] == null || indata[5] == null) {
								alert("File loading Error " + indata.length + "\nv: " + indata[1] + "\nw: " + indata[2] + "\nh: " + indata[3] + "\nt: " + indata[4] + "\nj: " + indata[5] + "\nf: " + json);
							}

							playfield.width = parseInt(indata[2]);
							playfield.height = parseInt(indata[3]);
							playfield.biganswer = (indata[4] == 'true');
							playfield.title = indata[5];
							playfield.questions = convertOldQuestions(JSON.parse(indata[6]), playfield.width*playfield.height);
							return true;
						} break;
						case 3: {
							console.log("Q version 3");
							if (indata.length == 7) {}
							if (indata[2] == null || indata[3] == null || indata[4] == null || indata[5] == null || indata[6] == null) {
								alert("File loading Error " + indata.length + "\nv: " + indata[1] + "\nw: " + indata[2] + "\nh: " + indata[3] + "\nt: " + indata[4] + "\nj: " + indata[5] + "\nf: " + json);
							} break;

							playfield.width = parseInt(indata[2]);
							playfield.height = parseInt(indata[3]);
							playfield.biganswer = (indata[4] == 'true');
							playfield.squarebox = (indata[5] == 'true');
							playfield.title = indata[6];
							playfield.questions = convertOldQuestions(JSON.parse(indata[7]), playfield.width*playfield.height);
							return true;
						} break;
						case 4: {
							console.log("Q version 4");
							if(indata.length >= 3 && indata[2] !== undefined) {
								// console.log(json);
								let str = json.substring(json.indexOf("#")+1);
								// console.log(str);
								str = str.substring(str.indexOf("#")+1)
								// console.log(str);
								let save = JSON.parse(str);
								if(save.width !== undefined && save.height !== undefined && save.biganswer !== undefined && save.squarebox !== undefined && save.title !== undefined && save.questions !== undefined) {
									playfield = save;
									// Defaults to things added since the OG Qv4
									if(playfield.showScore === undefined) {
										playfield.showScore = true;
									}
									for(let cln = 0; cln < playfield.width * playfield.height; cln++) {
										let q = playfield.questions[cln]
										if(q.highlightcolor === undefined || q.highlightcolor == "undefined") {
											q.highlightcolor = "FFFFFF";
										}
										if(q.highlighted === undefined) {
											q.highlighted = false;
										}
										if(q.randomizable === undefined) {
											q.randomizable = true;
										}
										if(q.isGraphic === undefined) {
											q.isGraphic = false;
										}
									}
								} else {
									console.log('JSON loading error');
									alert("Error reading playfield data.")
								}
							} else {
								console.log('File loading error')
								alert("Error loading file. Please refresh the page, then try a different file.")
							}
							return true;
						} break;
					}
					if (indata[1] == null || indata[2] == null || indata[3] == null || indata[4] == null) {
						alert("File loading Error " + indata.length + "\nw: " + indata[1] + "\nh: " + indata[2] + "\nt: " + indata[3] + "\nj: " + indata[4] + "\nf: " + json);
					}

					playfield.width = parseInt(indata[1]);
					playfield.height = parseInt(indata[2]);
					playfield.title = indata[3];
					playfield.questions = convertOldQuestions(JSON.parse(indata[4]), playfield.width*playfield.height);
					return true;
				}
			} else { // Probably should just catch anything else
				return false;
			}
		}
	} else {
		return true;
	}
}

// Creates a blank question object
function makejobject(i, o) {
	let obj = (o === undefined) ? new Object() : o;
	obj.answer = document.getElementById('ans' + i).value;
	obj.points = parseInt(document.getElementById('pts' + i).value);
	obj.unusedcolor = document.getElementById('cols' + i).value;
	obj.usedcolor = document.getElementById('cold' + i).value;
	obj.highlightcolor = document.getElementById('colh' + i).value;
	obj.question = document.getElementById('ques' + i).value;
	obj.showScore = document.getElementById('dosc' + i).checked;
	obj.showteam = document.getElementById('dotm' + i).checked;
	obj.highlighted = document.getElementById('doth' + i).checked;
	obj.randomizable = document.getElementById('dotr' + i).checked;
	obj.isGraphic = document.getElementById('doti' + i).checked;
	obj.hideQ = document.getElementById('dohq' + i).checked;
	obj.hideA = document.getElementById('doha' + i).checked;
	obj.qIsPts = document.getElementById('dopq' + i).checked;
	obj.aIsPts = document.getElementById('dopa' + i).checked;
	return obj;
}

// Saves a game object to a string to save to a file
function makeSavefile(outJSON) {
	let saveversion = 4;
	injson = "Ben's Game Show Question File#" + saveversion + "#" + JSON.stringify(outJSON);
	return injson;
}

// TODO this may not be needed anymore, although it is still used in some places
// Saves the current state to an object ready to be JSONified
function saveToObj() {
	for (let i = 0; i < (playfield.width * playfield.height); i++) {
		playfield.questions[i] = makejobject(i, playfield.questions[i]);
	}
	return playfield;
}

// Saves the game as JSON, possibly printing to cosole
function savejson(silent) {
	// V3
	// let outJSON = new Object();
	// for (let i = 0; i < (width * height); i++) {
	//   let obj = makejobject(i);
	//   outJSON[i] = obj;
	// }
	let injson = makeSavefile(saveToObj());
	if(silent === undefined || !silent) {
		// console.log(injson);
		// alert("Find the JSON in the console");
		download("questions.json", injson);
	}
	return injson;
}

// Saves a copy of the game to a cookie
function cacheGame() {
	if(mayUseLocalStorage) {
		window.localStorage.setItem(backup_name, savejson(true));
	} else {
		setCookie(backup_name, savejson(true), 1); // Fall back to cookies if needed
	}
}

function readCachedGame() {
	if(mayUseLocalStorage) {
		return window.localStorage.getItem(backup_name);
	} else {
		return readCookie(backup_name); // Fall back to cookies if needed
	}
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Copies stuff to the user's clipboard
function savetoClipboard(text) {
	document.getElementById('cb').hidden = false;
	document.getElementById('cb').value = text;
	var copyText = document.querySelector("#cb");
	copyText.select();
	document.execCommand("copy");
	document.getElementById('cb').hidden = true;
}

/*
 *  ██████   ██████    ██████   ██   ██  ██  ███████  ███████
 * ██       ██    ██  ██    ██  ██  ██   ██  ██       ██
 * ██       ██    ██  ██    ██  █████    ██  █████    ███████
 * ██       ██    ██  ██    ██  ██  ██   ██  ██            ██
 *  ██████   ██████    ██████   ██   ██  ██  ███████  ███████
 */

// Sets a cookie to store the game state
function setCookie(cname, cvalue, exdays) {
	let d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + "; samesite=strict";
}

// Reads a cookie if it exists, returns empty string if it does not.
function readCookie(cname) {
	let indata = document.cookie.split("; ");
	for (let i = 0; i < indata.length; i++) {
		let spt = indata[i].split("=");
		if (spt[0] == cname) {
			let out = spt[1];
			for (let j = 2; j < spt.length; j++) {
				out = out + "=" + spt[j];
			}
			return out;
		}
	}
	return "";
}


/*
 * ██     ██ ███████ ██████      ███████ ████████  ██████  ██████   █████   ██████  ███████
 * ██     ██ ██      ██   ██     ██         ██    ██    ██ ██   ██ ██   ██ ██       ██
 * ██  █  ██ █████   ██████      ███████    ██    ██    ██ ██████  ███████ ██   ███ █████
 * ██ ███ ██ ██      ██   ██          ██    ██    ██    ██ ██   ██ ██   ██ ██    ██ ██
 *  ███ ███  ███████ ██████      ███████    ██     ██████  ██   ██ ██   ██  ██████  ███████
 * Web Storage API stuff to replace cookies
 */

let mayUseLocalStorage = storageAvailable('localStorage');

function storageAvailable(type) {
   let storage;
   try {
       storage = window[type];
       const x = '__storage_test__';
       storage.setItem(x, x);
       storage.removeItem(x);
       return true;
   }
   catch(e) {
       return e instanceof DOMException && (
           // everything except Firefox
           e.code === 22 ||
           // Firefox
           e.code === 1014 ||
           // test name field too, because code might not be present
           // everything except Firefox
           e.name === 'QuotaExceededError' ||
           // Firefox
           e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
           // acknowledge QuotaExceededError only if there's something already stored
           (storage && storage.length !== 0);
   }
}
