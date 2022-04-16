var mysql = require('mysql');

// TODO fix the DB
// TODO properly hide the credentials
// var db = mysql.createConnection({
//   host: "localhost",
//   user: "",
//   password: "",
//   database: "node",
//   dateStrings: 'date'
// });

var isDBConnected = false;

module.exports = {
  error_connecttitle: "DB LOADING ERROR",
  error_noconnecterrormsg: "The database has not been connected to yet",

  error_errortitle: "DB REQUEST ERROR",
  error_errorerrormsg: "<The database had an error compleating the queary.",

  isDBConnected: function() {
    return isDBConnected;
  },

  begin: function () {
    return begin();
  },

  makeerrorhtml: function(title, error, tryagain) {
    return makeerrorhtml(title, error, tryagain);
  },

  makemessagehtml: function (title, message) {
    return makemessagehtml(title, message);
  },

  stringifyMySQLResponse: function (rsp, count, latest) {
    return stringifyMySQLResponse(rsp, count, latest);
  },

  objToLabelTr: function (obj) {
    return objToLabelTr(obj);
  },

  objToTr: function (obj) {
    return objToTr(obj);
  },

  objToString: function (obj, ishtml) {
    return objToString(obj, ishtml);
  },

  query: function(request, onDone) {
    return query(request, onDone);
  },

  resToCSV: function (res) {
    return resToCSV(res);
  },

  requestHTML: function(request) {
    // db.query(args.command, function(err, result, fields) {
  }
}

function begin() {
  // db.connect(function(err) {
  //   if (err) {
  //     throw err;
  //   } else {
  //     console.log("Connected to MySQL!");
  //     isDBConnected = true;
  //     db.query("SELECT data FROM html WHERE name = 'test1'", function (err, result) {
  //     if (err) throw err;
  //     console.log("Result: " + result);
  //   });
  //   }
  // });
}

function makeerrorhtml(title, error, tryagain) {
  let msg = "<h1>" + error;
  if(tryagain) {
    msg += " Try again in a moment, or c"
  } else {
    msg += " C";
  }
  msg += "heck the log for details.</h1>";
  return makemessagehtml(title, msg);
}

function makemessagehtml(title, message) {
  return "<html><head><title>" + title + "</title></head><body>" + message + "</body></html>";
}

function stringifyMySQLResponse(rsp, count, latest) {
  if(isNaN(count) || count < 1) {
    count = 99;
  }
  if(count > rsp.length) {
    count = rsp.length;
  }
  let msg = "<table id=\"data\" style=\"border-collapse: collapse\">";
  msg += "<tr>"
  msg += objToLabelTr(rsp[0]);
  msg += "</tr>";
  if(latest) {
    for(var i = rsp.length-1; i > rsp.length-count-1; i--) {
      msg += "<tr>" + objToTr(rsp[i]) + "</tr>";
    }
  } else {
    for(var i = 0; i < rsp.length; i++) {
      msg += "<tr>" + objToTr(rsp[i]) + "</tr>";
    }
  }
  return "</table>" + msg;
}

function objToLabelTr(obj) {
  let msg = "";
  if(obj != null) {
    let keys = Object.keys(obj);
    for (let [key, value] of Object.entries(obj)) {
      msg += "<td style=\"border:1px solid black;\">" + `${key}` + "</td>";
    }
  } else {
    msg = "<td style=\"border:1px solid black;\">null</td>";
  }
  return msg;
}

function objToTr(obj) {
  let keys = Object.keys(obj);
  let msg = "";
  for (let [key, value] of Object.entries(obj)) {
    msg += "<td style=\"border:1px solid black;\">" + `${value}` + "</td>";
  }
  return msg;
}

function objToString(obj, ishtml) {
  let keys = Object.keys(obj);
  let msg = "";
  let tag1 = "";
  let tag2 = " ";
  if(ishtml) {
    tag1 = "<xmp>";
    tag2 = "</xmp> ";
  }
  for (let [key, value] of Object.entries(obj)) {
    msg += tag1 + `${key}: ${value}` + tag2;
  }
  return msg;
}

// ==================================

function resToCSV(res) {
  if(res === undefined || res.length < 1) {
    return "";
  }

  let msg = "";

  // Set up column labels
  let first = true;
  for(let [key, value] of Object.entries(res[0])) {
    msg += ((first) ? "" : ",") + `${key}`;
    first = false;
  }
  msg += "\n";

  // Print data
  for(let i = 0; i < res.length; i++) {
    let firstdta = true;
    for(let [key, value] of Object.entries(res[i])) {
      msg += ((firstdta) ? "" : ",") + `${value}`;
      firstdta = false;
    }
    msg += "\n";
  }
  return msg;
}

// ==================================

function query(request, onDone) {
  // TODO fix the DB
  // db.query(request, onDone);
}

function requestHTML(request) {
  // db.query(args.command, function(err, result, fields) {
}
