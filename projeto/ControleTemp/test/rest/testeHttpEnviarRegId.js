// test REST interface

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');
var httpClient = require('nodeunit-httpclient').create({
    port: 3000,
    path: '/tecnico',   
    status: 200,    
    headers: {      
        'content-type': 'application/json; charset=utf-8'  
    }
});

var tec = null;


exports.testeHttpConferirDispositivo = function(test) {

    test.expect(6);
  
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
                next(null,tec);
            }
           });             
        },
        function(r,next) {
          httpClient.put(test, '/cleuton/xpto/regId1', {
          }, {
              status: 200
          }, function(res) {

              test.equal(res.data.nome, "cleuton", "*** Nome. Esperado: " 
                        + "cleuton"
                        + " recebido: " + res.data.nome);
              next(null,r);
          });          
        },
        function(r,next) {
          httpClient.put(test, '/dispositivo1/cleuton/xptz', {
 
          }, {
              status: 403
          }, function(res) {
              test.equal(res.statusCode,403, "*** ERRO Diferente. Esperado: 403 " 
                        + " recebido: " + res.erro);
              next();
          });           
        }
      ]);
};      
