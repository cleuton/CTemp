// Cria as coleções iniciais do banco

mongoose = require('mongoose');

var esquemaTecnico = require('./esquemas/esquemaTecnico').tecnico;
var esquemaDispositivo = require('./esquemas/esquemaDispositivo').dispositivo;
var Promise = require('promise');

function criarTecnico() {
   var Tecnico = mongoose.model('Tecnico',esquemaTecnico, 'tecnico');
   return new Promise(
      function (fulfill, reject){
          Tecnico.remove({}, 
              function(erro) {
                if (erro) {
                  reject(erro);
                }
                else {
                  var tec1 = new Tecnico(
                      {
                        "nome" : "cleuton",
                        "regId" : null,
                        "senha" : "teste"
                      }  
                  );
                  tec1.save(function (erro, tecnico) {
                      if(erro) {
                        console.log("*** ERRO AO CRIAR TECNICO ***");
                        reject(erro);
                      }
                      else {
                        console.log("TECNICO OK!");
                        fulfill(tec1);
                      }
                    }
                  );
                }
              }
            );
       }
   );
}

function criarDispositivos() {
  var Tecnico = mongoose.model('Tecnico',esquemaTecnico, 'tecnico');
  var Dispositivo = mongoose.model('Dispositivo', esquemaDispositivo, 'dispositivo');
  return new Promise( 
    function (fulfill, reject){
        var agora = new Date();
        var ultMedicao = new Date(agora);
        ultMedicao.setMinutes(agora.getMinutes() - 1.5);
        var dispNormal = {
            	    "idDispositivo" : "dispositivo1",
            	    "status" : 1,
            	    "senha" : "senhadisp1",
            	    "ultAlerta" : null,
            	    "ultMedicao" : ultMedicao,
            	    "medicoes" : [
                     {
            	        "dataHora" : ultMedicao,
            	        "valor" : 20,
            	        "gerar" : false,
            	        "processada" : true,
            	      },        	      
                     {
            	        "dataHora" : ultMedicao,
            	        "valor" : 23,
            	        "gerar" : false,
            	        "processada" : true,
            	      }        	      
            	      
             	    ]
            	};
        var dispAlerta = {
            	    "idDispositivo" : "dispositivo2",
            	    "status" : 2,
            	    "senha" : "senhadisp1",
            	    "ultAlerta" : ultMedicao,
            	    "ultMedicao" : ultMedicao,
            	    "medicoes" : [
                     {
            	        "dataHora" : ultMedicao,
            	        "valor" : 30,
            	        "gerar" : true,
            	        "processada" : false,
            	      }, 
                     {
            	        "dataHora" : ultMedicao,
            	        "valor" : 23,
            	        "gerar" : false,
            	        "processada" : true,
            	      }              	             	      
             	    ]
            	};
        var dispAtraso = {
            	    "idDispositivo" : "dispositivo3",
            	    "status" : 3,
            	    "senha" : "senhadisp1",
            	    "ultAlerta" : null,
            	    "ultMedicao" : ultMedicao,
            	    "medicoes" : [
                     {
            	        "dataHora" : ultMedicao,
            	        "valor" : 20,
            	        "gerar" : false,
            	        "processada" : false,
            	      },   
                     {
            	        "dataHora" : ultMedicao,
            	        "valor" : 23,
            	        "gerar" : false,
            	        "processada" : true,
            	      }              	           	      
             	    ]
            	};
        Dispositivo.remove({},function(erro) {
          if(erro) {
            console.log("@@@ ERRO AO REMOVER DISPOSITIVOS @@@");
            reject(erro);
          }
          else {
            Dispositivo.create([dispNormal,dispAlerta,dispAtraso],
              function(erro,d1,d2,d3) {
                if(erro) {
                  console.log("**** ERRO AO CRIAR DISPOSITIVOS ****");
                  reject(erro);
                }
                else {
                  console.log("DISPOSITIVO OK");
                  fulfill([d1,d2,d3]);
                }
              }
            );       
          }
        });
    }
  );
}

mongoose.connect('mongodb://localhost/ctempdb', function(erro) {
    if(erro) {
	    console.log('erro ao conectar com o banco: ' + erro);
    }
    else {
	    console.log('Conexão com o banco OK');
	    criarTecnico()
      .done(
        function(resultados) {
          console.log("FASE 1 Completa OK");
          criarDispositivos()
          .done(
            function(disp) {
              console.log("FASE 2 Completa OK");
            },
            function(erro) {
              console.log("ERRO AO COMPLETAR FASE 2 " + erro);
            }
          );
        },
        function(erro) {
          console.log("ERRO AO COMPLETAR FASE 1");
        }
      );   
    }
});