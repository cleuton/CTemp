// Nodeunit test: testeComMedicao

inspetor = require('../scheduled/inspetor');
global.MinutosEntreMedicoes = 2;
global.MinutosEntreAlertasGCM = 5;

/*
status 1, e se passou menos de 2 minutos desde a última medição
*/
exports.testeTudoOkSM = function (test) {
    var agora = new Date();
    var ultMedicao = new Date(agora);
    ultMedicao.setMinutes(agora.getMinutes() - 1.5);
    var disp = {
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
        	        "processada" : true,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,ultMedicao);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,1);
    test.done();
};

/*
status 1, e se passou mais de 2 minutos desde a última medição
*/
exports.testeAtrasadoSM = function(test) {
    var agora = new Date();
    var ultMedicao = new Date(agora);
    ultMedicao.setMinutes(agora.getMinutes() - 3);
    var disp = {
        	    "idDispositivo" : "dispositivo1",
        	    "status" : 1,
        	    "senha" : "senhadisp1",
        	    "ultAlerta" : null,
        	    "ultMedicao" : ultMedicao,
        	    "medicoes" : [
                 {
        	        "dataHora" : agora,
        	        "valor" : 20,
        	        "gerar" : false,
        	        "processada" : true,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,agora);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,3);
    test.done();  
};

/*
status 3 e não chegou nova monitoração: mudar para status 4;
*/
exports.testeSemMonitoracaoSM = function(test) {
    var agora = new Date();
    var ultMedicao = new Date(agora);
    ultMedicao.setMinutes(agora.getMinutes() - 5);
    var disp = {
        	    "idDispositivo" : "dispositivo1",
        	    "status" : 3,
        	    "senha" : "senhadisp1",
        	    "ultAlerta" : null,
        	    "ultMedicao" : ultMedicao,
        	    "novoAlerta" : false,
        	    "medicoes" : [
                 {
        	        "dataHora" : agora,
        	        "valor" : 20,
        	        "gerar" : false,
        	        "processada" : true,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,agora);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,4);
    test.done();  
};

/*
status 4 e não chegou nova monitoração: gerar alerta, se passaram 
 <MinutosEntreAlertasGCM> desde o último alerta ;
*/

exports.testeSemMonitoracaoSemGerarAlertaGCM_SM = function(test) {
    var agora = new Date();
    var ultMedicao = new Date(agora);
    var ultAlerta = new Date(agora);
    ultAlerta.setMinutes(agora.getMinutes() - 3);
    ultMedicao.setMinutes(agora.getMinutes() - 5);
    var disp = {
        	    "idDispositivo" : "dispositivo1",
        	    "status" : 4,
        	    "senha" : "senhadisp1",
        	    "ultAlerta" : ultAlerta,
        	    "ultMedicao" : ultMedicao,
        	    "novoAlerta" : false,
        	    "medicoes" : [
                 {
        	        "dataHora" : agora,
        	        "valor" : 20,
        	        "gerar" : false,
        	        "processada" : true,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,agora);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,4);
    test.equal(disp.novoAlerta, false);
    test.done();  
};

/*
status 4 e não chegou nova monitoração: gerar alerta, se passaram 
 <MinutosEntreAlertasGCM> desde o último alerta ;
*/

exports.testeSemMonitoracaoGerarGCM_SM = function(test) {
    var agora = new Date();
    var ultMedicao = new Date(agora);
    var ultAlerta = new Date(agora);
    ultAlerta.setMinutes(agora.getMinutes() - 6);
    ultMedicao.setMinutes(agora.getMinutes() - 5);
    var disp = {
        	    "idDispositivo" : "dispositivo1",
        	    "status" : 4,
        	    "senha" : "senhadisp1",
        	    "ultAlerta" : ultAlerta,
        	    "ultMedicao" : ultMedicao,
        	    "novoAlerta" : false,
        	    "medicoes" : [
                 {
        	        "dataHora" : agora,
        	        "valor" : 20,
        	        "gerar" : false,
        	        "processada" : true,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,agora);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,4);
    test.equal(disp.novoAlerta, true);
    test.done();  
};