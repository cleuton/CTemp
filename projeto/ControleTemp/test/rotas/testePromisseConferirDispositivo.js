// Nodeunit test: testePromisseConferirDispositivo

/*
 * Modelo de dados
 */

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');
var tec = null;

exports.testePromisseConferirDispositivo = function(test) {

    test.expect(5);
  
    th.runTest(test, [
        function(next) {
              var agora = new Date();
              var ultMedicao = new Date(agora);
              ultMedicao.setMinutes(agora.getMinutes() - 1.5);
              var disp = new global.Dispositivo ({
                  	    "idDispositivo" : "dispositivo1",
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
                  	      }        	      
                   	    ]
                  	});
              disp.save(function(erro) {
                if(erro) {
                  test.ok(false,"****** ERRO AO GRAVAR: " + erro);
                }
                else {
                       tec = new Tecnico(
                            {
                                "nome" : "cleuton",
                                "regId" : "@@regid@@",
                                "senha" : "xpto"
                            }
                        );
                       tec.save(function(erro) {
                        if(erro) {
                            test.ok(false,"****** ERRO AO GRAVAR TECN: " + erro);
                        }
                        else {
                           var req = {"params" : {}};
                           req.params.idDispositivo = "dispositivo1";
                           req.params.nomeTecnico = "cleuton";
                           req.params.senhaTecnico = "xpto";
                           promisesRotas.conferirDispositivo(req)
                            .done(
                              function(retorno) {
                                next(null, disp);
                              },
                              function(erro) {
                                test.ok(false,"Erro ao conferir: " + erro);
                                test.done();
                              }
                            );
                        }
                       }); 
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
                    test.equal(d.status,0);
                    var medicao = d.medicoes[d.medicoes.length - 1];
                    test.ok(medicao.conferencia," *** NAO CRIOU CONFERIDA ***");
                    test.equal(medicao.conferencia.tecnico,tec._id.toString(), " *** TECN INVALIDO ***");
                    next(null,d);
                  }
                }
              );            
            
        },
        function(disp, next) {
          /*
            Testa com dispositivo não encontrado
          */
             var req = {"params" : {}};
             req.params.idDispositivo = "xxxxx";
             req.params.nomeTecnico = "cleuton";
             req.params.senhaTecnico = "xpto";

             promisesRotas.conferirDispositivo(req)
              .done(
                function(resultado) {
                  test.ok(false,"*** Deveria dar erro 404 ***");
                  test.done();
                },
                function(erro) {
                  test.equal(erro,404,"*** Deveria dar erro 404 : " + erro);
                  next(null,disp);
                }
              ); 
        },
        function(disp, next) {
          /*
            Testa com tecnico invalido
          */
             var req = {"params" : {}};
             req.params.idDispositivo = "dispositivo1";
             req.params.nomeTecnico = "rr";
             req.params.senhaTecnico = "xpto";
             
             promisesRotas.conferirDispositivo(req)
              .done(
                function(resultado) {
                  test.ok(false,"*** Deveria dar erro 403, e veio ok ***");
                  test.done();
                },
                function(erro) {
                  test.equal(erro,403,"*** Deveria dar erro 403 : " + erro);
                  next();
                }
              ); 
        },                
    ]);

};

