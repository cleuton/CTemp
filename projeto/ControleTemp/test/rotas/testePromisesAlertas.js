// Nodeunit test: testePromisesAlertas

/*
 * Modelo de dados
 */

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');


exports.testePromisesConsultaAlertas = function(test) {

    test.expect(3);
    th.runTest(test, [
        function(next) {
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
                  	        "processada" : false,
                  	      }        	      
                   	    ]
                  	};
              var dispAlerta = {
                  	    "idDispositivo" : "dispositivo2",
                  	    "status" : 2,
                  	    "senha" : "senhadisp1",
                  	    "ultAlerta" : null,
                  	    "ultMedicao" : ultMedicao,
                  	    "medicoes" : [
                           {
                  	        "dataHora" : ultMedicao,
                  	        "valor" : 20,
                  	        "gerar" : false,
                  	        "processada" : false,
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
                  	      }        	      
                   	    ]
                  	};
              Dispositivo.create([dispNormal,dispAlerta,dispAtraso],
                function(erro,d1,d2,d3) {
                  if(erro) {
                    test.ok(false,"****** ERRO AO GRAVAR: " + erro);
                  }
                  else {
                         promisesRotas.consultarAlertas()
                          .done(
                            function(resultados) {
                              test.equal(resultados.dispositivos.length,2,
                                  "*** Erro disp alertas. Esperado: " 
                                  + 2 + " recebido: " + resultados.dispositivos.length);
                              test.equal(resultados.dispositivos[0].idDispositivo,"dispositivo2",
                                  "*** Erro esperado dispositivo 2, recebido: " 
                                  + resultados.dispositivos[0].idDispositivo);
                              test.equal(resultados.dispositivos[1].idDispositivo,"dispositivo3",
                                  "*** Erro esperado dispositivo 3, recebido: " 
                                  + resultados.dispositivos[1].idDispositivo);
                                  
                              next();
                            },
                            function(erro) {
                              test.ok(false,"*** ERRO AO CONSULTARO ALERTAS 1: " + erro);
                              test.done();
                            }
                          ); 
                       }
                });               
        }


    ]);

};

