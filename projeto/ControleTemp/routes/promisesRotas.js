// Promisses das rotas

var Promise = require('promise');
var gerador = require('../util/gerador');
var pr = 
{
  "novaMedicao" : function(req) {
        return new Promise(
            function (fulfill, reject){
                var idDispositivo = req.body.idDispositivo; 
                var dataHora = req.body.dataHora;
                var valor = req.body.valor;
                var gerar = req.body.gerar;
                var senha = req.body.senha;
                Dispositivo.findOne({"idDispositivo" : idDispositivo}, 
                    function(erro, disp) {
                      if (erro) {
                        reject(erro);
                      }
                      else {
                        if (!disp) {
                          reject(404);
                        }
                        else {
                          if (senha != disp.senha) {
                            reject(403);
                          }
                          else {
                            var medicao = {
                     	        "dataHora" : dataHora,
	                            "valor" : valor,
	                            "gerar" : gerar,
	                            "processada" : false
                            };
                            if (gerar) {
console.log("*** ENTROU EM GERAR");
                              if (disp.status != 2) {
console.log("*** ENTROU EM GERAR 2");
                                disp.status = 2;
                                var mensagem = "Dispositivo: " 
                                    + disp.idDispositivo
                                    + " ALERTA!";
                                disp.ultAlerta = new Date();
                                gerador(mensagem);
                              }
                            }
                            disp.medicoes.push(medicao);
                            disp.ultMedicao = medicao.dataHora;
                            disp.save();
                            fulfill(disp);
                          }
                        }
                      }
                    }
                );
              }
          );
  },
  
  "consultarDispositivo" : function(req) {
      return new Promise(
            function (fulfill, reject){
              var idDispositivo = req.params.idDispositivo;
              Dispositivo.findOne({"idDispositivo" : idDispositivo}, 
                    function(erro, disp) {
                      if(erro) {
                        reject(erro);
                      }
                      else {
                        if (!disp) {
                          reject(404);
                        }
                        else {
                          fulfill(disp);
                        }
                      }
                    }
              );
            }
      );
  },
  
  "consultarMedias" : function(req) {
    return new Promise(
            function (fulfill, reject){
              var idDispositivo = req.params.idDispositivo;
              var qtdeDias = req.params.qtdeDias;

              if (qtdeDias == null) {
                qtdeDias = 7;
              }
              
              var agora = new Date();
              var dtInicio = new Date(agora);
              dtInicio.setDate(agora.getDate() - qtdeDias);

              Dispositivo.findOne({"idDispositivo" : idDispositivo}, 
                    function(erro, disp) {
                      if(erro) {
                        reject(erro);
                      }
                      else {
                        if (!disp) {
                          reject(404);
                        }
                        else {
                          mapReduceMedicoes(disp, agora, dtInicio)
                          .done(
                            function(resMapReduce) {
                              var resultado = 
                              {
                                "idDispositivo" : disp.idDispositivo,
                                "dtInicial" : dtInicio,
                                "media" : resMapReduce[0].value.media,
                              };                              
                              fulfill(resultado);
                            },
                            function(erro) {
                              reject(erro);
                            }
                          );
                        }
                      }
                    }
              );
            }
      );
  },
  
  "consultarAlertas" : function() {
    return new Promise(
            function (fulfill, reject){
              Dispositivo.find({"status" : {$gt : 1}},
                    {'idDispositivo' : 1 ,'status' : 1}, 
                    {
                        sort:{
                            status: 1 
                        }
                    }, 
                    function(erro, dispositivos) {
                      if(erro) {
                        reject(erro);
                      }
                      else {                        
                        if (dispositivos.length == 0) {
                          reject(404);
                        }
                        var resposta = 
                        {
                          "dispositivos" : []
                        }
                        dispositivos.forEach(function(disp) {
                          resposta.dispositivos.push(
                            {
                              "idDispositivo" : disp.idDispositivo,
                              "status" : disp.status
                            }
                          );
                          
                        });
                        fulfill(resposta);
                      }
                    }
              );
            }
      );
  },
  "consultarStatus" : function() {
      return new Promise(
            function (fulfill, reject){
              Dispositivo.find({},{'idDispositivo' : 1 ,'status' : 1},
                    {
                        sort:{
                            status: -1 
                        }
                    },  
                    function(erro, dispositivos) {
                      if(erro) {
                        reject(erro);
                      }
                      else {
                        if (!dispositivos) {
                          reject(404);
                        }
                        else {
                          var resposta = 
                          {
                            "dispositivos" : []                          
                          };
                          dispositivos.forEach(function(disp) {
                            resposta.dispositivos.push(disp);
                          });
                          fulfill(resposta);
                        }
                      }
                    }
              );
            }
      );
  }, 
  "conferirDispositivo": function(req) {

    return new Promise(
            function (fulfill, reject){
              var idDispositivo = req.params.idDispositivo;
              var nomeTecnico = req.params.nomeTecnico;
	          var senhaTecnico = req.params.senhaTecnico;

	          Tecnico.findOne({"nome" : nomeTecnico, 
                               "senha": senhaTecnico}, 
		        function(erro,tec) {
		            if(erro) {
                        reject(erro);
                    }
                    else {
                        if(!tec) {
                            reject(403);
                        }
                        else {
                          Dispositivo.findOne({"idDispositivo" : idDispositivo}, 
                                function(erro, disp) {
                                  if(erro) {
                                    reject(erro);
                                  }
                                  else {
                                    if (!disp) {
                                      reject(404);
                                    }
                                    else {
                                        var medicao = disp.medicoes[disp.medicoes.length -1];
                                        var conferencia = 
                                        {
                                            "tecnico" : tec,
                                            "dataHora" : new Date()
                                        };
                                        medicao.conferencia = conferencia;
                                        disp.status = 0;
                                        disp.save(function(erro) {
                                            if(erro) {
                                                reject(erro);
                                            }
                                            else {
                                                var resultado = 
                                                {
                                                    "idDispositivo" : disp.idDispositivo,
                                                    "status" : 0
                                                };
                                                fulfill(resultado);
                                            }
                                        });
                                    }
                                  }
                                }
                          );
                        }
                    }
		        }
              );
            }
      );
  },

  "enviarRegId": function(req) {

    return new Promise(
            function (fulfill, reject){
              var nomeTecnico = req.params.nomeTecnico;
	          var senhaTecnico = req.params.senhaTecnico;
              var regId = req.params.regId;

	          Tecnico.findOne({"nome" : nomeTecnico, 
                               "senha": senhaTecnico}, 
		        function(erro,tec) {
		            if(erro) {
                        reject(erro);
                    }
                    else {
                        if(!tec) {
                            reject(403);
                        }
                        else {
                            tec.regId = regId;
                            tec.save(
                                function(erro) {
                                    if(erro) {
                                        reject(erro);
                                    }
                                    else {
                                        var resposta = 
                                        {
                                            "nome" : nomeTecnico,
                                            "regId" : regId
                                        }
                                        fulfill(resposta);
                                    }
                                }
                            );
                        }
                    }
		        }
              );
            }
      );
  }
  
};



