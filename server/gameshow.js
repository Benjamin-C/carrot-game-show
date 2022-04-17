const uuid = require('uuid');
const crypto = require('crypto');

module.exports = {
  process: function(args, body, res) {
    process(args, body, res);
  },
  processPOST: function(args, res) {

  }
}

/*
 * ███████  ██████   ██████    ██████   ██████   ███████
 * ██       ██   ██  ██   ██  ██    ██  ██   ██  ██
 * █████    ██████   ██████   ██    ██  ██████   ███████
 * ██       ██   ██  ██   ██  ██    ██  ██   ██       ██
 * ███████  ██   ██  ██   ██   ██████   ██   ██  ███████
 */
/**
 * Ends the response with a missing paramater error
 * @param obj The array of arguments
 * @param arg The argument that is missing
 * @param res The HTTP response
 * @return false if the argument array contains the argument, else returns undifined
 */
function errorArg(obj, arg, res) {
  if(obj[arg] !== undefined) {
    return false;
  } else {
    finishError(res, arg);
  }
}
/**
 * Ends the response with a missing paramater error
 * @param res The HTTP response
 * @param error The missing paramater
 */
function finishError(res, error) {
  console.log("Request did not specify " + error + ".");
  res.statusCode = 400;
  res.end(error + ' not specified');
}


/*
 *  ██████    █████   ███    ███  ███████        ██████  ██        █████   ███████  ███████  ███████  ███████
 * ██        ██   ██  ████  ████  ██            ██       ██       ██   ██  ██       ██       ██       ██
 * ██   ███  ███████  ██ ████ ██  █████         ██       ██       ███████  ███████  ███████  █████    ███████
 * ██    ██  ██   ██  ██  ██  ██  ██            ██       ██       ██   ██       ██       ██  ██            ██
 *  ██████   ██   ██  ██      ██  ███████        ██████  ███████  ██   ██  ███████  ███████  ███████  ███████
 */

/**
 * Stores information pertaning to a particular games
 */
class Game {
    constructor() {
      // The game UUID
      this.uuid = uuid.v4() + '';
      // Map of waiters to be notified on an update
      this.waiters = new Map();
      // Arrray of play fields
      this.playfield = new Array();
      // Current play field index
      this.playfieldNum = 0;
      // Cryptographic key
      this.key = crypto.randomBytes(64).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
      // Update buffer
      this.buff = new RingBuffer(8);

      let e = new Object();
      e.cause = "null";
      this.buff.add(e);
    }

    /**
     * Adds a play field to the game
     * @param playfield the field to add
     * @return the number of fields in the game
     */
    addPlayfield(playfield) {
      this.playfield.push(playfield);
      return this.playfield.size - 1;
    }

    /**
     * Sends an update to all waiters
     * @param update The update to send to the waiters
     */
    sendUpdate(update) {
      let toSend = new Array(this.buff.add(update));
      notifyWaiters(this, toSend);
    }

    /**
     * Responds with a veiw board
     * @param  {HTTP Response} res the response
     */
    showViewerBoard(res) {
      let ro = new Object();
      let o = new Object();
      ro.id = this.buff.getLastID();
      ro.item = o;
      o.cause = "fullupdate"
      // Copy playfield
      let cpf = this.playfield[this.playfieldNum];
      o.playfield = new Object();
      o.playfield.width = cpf.width;
      o.playfield.height = cpf.height;
      o.playfield.biganswer = cpf.biganswer;
      o.playfield.squarebox = cpf.squarebox;
      o.playfield.title = cpf.title;
      o.playfield.questions = new Array(cpf.width * cpf.height);
      cpf.questions.forEach((elem, i) => {
        o.playfield.questions[i] = getClientCell(elem);
      });
      let toSend = new Array(ro);
      console.log(JSON.stringify(toSend));
      respondJSON(res, toSend);
    }
}

/**
 * Returns a client version of a cell
 * @param  {[type]} cell The cell to get a version of
 * @return {[type]} A client version of the cell
 */
function getClientCell(cell) {
  let obj = new Object();
  if(cell.used) {
    obj.text = cell.answer + ((cell.showscore == true) ? " [" + cell.points + "]" : "");
    obj.color = cell.usedcolor;
  } else {
    obj.text = cell.question;
    obj.color = cell.unusedcolor;
  }
  return obj;
}

/**
 * Buffer that fills in a circular patern (ie when the buffer gets full, it starts overiding the first elemtn of the buffer)
 */
