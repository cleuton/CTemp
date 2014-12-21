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

exports.testeHttpConsultaMedia = function(test) {

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
                  	    "medicoes" : []
                  	});
              criarMedicoes(disp);                  	
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
          httpClient.get(test, '/dispositivo1/media', {
          }, {
              status: 200
          }, function(res) {
              test.equal(res.data.media, 23, "*** ID Diferente. Esperado: " 
                        + 23
                        + " recebido: " + res.data.media);
              next(null,r);
          });          
        },
        function(r,next) {
          httpClient.get(test, '/dispositivo1/media/30', {
 
          }, {
              status: 200
          }, function(res) {
                  var mediaResultado = res.data.media.toFixed(2);
                  var mediaEsperada = 24.22222.toFixed(2);
                  test.equal(mediaEsperada,mediaResultado,"*** Media incorreta. Esperada: " 
                            + mediaEsperada + " recebida: " + mediaResultado);
                  next();
          });           
        }
      ]);
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