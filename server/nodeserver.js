// Requires modules uuid,node-mysql

var http = require('http');
const url = require('url');
const db = require('./db');
const gameshow = require('./gameshow.js');
const fs = require('fs');

db.begin();

console.log("Node server starting at " + new Date().toLocaleString());
/* Main server function
 * This function is called at each HTTP request.
 * req is the http request, query is the information after the ?
 * res is the response.
 * Use res.write(txt); to write text to the response
 */
http.createServer(function (req, res) {
  let requestTime = new Date();
  console.log("Got HTTP request at " + requestTime.toLocaleString());
  const args = url.parse(req.url, true).query;
  res.writeHead(200, {'Content-Type': 'text/html'});

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    console.log("Got chunk");
  });
  req.on('end', () => {
    console.log("Got body, processing request now");

    if(db.isDBConnected() || true) {
      switch(args.use) { // DO NOT CHANGE USE KEYWORD, it is in use by hardware
        case "test": {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end("Hello World!");
        } break;
        case "example": {
          console.log("Executing the example command");
          let msg = "This is an example!";
          res.end(db.makemessagehtml("DB Result", msg));
        } break;
        case "gameshow": {
          gameshow.process(args, body, res);
        } break;
        case "gameshowctl": {
          console.log("Gameshowctl")
          switch(args.type) {
            case "create": { // Makes a new possible gamet
              res.end(db.makemessagehtml("Gameshow Response", "This would create a new game"));
              //create table index-game (x int, y int, height int, title text, tablename text);
              // question, answer, points, hidepoints, unusedcolor, usedcolor,
            } break;
            case "play": {// Plays a game
              res.end(db.makemessagehtml("Gameshow Response", "This would set a game up for play"));
            } break;
            case "join": { // Join a game
              res.end(db.makemessagehtml("Gameshow Response", "This would join a game"));
            } break;
          }
        } break;
        case "loadhtml": {
          console.log("Sending HTML");
          db.query("SELECT data FROM html where name = '" + args.site + "'", function (err, result, fields) {
            if (err) {
              res.end(db.makeerrorhtml(db.error_errortitle, dberrorerror, false));
              throw err /* error 1*/;
            } else {
              let index = args.index;
              if(isNaN(index)) {
                index = 0;
              }
              if(result.length > 0) {
                console.log("Result: " + result[0]);
                res.end(result[0].data);
              } else {
                console.log("The URL did not specify a valid site.");
                res.end(db.makeerrorhtml("URL Error", "The URL did not specify a valid wepbage. Use ?site=SITE in your url to specify the requested site.", true));
              }
            }
          });
        } break;
        default: {
          let filename = req.url;
          if(filename == "/") {
            filename = "/bengameshow.html";
          }
          fs.readFile(__dirname.substring(0,__dirname.lastIndexOf('/')) + "/client" + filename, function (err,data) {
            console.log("Trying to serve " + filename)
            if (err) {
              res.writeHead(404);
              res.end("404: " + JSON.stringify(err));
              return;
            }
            let ext = filename.substring(filename.lastIndexOf("."))
            if(ext == "html") {
              res.writeHead(200, {'Content-Type': 'text/html'});
            } else if(ext == 'js') {
              res.writeHead(200, {'Content-Type': 'application/json'});
            } else {
              res.writeHead(200, {'Content-Type': 'unknown'});
            }
            res.end(data);
          });
          // res.end(db.makeerrorhtml("Node Error", "There was a NodeJS error.", false));
          // console.log("The use paramater was not specified");
          // let msg = "";
          // for(let i = 0; i < args.length; i++) {
          //   msg += objToString(args[i], true) + " ";
          // }
          // console.log("The paramaters were: " + msg);
        } break;
      } // end switch
    } else {
      res.end(db.makeerrorhtml(db.error_connecttitle, db.error_noconnecterrormsg, true));
      console.log("The DB was not connected")
    }
    console.log("Finished the HTTP request");
  });
}).listen(33544);

/*
const {PythonShell} = require('python-shell');

let pyshell = new PythonShell('/var/www/node/plot-weather.py', options);

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  // console.log(message);
  sysout += message + "\n";
});
// end the input stream and allow the process to exit
pyshell.end(function (err, code, signal) {
  if (err) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    let errortext = err.stack.replace(new RegExp('\r?\n','g'), "<br/>").replace(new RegExp(' ','g'), "&nbsp")
    res.end((gotSVG) ? data : "<html><body><h1>Error</h1>" + errortext + "<h1>Results</h1>" + sysout.replace(new RegExp('\r?\n','g'), "<br />") + "</body></html>");
    throw err;
  }

  if(gotSVG) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end((gotSVG) ? data : "No response provided");
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end((gotSVG) ? data : "<html><body><h1> Response code</h1>" + code + "<h1>Signal</h1>" + signal + "<h1>Results</h1>" + sysout.replace(new RegExp('\r?\n','g'), "<br />") + "</body></html>");
  }

});
*/