class RingBuffer {
  /**
   * Creates a new RingBuffer of size
   * @param {integer} size The size of the buffer
   */
  constructor(size) {
    this.size = size;
    this.buffer = new Array(size);
    this.nextID = 0;
  }

  /**
   * Adds an elemnt to the buffer and returns the object added
   * @param {Object} element The object to added
   * @return {Object} The new object in the buffer (.item is the element, .id is the id in the buffer)
   */
  add(element) {
    let obj = new Object();
    obj.item = element;
    obj.id = this.nextID;
    this.buffer[this.nextID++ % this.size] = obj;
    return obj;
  }

  /**
   * Returns an array of all elemtns in the buffer after start
   * @param  {integer} start The first ID in the buffer to return
   * @return {Array} The array of all elements in the buffer after start,
   *   or undifined if start is higher that the highest ID, or is smaller than the lowes ID still in the buffer
   */
  get(start) {
    console.log('Next: ' + this.nextID + " Start: " + start);
    if(this.nextID - this.size > start || start < 0 || start >= this.nextID) {
      console.log("Invalid paramaters, try again");
      return undefined; // Not enough data to send complete result, so send no result to avoid confusion
    } else {
      let result = new Array();
      for(let i = start; i < this.nextID; i++) {
        result.push(this.buffer[i%this.size]);
      }
      return result;
    }
  }

  /**
   * Returns the highest ID in the buffer
   * @return {integer} The higher ID in the buffer
   */
  getLastID() {
    return this.nextID - 1;
  }

  /**
   * Returns if the provided ID is the most recent ID in the buffer
   * @param  {integer}  cid The ID to check
   * @return {Boolean} If cid matches the last ID in the buffer
   */
  isUpToDate(cid) {
    return cid == this.nextID - 1;
  }
}

/*
 *  ██████   ██        ██████   ██████    █████   ██            ██    ██   █████   ██████   ███████
 * ██        ██       ██    ██  ██   ██  ██   ██  ██            ██    ██  ██   ██  ██   ██  ██
 * ██   ███  ██       ██    ██  ██████   ███████  ██            ██    ██  ███████  ██████   ███████
 * ██    ██  ██       ██    ██  ██   ██  ██   ██  ██             ██  ██   ██   ██  ██  ██        ██
 *  ██████   ███████   ██████   ██████   ██   ██  ███████         ████    ██   ██  ██   ██  ███████
 */
/**
 * Map of the current games by UUID
 * @type {Map}
 */
let currentGames = new Map();

/*
 * ██   ██  ████████  ████████  ██████        ██████   ███████  ███████  ██████    ██████   ███    ██  ███████  ███████
 * ██   ██     ██        ██     ██   ██       ██   ██  ██       ██       ██   ██  ██    ██  ████   ██  ██       ██
 * ███████     ██        ██     ██████        ██████   █████    ███████  ██████   ██    ██  ██ ██  ██  ███████  █████
 * ██   ██     ██        ██     ██            ██   ██  ██            ██  ██       ██    ██  ██  ██ ██       ██  ██
 * ██   ██     ██        ██     ██            ██   ██  ███████  ███████  ██        ██████   ██   ████  ███████  ███████
 */
/**
 * Responsds with an object
 * @param  {HTTP Response} res the response
 * @param  {Object} toSend the object to convert to JSON
 */
function respondJSON(res, toSend) {
  if(!res.finished) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(toSend));
  }
}

/**
 * Alerts the waiters, and sends them an object.
 * Clears the games waiters and timeout
 * @param  {Game} game The game to alert
 * @param  {Object} toSend The object to send
 */
function notifyWaiters(game, toSend) {
  game.waiters.forEach((waiter) => {
    respondJSON(waiter.response, toSend);
    clearTimeout(waiter.timer);
  });
  game.waiters.clear();
}

/*
 * ██████   ██████    ██████    ██████  ███████  ███████  ███████       ██████   ███████   ██████   ██    ██  ███████  ███████  ████████  ███████
 * ██   ██  ██   ██  ██    ██  ██       ██       ██       ██            ██   ██  ██       ██    ██  ██    ██  ██       ██          ██     ██
 * ██████   ██████   ██    ██  ██       █████    ███████  ███████       ██████   █████    ██    ██  ██    ██  █████    ███████     ██     ███████
 * ██       ██   ██  ██    ██  ██       ██            ██       ██       ██   ██  ██       ██ ▄▄ ██  ██    ██  ██            ██     ██          ██
 * ██       ██   ██   ██████    ██████  ███████  ███████  ███████       ██   ██  ███████   ██████    ██████   ███████  ███████     ██     ███████
 */
