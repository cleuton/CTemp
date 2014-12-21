var globalUrl = "http://10.0.2.2:3000";
var globalTec = "";
var globalSenha = "";
var globalRegId = "";
var globalDispSelected = "";

$(document).ready(function() {
	$("#btnAtualizar").click(function() {
		atualizarDiv();
	});
	$("#btnSetup").click(function() {
		configurar();
	});
	$("#btnFecharSetup").click(function() {
		var configCtemp = {};
		configCtemp.url = $("#txtURL").val();
		globalUrl = configCtemp.url;
		configCtemp.nome = $("#txtNome").val();
		globalTec = configCtemp.nome;
		configCtemp.senha = $("#txtSenha").val();
		globalSenha = configCtemp.senha;
		window.localStorage.setItem("configCtemp", JSON.stringify(configCtemp));
		$("body").pagecontainer("change", "#inicial", {});
	});
	$("#btnEnviarRegId").attr("disabled", true);
	$("#btnEnviarRegId").click(function() {
		enviarRegId();
	});
	
	$("#btnFecharDispositivo").click(function() {
		$("body").pagecontainer("change", "#inicial", {});
	});
	
	$("#btnResetarDispositivo").click(function() {
		resetarDisp();
	});

});

var statusText = ["DESLIGADO", "NORMAL", "ALARME", "ATRASADO", "MUDO"];

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
    	registrarPushNotification();
    }
};

function atualizarDiv() {
  var url = $("#txtURL").val();
  console.log("*** ACESSANDO URL base: " + url + "/status");
  $.ajax(
    {
       type: "GET",
       url: url + "/status",
       beforeSend: function() {  
      	$.mobile.loading( 'show', {
      		text: 'carregando...',
      		textVisible: true,
      		textonly: true,
      		theme: 'b',
      		html: ""
      	}); 	            	 
       }, 
       complete: function() { $.mobile.loading('hide'); },
       success: function(lista, status, req) {
      	 console.log("****** OK: " + status);
      	 var resultHtml = "";
      	 for(var x=0; x<lista.dispositivos.length;x++) {
      		 var disp = lista.dispositivos[x];
        	 resultHtml += "<li name='disp'>"
        		 		+ "Dispositivo: "
        	            + disp.idDispositivo
        	            + ", status: "
        	            + statusText[disp.status]
        	            + "</li>";
      	 }
         
  	     $("#saida").html(resultHtml);
  	     $("#saida").listview().listview("refresh");
  	     $("li[name=disp]").click(function() {
  			carregarDispositivo(this.textContent);
  	     });$  	     
	    }
     }
   );
}

function carregarDispositivo(disp) {
  var url = $("#txtURL").val();
  var posInicial = disp.indexOf(': ') + 2;
  var posFinal = disp.indexOf(',');
  var dispId = disp.substring(posInicial,posFinal);
  globalDispSelected = dispId;
  console.log("*** ACESSANDO URL base: " + url + "/dispositivo/" + dispId);
  $.ajax(
    {
       type: "GET",
       url: url + "/dispositivo/" + dispId,
       beforeSend: function() {  
      	$.mobile.loading( 'show', {
      		text: 'carregando dispositivo...',
      		textVisible: true,
      		textonly: true,
      		theme: 'b',
      		html: ""
      	}); 	            	 
       }, 
       complete: function() { 
    	   $.mobile.loading('hide');
    	   $("body").pagecontainer("change", "#dispositivo", { role: "dialog", transition: "popup" });
       },
       success: function(d, status, req) {
      	 console.log("****** OK: " + status);
      	 	var resultHtml = "";
      	 	resultHtml += "<li>Dispositivo: "
      	 			 	+ d.idDispositivo + "</li>"
      	 			 	+ "<li>Status: " + statusText[d.status] + "</li>"
      	 			 	+ "<li>Último Alerta: " + d.ultAlerta + "</li>"
      	 			 	+ "<li>Última medição:</li>"
      	 			 	+ "<li><ul><li>Data / Hora: " + d.ultMedicao.dataHora + "</li>"
      	 			 	+ "<li>Valor: " + d.ultMedicao.valor + "</li>"
      	 			 	+ "<li>Gerar: " + d.ultMedicao.gerar + "</li>"
      	 			 	+ "</ul></li>";
      	 	$("#saidaDisp").html(resultHtml);
     	    $("#saidaDisp").listview().listview("refresh");
	     }
     }
   );	
}

