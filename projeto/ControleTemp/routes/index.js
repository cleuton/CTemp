var express = require('express');
var router = express.Router();
var Promise = require('promise');
var promisesRotas = require('./promisesRotas');

/* 
  Pagina inicial
  Retorna o status dos dispositivos ("consultarStatus")
 */
router.get('/', function(req, res) {
  
    promisesRotas.consultarStatus()
      .done(
        function(resultados) {
           res.status(200).render('index', { 
                title: 'Monitoração Ativa', 
                msg: 'Status dos dispositivos',
                resultado: resultados
           });
        },
        function(erro) {
          console.log("*** ERRO AO CONSULTARO Status: " + erro);
          var msgErro = "Erro ao consultar status dos dispositivos";
          if (erro == 404) {
            msgErro = "Nenhum dispositivo encontrado";
          }
           res.status(500).render('index', { 
                title: 'Monitoração Ativa', 
                msg: msgErro,
                resultado: {
                            "dispositivos" : []                          
                            }
           });        
        }
      );   
});

/* POST medicao */
/*
{
  "_id" : <ObjectId: Id da medi??o>
}
*/

router.post('/medicao', function(req, res) {
  promisesRotas.novaMedicao(req)
    .done(
      function(disp) {
        var respostaOk = {
          "_id" : disp._id
        };
        res.json(200,respostaOk);
      }
      ,
      function(erro) {
        var respostaErro = {
          "erro" : "Erro ao postar medi??o: " + erro
        }
        var statuserro = 500;
        if (erro == 403 || erro == 404) {
          statuserro = erro;
        }
        res.json(statuserro,respostaErro);
        console.log('**** ERRO ao postar medicao: ' + erro);
      }
    ); 
});

/* 
  GET /dispositivo/{idDispositivo} 
  RESPONSE:
  
  {
    "idDispositivo" : <string: id do dispositivo>,
    "status" : <int: c?digo de status do dispositivo>,
    "ultAlerta" : <date: data/hora do ?ltimo alarme enviado>,
    "ultMedicao" : <medicao: ?ltima medi??o enviada>
  }
  
  Status do dispositivo: 
  0 - Desligado;
  1 - Normal;
  2 - Gerando alerta;
  3 - Atraso no envio;
  4 - Sem envio; 
  
  {
    "erro" : "Erro ao consultar dispositivo: " + erro
  }
   
*/
router.get('/dispositivo/:idDispositivo', function(req, res) {
  promisesRotas.consultarDispositivo(req)
    .done(
      function(disp) {
        var respostaOk = {
          "idDispositivo" : disp.idDispositivo,
          "status" : disp.status,
          "ultAlerta" : disp.ultAlerta,
          "ultMedicao" : null
        };
        
        if(disp.medicoes.length > 0) {
          respostaOk.ultMedicao = disp.medicoes[disp.medicoes.length - 1];        
        }
        
        res.json(200,respostaOk);
      }
      ,
      function(erro) {
        var respostaErro = {
          "erro" : "Erro ao consultar dispositivo: " + erro
        }
        var statuserro = 500;
        if (erro == 403 || erro == 404) {
          statuserro = erro;
        }
        res.json(statuserro,respostaErro);
        console.log('**** Erro ao consultar dispositivo: ' + erro);
      }
    ); 
});


/*
-----------------------------------------
3) Consultar m?dia temperaturas por per?odo:
-----------------------------------------


GET /dispositivo/{idDispositivo}/media[/{quantidade de dias}]

Retorna a m?dia das "n" ?ltimas temperaturas, 
calculada usando MapReduce.

Se o par?metro "quantidade de dias" n?o for informado, 
calcula a m?dia dos ?ltimos 7 dias.

RESPONSE:

{
  "idDispositivo" : <string: id do dispositivo>,
  "dtInicial" : <date: data do in?cio da amostragem>,
  "media" : <double: m?dia encontrada>,
}

{
  "erro" : "Erro ao calcular m?dia: " + erro
}

*/

function consultarMedias(req, res) {
    promisesRotas.consultarMedias(req)
    .done(
      function(resultado) {
        res.json(200,resultado);
      }
      ,
      function(erro) {
        var respostaErro = {
          "erro" : "Erro ao calcular m?dia: " + erro
        }
        var statuserro = 500;
        if (erro == 403 || erro == 404) {
          statuserro = erro;
        }
        res.json(statuserro,respostaErro);
        console.log('**** Erro ao calcular m?dia: ' + erro);
      }
    );  
}

