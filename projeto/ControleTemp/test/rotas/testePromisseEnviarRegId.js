// Nodeunit test: testePromisseEnviarRegId

/*
 * Modelo de dados
 */

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');
var tec = null;

exports.testePromisseEnviarRegId = function(test) {

    test.expect(2);
  
    th.runTest(test, [
        function(next) {
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
               req.params.regId = "regId1";
               req.params.nomeTecnico = "cleuton";
               req.params.senhaTecnico = "xpto";
               promisesRotas.enviarRegId(req)
                .done(
                  function(retorno) {
                    next(null, tec);
                  },
                  function(erro) {
                    test.ok(false,"Erro ao conferir: " + erro);
                    test.done();
                  }
                );
            }
           });               
        },
        function(tec, next) {
              global.Tecnico.findOne({"nome" : tec.nome},
                function(erro,t) {
                  if (erro) {
                    test.ok(false,"****** ERRO AO LER NOVAMENTE: " + erro);
                    test.done();  
                  }
                  else {      
                    test.equal(t.regId,"regId1"," *** RegId diferente ****");
                    next(null,t);
                  }
                }
              );            
            
        },
        function(t, next) {
          /*
            Testa com senha invalida
          */
             var req = {"params" : {}};
               req.params.regId = "regId1";
               req.params.nomeTecnico = "cleuton";
               req.params.senhaTecnico = "zzzz";

             promisesRotas.conferirDispositivo(req)
              .done(
                function(resultado) {
                  test.ok(false,"*** Deveria dar erro 403 ***");
                  test.done();
                },
                function(erro) {
                  test.equal(erro,403,"*** Deveria dar erro 403 : " + erro);
                  next();
                }
              ); 
        }               
    ]);

};

