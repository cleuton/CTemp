// test REST interface

var th = require('../testHelper');
var promisesRotas = require('../../routes/promisesRotas');
var httpClient = require('nodeunit-httpclient').create({
    port: 3000,
    path: '/alerta',   
    status: 200,    
    headers: {      
        'content-type': 'application/json; charset=utf-8'  
    }
});

exports.testeHttpConsultaAlertas = function(test) {

    test.expect(5);
  
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
                     next(null,[d2,d3]); 
                  }
                });               
            
        },
        function(arrayDisp,next) {
          httpClient.get(test, '', {
          }, {
              status: 200
          }, function(res) {          
              var dispositivos = res.data.dispositivos;
              test.equal(dispositivos.length,arrayDisp.length,"*** ERRO. Esperados: " + arrayDisp.length
                    + " recebidos: " + dispositivos.length);
              for (var x=0; x<arrayDisp.length; x++) {
                test.equal(dispositivos[0].idDispositivo,arrayDisp[0].idDispositivo,
                    "*** Esperado: " + arrayDisp[0].idDispositivo
                    + " recebido: " + dispositivos[0].idDispositivo);                
              }

              next();
          });          
        }        
        
      ]);
};      

