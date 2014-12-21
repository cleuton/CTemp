// Nodeunit test: testePromisesRotas

/*
 * Modelo de dados
 */

var th = require('../testHelper/testHelper');
var promisesRotas = require('../routes/promisesRotas');


exports.testePromisseNovaMedicaoOk = function(test) {

    test.expect(11);
  
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
                       var req = {};
                       req.body = 
                       {
                          "idDispositivo" : "dispositivo1",
                          "dataHora" : new Date(),
                          "valor" : 21, 
                          "gerar" : false, 
                          "senha" : "senhadisp1"
                        };

                       promisesRotas.novaMedicao(req)
                        .done(
                          function(disp) {
                            next(null, disp);
                          },
                          function(erro) {
                            test.done();
                          }
                        ); 
                     }
                });               
        },
        function(disp, next) {
              global.Dispositivo.findOne({"_id" : disp._id},
                function(erro,d) {
                  if (erro) {
                    test.ok(false,"****** ERRO AO LER NOVAMENTE: " + erro);
                    test.done();  
                  }
                  else {                    
                    test.equal(d.status,1);
                    test.equal(d.medicoes.length,2);
                    var medicao = d.medicoes[d.medicoes.length -1];
                    var agora = new Date();
                    var dif = Math.round((agora - medicao.dataHora) / (1000 * 60));   
                    test.equal(dif,0);
                    var dif = Math.round((medicao.dataHora - d.ultMedicao) / (1000 * 60));   
                    test.equal(dif,0);
                    next(null,d);
                  }
                }
              );            
            
        },
        function(disp, next) {
          /*
            Testa com dispositivo não encontrado
          */
             var req = {};
             req.body = 
             {
                "idDispositivo" : "*********",
                "dataHora" : new Date(),
                "valor" : 21, 
                "gerar" : false, 
                "senha" : "senhadisp1"
              };

             promisesRotas.novaMedicao(req)
              .done(
                function(disp) {
                  test.ok(false,"*** Deveria dar erro 404 ***");
                  next();
                },
                function(erro) {
                  test.equal(erro,404,"*** Deveria dar erro 404 : " + erro);
                  next(null,disp);
                }
              ); 
        },
        function(disp, next) {
          /*
            Testa com senha invalida
          */
             var req = {};
             req.body = 
             {
                "idDispositivo" : "dispositivo1",
                "dataHora" : new Date(),
                "valor" : 21, 
                "gerar" : false, 
                "senha" : "*******"
              };

             promisesRotas.novaMedicao(req)
              .done(
                function(disp) {
                  test.ok(false,"*** Deveria dar erro 403 e retornou ok ***");
                  test.done();
                },
                function(erro) {
                  test.equal(erro,403,"*** Deveria dar erro 403 : " + erro);
                  next(null,disp);
                }
              ); 
        },
        function(disp, next) {
          /*
            Testa com senha invalida
          */
             var req = {};
             req.body = 
             {
                "idDispositivo" : "dispositivo1",
                "dataHora" : new Date(),
                "valor" : 35, 
                "gerar" : true, 
                "senha" : "senhadisp1"
              };

             promisesRotas.novaMedicao(req)
              .done(
                function(d) {
                  test.equal(d.status,2, "*** DEVERIA SER STATUS 2: " + d.status);
                  test.equal(d.medicoes.length,3, "*** DEVERIA TER 3 MEDICOES: " + d.medicoes.length);
                  var medicao = d.medicoes[d.medicoes.length -1];
                  var agora = new Date();
                  var dif = Math.round((agora - medicao.dataHora) / (1000 * 60));   
                  test.equal(dif,0, "*** DT MEDICAO NAO CONFERE");
                  var dif = Math.round((medicao.dataHora - d.ultMedicao) / (1000 * 60));   
                  test.equal(dif,0, "*** DT ULT MEDICAO NAO CONFERE");
                  var dif = Math.round((medicao.dataHora - d.ultAlerta) / (1000 * 60));   
                  test.equal(dif,0, "*** DT ULT ALERTA NAO CONFERE");                        
                  next();
                },
                function(erro) {
                  test.ok(false,"*** Erro ao postar medicao: " + erro);
                  test.done();
                }
              ); 
        }                
    ]);

};