/**
 * Prosses an HTTP Request
 * @param  {Array} args The arguments from the request
 * @param  {String} body The body of the request
 * @param  {HTTP Response} res The response object
 * @return undifined if the arguments are missing 'role'
 */
function process(args, body, res) {
  if(errorArg(args, 'role', res)) { return; }
  // if(errorArg(args, 'gid', res)) { return; }


  switch(args.role) {
  /*
   * ██    ██  ██  ███████  ██     ██  ███████  ██████
   * ██    ██  ██  ██       ██     ██  ██       ██   ██
   * ██    ██  ██  █████    ██  █  ██  █████    ██████
   *  ██  ██   ██  ██       ██ ███ ██  ██       ██   ██
   *   ████    ██  ███████   ███ ███   ███████  ██   ██
   */
  case 'viewer': {
    console.log("You are a viewer");
    if(args.action !== undefined) {
      if(args.gid !== undefined && uuid.validate(args.gid)) {
        let gameid = args.gid;
        let game = currentGames.get(gameid);
        if(game !== undefined) {
          switch(args.action) {
//         __   __             ___  __  ___
//        /  ` /  \ |\ | |\ | |__  /  `  |
//        \__, \__/ | \| | \| |___ \__,  |
          case "load": {
            game.showViewerBoard(res);
          } break;
//                    ___
//        |  |  /\  |  |
//        |/\| /~~\ |  |
          case "wait": {
            console.log('Looking for ' + args.lastCID)
            let lastCID = parseInt(args.lastCID);
            // If there are no chunks, wait for one to be ready
            if(lastCID !== undefined && !isNaN(lastCID)) {
              if(game.buff.isUpToDate(lastCID)) {
                console.log("Waiting for update");
                let waiter = new Object();
                let id = uuid.v4();
                waiter.response = res;
                waiter.gameid = gameid;
                waiter.timer = setTimeout((wid) => {
                  if(!res.finished) {
                    res.writeHead(204, {'Content-Type': ''});
                    res.end('');
                  }
                  console.log(game.waiters.delete(wid));
                }, 30*1000, gameid);
                game.waiters.set(id, waiter);
              } else { // If there are chunks, send them
                console.log("Sending based on last message ID " + lastCID);
                let toSend = game.buff.get(lastCID + 1);
                if(toSend !== undefined) { // If there are few enough results, send them
                  console.log("Sending results");
                  respondJSON(res, toSend);
                } else { // Otherwise, send the full update
                  console.log("Sending full update");
                  game.showViewerBoard(res);
                  // Send full update
                }
              }
            } else {
              res.end("No id was provided");
            }
          } break;
//                                 __
//        | |\ | \  /  /\  |    | |  \
//        | | \|  \/  /~~\ |___ | |__/
          default: {
            console.log("No action specified");
            res.writeHead(400, {'Content-Type': 'text/html'});
            res.end("No action specified");
          } break;
          }
        } else {
          res.writeHead(400, {'Content-Type': 'text/html'});
          res.end("That game does not exist");
        }
      } else {
        console.log("Invalid or missing GID");
        res.writeHead(400, {'Content-Type': 'text/html'});
        res.end("Invalid or missing GID");
      }
    } else {
      res.writeHead(400, {'Content-Type': 'text/html'});
      res.end(" o,o ");
    }
  } break;
  /*
   * ███    ███   █████   ███████  ████████  ███████  ██████
   * ████  ████  ██   ██  ██          ██     ██       ██   ██
   * ██ ████ ██  ███████  ███████     ██     █████    ██████
   * ██  ██  ██  ██   ██       ██     ██     ██       ██   ██
   * ██      ██  ██   ██  ███████     ██     ███████  ██   ██
   */
  case 'master': {
    console.log("You are the master");
    if(args.action !== undefined) {
      switch(args.action) {
//     __   ___  __
//    |__) |__  / _` | |\ |
//    |__) |___ \__) | | \|
      case "begin": {
        // What we need: width, height, playfield
        let payload = undefined;
        try {
          payload = JSON.parse(body);
        } catch(error) { }
        if(payload !== undefined) {
          let game = new Game();
          game.playfield.push(payload);

          let ro = new Object();
          ro.gid = game.uuid;
          console.log(game.key);
          ro.key = game.key;
          currentGames.set(game.uuid, game);
          console.log("Created game " + game.uuid);
          respondJSON(res, ro);
        } else {
          res.end("Payload was undefined");
          console.log("Payload was undefined");
        }
      } break;
//          ___  __   __        __   ___
//    |\/| |__  /__` /__`  /\  / _` |__
//    |  | |___ .__/ .__/ /~~\ \__) |___
      case "message": {
        console.log("Sending message ...");
        if(args.message !== undefined) {
          if(uuid.validate(args.gid)) { //args.gid !== undefined &&
            console.log("Searching for " + args.gid);
            let game = currentGames.get(args.gid);
            if(game !== undefined) {
              let now = new Date();
              let r = new Object();
              r.cause = "message";
              r.message = "The Master has spoken (" + now.toLocaleTimeString() + "): " + args.message;
              game.sendUpdate(r);
              res.end("Message id " + game.buff.lastCID + " sent");
              console.log("The message has been sent");
            } else {
              res.end("That game does not exist");
              console.log("Game does not exist");
            }
          } else {
            res.end("Invalid GID")
            console.log("Invalid GID");
          }
        } else {
          res.end("No message specified");
          console.log("No message specified");
        }
      } break;
//          __   __       ___  ___
//    |  | |__) |  \  /\   |  |__
//    \__/ |    |__/ /~~\  |  |___
      case "update": {
        console.log("Got an update request");
        if(uuid.validate(args.gid)) { //args.gid !== undefined &&
          console.log("Searching for");
          let game = currentGames.get(args.gid);
          if(game !== undefined) {
            let payload = JSON.parse(body);
            if(payload !== undefined && payload.key !== undefined) {
              if(payload.key == game.key) {
                if(payload.type !== undefined) {
                  switch(payload.type) {
                    case 'cell': {
                      if(payload.num !== undefined && payload.cell !== undefined) {
                        let cell = payload.cell;
                        let pf = game.playfield[game.playfieldNum];
                        pf.questions[parseInt(payload.num)] = payload.cell;
                        let r = new Object();
                        r.cause = "update";
                        r.num = payload.num;
                        let newcell = getClientCell(payload.cell)
                        r.cell = newcell;
                        game.sendUpdate(r);
                        res.end("Update id " + game.buff.lastCID + " sent");
                        console.log("Got cell #" + payload.num + " which will become " + JSON.stringify(newcell));
                      } else {
                        res.end("Missing cell number or content");
                        console.log("Missing cell number or content");
                      }
                    } break;
                    default: {
                      res.end("Invalid payload type");
                      console.log("Invalid payload type");
                    } break;
                  }
                } else {
                  res.end("No update type specified");
                  console.log("No update type specified");
                }
              } else {
                res.end("Wrong key");
                console.log("Wrong key");
              }
            } else {
              res.end("Payload was undefined");
              console.log("Payload was undefined");
            }
          } else {
            res.end("That game does not exist");
            console.log("Game does not exist");
          }
        } else {
          res.end("Invalid GID")
          console.log("Invalid GID");
        }
      } break;
//            __  ___
//    |    | /__`  |
//    |___ | .__/  |
      case "list": {
        let r = '';
        currentGames.forEach((val, key) => {r += key.toString() + '<br/>'; } );
        if(r == '') {
          r = 'None';
        }
        res.end(r);
      } break;
      case "update": {
        console.log("Updating based on " + body);
      } break;
//                             __
//    | |\ | \  /  /\  |    | |  \
//    | | \|  \/  /~~\ |___ | |__/
      default: {
        res.end();
        console.log("Invalid action");
      }
      }
    } else {
      res.end("Action was undefined");
      console.log("Action was undefined");
    }
  } break;
  /*
   * ██  ███    ██  ██    ██   █████   ██       ██  ██████
   * ██  ████   ██  ██    ██  ██   ██  ██       ██  ██   ██
   * ██  ██ ██  ██  ██    ██  ███████  ██       ██  ██   ██
   * ██  ██  ██ ██   ██  ██   ██   ██  ██       ██  ██   ██
   * ██  ██   ████    ████    ██   ██  ███████  ██  ██████
   */
  default: {
    res.end("Invalid role");
    console.log("Invalid role " + args.role);
  }
  }
}
