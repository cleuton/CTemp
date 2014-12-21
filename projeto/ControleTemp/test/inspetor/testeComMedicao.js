// Nodeunit test: testeComMedicao

inspetor = require('../../scheduled/inspetor');
global.MinutosEntreMedicoes = 2;
global.MinutosEntreAlertasGCM = 5;

exports.testeTudoOk = function (test) {
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
        	        "processada" : false,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,ultMedicao);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,1);
    test.done();
};

exports.testeAtrasado = function(test) {
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
        	        "processada" : false,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,agora);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,3);
    test.done();  
};

exports.testeAtrasadoNormalizar = function(test) {
    var agora = new Date();
    var ultMedicao = new Date(agora);
    ultMedicao.setMinutes(agora.getMinutes() - 3);
    var disp = {
        	    "idDispositivo" : "dispositivo1",
        	    "status" : 3,
        	    "senha" : "senhadisp1",
        	    "ultAlerta" : null,
        	    "ultMedicao" : ultMedicao,
        	    "medicoes" : [
                 {
        	        "dataHora" : agora,
        	        "valor" : 20,
        	        "gerar" : false,
        	        "processada" : false,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,agora);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,1);
    test.done();  
};

exports.testeSemAlertaNormalizar = function(test) {
    var agora = new Date();
    var ultMedicao = new Date(agora);
    ultMedicao.setMinutes(agora.getMinutes() - 3);
    var disp = {
        	    "idDispositivo" : "dispositivo1",
        	    "status" : 4,
        	    "senha" : "senhadisp1",
        	    "ultAlerta" : null,
        	    "ultMedicao" : ultMedicao,
        	    "medicoes" : [
                 {
        	        "dataHora" : agora,
        	        "valor" : 20,
        	        "gerar" : false,
        	        "processada" : false,
        	      }        	      
         	    ]
        	};  	    
    var medicao = inspetor.getUltMedicao(disp);
    test.equal(medicao.dataHora,agora);  
    var status = inspetor.verDispositivo(disp, medicao);
    test.equal(status,3);
    test.done();  
};