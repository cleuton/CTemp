// Gerador de notificações
var gcm = require('node-gcm');
var sender = new gcm.Sender('*** ENTRE COM SUA API KEY ***'); 
var gerador = 
  function(mensagem) {
console.log("@@@ MANDOU GERAR: " + mensagem);
    var registrationIds = [];
    Tecnico.find({}, 
        function(erro, tecnicos) {
            if (erro) {
                console.log("*** ERRO AO LER TECNICOS: " + erro);
            }
            else {
                for(var x=0; x<tecnicos.length; x++) {
                    registrationIds.push(tecnicos[x].regId);
                }
               var message = new gcm.Message();
               message.addData('message', mensagem);
               message.addData('title','URGENTE!!!' );
               message.addData('msgcnt','3'); 
               message.addData('soundname','beep.wav'); 
               message.collapseKey = 'demo';
               message.delayWhileIdle = true; 
               message.timeToLive = 3000;
console.log("@@@ VAI ENVIAR: " + mensagem);
               sender.send(message, registrationIds, 4, function (err, result) {
                  if(err) {
                    console.log('*** Erro: ' + err);
                  }
                  if (result) {
                    console.log('*** Result: ' + JSON.stringify(result));
                  }
                  else {
                    console.log('*** Result nulo');
                  }
               });                
            }
        }
    );
  };


module.exports = gerador;
