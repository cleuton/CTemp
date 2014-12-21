// Nodeunit test: testeComMedicao

/*
 * Modelo de dados
 */
inspetor = require('../../scheduled/inspetor');
var th = require('../testHelper');

exports.testeTudoOkBanco = function(test) {

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
                        inspetor.verificar();
                        setTimeout(function() {
                          next(null, disp);
                        },3000);
                     }
                });               
        },
        function(disp, next) {
          console.log("***testeTudoOkBanco: Entrou1 ***");
              global.Dispositivo.findOne({"_id" : disp._id},
                function(erro,d) {
                  if (erro) {
                    test.ok(false,"****** ERRO AO LER NOVAMENTE: " + erro);
                    test.done();  
                  }
                  else {                    
                    var medicao = d.medicoes[d.medicoes.length - 1];
                    var dtMedicao = new Date(medicao.dataHora);
                    var dtUltMedicao = new Date(d.ultMedicao);
                    var dif = Math.round((dtUltMedicao - dtMedicao) / (1000 * 60));   
                    console.log("DIF: " + dif);                     
                    test.equal(dif,0);  
                    test.equal(d.status,1);
                    next();
                  }
                }
              );            
            
        }
    ]);

};


