// Verifica o status dos dispositivos

var gerador = require("../util/gerador");

var inspetor = 

{ 
  
  "getUltMedicao" : function(disp) {
    var ultMedicao = null;
    if (disp.medicoes.length > 0) {
      ultMedicao = disp.medicoes[disp.medicoes.length - 1];
    }
    return ultMedicao;
  },
  
  "verificar" : function() {
    global.Dispositivo.find({})
    .exec(function(erro, dispositivos) {
      if (erro) {
        console.log('Erro: ' + erro);
      }
      else {
        for(var x=0; x<dispositivos.length; x++) {
          var ultMedicao = inspetor.getUltMedicao(dispositivos[x]);
          var status = inspetor.verDispositivo(dispositivos[x], ultMedicao);
          if (dispositivos[x].novoAlerta) {
            inspetor.gerarAlerta(dispositivos[x]);
          }
          if (ultMedicao != null) {
            inspetor.atualizarMedicaoDispositivo(dispositivos[x], status, ultMedicao);
          }
          else {
            inspetor.atualizarDispositivo(dispositivos[x], status);
          }
        }
      }
    });
  },
  
  "verDispositivo" : function (disp, medicao) {
    if(medicao != null && !medicao.processada) {
      return inspetor.novaMedicao(disp,medicao);
    }
    else {
      return inspetor.semMedicao(disp);
    }
  },

  "novaMedicao" : function(disp,medicao) {
    // Chegou uma nova medição
    // Temos que processa-la.
    
    var novoStatus = disp.status;
    var agora = new Date();
    switch(disp.status) {
      case 0:
        novoStatus = 1;
        break;
      case 1:
        if (inspetor.alertaAtrasado(disp, medicao.dataHora)) {
          novoStatus = 3;
        }
        break; 
      case 2:
        var dif = Math.round((agora - disp.ultAlerta) / (1000 * 60));
        if (dif <= global.MinutosEntreAlertasGCM) {
          disp.novoAlerta = false;
        }
        else {        
          disp.novoAlerta = true;
        }      
        break; 
      case 3:
        novoStatus = 1;
        break;
      case 4:
        novoStatus = 3;
        break;      
    }
    
    return novoStatus;
  },
  "atualizarMedicaoDispositivo" : function(disp, status, medicao) {
    // Marcamos a medicao como processada:
    global.Dispositivo.update({"_id" : disp._id, 
                        "medicoes.dataHora" : medicao.dataHora},
                       {
                         $set: 
                          {
                             "medicoes.$.processada" : true
                          }
                       }, function(erro, qtd) {
         // Agora, modificamos o status do dispositivo:
         global.Dispositivo.update({"_id" : disp._id},
              {$set: { "status" : status, 
                       "ultMedicao" : medicao.dataHora }}, 
              function(erro2,qtde2) {
                if (erro) {
                  console.log("Erro ao atualizar disp "
                              + disp.idDispositivo
                              + " : " 
                              + erro);
                }
                else {
                  console.log("Dispositivo : " 
                  + disp.idDispositivo 
                  + " novo status: " + status);                                
                }
              });
    });    
  },
  
  "atualizarDispositivo" : function(disp, status) {
     // Agora, modificamos o status do dispositivo:
     global.Dispositivo.update({"_id" : disp._id},
          {$set: { "status" : status}}, 
          function(erro2,qtde2) {
            if (erro2) {
              console.log("Erro ao atualizar disp "
                          + disp.idDispositivo
                          + " : " 
                          + erro);
            }
            else {
              console.log("Dispositivo : " 
              + disp.idDispositivo 
              + " novo status: " + status);                                
            }
          });    
  },

  "alertaAtrasado" : function(disp, data) {
    // Passaram mais de <MinutosEntreMedicoes> minutos desde a 
    // penúltima medição?
    var retorno = true;
    if (disp.ultMedicao != null) {
        var dif = Math.round((data - disp.ultMedicao) / (1000 * 60));
        if (dif <= global.MinutosEntreMedicoes) {
          retorno = false;
        }
        else {
          retorno = true;
        }
    }
    return retorno;
  },

  "semMedicao" : function(disp) {
    var novoStatus = disp.status;
    var agora = new Date();
    switch(disp.status) {
      case 1:
        if (inspetor.alertaAtrasado(disp, agora)) {
          novoStatus = 3;
        }
        break;  
      case 2:
        var dif = Math.round((agora - disp.ultAlerta) / (1000 * 60));
        if (dif <= global.MinutosEntreAlertasGCM) {
          disp.novoAlerta = false;
        }
        else {        
          disp.novoAlerta = true;
        }
        break;
      case 3:
        if (inspetor.alertaAtrasado(disp, agora)) {
          novoStatus = 4;
        }
        break;
      case 4:
        var dif = Math.round((agora - disp.ultAlerta) / (1000 * 60));
        if (dif <= global.MinutosEntreAlertasGCM) {
          disp.novoAlerta = false;
        }
        else {        
          disp.novoAlerta = true;
        }
        break;
    }
    
    return novoStatus;
  },
  
  "gerarAlerta" : function(disp) {
    // Gera um alerta se tiver passado mais de <MinutosEntreAlertasGCM>
    // minutos do último alerta.
    var agora = new Date();
    var gerar = true;
    if (disp.ultAlerta == null) {
      gerar = false;
    }
    else {
      var dif = Math.round((agora - disp.ultAlerta) / (1000 * 60));
      if (dif <= global.MinutosEntreAlertasGCM) {
        gerar = false;
      }
    }
    
    if (gerar) {
      console.log("**** GEROU ALERTA ****");
      disp.ultAlerta = agora;
      var mensagem = "Dispositivo: " 
          + disp.idDispositivo
          + " continua com problemas!";
      gerador(mensagem);            
      disp.save(function(erro) {
         if(erro) {
           console.log("*** Erro ao atualizar ultimo alerta ***");
         }
         else {
           console.log("*** Novo alerta enviado e atualizado: " + disp.ultAlerta);
         }
      });    
    }
    disp.novoAlerta = false;
  },

};
  

module.exports = inspetor;

