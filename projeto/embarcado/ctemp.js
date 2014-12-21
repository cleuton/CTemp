var five = require("johnny-five");
var request = require('request-json');
var msgSent = false;
var dispId = "dispositivo1";
var senhaDisp = "senhadisp1";
var URL = "192.168.1.24";

var temps = [];
var lastPost = new Date();
var tempLimite = 33;

if (process.argv.length > 2) {
    dispId = process.argv[2];
    senhaDisp = process.argv[3];
    URL = process.argv[4];
}

function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    var segundos = diff / 1000;
    return segundos / 60;
}

function postJson(post_data) {
    request = require('request-json');
    var client = request.newClient('http://' + URL + ':3000/');
    client.post('medicao', post_data, function(err, res, body) {
      return console.log(res.statusCode);
    });
}


function sendMsg() {
    var mediaTemp = 0.0;
    var soma = 0.0;
    for( var i = 0; i < temps.length; i++ ){
        soma += temps[i];
    }
 
    mediaTemp = soma/temps.length;
    var dado = { 
                    "idDispositivo" : dispId,
                    "dataHora" : new Date(),
                    "valor" : mediaTemp, 
                    "gerar" : false, 
                    "senha" : senhaDisp               
              }
    if (mediaTemp > tempLimite) {
        dado.gerar = true;      
    }
    temps = [];
    postJson(dado);
}



five.Board().on("ready", function() {
  var sensor = new five.Sensor("A0");
  var ledVerde = new five.Led(3);
  var ledVermelho = new five.Led(5);
  sensor.on("data", function() {
    var temp = (this.value * 0.2027) - 82;
    temps.push(temp);
    console.log(temp + "°C"); 
    var agora = new Date();
    var minutos = getMinutesBetweenDates(lastPost, agora);
console.log("@@@ MINUTOS: " + minutos);
    if (minutos >= 1) {
        console.log("*** Enviando mensagem ***");
        sendMsg();
        lastPost = agora;
    }
    if(temp <= tempLimite) {
	    ledVermelho.off();
	    ledVerde.on();
    }
    else {
        console.log("*** Temp > limite ***");
     	ledVermelho.on();
        	ledVerde.off();
    }
  });
});