function configurar() {
	var configCtemp = window.localStorage.getItem("configCtemp");
	if (!configCtemp) {
		configCtemp = {
				url : globalUrl,
				nome : globalTec,
				senha : globalSenha,
				regId : ""
		}
	}
	else {
		configCtemp = JSON.parse(configCtemp);
	}
console.log("configCtemp: " + JSON.stringify(configCtemp));	
	globalUrl = configCtemp.url;
	globalTec = configCtemp.nome;
	globalSenha = configCtemp.senha;
	$("#txtURL").val(configCtemp.url);
	$("#txtNome").val(configCtemp.nome);
	$("#txtSenha").val(configCtemp.senha);
	$("body").pagecontainer("change", "#setup", { role: "dialog", transition: "popup" });
}

function registrarPushNotification() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(
    		function(resultado) {
    			console.log("OK. Resultado: " + JSON.stringify(resultado));
    		}, 
    		function(erro) {
    			alert("Erro ao registrar: " + erro);
    		},
    		{"senderID":"*** ENTRE COM O NUMERO DO PROJETO ***","ecb":"notificacao"}
    );
}

function enviarRegId() {
	// /tecnico/:nomeTecnico/:senhaTecnico/:regId
	var url = globalUrl + "/tecnico/" + globalTec 
    	+ "/"
    	+ globalSenha
    	+ "/"
    	+ globalRegId;
	console.log("*** URL : " + url);
	$.ajax(
		    {
		       type: "PUT",
		       url: url,
		       beforeSend: function() {  
		      	$.mobile.loading( 'show', {
		      		text: 'Enviando Reg Id...',
		      		textVisible: true,
		      		textonly: true,
		      		theme: 'b',
		      		html: ""
		      	}); 	            	 
		       }, 
		       complete: function() { 
		    	   $.mobile.loading('hide');
		    	   alert("Transação concluída");
		       },
		       success: function(d, status, req) {
		      	 	console.log("****** OK: " + status);
		      	 	alert("Status: " + status);
			     },
		       error: function (request, status, error) {
		      	 	console.log("****** ERRO: " + status
		      	 			    + "\r\n" + JSON.stringify(request));
		      	 	alert("****** ERRO: " + status
	      	 			    + "\r\n" + request.responseText);
		    	   
		       }
		     }
		   );	
}

function notificacao(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log("**** RECEBEU Regid " + e.regid);
                globalRegId = e.regid; 
                $("#btnEnviarRegId").removeAttr("disabled");
            }
        break;

        case 'message':
          alert('MSG: ' + e.message);
        break;

        case 'error':
          alert('Erro GCM = '+e.msg);
        break;

        default:
          alert('ERRO GERAL');
          break;
    }    	
}

function resetarDisp() {
	// /dispositivo/:idDispositivo/:nomeTecnico/:senhaTecnico
	var url = globalUrl 
		+ "/dispositivo/" 
		+ globalDispSelected
		+ "/"
		+ globalTec 
    	+ "/"
    	+ globalSenha;
	console.log("*** URL : " + url);
	$.ajax(
		    {
		       type: "PUT",
		       url: url,
		       beforeSend: function() {  
		      	$.mobile.loading( 'show', {
		      		text: 'Resetando dispositivo...',
		      		textVisible: true,
		      		textonly: true,
		      		theme: 'b',
		      		html: ""
		      	}); 	            	 
		       }, 
		       complete: function() { 
		    	   $.mobile.loading('hide');
		    	   alert("Transação concluída");
		       },
		       success: function(d, status, req) {
		      	 	console.log("****** OK: " + status);
		      	 	alert("Status: " + status);
			     },
		       error: function (request, status, error) {
		      	 	console.log("****** ERRO: " + status
		      	 			    + "\r\n" + JSON.stringify(request));
		      	 	alert("****** ERRO: " + status
	      	 			    + "\r\n" + request.responseText);
		    	   
		       }
		     }
		   );	
}