// ****************************************************************

function mapReduceMedicoes(disp, agora, dtInicio) {
  return new Promise(
    function (fulfill, reject){
      var mapReduce = {};
      mapReduce.scope = 
      {
        idDispositivo : disp.idDispositivo,
        agora : agora,
        dtInicio : dtInicio
      };
      mapReduce.query = 
      {
        idDispositivo : disp.idDispositivo
      };
      mapReduce.map = function() {
        var conta = 0;
        this.medicoes.forEach(function(medicao) {
          if(medicao.dataHora.getTime() <= agora.getTime() &&
             medicao.dataHora.getTime() >= dtInicio.getTime()) {
               conta++; 
               emit(this.iDdispositivo, medicao.valor);
          }
        });
      };
      mapReduce.reduce = function (k, vals) {
        var resultado = 
        { 
            "idDispositivo" : idDispositivo,
            "soma" : 0,
            "contagem" : 0,
            "media" : 0
        }
        vals.forEach(function(v) {
          resultado.soma += v;
          resultado.contagem += 1;
        });      
        return resultado;
      };
      mapReduce.finalize = function (k, val) {
        
        if (val.contagem > 0) {
          val.media = val.soma / val.contagem;
        }
        return val;        
      };
      Dispositivo.mapReduce (mapReduce, function(erro, resultado) {
        if(erro) {
          reject(erro);
        }
        else {
          if(!resultado) {
            reject(404);
          }
          else {
            fulfill(resultado);
          }
        }
      }); 
    }
  );
}

module.exports = pr;

function print(msg) {
  console.log(msg);
}