router.get('/dispositivo/:idDispositivo/media', function(req, res) {
 consultarMedias(req,res);
});

router.get('/dispositivo/:idDispositivo/media/:qtdeDias', function(req, res) {
 consultarMedias(req,res);
});

/*

4) Obter novos alertas:

GET /alerta

Retorna os dispositivos com alertas n?o tratados.

Informa todos os dispositivos que est?o com status diferente de 1, em ordem:
- Status Alerta;
- Status Sem envio;
- Status Atrasado.

RESPONSE: 

{
  "dispositivos" : [
    {
      "idDispositivo" : <string: id do dispositivo>,
      "status" : <int: c?digo de status do dispositivo>
    }
  ]
}

*/

router.get('/alerta', function(req, res) {
    promisesRotas.consultarAlertas()
    .done(
      function(resultado) {
        res.json(200,resultado);
      }
      ,
      function(erro) {
        var respostaErro = {
          "erro" : "Erro ao consultar alertas: " + erro
        }
        var statuserro = 500;
        if (erro == 404) {
          statuserro = erro;
        }
        res.json(statuserro,respostaErro);
        console.log('**** Erro ao consultar alertas: ' + erro);
      }
    );   
});

/*
5) Obtem os status dos dispositivos:
------------------------------------

GET /status

Retorna os status de todos os dispositivos.

RESPONSE:

{
  "dispositivos" : [
    {
      "idDispositivo" : <string: id do dispositivo>,
      "status" : <int: c?digo de status do dispositivo>,
    },
  ]
}


{
  "erro" : "Erro ao obter status dos dispositivos: " + erro
}

*/

router.get('/status', function(req, res) {
    promisesRotas.consultarStatus()
    .done(
      function(resultado) {
        res.json(200,resultado);
      }
      ,
      function(erro) {
        var respostaErro = {
          "erro" : "Erro ao consultar status dos dispositivos: " + erro
        }
        var statuserro = 500;
        if (erro == 404) {
          statuserro = erro;
        }
        res.json(statuserro,respostaErro);
        console.log('**** Erro ao consultar status dos dispositivos: ' + erro);
      }
    );   
});    


/*
6) Conferir um dispositivo:
----------------------------


O t?cnico, quando chega ao local e religa o dispositivo, 
envia uma notifica??o indicando que j? conferiu.

PUT /dispositivo/{idDispositivo}/{nome tecnico}/{senha tecnico}

RESPONSE: 

{
  "idDispositivo" : <string: id do dispositivo>,
  "status": <int: c?digo de status do dispositivo>
}


{
  "erro" : "Erro ao resetar dispositivo: " + erro
}

Erros:
- 404: Dispositivo inexistente
- 403: Tecnico inexistente ou senha invalida


PUT /dispositivo/dispositivo1/cleuton/xpto
*/

router.put('/dispositivo/:idDispositivo/:nomeTecnico/:senhaTecnico', function(req, res) {
    promisesRotas.conferirDispositivo(req)
    .done(
      function(resultado) {
        res.json(200,resultado);
      }
      ,
      function(erro) {
        var respostaErro = {
          "erro" : "Erro ao resetar dispositivo: " + erro
        }
        var statuserro = 500;
        if (erro == 404 || erro == 403) {
          statuserro = erro;
        }
        res.json(statuserro,respostaErro);
        console.log('**** Erro ao resetar dispositivo: ' + erro);
      }
    );   
});

/*
7) Enviar "regId":
-------------------

Quando um t?cnico instala a app pela primeira vez, ele deve enviar o seu 
"registrationId" e nome.

PUT /tecnico/:nomeTecnico/:senhaTecnico/:regId


RESPONSE:

  {
    "nome" : {type: String}.
    "regId" : {type: String}
  }
  
*/

router.put('/tecnico/:nomeTecnico/:senhaTecnico/:regId', function(req, res) {
    promisesRotas.enviarRegId(req)
    .done(
      function(resultado) {
        res.json(200,resultado);
      }
      ,
      function(erro) {
        var respostaErro = {
          "erro" : "Erro ao enviar reg id: " + erro
        }
        var statuserro = 500;
        if (erro == 404 || erro == 403) {
          statuserro = erro;
        }
        res.json(statuserro,respostaErro);
        console.log('**** Erro ao enviar reg id: ' + erro);
      }
    );   
});


module.exports = router;
