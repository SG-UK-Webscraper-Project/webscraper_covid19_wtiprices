var socket = io();
let CovidDeathsGraph = document.getElementById('CovidDeathsGraph').getContext('2d');//referencing the canvas
let OilPriceGraph = document.getElementById('OilPriceGraph').getContext('2d')
var yValuesCovid = [];
var xValuesCovid = [];
var xValuesOil = [];
var yValuesOil = [];
var covidCases = {};
var oilPrices = {};

socket.on('connectionTest', function(fb) { //include gamemode here so we know 
	
	});

    //socket.emit('buttonPressed', null);

socket.on('updateCovidCases', function(covidC) { //include gamemode here so we know 
  covidCases = covidC;
});
socket.on('updateOilPrice', function(oilP) { //include gamemode here so we know 
  oilPrices = oilP;
});

socket.on('drawCovidGraph', function(foo) {
  for(var i in covidCases) {
    yValuesCovid[i] = covidCases[i].cases;
    xValuesCovid[i] = "" + covidCases[i].day + "/" + covidCases[i].month;
  }

  // This is the configuration of the graph, to control styling, fonts, legends and other things; global is used to reduce repitition if you are using more than one graph
  Chart.defaults.global.defaultFontFamily = 'Times New Roman';
  Chart.defaults.global.defaultFontSize = 20;
  Chart.defaults.global.defaultFontColor = 'black';

  let massPopChart = new Chart(CovidDeathsGraph, {
    type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data:{
    // labels:['10/5/2020',2,3,4,5,6,7], // the x-axis values
    labels: xValuesCovid,
      datasets:[{
        label:'Covid Cases',
        data: yValuesCovid, // this is the array that we have defined before
        pointRadius: 0,
        backgroundColor: '#ffffff00',
        borderWidth:4,
        borderColor:'darkblue',
        hoverBorderWidth:3,
        hoverBorderColor:'#FFFFF'
      }]
    },
    options:{
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Number of Covid Cases'
          }
        }]
      },
      elements: {
        point:{
            radius: 8
        }
      },
      title:{
        display:true,
        text:'Covid-19 Deaths Worldwide',
        fontSize:25
      },
      legend:{
        display:true,
        position:'right',
        fillStyle: '#white',
        labels:{
          fontColor:'#000'
        }
      },
      layout:{
        padding:{
          left:50,
          right:0,
          bottom:0,
          top:0
        }
      },
      tooltips:{
        enabled:true
      }
    }
  });
});

socket.on('drawOilGraph', function(foo) {
  for(var i in oilPrices) {
    yValuesOil[i] = oilPrices[i].price;
    xValuesOil[i] = "" + oilPrices[i].day + "/ " + oilPrices[i].month;
  }

  let massPopChart = new Chart(OilPriceGraph, {
    type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data:{
    // labels:['10/5/2020',2,3,4,5,6,7], // the x-axis values
    labels: xValuesOil,
      datasets:[{
        label:'Oil Price',
        data: yValuesOil, // this is the array that we have defined before
        pointRadius: 0,
        borderWidth:4,
        borderColor:'red',
        hoverBorderWidth:3,
        hoverBorderColor:'#FFFFF'
      }]
    },
    options:{
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Oil Price in US$'
          }
        }]
      },
      elements: {
        point:{
            radius: 8
        }
      },
      title:{
        display:true,
        text:'Oil Prices WTI',
        fontSize:25
      },
      legend:{
        display:true,
        position:'right',
        labels:{
          fontColor:'#000'
        }
      },
      layout:{
        padding:{
          left:50,
          right:0,
          bottom:0,
          top:0
        }
      },
      tooltips:{
        enabled:true
      }
    }
  });
});

