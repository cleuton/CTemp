// Nodeunit test: testePromisseConsultarDispositivo

/*
 * Modelo de dados
 */

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');


exports.testePromisseConsultarDispositivo = function(test) {

    test.expect(2);
  
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

                       promisesRotas.consultarDispositivo(req)
                        .done(
                          function(disp) {
                            next(null, disp);
                          },
                          function(erro) {
                            test.ok(false,"Erro ao consultar: " + erro);
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

             promisesRotas.consultarDispositivo(req)
              .done(
                function(disp) {
                  test.ok(false,"*** Deveria dar erro 404 ***");
                  next();
                },
                function(erro) {
                  test.equal(erro,404,"*** Deveria dar erro 404 : " + erro);
                  next();
                }
              ); 
        }                
    ]);

};

