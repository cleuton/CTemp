// test REST interface

var th = require('../testHelper/testHelper');
var promisesRotas = require('../routes/promisesRotas');
var httpClient = require('nodeunit-httpclient').create({
    port: 3000,
    path: '/medicao',   
    status: 200,    
    headers: {      
        'content-type': 'application/json; charset=utf-8'  
    }
});

exports.testeHttpNovaMedicaoOk = function(test) {

    test.expect(6);
  
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
                       next(null,disp);
                     }
                });              
        },
        function(r,next) {
          httpClient.post(test, '', {
              data: { 
                    "idDispositivo" : "dispositivo1",
                    "dataHora" : new Date(),
                    "valor" : 21, 
                    "gerar" : false, 
                    "senha" : "senhadisp1"                
              } 
          }, {
              status: 200
          }, function(res) {
              test.equal(res.data._id, r._id, "*** ID Diferente. Esperado: " 
                        + r._id
                        + " recebido: " + res._id);
              next(null,r);
          });          
        },
        function(r,next) {
          httpClient.post(test, '', {
              data: { 
                    "idDispositivo" : "*******",
                    "dataHora" : new Date(),
                    "valor" : 21, 
                    "gerar" : false, 
                    "senha" : "senhadisp1"                
              } 
          }, {
              status: 404
          }, function(res) {
              test.equal(res.data.erro, "Erro ao postar medição: 404", "*** ERRO Diferente. Esperado: " 
                        + "Erro ao postar medição: 404"
                        + " recebido: " + res.erro);
              next();
          });           
        }
      ]);
};      
