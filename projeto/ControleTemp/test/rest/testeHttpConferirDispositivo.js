// test REST interface

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');
var httpClient = require('nodeunit-httpclient').create({
    port: 3000,
    path: '/dispositivo',   
    status: 200,    
    headers: {      
        'content-type': 'application/json; charset=utf-8'  
    }
});

var tec = null;


exports.testeHttpConferirDispositivo = function(test) {

    test.expect(7);
  
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
                                next(null,disp);
                            }  
                       });                      
                }
             });              
        },
        function(r,next) {
          httpClient.put(test, '/dispositivo1/cleuton/xpto', {
          }, {
              status: 200
          }, function(res) {

              test.equal(res.data.idDispositivo, r.idDispositivo, "*** ID Diferente. Esperado: " 
                        + r._id
                        + " recebido: " + res._id);
              test.equal(res.data.status,0," *** STATUS DIFERENTE. Esperado: 0 retornado: " +  res.data.status);
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
