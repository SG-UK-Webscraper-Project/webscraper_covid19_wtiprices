var path = require('path');
var fs = require("fs");
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
app.use('/Static',express.static(__dirname + '/Static'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
}); 
server.listen(process.env.PORT || 3000);
console.log("Starting on localhost:3000");

const rp = require('request-promise');
const cheerio = require('cheerio');
const covidUrl = 'https://en.wikipedia.org/wiki/COVID-19_pandemic';
const oilUrl = 'https://oilprice.com/oil-price-charts'; 

var covidCases = {};
var covidDeath = {};
var covidDays = 0;

var oilCount = 0;

var oilWti = {};

var oilDelay = 10*1000;//20*60*1000;
var covidDelay = 24*60*60*1000;//24*60*60*1000

 

readTheFile();

  setTimeout(function a() {  
  readCovidWebsite();
  drawGraph();
  writeToFile();
  readOilWebsite();

  setTimeout(a, covidDelay);
  covidDays++;
  oilCount++;
}, 500);

function readCovidWebsite() {
  rp(covidUrl)
  .then(function(html){
    //console.log(html);

  var tablerow = cheerio('.sorttop', html).find('th');
  var tableRowText = tablerow.text();
  var result = tableRowText.split("\n");
  var today = new Date();
  //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  var todayMonth = today.getMonth()+1;
  var todayDay = today.getDate();

  updateCases(todayMonth, todayDay, result[1]);
  updateDeaths(todayMonth, todayDay, result[2]);
  //console.log(covidCases[0].cases);
    covidCases[covidDays].cases = convertStringToInt(covidCases[covidDays].cases);
    console.log("Covid Update: CovidDay:" + covidDays + ", " + covidCases[covidDays].cases + " cases" );
    casesDetermined = true;
    

  })
  .catch(function(err){
    console.log("failure");
    //handle error
  }); 
}

function drawGraph() {
  io.sockets.emit('updateCovidCases',covidCases);
  io.sockets.emit('drawCovidGraph',null);
  io.sockets.emit('updateOilPrice',oilWti);
  io.sockets.emit('drawOilGraph',oilWti);
}



function writeToFile() {
  fs.writeFile("covidData.txt", JSON.stringify(covidCases, null, 2), 'utf8', function (err) {
    if (err) {
        return console.log(err);
      }
    });

    fs.writeFile("oilData.txt", JSON.stringify(oilWti, null, 2), 'utf8', function (err) {
      if (err) {
          return console.log(err);
        }
      });
}

function readTheFile() {
  var read = fs.readFileSync("covidData.txt",'utf8', function (err) {
    if (err) {
      return console.log("reading " + err);
    }
  });
  read = JSON.parse(read);
  if(typeof read != "undefined") {
    covidCases = read;
    covidDays = returnObjectSize(covidCases)-1;
    console.log("covidDays is now " + covidDays);
  }

  read = fs.readFileSync("oilData.txt",'utf8', function (err) {
    if (err) {
      return console.log("reading oil" + err);
    }
  });
  read = JSON.parse(read);
  if(typeof read != "undefined") {
    oilWti = read;
    oilDays = returnObjectSize(oilWti);
    console.log("oilydays is now " + oilDays);
  }
}

function returnObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



  function updateCases(monthNumber, dayNumber, caseNumber) {
    covidCases[covidDays] = {
      month: monthNumber,
      day: dayNumber,
      cases: caseNumber
    };
  }

  function updateDeaths(monthNumber, dayNumber, deathNumber) {
    covidDeath[covidDays] = {
      month: monthNumber,
      day: dayNumber,
      deaths: deathNumber
    }
  }

  function convertStringToInt(str) {
    str = str.replace(/,/g,"");
    var int = parseInt(str, 10);
    
    return int;
  }

  function convertStringToFloat(str) {
    str = str.replace(/,/g,"");
    var int = parseFloat(str, 10);
    
    return int;
  }

  function updateWti(monthNumber, dayNumber, m_price) {
    oilWti[oilCount] = {
      month: monthNumber,
      day: dayNumber,
      price: m_price
    }
  }

    

io.on('connection', function(socket) { 
  //io.sockets.emit('updateCovidCases',covidCases);
    //io.sockets.emit('drawTheGraph',null);
drawGraph();
}); 

function readOilWebsite() {
  rp(oilUrl)
  .then(function(html){
  var lastPrice = cheerio('.last_price', html).text();
  var oil_Wti = lastPrice.substring(0,5);
  oil_Wti = convertStringToFloat(oil_Wti);


 var today = new Date();
 //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
 var todayMonth = today.getMonth()+1;
 var todayDay = today.getDate();

 updateWti(todayMonth, todayDay, oil_Wti);


  })
  .catch(function(err){
    console.log("readOilWebsite failure");
    //handle error

  }); 
}

