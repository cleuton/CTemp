// Nodeunit test: testePromisesConsultaMedia

/*
 * Modelo de dados
 */

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');


exports.testePromisesConsultaMedia = function(test) {

    test.expect(3);
    th.runTest(test, [
        function(next) {
              var agora = new Date();
              var ultMedicao = new Date(agora);
              ultMedicao.setMinutes(agora.getMinutes() - 1.5);
              var disp = new global.Dispositivo ({
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
                  	});
              disp.save(function(erro) {
                if(erro) {
                  test.ok(false,"****** ERRO AO GRAVAR: " + erro);
                }
                else {
                       var req = {"params" : {}};
                       req.params.idDispositivo = "dispositivo1";
                       promisesRotas.consultarMedias(req)
                        .done(
                          function(resultado) {
                            var agora = new Date();
                            var inicio = new Date();
                            inicio.setDate(agora.getDate() - 7);
                            var dif = Math.round((inicio - resultado.dtInicial) / (1000 * 60));   
                            test.equal(dif,0,"*** Erro dt incial. Esperado: " 
                                      + inicio + " recebido: " + resultado.dtInicial);
                            next(null, disp);
                          },
                          function(erro) {
                            test.ok(false,"*** ERRO AO CONSULTARO MEDIAS 1: " + erro);
                            test.done();
                          }
                        ); 
                     }
                });               
        },

        function(disp, next) {
          /*
            Testa com dispositivo não encontrado
          */
            var req = {"params" : {}};
            req.params.idDispositivo = "hhhhhh";


             promisesRotas.consultarMedias(req)
              .done(
                function(disp) {
                  test.ok(false,"*** Deveria dar erro 404 ***");
                  next();
                },
                function(erro) {
                  test.equal(erro,404,"*** Deveria dar erro 404 veio: " + erro);
                  next(null,disp);
                }
              ); 
        },
        function(disp, next) {
          /*
            Testa com outro periodo
          */
            var req = {"params" : {}};
            req.params.idDispositivo = "dispositivo1";
            req.params.qtdeDias = 2;


             promisesRotas.consultarMedias(req)
              .done(
                  function(resultado) {
                    var agora = new Date();
                    var inicio = new Date();
                    inicio.setDate(agora.getDate() - 2);
                    var dif = Math.round((inicio - resultado.dtInicial) / (1000 * 60));   
                    test.equal(dif,0,"*** Periodo fornecido. Erro. Dt esperada: " 
                               + inicio + " recebida: " + resultado.dtInicial);
                    next();
                  },
                function(erro) {
                   test.ok(false,"*** ERRO AO CONSULTARO MEDIAS 2: " + erro);
                    next();
                }
              ); 
        }
        
    ]);

};


