//  let gridAns = ["This", "Is", "some", "text", "that i", "will want", "to find out", "what will happen", "if i were to put", "way too much text in one box and it had to overflow"];
//  let gridScore = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]

const baseURL = 'http://mccreas.us:33543/node?use=gameshow';

function matchRule(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

/**
 * @brief    Error message when player has not launched the controller.
 */
let playerFunc = function() {
  console.log("Player launching");
  document.getElementById("table").innerHTML = "<h1>Something has gone wrong. You should not have gotten here. Please launch the controller first.</h1>";
  let go = false;
  if (window.opener != null) {
    go = window.opener.popupReady();
  }
  // window.onUnload = Function() {
  //   window.opener.popupClosed();
  // }
}


let controlFunc = function() {
  console.log("Launghing");
  document.title = "Control BenGameShow";
  document.getElementById("topnav").innerHTML = "<input id=\"fadebox\" type=\"checkbox\">Fade</input><input type=\"file\" id=\"files\" style=\"display: none;\" /><input class=\"button\" type=\"button\" value=\"Pick some questions\" onclick=\"document.getElementById('files').click()\" />" + " or " + "<input class=\"button\" type=\"button\" value=\"Load from cache\" onclick=\"handleCacheSelect()\" />" + " or " + "<input type=\"file\" id=\"videos\" style=\"display: none;\" /><input class=\"button\" type=\"button\" value=\"Pick a video\" onclick=\"document.getElementById('videos').click()\" />" + " or " + "<input type=\"file\" id=\"images\" style=\"display: none;\" /><input  class=\"button\" type=\"button\" value=\"Pick an Image\" onclick=\"document.getElementById('images').click()\" />" + " or " + "<input class=\"button\" type=\"button\" value=\"Blank\" onclick=\"prepareBlank()\" />&nbsp&nbsp&nbsp<button onClick=\"openNetworkSettings()\">Online Settings</button>";
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

//MyModes constants.
const MyModes = {
  GAME: 'game',
  ANS: '1answer',
  VIDEO: 'video',
  IMAGE: 'image',
  BLANK: 'blank'
}

let myMode = MyModes.GAME;

let videoloc;
/**
 * @brief    Playfield space creation.
 */
let playfield = new Object();
playfield.questions = new Array();
playfield.width = 2;
playfield.height = 5;
playfield.title = "GameShow";
playfield.biganswer = false;
playfield.squarebox = false;

//Score evening and color.

let scoreid = 0;
let score = [0, 0, 0];
let scorecolor = [ ["#ff0000", "#00FF00", "#0000ff"], ["#400000", "#004000", "#000080"], ["#200000", "#002000", "#000020"] ];
let scoreStr = "Score = ";

let gamePanel;
let gamePanelOpen = false;

let waiting = true;
let meWaiting = true;

let nextx = 1;

let nextFadeMode = false;

let backup_name = "backup-game";

let args = window.location.toString().split('?').pop().split("&");

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

/**
 * @brief    Beginning of new game.
 */
function startnew() {
  playfield.width = parseInt(document.getElementById("inw").value);
  playfield.height = parseInt(document.getElementById("inh").value);
  playfield.title = document.getElementById("int").value
  for (let i = 0; i < (playfield.width * playfield.height); i++) {
    let obj = new Object();
    obj.answer = "";
    obj.points = 0;
    obj.showscore = false;
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


function prepareVideo(video) {
  console.log("Prep video")
  openWindow();
  videoloc = video;
  myMode = MyModes.VIDEO;
  meWaiting = true;
  meReady();
}

function prepareImage(image) {
  console.log("Prep img")
  openWindow();
  videoloc = image;
  myMode = MyModes.IMAGE;
  meWaiting = true;
  meReady();
}

function prepareBlank() {
  if (mymode = MyModes.GAME) {

  }
  console.log("Prep blank")
  openWindow();
  myMode = MyModes.BLANK;
  meWaiting = true;
  meReady();
}

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

/*
 *      ██  ███████   ██████   ███    ██
 *      ██  ██       ██    ██  ████   ██
 *      ██  ███████  ██    ██  ██ ██  ██
 * ██   ██       ██  ██    ██  ██  ██ ██
 *  █████   ███████   ██████   ██   ████
 */
function convertOldQuestions(oldq, size) {
  let nq = new Array(size);
  for(let i = 0; i < size; i++) {
    nq[i] = oldq[i];
  }
  return nq;
}

function loadjson(json) {
  if (json != "blank") {
    if (json != null) {
      let indata = json.split("#");
      if (indata[0] == "Ben's Game Show Question File") {
        let qfileversion = 0;
        if (indata.length == 5) {
          qfileversion = 1;
        } else {
          qfileversion = parseInt(indata[1]);
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
              if(indata.length == 3 && indata[2] !== undefined) {
                let save = JSON.parse(indata[2]);
                if(save.width !== undefined && save.height !== undefined && save.biganswer !== undefined && save.squarebox !== undefined && save.title !== undefined && save.questions !== undefined) {
                  playfield = save;
                } else {
                  console.log('JSON loading error');
                }
              } else {
                console.log('File loading error')
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
      } else if (indata[0] = "Ben's Game Show Question File") {
        return false;
      }
    }
  } else {
    return true;
  }
}

function makejobject(i, o) {
  let obj = (o === undefined) ? new Object() : o;
  obj.answer = document.getElementById('ans' + i).value;
  obj.points = parseInt(document.getElementById('pts' + i).value);
  obj.unusedcolor = document.getElementById('cols' + i).value;
  obj.usedcolor = document.getElementById('cold' + i).value;
  obj.question = document.getElementById('ques' + i).value;
  obj.showscore = document.getElementById('dosc' + i).checked;
  return obj;
}

function makeSavefile(outJSON) {
  // let saveversion = 3;
  // injson = "Ben's Game Show Question File#" + saveversion + "#" + width + "#" + height + "#" + biganswer + "#" + squarebox + "#" + title + "#" + JSON.stringify(outJSON);
  // return injson;
  let saveversion = 4;
  injson = "Ben's Game Show Question File#" + saveversion + "#" + JSON.stringify(outJSON);
  return injson;
}

// TODO this may not be needed anymore
function saveToObj() {
  for (let i = 0; i < (playfield.width * playfield.height); i++) {
    playfield.questions[i] = makejobject(i, playfield.questions[i]);
  }
  return playfield;
}

function savejson(silent) {
  // V3
  // let outJSON = new Object();
  // for (let i = 0; i < (width * height); i++) {
  //   let obj = makejobject(i);
  //   outJSON[i] = obj;
  // }
  let injson = makeSavefile(saveToObj());
  if(silent === undefined || !silent) {
    console.log(injson);
    alert("Find the JSON in the console");
  }
  return injson;
}

// function savefulljson() {
//   let outJSON = new Object();
//   for (let i = 0; i < (width * height); i++) {
//     let obj = makejobject(i);
//     obj.used = questions[i].used;
//     // obj.showscore = document.getElementById('dosc' + i).checked;
//     outJSON[i] = obj;
//   }
//   return makeSavefile(outJSON);
// }

function cacheGame() {
  setCookie(backup_name, savejson(true), 1);
}

/*
 * ███    ███   ██████   ██████   ███████       ███████  ██     ██  ██  ████████   ██████  ██   ██
 * ████  ████  ██    ██  ██   ██  ██            ██       ██     ██  ██     ██     ██       ██   ██
 * ██ ████ ██  ██    ██  ██   ██  █████         ███████  ██  █  ██  ██     ██     ██       ███████
 * ██  ██  ██  ██    ██  ██   ██  ██                 ██  ██ ███ ██  ██     ██     ██       ██   ██
 * ██      ██   ██████   ██████   ███████       ███████   ███ ███   ██     ██      ██████  ██   ██
 */
function pauseVideo() {
  controlGameFade(1, 10);
}

function fadeGame() {
  controlGameFade(0, 500);
}

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

function handleCacheSelect() {
  let t = readCookie(backup_name);
  prepare(t);
}

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

function handleImageSelect(evt) {
  console.log("Loading Image");
  let files = evt.target.files; // FileList object
  let file = files[0];
  let toret;
  let reader = new FileReader();
  // alert("file " + URL.createObjectURL(file));
  prepareImage(URL.createObjectURL(file));
}

function handleBlankSelect(evt) {
  console.log("Loading nothing");
  prepareBlank();
}

/*
 * ██████   ██    ██  ██  ██       ██████
 * ██   ██  ██    ██  ██  ██       ██   ██
 * ██████   ██    ██  ██  ██       ██   ██
 * ██   ██  ██    ██  ██  ██       ██   ██
 * ██████    ██████   ██  ███████  ██████
 */
function build() {
  console.log("Building");
  // document.getElementById("topnav").innerHTML = "TopNav";
  switch (myMode) {
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
  case MyModes.GAME: {
    $.css
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
    cacheGame();
  }
  break;
  }
}

function setShowColorConfig() {
  showColorConfig = document.getElementById('configcolor').checked;
  for (let i = 0; i < playfield.height; i++) {
    for (let j = 0; j < playfield.width; j++) {
      let num = (i + (j * playfield.height))
      document.getElementById("box" + num + "color").style.display = (showColorConfig) ? "" : "none";
    }
  }
}

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

function getNewControlTableBox(num) {
  return getNewControlTableBox_param(num, playfield.questions[num].used);
}

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

function getNewAnswerTableBox(num, boxwidth, boxheight, privileged) {
  return getNewAnswerTableBox_param(num, playfield.questions[num].used, playfield.questions[num].used, (playfield.biganswer && playfield.questions[num].used), boxwidth, boxheight, privileged);
}

function hideScore() {
  document.getElementById("score").innerHTML = "";
  gamePanel.document.getElementById("score").innerHTML = "";
}

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

function nbsp(num) {
  var n = "";
  if(num > 0) {
    for(var i = 0; i < num; i++) {
      n += "&nbsp";
    }
  }
  return n;
}

function getBackgroundColor() {
  var val = document.body.style.backgroundColor;
  return val;
}

function createScoreLabel(id) {
  // return "<p style=\"color:" + scorecolor[0][id] + ";background-color:" + scorecolor[(id == scoreid) ? 1 : 2][id] + "\>" + scoreStr + score[id] + "</p>";
  // return scoreStr + score[id];
  return "<h1 style=\"border:" + ((id == scoreid) ? scorecolor[0][id] : getBackgroundColor()) + "; border-width:5px; border-style:solid; color:" + scorecolor[0][id] + "\">&nbsp" + scoreStr + score[id] + "&nbsp</h1>";
}

function createScoreButton(id) {
  return "<button id=\"scoreid-" + id + "\" onclick=\"setScoreID(" + id + ")\" style=\"color:" + scorecolor[0][id] + "; background-color:" + scorecolor[(id == scoreid) ? 1 : 2][id] + "\"><h2>" + scoreStr + score[id] + "</h2></button>";
}

function setScoreID(id) {
  scoreid = id;
  // for(var iter = 0; iter < score.length; iter++) {
  //   document.getElementById("scoreid-" + iter).style.background = scorecolor[(iter == id) ? 1 : 2][iter];
  // }
  // scorecolor
  showScore();
}

function openWindow() {
  if (!gamePanelOpen) {
    gamePanel = window.open("bengameshow.html?role=player", null, "status=no,toolbar=no,menubar=no,location=no,titlebar=no"); //height=720,width=1280,
    gamePanelOpen = true;
  } else {
    console.log("Windw open, not doing anything")
  }
}

function popupClosed() {
  gamePanelOpen = false;
}

function popupReady() {
  if (waiting) {
    waiting = false;
    if (!meWaiting) {
      prepBuild();
    }
    return true;
  }
}

function meReady() {
  if (meWaiting) {
    meWaiting = false;
    console.log("Ready " + meWaiting + " " + waiting);
    if (!waiting) {
      prepBuild();
    }
  }
}

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

function showans(num) {
  if (playfield.biganswer) {
    // myMode = MyModes.ANS;
    document.getElementById("ansbtn" + num).onclick = function() {
      doneans(num)
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

function titlechange() {
  playfield.title = document.getElementById("titlebox").value;
  playfield.biganswer = document.getElementById("bigansbox").checked;
  playfield.squarebox = document.getElementById("squareboxbox").checked;
  build();
}

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

function showXr() {
  nextx = 1;
  showX(0);
}

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

function testme() {
  alert("text");
}

/*
 *  ██████   ██████    ██████   ██   ██  ██  ███████  ███████
 * ██       ██    ██  ██    ██  ██  ██   ██  ██       ██
 * ██       ██    ██  ██    ██  █████    ██  █████    ███████
 * ██       ██    ██  ██    ██  ██  ██   ██  ██            ██
 *  ██████   ██████    ██████   ██   ██  ██  ███████  ███████
 */

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + "; samesite=strict";
}

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

function savetoClipboard(text) {
  document.getElementById('cb').hidden = false;
  document.getElementById('cb').value = text;
  var copyText = document.querySelector("#cb");
  copyText.select();
  document.execCommand("copy");
  document.getElementById('cb').hidden = true;
}

/*
 * ██████   ██████    █████    ██████    ██████   ██  ███    ██   ██████
 * ██   ██  ██   ██  ██   ██  ██        ██        ██  ████   ██  ██
 * ██   ██  ██████   ███████  ██   ███  ██   ███  ██  ██ ██  ██  ██   ███
 * ██   ██  ██   ██  ██   ██  ██    ██  ██    ██  ██  ██  ██ ██  ██    ██
 * ██████   ██   ██  ██   ██   ██████    ██████   ██  ██   ████   ██████
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

/*
 * ███    ██  ███████  ████████  ██     ██   ██████   ██████   ██   ██  ██  ███    ██   ██████
 * ████   ██  ██          ██     ██     ██  ██    ██  ██   ██  ██  ██   ██  ████   ██  ██
 * ██ ██  ██  █████       ██     ██  █  ██  ██    ██  ██████   █████    ██  ██ ██  ██  ██   ███
 * ██  ██ ██  ██          ██     ██ ███ ██  ██    ██  ██   ██  ██  ██   ██  ██  ██ ██  ██    ██
 * ██   ████  ███████     ██      ███ ███    ██████   ██   ██  ██   ██  ██  ██   ████   ██████
 */

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

function closeNetworkSettings() {
  document.getElementById("netset").innerHTML = '';
}

class NetworkManager {
  constructor() {
    this.online = false;
    this.privateKey = '';
    this.gid = '';
    this.key = '';
  }

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

  updateCell(num) {
    if(this.online) {
      let pl = new Object();
      pl.type = 'cell';
      pl.num = num;
      pl.cell = playfield.questions[num];
      this.sendPOSTRequest(pl);
    }
  }

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