exports.testePromisesConsultaMapReduce = function(test) {
  
    test.expect(3);
  
    th.runTest(test, [
        // Primeiro teste: até 7 dias
        function(next) {
              var agora = new Date();
              var ultMedicao = new Date(agora);
              ultMedicao.setMinutes(agora.getMinutes() - 1.5);
              var disp = new global.Dispositivo ({
                  	    "idDispositivo" : "dispositivo1",
                  	    "status" : 1,
                  	    "senha" : "senhadisp1",
                  	    "ultAlerta" : null,
                  	    "ultMedicao" : ultMedicao,
                  	    "medicoes" : [
                   	    ]
                  	});
              criarMedicoes(disp);
              disp.save(function(erro) {
                if(erro) {
                  test.ok(false,"****** ERRO AO GRAVAR: " + erro);
                }
                else {
                       var req = {"params" : {}};
                       req.params.idDispositivo = "dispositivo1";

                       promisesRotas.consultarMedias(req)
                        .done(
                          function(resultado) {
                            test.equal(resultado.media,23,"*** Erro Media. Esperado: " 
                                      + 23 + " recebido: " + resultado.media);
console.log("\r\n@ Media esperada: " + 23 + " recebida: " + resultado.media);                                      
                            next(null, disp);
                          },
                          function(erro) {
                            test.ok(false,"*** ERRO AO CONSULTAR MEDIAS 3: " + erro);
                            test.done();
                          }
                        ); 
                     }
                });            
        },
        function(disp, next) {
          /*
            Testa com até 30 dias
          */
            var req = {"params" : {}};
            req.params.idDispositivo = "dispositivo1";
            req.params.qtdeDias = 30;


             promisesRotas.consultarMedias(req)
              .done(
                  function(resultado) {
                    var mediaResultado = resultado.media.toFixed(2);
                    var mediaEsperada = 24.22222.toFixed(2);
                    test.equal(mediaEsperada,mediaResultado,"*** Media incorreta. Esperada: " 
                               + mediaEsperada + " recebida: " + mediaResultado);
console.log("\r\n@ Media esperada: " + mediaEsperada + " recebida: " + mediaResultado);                               
                    next(null, disp);
                  },
                function(erro) {
                   test.ok(false,"*** ERRO AO CONSULTARO MEDIAS 4: " + erro);
                   test.done();
                }
              ); 
        },
        function(disp, next) {
          /*
            Testa com até 90 dias
          */
            var req = {"params" : {}};
            req.params.idDispositivo = "dispositivo1";
            req.params.qtdeDias = 90;


             promisesRotas.consultarMedias(req)
              .done(
                  function(resultado) {
                    var mediaResultado = resultado.media.toFixed(2);
                    var mediaEsperada = 24.3214285714.toFixed(2);
                    test.equal(mediaEsperada,mediaResultado,"*** Media incorreta. Esperada: " 
                               + mediaEsperada + " recebida: " + mediaResultado);
console.log("\r\n@ Media esperada: " + mediaEsperada + " recebida: " + mediaResultado);                               
                    next();
                  },
                function(erro) {
                   test.ok(false,"*** ERRO AO CONSULTARO MEDIAS 5: " + erro);
                   test.done();
                }
              ); 
        }        
      ]
    );
};

function criarMedicoes(disp) {
  // Medicoes com mais de 30 dias:
  /*
    10 medicoes, com valores: 
    20,21,22,23,24,25,26,27,28,29
    Média = 24.5
    
    Resultado combinado até 50 dias:
    28 medicoes
    Média = 24,3214285714
  */
  valorBase = 20;
  for (var x=0; x<10; x++) {
     var agora = new Date();
     var inicio = agora;
     var periodo = (31 + x) * (24 * 60 * 60 * 1000); 
     inicio.setTime(agora.getTime() - periodo);
     disp.medicoes.push(novaMedicao(inicio, valorBase + x));    
  }
  
  // Medicoes com mais de 7 dias e menos de 30 dias
  /*
    11 medicoes, com valores: 
    20,21,22,23,24,25,26,27,28,29,30
    Média = 25
    Resultado combinado até 30 dias:
    18 medições
    Média = 24.22222
  */  
  for (var x=0; x<11; x++) {
     var agora = new Date();
     var inicio = agora;
     var periodo = (8 + x) * (24 * 60 * 60 * 1000); 
     inicio.setTime(agora.getTime() - periodo);
     disp.medicoes.push(novaMedicao(inicio, valorBase + x));     
  }

  // Medicoes com 7 dias 
  /*
    7 medicoes, com valores: 
    20,21,22,23,24,25,26
    Média = 23
  */   
  for (var x=0; x<7; x++) {
     var agora = new Date();
     var inicio = agora;
     var periodo = (x) * (24 * 60 * 60 * 1000); 
     inicio.setTime(agora.getTime() - periodo);
     disp.medicoes.push(novaMedicao(inicio, valorBase + x));       
  }   
}

function novaMedicao(dataHora, valor) {
  var medicao = 
  {
    "dataHora" : dataHora,
    "valor" : valor,
    "gerar" : false,
    "processada" : true    
  };
  return medicao;
}